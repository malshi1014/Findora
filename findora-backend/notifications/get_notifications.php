<?php
ob_start();

$origin = $_SERVER['HTTP_ORIGIN'] ?? ''; if ($origin === 'https://findora.freehosting.dev' || $origin === 'http://localhost:5173') { header('Access-Control-Allow-Origin: ' . $origin); } header('Access-Control-Allow-Headers: Content-Type'); header('Access-Control-Allow-Methods: GET, OPTIONS'); header('Content-Type: application/json');
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    ob_clean();
    echo json_encode(array(
        "status" => "success",
        "message" => "Preflight OK"
    ));
    exit();
}

include __DIR__ . "/../config/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    ob_clean();
    echo json_encode(array(
        "status" => "error",
        "message" => "Only GET method is allowed"
    ));
    exit();
}

$user_id = isset($_GET["user_id"]) ? intval($_GET["user_id"]) : 0;

if ($user_id <= 0) {
    ob_clean();
    echo json_encode(array(
        "status" => "error",
        "message" => "user_id is required"
    ));
    exit();
}

try {
    $stmt = $conn->prepare("
        SELECT 
            notification_id,
            user_id,
            match_id,
            message,
            type,
            is_read,
            created_at
        FROM match_notification
        WHERE user_id = ?
        ORDER BY created_at DESC, notification_id DESC
    ");

    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("i", $user_id);

    if (!$stmt->execute()) {
        throw new Exception("Execute failed: " . $stmt->error);
    }

    $result = $stmt->get_result();

    $notifications = array();

    while ($row = $result->fetch_assoc()) {
        $notifications[] = $row;
    }

    ob_clean();
    echo json_encode(array(
        "status" => "success",
        "notifications" => $notifications
    ));
    exit();

} catch (Exception $e) {
    ob_clean();
    echo json_encode(array(
        "status" => "error",
        "message" => "Failed to load notifications",
        "error" => $e->getMessage()
    ));
    exit();
}
?>