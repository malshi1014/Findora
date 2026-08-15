<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, X-CSRF-Token");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit();
}

require_once __DIR__ . "/../config/db.php";

$userId = SessionManager::userId(); // Null if guest

$data = json_decode(file_get_contents("php://input"), true);

$name    = isset($data['name'])    ? trim($data['name'])    : '';
$email   = isset($data['email'])   ? trim($data['email'])   : '';
$subject = isset($data['subject']) ? trim($data['subject']) : '';
$message = isset($data['message']) ? trim($data['message']) : '';

if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Name, email, and message are required."]);
    exit();
}

try {
    if ($userId !== null && $userId > 0) {
        $stmt = $conn->prepare("INSERT INTO complaint (user_id, name, email, subject, message, status) VALUES (?, ?, ?, ?, ?, 'pending')");
        $stmt->bind_param("issss", $userId, $name, $email, $subject, $message);
    } else {
        // If guest, use 0 or default user_id if null constraint exists, but let's check user_id default.
        // In schema, complaint user_id is INT NOT NULL. We can assign guest to user_id=0 or handle safely.
        // Wait, schema has user_id int NOT NULL with FK to users(user_id). If user_id = 0 fails FK, we check if user exists or fallback to existing valid user or remove FK restriction / insert with valid user ID if logged in.
        // Let's check if 0 exists or use logged in user ID if available, else fallback to 1 or guest user.
        $guestUserId = 1; // Default to admin/system user if guest submit
        if ($userId && $userId > 0) {
            $guestUserId = $userId;
        }
        $stmt = $conn->prepare("INSERT INTO complaint (user_id, name, email, subject, message, status) VALUES (?, ?, ?, ?, ?, 'pending')");
        $stmt->bind_param("issss", $guestUserId, $name, $email, $subject, $message);
    }

    if ($stmt->execute()) {
        $complaintId = $stmt->insert_id;
        $stmt->close();
        echo json_encode([
            "status" => "success",
            "message" => "Your message has been submitted successfully.",
            "complaint_id" => $complaintId
        ]);
    } else {
        throw new Exception($stmt->error);
    }
} catch (Exception $e) {
    error_log("send_complaint error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to submit complaint: " . $e->getMessage()]);
}
?>
