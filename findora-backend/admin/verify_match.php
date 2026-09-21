<?php

header("Content-Type: application/json");

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

    // ── Send Email Notifications only to Lost Owner & Found Reporter for verified matches ──
    // Only triggers on 'verified' action. Prevents duplicates via email_notifications table.
    if ($action === "verified") {
        try {
            require_once __DIR__ . "/../classes/Services/EmailService.php";
            $emailService = new EmailService();

            $isProd = (!empty($_SERVER['HTTP_HOST']) && strpos($_SERVER['HTTP_HOST'], 'findora.software') !== false);
            $frontendBase = $isProd ? "https://findora.software" : "http://localhost:5173";

            // Ensure email_notifications table exists (defensive for production)
            $conn->query("
                CREATE TABLE IF NOT EXISTS `email_notifications` (
                    `notification_id` int NOT NULL AUTO_INCREMENT,
                    `report_type` varchar(50) NOT NULL,
                    `report_id` int NOT NULL,
                    `user_id` int NOT NULL,
                    `email` varchar(150) NOT NULL,
                    `status` varchar(20) NOT NULL DEFAULT 'sent',
                    `sent_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (`notification_id`),
                    UNIQUE KEY `unique_notification` (`report_type`, `report_id`, `user_id`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            ");

            // Fetch additional report details for enriched emails
            $lrStmt = $conn->prepare("
                SELECT lr.category, lr.description, lr.location, lr.lost_date, lr.district
                FROM lost_report lr
                WHERE lr.report_id = ?
                LIMIT 1
            ");
            $lostDetails = [];
            if ($lrStmt) {
                $lrStmt->bind_param("i", $match["lost_report_id"]);
                $lrStmt->execute();
                $lostDetails = $lrStmt->get_result()->fetch_assoc() ?? [];
                $lrStmt->close();
            }

            $frStmt = $conn->prepare("
                SELECT fr.category, fr.description, fr.location, fr.found_date, fr.district
                FROM found_report fr
                WHERE fr.report_id = ?
                LIMIT 1
            ");
            $foundDetails = [];
            if ($frStmt) {
                $frStmt->bind_param("i", $match["found_report_id"]);
                $frStmt->execute();
                $foundDetails = $frStmt->get_result()->fetch_assoc() ?? [];
                $frStmt->close();
            }

            $category = !empty($lostDetails['category']) ? htmlspecialchars($lostDetails['category']) : (!empty($foundDetails['category']) ? htmlspecialchars($foundDetails['category']) : 'Item');
            $lostLocation = !empty($lostDetails['location']) ? htmlspecialchars($lostDetails['location']) : 'Unknown';
            $foundLocation = !empty($foundDetails['location']) ? htmlspecialchars($foundDetails['location']) : 'Unknown';
            $lostDate = !empty($lostDetails['lost_date']) ? htmlspecialchars($lostDetails['lost_date']) : 'Unknown';
            $foundDate = !empty($foundDetails['found_date']) ? htmlspecialchars($foundDetails['found_date']) : 'Unknown';

            error_log("[verify_match] Sending match emails. Match #$match_id. Lost owner: {$match['owner_id']}, Found reporter: {$match['finder_id']}");

            $sentMatchEmails = array();

            // ─── Email to Lost Item Owner ───
            $uStmt = $conn->prepare("SELECT user_id, first_name, email FROM users WHERE user_id = ? AND email IS NOT NULL AND TRIM(email) != '' LIMIT 1");
            $uStmt->bind_param("i", $match["owner_id"]);
            $uStmt->execute();
            $ownerUser = $uStmt->get_result()->fetch_assoc();
            $uStmt->close();

            if ($ownerUser && !empty($ownerUser["email"])) {
                $ownerEmail = strtolower(trim($ownerUser["email"]));
                $reportTypeOwner = 'match_verified_owner';

                $shouldSendOwner = true;
                $chkStmt = $conn->prepare("SELECT status FROM email_notifications WHERE report_type = ? AND report_id = ? AND user_id = ? LIMIT 1");
                if ($chkStmt) {
                    $chkStmt->bind_param("sii", $reportTypeOwner, $match_id, $ownerUser["user_id"]);
                    $chkStmt->execute();
                    $res = $chkStmt->get_result()->fetch_assoc();
                    $chkStmt->close();
                    if ($res) {
                        if ($res['status'] === 'sent') {
                            $shouldSendOwner = false;
                        } else {
                            $upd = $conn->prepare("UPDATE email_notifications SET status='pending', email=? WHERE report_type=? AND report_id=? AND user_id=?");
                            if ($upd) { $upd->bind_param("ssii", $ownerUser["email"], $reportTypeOwner, $match_id, $ownerUser["user_id"]); $upd->execute(); $upd->close(); }
                        }
                    } else {
                        $ins = $conn->prepare("INSERT IGNORE INTO email_notifications (report_type, report_id, user_id, email, status) VALUES (?, ?, ?, ?, 'pending')");
                        if ($ins) { $ins->bind_param("siis", $reportTypeOwner, $match_id, $ownerUser["user_id"], $ownerUser["email"]); $ins->execute(); $ins->close(); }
                    }
                }

                if ($shouldSendOwner && !isset($sentMatchEmails[$ownerEmail])) {
                    $sentMatchEmails[$ownerEmail] = true;
                    $subject = "Findora Verified Match Notification - " . htmlspecialchars($match["lost_title"]);
                    $body = "
                    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;'>
                        <div style='background-color: #16a34a; color: white; padding: 15px; border-radius: 8px 8px 0 0; text-align: center;'>
                            <h2 style='margin: 0;'>&#10003; Verified Match Found!</h2>
                            <p style='margin: 5px 0 0 0; font-size: 14px;'>Your lost item may have been found</p>
                        </div>
                        <div style='padding: 20px;'>
                            <p>Hi <strong>" . htmlspecialchars($ownerUser["first_name"]) . "</strong>,</p>
                            <p>Great news! A verified match has been found for your lost item report on Findora.</p>

                            <div style='background-color: #f0fdf4; padding: 15px; border-left: 4px solid #16a34a; margin: 20px 0; border-radius: 4px;'>
                                <h3 style='margin-top: 0; color: #0f172a;'>Your Lost Report: " . htmlspecialchars($match["lost_title"]) . "</h3>
                                <table style='width: 100%; font-size: 14px; color: #334155;'>
                                    <tr><td><strong>Category:</strong></td><td>$category</td></tr>
                                    <tr><td><strong>Lost Location:</strong></td><td>$lostLocation</td></tr>
                                    <tr><td><strong>Lost Date:</strong></td><td>$lostDate</td></tr>
                                </table>
                            </div>

                            <div style='background-color: #f8fafc; padding: 15px; border-left: 4px solid #2563eb; margin: 20px 0; border-radius: 4px;'>
                                <h3 style='margin-top: 0; color: #0f172a;'>Matched Found Report: " . htmlspecialchars($match["found_title"]) . "</h3>
                                <table style='width: 100%; font-size: 14px; color: #334155;'>
                                    <tr><td><strong>Found Location:</strong></td><td>$foundLocation</td></tr>
                                    <tr><td><strong>Found Date:</strong></td><td>$foundDate</td></tr>
                                </table>
                                <p style='color: #475569; font-size: 14px; margin-top: 10px;'>Log in to Findora to view full match details and contact the finder through the platform.</p>
                            </div>

                            <div style='text-align: center; margin: 30px 0;'>
                                <a href='" . $frontendBase . "/login' style='background-color: #2563eb; color: white; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-weight: bold;'>View Match in Findora</a>
                            </div>
                        </div>
                    </div>";
                    $result = $emailService->send($ownerUser["email"], $subject, $body);
                    $newStatus = $result ? 'sent' : 'failed';
                    $updStmt = $conn->prepare("UPDATE email_notifications SET status = ?, sent_at = CURRENT_TIMESTAMP WHERE report_type = ? AND report_id = ? AND user_id = ?");
                    if ($updStmt) {
                        $updStmt->bind_param("ssii", $newStatus, $reportTypeOwner, $match_id, $ownerUser["user_id"]);
                        $updStmt->execute();
                        $updStmt->close();
                    }
                    error_log("[verify_match] Owner email to {$ownerUser['email']}: " . $newStatus);
                }
            }

            // ─── Email to Found Item Reporter ───
            $uStmt = $conn->prepare("SELECT user_id, first_name, email FROM users WHERE user_id = ? AND email IS NOT NULL AND TRIM(email) != '' LIMIT 1");
            $uStmt->bind_param("i", $match["finder_id"]);
            $uStmt->execute();
            $finderUser = $uStmt->get_result()->fetch_assoc();
            $uStmt->close();

            if ($finderUser && !empty($finderUser["email"])) {
                $finderEmail = strtolower(trim($finderUser["email"]));
                $reportTypeFinder = 'match_verified_finder';

                $shouldSendFinder = true;
                $chkStmt = $conn->prepare("SELECT status FROM email_notifications WHERE report_type = ? AND report_id = ? AND user_id = ? LIMIT 1");
                if ($chkStmt) {
                    $chkStmt->bind_param("sii", $reportTypeFinder, $match_id, $finderUser["user_id"]);
                    $chkStmt->execute();
                    $res = $chkStmt->get_result()->fetch_assoc();
                    $chkStmt->close();
                    if ($res) {
                        if ($res['status'] === 'sent') {
                            $shouldSendFinder = false;
                        } else {
                            $upd = $conn->prepare("UPDATE email_notifications SET status='pending', email=? WHERE report_type=? AND report_id=? AND user_id=?");
                            if ($upd) { $upd->bind_param("ssii", $finderUser["email"], $reportTypeFinder, $match_id, $finderUser["user_id"]); $upd->execute(); $upd->close(); }
                        }
                    } else {
                        $ins = $conn->prepare("INSERT IGNORE INTO email_notifications (report_type, report_id, user_id, email, status) VALUES (?, ?, ?, ?, 'pending')");
                        if ($ins) { $ins->bind_param("siis", $reportTypeFinder, $match_id, $finderUser["user_id"], $finderUser["email"]); $ins->execute(); $ins->close(); }
                    }
                }

                if ($shouldSendFinder && !isset($sentMatchEmails[$finderEmail])) {
                        $sentMatchEmails[$finderEmail] = true;
                        $subject = "Findora Verified Match Notification - " . htmlspecialchars($match["found_title"]);
                        $body = "
                        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;'>
                            <div style='background-color: #2563eb; color: white; padding: 15px; border-radius: 8px 8px 0 0; text-align: center;'>
                                <h2 style='margin: 0;'>&#10003; Your Found Report Was Matched!</h2>
                                <p style='margin: 5px 0 0 0; font-size: 14px;'>A verified match has been confirmed by admin</p>
                            </div>
                            <div style='padding: 20px;'>
                                <p>Hi <strong>" . htmlspecialchars($finderUser["first_name"]) . "</strong>,</p>
                                <p>Your found item report on Findora has been verified as a match for someone's lost item report. Thank you for helping our community!</p>

                                <div style='background-color: #f8fafc; padding: 15px; border-left: 4px solid #2563eb; margin: 20px 0; border-radius: 4px;'>
                                    <h3 style='margin-top: 0; color: #0f172a;'>Your Found Report: " . htmlspecialchars($match["found_title"]) . "</h3>
                                    <table style='width: 100%; font-size: 14px; color: #334155;'>
                                        <tr><td><strong>Category:</strong></td><td>$category</td></tr>
                                        <tr><td><strong>Found Location:</strong></td><td>$foundLocation</td></tr>
                                        <tr><td><strong>Found Date:</strong></td><td>$foundDate</td></tr>
                                    </table>
                                </div>

                                <div style='background-color: #f0fdf4; padding: 15px; border-left: 4px solid #16a34a; margin: 20px 0; border-radius: 4px;'>
                                    <h3 style='margin-top: 0; color: #0f172a;'>Matched Lost Report: " . htmlspecialchars($match["lost_title"]) . "</h3>
                                    <p style='color: #475569; font-size: 14px;'>Log in to Findora to view the owner's details and coordinate the return. A reward may also be available for you!</p>
                                </div>

                                <div style='text-align: center; margin: 30px 0;'>
                                    <a href='" . $frontendBase . "/login' style='background-color: #2563eb; color: white; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-weight: bold;'>View Match in Findora</a>
                                </div>
                            </div>
                        </div>";
                        $result = $emailService->send($finderUser["email"], $subject, $body);
                        $newStatus = $result ? 'sent' : 'failed';
                        $updStmt = $conn->prepare("UPDATE email_notifications SET status = ?, sent_at = CURRENT_TIMESTAMP WHERE report_type = ? AND report_id = ? AND user_id = ?");
                        if ($updStmt) {
                            $updStmt->bind_param("ssii", $newStatus, $reportTypeFinder, $match_id, $finderUser["user_id"]);
                            $updStmt->execute();
                            $updStmt->close();
                        }
                        error_log("[verify_match] Finder email to {$finderUser['email']}: " . $newStatus);
                }
            }
        } catch (\Throwable $e) {
            error_log("[verify_match] Error sending email: " . $e->getMessage());
        }
    }

    echo json_encode(array(
        "status" => "success",
        "message" => "Match " . $action . " successfully",
        "match_id" => $match_id
    ));

} catch (\Throwable $e) {
    if (isset($conn) && $conn->connect_errno === 0 && !$conn->autocommit(true)) {
        $conn->rollback();
    }
    error_log("[verify_match] Critical Exception: " . $e->getMessage());
    echo json_encode(array(
        "status" => "error",
        "message" => "An error occurred while processing the request",
        "error" => $e->getMessage()
    ));
}
?>
