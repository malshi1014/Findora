<?php

header("Content-Type: application/json; charset=utf-8");

require_once __DIR__ . "/../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

$userId     = isset($data['user_id'])      ? (int)$data['user_id']          : 0;
$firstName  = isset($data['first_name'])   ? trim($data['first_name'])      : '';
$lastName   = isset($data['last_name'])    ? trim($data['last_name'])       : '';
$mobile     = isset($data['mobile'])       ? trim($data['mobile'])          : '';
$district   = isset($data['district'])     ? trim($data['district'])        : '';
$nearTown   = isset($data['nearest_town']) ? trim($data['nearest_town'])    : '';

if ($userId <= 0) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "user_id is required."]);
    exit();
}

if (empty($firstName) || empty($lastName)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "First and last name are required."]);
    exit();
}

try {
    $stmt = $conn->prepare("
        UPDATE users
        SET first_name = ?, last_name = ?, mobile = ?, district = ?, nearest_town = ?
        WHERE user_id = ?
    ");
    $stmt->bind_param("sssssi", $firstName, $lastName, $mobile, $district, $nearTown, $userId);
    $stmt->execute();
    $stmt->close();

    // Return updated user data
    $res = $conn->prepare("SELECT user_id, first_name, last_name, email, mobile, role, district, nearest_town FROM users WHERE user_id = ?");
    $res->bind_param("i", $userId);
    $res->execute();
    $user = $res->get_result()->fetch_assoc();
    $res->close();

    echo json_encode([
        "status"  => "success",
        "message" => "Profile updated successfully.",
        "user"    => $user
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to update profile: " . $e->getMessage()]);
}
?>
