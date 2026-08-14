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

// Enforce Admin Authentication
$role = SessionManager::role();
if ($role !== 'admin') {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Unauthorized access. Admin privileges required."]);
    exit();
}

try {
    // Real-time statistics queries
    $totalRes = $conn->query("SELECT COUNT(*) AS cnt FROM complaint");
    $totalCount = (int)$totalRes->fetch_assoc()['cnt'];

    $openRes = $conn->query("SELECT COUNT(*) AS cnt FROM complaint WHERE status IN ('pending', 'reviewing')");
    $openCount = (int)$openRes->fetch_assoc()['cnt'];

    $resolvedRes = $conn->query("SELECT COUNT(*) AS cnt FROM complaint WHERE status = 'resolved'");
    $resolvedCount = (int)$resolvedRes->fetch_assoc()['cnt'];

    // Fetch all complaint records joined with user details
    $sql = "
        SELECT 
            c.complaint_id,
            c.user_id,
            COALESCE(c.name, CONCAT(u.first_name, ' ', u.last_name), 'Guest User') AS user_name,
            COALESCE(c.email, u.email, 'No Email') AS user_email,
            c.subject,
            c.message,
            c.status,
            c.admin_reply,
            c.replied_at,
            c.created_at
        FROM complaint c
        LEFT JOIN users u ON c.user_id = u.user_id
        ORDER BY c.created_at DESC
    ";

    $res = $conn->query($sql);
    $complaints = [];

    while ($row = $res->fetch_assoc()) {
        $complaints[] = [
            'id'           => (int)$row['complaint_id'],
            'user_id'      => (int)$row['user_id'],
            'name'         => $row['user_name'],
            'email'        => $row['user_email'],
            'subject'      => $row['subject'] ?: 'General Inquiry',
            'message'      => $row['message'],
            'status'       => ucfirst($row['status']), // e.g. Pending, Reviewing, Resolved, Rejected
            'admin_reply'  => $row['admin_reply'],
            'replied_at'   => $row['replied_at'],
            'created_at'   => $row['created_at']
        ];
    }

    echo json_encode([
        "status" => "success",
        "stats" => [
            "total"    => $totalCount,
            "open"     => $openCount,
            "resolved" => $resolvedCount
        ],
        "complaints" => $complaints
    ]);

} catch (Exception $e) {
    error_log("get_complaints error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
?>
