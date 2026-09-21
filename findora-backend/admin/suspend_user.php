<?php

header("Content-Type: application/json");

require_once __DIR__ . "/../config/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(array("status" => "error", "message" => "Only POST method is allowed"));
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data['user_id']) || !isset($data['action'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid parameters"]);
    exit();
}

$user_id = intval($data['user_id']);
$action = $data['action'] === 'unsuspend' ? 'active' : 'suspended';

try {
    $stmt = $conn->prepare("UPDATE users SET account_status = ? WHERE user_id = ?");
    $stmt->bind_param("si", $action, $user_id);

    if (!$stmt->execute()) {
        throw new Exception("Failed to update status");
    }

    echo json_encode(["status" => "success", "message" => "User status updated to $action"]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
