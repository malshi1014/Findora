<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

include __DIR__ . "/../config/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(array(
        "status" => "error",
        "message" => "Only POST method is allowed"
    ));
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

$match_id = isset($data["match_id"]) ? intval($data["match_id"]) : 0;
$admin_id = isset($data["admin_id"]) ? intval($data["admin_id"]) : 0;
$action = isset($data["action"]) ? trim($data["action"]) : "";

if ($match_id <= 0 || $admin_id <= 0 || empty($action)) {
    echo json_encode(array(
        "status" => "error",
        "message" => "match_id, admin_id and action are required"
    ));
    exit();
}

if ($action !== "verified" && $action !== "rejected") {
    echo json_encode(array(
        "status" => "error",
        "message" => "Action must be verified or rejected"
    ));
    exit();
}

// Check whether admin_id belongs to an admin
$adminCheck = $conn->prepare("SELECT user_id FROM users WHERE user_id = ? AND role = 'admin' LIMIT 1");
$adminCheck->bind_param("i", $admin_id);
$adminCheck->execute();
$adminResult = $adminCheck->get_result();

if ($adminResult->num_rows === 0) {
    echo json_encode(array(
        "status" => "error",
        "message" => "Invalid admin user"
    ));
    exit();
}

// Get match details
$matchStmt = $conn->prepare("
    SELECT 
        m.match_id,
        m.lost_report_id,
        m.found_report_id,
        lr.user_id AS owner_id,
        fr.user_id AS finder_id,
        lr.title AS lost_title,
        fr.title AS found_title
    FROM matches m
    INNER JOIN lost_report lr ON m.lost_report_id = lr.report_id
    INNER JOIN found_report fr ON m.found_report_id = fr.report_id
    WHERE m.match_id = ?
    LIMIT 1
");

$matchStmt->bind_param("i", $match_id);
$matchStmt->execute();
$matchResult = $matchStmt->get_result();

if ($matchResult->num_rows === 0) {
    echo json_encode(array(
        "status" => "error",
        "message" => "Match not found"
    ));
    exit();
}

$match = $matchResult->fetch_assoc();

$conn->begin_transaction();

try {
    // Update match status
    $updateMatch = $conn->prepare("
        UPDATE matches
        SET status = ?, admin_id = ?, verified_at = NOW()
        WHERE match_id = ?
    ");

    $updateMatch->bind_param("sii", $action, $admin_id, $match_id);
    $updateMatch->execute();

    if ($action === "verified") {
        // Update report statuses
        $updateLost = $conn->prepare("UPDATE lost_report SET status = 'matched' WHERE report_id = ?");
        $updateLost->bind_param("i", $match["lost_report_id"]);
        $updateLost->execute();

        $updateFound = $conn->prepare("UPDATE found_report SET status = 'matched' WHERE report_id = ?");
        $updateFound->bind_param("i", $match["found_report_id"]);
        $updateFound->execute();

        // ── Read configurable reward amount from system_config ────────────────
        $rewardAmount = 100.00; // safe fallback if table doesn't exist yet
        $cfgResult = $conn->query("
            SELECT config_value FROM system_config
            WHERE config_key = 'reward_amount' LIMIT 1
        ");
        if ($cfgResult && $cfgRow = $cfgResult->fetch_assoc()) {
            $rewardAmount = (float) $cfgRow["config_value"];
        }

        // ── Auto-create a pending reward for the finder ───────────────────────
        $insertReward = $conn->prepare("
            INSERT INTO reward (match_id, owner_id, finder_id, amount, status)
            VALUES (?, ?, ?, ?, 'pending')
        ");
        $insertReward->bind_param("iiid", $match_id, $match["owner_id"], $match["finder_id"], $rewardAmount);
        $insertReward->execute();
        $insertReward->close();

        // Send notification to lost item owner
        $ownerMessage = "Your lost report '" . $match["lost_title"] . "' has a verified match. Please check your dashboard.";
        $ownerNotify = $conn->prepare("
            INSERT INTO match_notification (user_id, match_id, message, type)
            VALUES (?, ?, ?, 'match_verified')
        ");
        $ownerNotify->bind_param("iis", $match["owner_id"], $match_id, $ownerMessage);
        $ownerNotify->execute();

        // Send notification to finder (including reward info)
        $rewardAmountFormatted = number_format($rewardAmount, 2);
        $finderMessage = "Your found report '" . $match["found_title"] . "' has been verified as a match! " .
                         "A Rs. {$rewardAmountFormatted} mobile reload reward is pending for you.";
        $finderNotify = $conn->prepare("
            INSERT INTO match_notification (user_id, match_id, message, type)
            VALUES (?, ?, ?, 'match_verified')
        ");
        $finderNotify->bind_param("iis", $match["finder_id"], $match_id, $finderMessage);
        $finderNotify->execute();
    }

    if ($action === "rejected") {
        $rejectMessage = "A potential match was reviewed by admin and rejected.";
        $rejectNotify = $conn->prepare("
            INSERT INTO match_notification (user_id, match_id, message, type)
            VALUES (?, ?, ?, 'match_rejected')
        ");
        $rejectNotify->bind_param("iis", $match["owner_id"], $match_id, $rejectMessage);
        $rejectNotify->execute();
    }

    // Save admin log
    $logAction = "Match " . $action . " by admin";
    $targetType = "match";

    $logStmt = $conn->prepare("
        INSERT INTO admin_log (admin_id, action, target_type, target_id)
        VALUES (?, ?, ?, ?)
    ");
    $logStmt->bind_param("issi", $admin_id, $logAction, $targetType, $match_id);
    $logStmt->execute();

    $conn->commit();

    echo json_encode(array(
        "status" => "success",
        "message" => "Match " . $action . " successfully",
        "match_id" => $match_id
    ));

} catch (Exception $e) {
    $conn->rollback();

    echo json_encode(array(
        "status" => "error",
        "message" => "Failed to update match",
        "error" => $e->getMessage()
    ));
}
?>