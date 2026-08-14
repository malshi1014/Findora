<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
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

$data = json_decode(file_get_contents("php://input"), true);

$complaintId = isset($data['complaint_id']) ? (int)$data['complaint_id'] : 0;
$replyText   = isset($data['admin_reply'])  ? trim($data['admin_reply'])  : '';
$newStatus   = isset($data['status'])       ? strtolower(trim($data['status'])) : 'resolved';

if (!$complaintId || empty($replyText)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Complaint ID and reply message are required."]);
    exit();
}

if (!in_array($newStatus, ['pending', 'reviewing', 'resolved', 'rejected'])) {
    $newStatus = 'resolved';
}

try {
    // 1. Fetch complaint details
    $stmt = $conn->prepare("SELECT user_id, subject, message FROM complaint WHERE complaint_id = ?");
    $stmt->bind_param("i", $complaintId);
    $stmt->execute();
    $res = $stmt->get_result();

    if ($res->num_rows === 0) {
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Complaint record not found."]);
        exit();
    }

    $complaint = $res->fetch_assoc();
    $userId = (int)$complaint['user_id'];
    $stmt->close();

    // 2. Update complaint with admin reply and new status
    $stmt = $conn->prepare("
        UPDATE complaint 
        SET admin_reply = ?, status = ?, replied_at = NOW() 
        WHERE complaint_id = ?
    ");
    $stmt->bind_param("ssi", $replyText, $newStatus, $complaintId);
    $stmt->execute();
    $stmt->close();

    // 3. Send notification to user if user_id > 0
    if ($userId > 0) {
        $notifMessage = "Admin replied to your inquiry (#" . $complaintId . "): \"" . $replyText . "\"";
        $notifType = "complaint_reply";

        $stmtNotif = $conn->prepare("
            INSERT INTO match_notification (user_id, match_id, message, type, is_read, sent_at)
            VALUES (?, NULL, ?, ?, 0, NOW())
        ");
        $stmtNotif->bind_param("iss", $userId, $notifMessage, $notifType);
        $stmtNotif->execute();
        $stmtNotif->close();
    }

    echo json_encode([
        "status"  => "success",
        "message" => "Reply submitted and complaint updated successfully.",
        "reply"   => [
            "complaint_id" => $complaintId,
            "admin_reply"  => $replyText,
            "status"       => ucfirst($newStatus),
            "replied_at"   => date("Y-m-d H:i:s")
        ]
    ]);

} catch (Exception $e) {
    error_log("reply_complaint error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
?>
