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

// db.php calls AuthGuard::bootstrap() which starts the session and enforces auth.
// If the user is not logged in, AuthGuard::bootstrap() will return a 401 before reaching here.
require_once __DIR__ . "/../config/db.php";

// AuthGuard already validated the session — safe to call SessionManager::userId().
$userId = SessionManager::userId();

$data        = json_decode(file_get_contents("php://input"), true);
$report_id   = isset($data['report_id'])   ? (int)$data['report_id']   : 0;
$report_type = isset($data['report_type']) ? $data['report_type']       : '';

if (!$report_id || !in_array($report_type, ['missing_person', 'missing_pet'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid parameters"]);
    exit();
}

$isPerson      = $report_type === 'missing_person';
$reactionTable = $isPerson ? 'missing_person_reaction' : 'missing_pet_reaction';
$postIdColumn  = $isPerson ? 'person_post_id'           : 'pet_post_id';

try {
    // Check existing reaction
    $stmt = $conn->prepare("SELECT reaction_id FROM $reactionTable WHERE $postIdColumn = ? AND user_id = ?");
    $stmt->bind_param("ii", $report_id, $userId);
    $stmt->execute();
    $alreadyReacted = $stmt->get_result()->num_rows > 0;
    $stmt->close();

    if ($alreadyReacted) {
        $stmt = $conn->prepare("DELETE FROM $reactionTable WHERE $postIdColumn = ? AND user_id = ?");
        $stmt->bind_param("ii", $report_id, $userId);
        $stmt->execute();
        $stmt->close();
        $userHasReacted = false;
    } else {
        $stmt = $conn->prepare("INSERT INTO $reactionTable ($postIdColumn, user_id, reaction_type) VALUES (?, ?, 'like')");
        $stmt->bind_param("ii", $report_id, $userId);
        $stmt->execute();
        $stmt->close();
        $userHasReacted = true;
    }

    // Return fresh count
    $stmt = $conn->prepare("SELECT COUNT(*) AS cnt FROM $reactionTable WHERE $postIdColumn = ?");
    $stmt->bind_param("i", $report_id);
    $stmt->execute();
    $reactionCount = (int)$stmt->get_result()->fetch_assoc()['cnt'];
    $stmt->close();

    echo json_encode([
        "status"         => "success",
        "reactionsCount" => $reactionCount,
        "userHasReacted" => $userHasReacted,
    ]);

} catch (Exception $e) {
    error_log("toggle_reaction.php error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
