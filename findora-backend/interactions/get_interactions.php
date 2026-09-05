<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit();
}

require_once __DIR__ . "/../config/db.php";
// AuthGuard::bootstrap() already called via db.php — session is started.
// This endpoint is public (no auth required), but if a session exists we use it.

$report_id = isset($_GET['report_id']) ? (int)$_GET['report_id'] : 0;
$report_type = isset($_GET['report_type']) ? $_GET['report_type'] : '';

if (!$report_id || !in_array($report_type, ['missing_person', 'missing_pet'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid parameters"]);
    exit();
}

$isPerson = $report_type === 'missing_person';
$reactionTable = $isPerson ? 'missing_person_reaction' : 'missing_pet_reaction';
$commentTable  = $isPerson ? 'missing_person_comment'  : 'missing_pet_comment';
$postIdColumn  = $isPerson ? 'person_post_id'           : 'pet_post_id';

// Use the authenticated session user (null for guests).
$sessionUserId = SessionManager::userId(); // null when not logged in

try {
    // 1. Reaction count (public)
    $stmt = $conn->prepare("SELECT COUNT(*) AS cnt FROM $reactionTable WHERE $postIdColumn = ?");
    $stmt->bind_param("i", $report_id);
    $stmt->execute();
    $reactionCount = (int)$stmt->get_result()->fetch_assoc()['cnt'];
    $stmt->close();

    // 2. Has the authenticated user reacted? (false for guests)
    $userHasReacted = false;
    if ($sessionUserId !== null) {
        $stmt = $conn->prepare("SELECT 1 FROM $reactionTable WHERE $postIdColumn = ? AND user_id = ?");
        $stmt->bind_param("ii", $report_id, $sessionUserId);
        $stmt->execute();
        $userHasReacted = $stmt->get_result()->num_rows > 0;
        $stmt->close();
    }

    // 3. Comments (public — everyone can read)
    $stmt = $conn->prepare("
        SELECT c.comment_id AS id, c.comment_text AS text, c.created_at, c.user_id,
               COALESCE(u.first_name, 'User') AS first_name,
               COALESCE(u.last_name, '')      AS last_name
        FROM $commentTable c
        LEFT JOIN users u ON c.user_id = u.user_id
        WHERE c.$postIdColumn = ?
        ORDER BY c.created_at ASC
    ");
    $stmt->bind_param("i", $report_id);
    $stmt->execute();
    $res = $stmt->get_result();

    $comments = [];
    while ($row = $res->fetch_assoc()) {
        $comments[] = [
            'id'         => (int)$row['id'],
            'text'       => $row['text'],
            'created_at' => $row['created_at'],
            'user_id'    => (int)$row['user_id'],
            'user_name'  => trim($row['first_name'] . ' ' . $row['last_name']),
        ];
    }
    $stmt->close();

    echo json_encode([
        "status"        => "success",
        "reactionsCount" => $reactionCount,
        "userHasReacted" => $userHasReacted,
        "comments"      => $comments,
    ]);

} catch (Exception $e) {
    error_log("get_interactions.php error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database error"]);
}
