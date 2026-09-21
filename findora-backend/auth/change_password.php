<?php

header("Content-Type: application/json; charset=utf-8");

require_once __DIR__ . "/../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

$userId      = isset($data['user_id'])          ? (int)$data['user_id']              : 0;
$currentPass = isset($data['current_password']) ? (string)$data['current_password']  : '';
$newPass     = isset($data['new_password'])     ? (string)$data['new_password']      : '';

if ($userId <= 0 || empty($currentPass) || empty($newPass)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "user_id, current_password, and new_password are all required."]);
    exit();
}

if (strlen($newPass) < 8) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "New password must be at least 8 characters."]);
    exit();
}

try {
    // Fetch current hash
    $stmt = $conn->prepare("SELECT password_hash FROM users WHERE user_id = ? LIMIT 1");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$row) {
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "User not found."]);
        exit();
    }

    if (!password_verify($currentPass, $row['password_hash'])) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Current password is incorrect."]);
        exit();
    }

    $newHash = password_hash($newPass, PASSWORD_BCRYPT);
    $upd = $conn->prepare("UPDATE users SET password_hash = ? WHERE user_id = ?");
    $upd->bind_param("si", $newHash, $userId);
    $upd->execute();
    $upd->close();

    echo json_encode(["status" => "success", "message" => "Password changed successfully."]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to change password: " . $e->getMessage()]);
}
?>
