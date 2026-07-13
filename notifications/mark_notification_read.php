<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    echo json_encode(array(
        "status" => "success",
        "message" => "Preflight OK"
    ));
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

if ($data === null) {
    echo json_encode(array(
        "status" => "error",
        "message" => "Invalid JSON input"
    ));
    exit();
}

$notification_id = isset($data["notification_id"]) ? intval($data["notification_id"]) : 0;
$user_id = isset($data["user_id"]) ? intval($data["user_id"]) : 0;

if ($notification_id <= 0 || $user_id <= 0) {
    echo json_encode(array(
        "status" => "error",
        "message" => "notification_id and user_id are required"
    ));
    exit();
}

try {
    $stmt = $conn->prepare("
        UPDATE match_notification
        SET is_read = 1
        WHERE notification_id = ? AND user_id = ?
    ");

    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("ii", $notification_id, $user_id);

    if (!$stmt->execute()) {
        throw new Exception("Execute failed: " . $stmt->error);
    }

    if ($stmt->affected_rows > 0) {
        echo json_encode(array(
            "status" => "success",
            "message" => "Notification marked as read"
        ));
    } else {
        echo json_encode(array(
            "status" => "error",
            "message" => "Notification not found or already read"
        ));
    }

    exit();

} catch (Exception $e) {
    echo json_encode(array(
        "status" => "error",
        "message" => "Failed to update notification",
        "error" => $e->getMessage()
    ));
    exit();
}
?>