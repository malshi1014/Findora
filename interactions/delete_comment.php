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

$userId      = SessionManager::userId();
$sessionRole = SessionManager::role() ?? '';

$data        = json_decode(file_get_contents("php://input"), true);
$comment_id  = isset($data['comment_id'])  ? (int)$data['comment_id']  : 0;
$report_type = isset($data['report_type']) ? $data['report_type']       : '';

if (!$comment_id || !in_array($report_type, ['missing_person', 'missing_pet'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid parameters"]);
    exit();
}

$isPerson     = $report_type === 'missing_person';
$commentTable = $isPerson ? 'missing_person_comment' : 'missing_pet_comment';

try {
    // Get the comment's owner
    $stmt = $conn->prepare("SELECT user_id FROM $commentTable WHERE comment_id = ?");
    $stmt->bind_param("i", $comment_id);
    $stmt->execute();
    $res = $stmt->get_result();

    if ($res->num_rows === 0) {
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Comment not found"]);
        exit();
    }

    $authorId = (int)$res->fetch_assoc()['user_id'];
    $stmt->close();

    // Only the author or an admin may delete
    if ($authorId !== $userId && $sessionRole !== 'admin') {
        http_response_code(403);
        echo json_encode(["status" => "error", "message" => "You can only delete your own comments"]);
        exit();
    }

    $stmt = $conn->prepare("DELETE FROM $commentTable WHERE comment_id = ?");
    $stmt->bind_param("i", $comment_id);
    $stmt->execute();
    $stmt->close();

    echo json_encode(["status" => "success", "message" => "Comment deleted"]);

} catch (Exception $e) {
    error_log("delete_comment.php error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database error"]);
}
