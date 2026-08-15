<?php
// ====================================================
// admin/update_reward_amount.php
// Admin action: update the reward_amount setting in
// the system_config table (used for all future rewards).
// POST /admin/update_reward_amount.php
// Body: { amount: <number> }
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

$data   = json_decode(file_get_contents("php://input"), true);
$amount = isset($data["amount"]) ? (float) $data["amount"] : -1;

if ($amount < 1) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Amount must be at least Rs. 1"]);
    exit();
}

$amountStr = number_format($amount, 2, ".", "");

$stmt = $conn->prepare("
    INSERT INTO system_config (config_key, config_value, description)
    VALUES ('reward_amount', ?, 'Mobile reload reward (LKR) given to finder on match verification')
    ON DUPLICATE KEY UPDATE config_value = ?
");
$stmt->bind_param("ss", $amountStr, $amountStr);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to update reward amount"]);
    exit();
}
$stmt->close();

echo json_encode([
    "status"  => "success",
    "message" => "Reward amount updated to Rs. {$amountStr}",
    "amount"  => (float) $amountStr,
]);
?>
