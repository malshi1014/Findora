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

$userId = SessionManager::userId();

$data         = json_decode(file_get_contents("php://input"), true);
$report_id    = isset($data['report_id'])    ? (int)$data['report_id']   : 0;
$report_type  = isset($data['report_type'])  ? $data['report_type']      : '';
$comment_text = isset($data['comment_text']) ? trim($data['comment_text']) : '';

if (!$report_id || !in_array($report_type, ['missing_person', 'missing_pet']) || $comment_text === '') {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid parameters"]);
    exit();
}

$isPerson      = $report_type === 'missing_person';
$commentTable  = $isPerson ? 'missing_person_comment' : 'missing_pet_comment';
$postIdColumn  = $isPerson ? 'person_post_id'          : 'pet_post_id';

try {
    $stmt = $conn->prepare("INSERT INTO $commentTable ($postIdColumn, user_id, comment_text) VALUES (?, ?, ?)");
    $stmt->bind_param("iis", $report_id, $userId, $comment_text);
    $stmt->execute();
    $newCommentId = $stmt->insert_id;
    $stmt->close();

    // Fetch inserted comment with user name
    $stmt = $conn->prepare("
        SELECT c.comment_id AS id, c.comment_text AS text, c.created_at, c.user_id,
               COALESCE(u.first_name, 'User') AS first_name,
               COALESCE(u.last_name, '')      AS last_name
        FROM $commentTable c
        LEFT JOIN users u ON c.user_id = u.user_id
        WHERE c.comment_id = ?
    ");
    $stmt->bind_param("i", $newCommentId);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    echo json_encode([
        "status"  => "success",
        "comment" => [
            'id'         => (int)$row['id'],
            'text'       => $row['text'],
            'created_at' => $row['created_at'],
            'user_id'    => (int)$row['user_id'],
            'user_name'  => trim($row['first_name'] . ' ' . $row['last_name']),
        ],
    ]);

} catch (Exception $e) {
    error_log("add_comment.php error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
