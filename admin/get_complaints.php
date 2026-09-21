<?php

header("Content-Type: application/json; charset=utf-8");

require_once __DIR__ . "/../config/db.php";

// Validate admin_id param
$adminId = isset($_GET['admin_id']) ? (int)$_GET['admin_id'] : 0;
if ($adminId <= 0) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "admin_id parameter is required."]);
    exit();
}

// Verify the caller is actually an admin
$chk = $conn->prepare("SELECT role FROM users WHERE user_id = ? LIMIT 1");
$chk->bind_param("i", $adminId);
$chk->execute();
$chkRes = $chk->get_result()->fetch_assoc();
$chk->close();

if (!$chkRes || $chkRes['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Unauthorized. Admin privileges required."]);
    exit();
}

try {
    // Real-time stats
    $totalRes    = $conn->query("SELECT COUNT(*) AS cnt FROM complaint");
    $totalCount  = (int)$totalRes->fetch_assoc()['cnt'];

    $openRes     = $conn->query("SELECT COUNT(*) AS cnt FROM complaint WHERE status IN ('pending','reviewing')");
    $openCount   = (int)$openRes->fetch_assoc()['cnt'];

    $resolvedRes = $conn->query("SELECT COUNT(*) AS cnt FROM complaint WHERE status = 'resolved'");
    $resolvedCount = (int)$resolvedRes->fetch_assoc()['cnt'];

    // Fetch complaints joined with user info
    $sql = "
        SELECT
            c.complaint_id,
            c.user_id,
            CONCAT(u.first_name, ' ', u.last_name) AS user_name,
            u.email AS user_email,
            c.message,
            c.status,
            c.created_at
        FROM complaint c
        LEFT JOIN users u ON c.user_id = u.user_id
        ORDER BY c.created_at DESC
    ";

    $res = $conn->query($sql);
    $complaints = [];

    while ($row = $res->fetch_assoc()) {
        $complaints[] = [
            'id'         => (int)$row['complaint_id'],
            'user_id'    => (int)$row['user_id'],
            'name'       => $row['user_name'] ?: 'Unknown User',
            'email'      => $row['user_email'] ?: 'No Email',
            'subject'    => 'General Inquiry',
            'message'    => $row['message'],
            'status'     => ucfirst($row['status'] ?? 'pending'),
            'admin_reply'=> null,
            'created_at' => $row['created_at']
        ];
    }

    echo json_encode([
        "status"     => "success",
        "stats"      => [
            "total"    => $totalCount,
            "open"     => $openCount,
            "resolved" => $resolvedCount
        ],
        "complaints" => $complaints
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
?>
