<?php
// ====================================================
// admin/update_reward_status.php
// Admin action: mark a reward as 'paid' or 'cancelled'.
// POST /admin/update_reward_status.php
// Body: { reward_id, action: "paid"|"cancelled", transaction_ref? }
// ====================================================

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit();
}

require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../classes/Security/AuthGuard.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Only POST method is allowed"]);
    exit();
}

AuthGuard::requireRole("admin");

$data           = json_decode(file_get_contents("php://input"), true);
$rewardId       = isset($data["reward_id"])      ? (int) $data["reward_id"]              : 0;
$action         = isset($data["action"])         ? trim($data["action"])                 : "";
$transactionRef = isset($data["transaction_ref"]) ? trim($data["transaction_ref"])       : null;

if ($rewardId <= 0 || !in_array($action, ["paid", "cancelled"], true)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "reward_id and valid action (paid|cancelled) are required"]);
    exit();
}

// Check reward exists and is still pending
$checkStmt = $conn->prepare("SELECT reward_id, status FROM reward WHERE reward_id = ? LIMIT 1");
$checkStmt->bind_param("i", $rewardId);
$checkStmt->execute();
$checkRow = $checkStmt->get_result()->fetch_assoc();
$checkStmt->close();

if (!$checkRow) {
    http_response_code(404);
    echo json_encode(["status" => "error", "message" => "Reward not found"]);
    exit();
}

if ($checkRow["status"] !== "pending") {
    http_response_code(409);
    echo json_encode(["status" => "error", "message" => "Reward has already been processed (status: {$checkRow['status']})"]);
    exit();
}

// Update reward
if ($action === "paid") {
    $updateStmt = $conn->prepare("
        UPDATE reward
        SET status = 'paid', transaction_ref = ?, paid_at = NOW()
        WHERE reward_id = ?
    ");
    $updateStmt->bind_param("si", $transactionRef, $rewardId);
} else {
    $updateStmt = $conn->prepare("
        UPDATE reward
        SET status = 'cancelled'
        WHERE reward_id = ?
    ");
    $updateStmt->bind_param("i", $rewardId);
}

if (!$updateStmt->execute()) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to update reward status"]);
    exit();
}
$updateStmt->close();

echo json_encode([
    "status"    => "success",
    "message"   => "Reward marked as {$action}",
    "reward_id" => $rewardId,
]);
?>
