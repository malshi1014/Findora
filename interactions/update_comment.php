<?php
ob_start();

header("Content-Type: application/json; charset=utf-8");

require_once __DIR__ . "/../config/db.php";

$userId      = SessionManager::userId();
$sessionRole = SessionManager::role() ?? '';

$data         = json_decode(file_get_contents("php://input"), true);
$comment_id   = isset($data['comment_id'])   ? (int)$data['comment_id']         : 0;
$report_type  = isset($data['report_type'])  ? $data['report_type']              : '';
$comment_text = isset($data['comment_text']) ? trim($data['comment_text'])       : '';

if (!$comment_id || !in_array($report_type, ['missing_person', 'missing_pet']) || $comment_text === '') {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid parameters"]);
    exit();
}

$isPerson     = $report_type === 'missing_person';
$commentTable = $isPerson ? 'missing_person_comment' : 'missing_pet_comment';

try {
    // Verify the comment exists and get its owner
    $stmt = $conn->prepare("SELECT user_id, comment_text FROM $commentTable WHERE comment_id = ?");
    $stmt->bind_param("i", $comment_id);
    $stmt->execute();
    $res = $stmt->get_result();

    if ($res->num_rows === 0) {
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Comment not found"]);
        exit();
    }

    $row      = $res->fetch_assoc();
    $authorId = (int)$row['user_id'];
    $stmt->close();

    // Only the comment's author may edit (admins can delete but not impersonate the author's words)
    if ($authorId !== $userId) {
        http_response_code(403);
        echo json_encode(["status" => "error", "message" => "You can only edit your own comments"]);
        exit();
    }

    // Update the comment text
    $stmt = $conn->prepare("UPDATE $commentTable SET comment_text = ? WHERE comment_id = ?");
    $stmt->bind_param("si", $comment_text, $comment_id);
    $stmt->execute();
    $stmt->close();

    // Return the updated comment
    echo json_encode([
        "status"       => "success",
        "message"      => "Comment updated",
        "comment_id"   => $comment_id,
        "comment_text" => $comment_text,
    ]);

} catch (Exception $e) {
    error_log("update_comment.php error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database error"]);
}
