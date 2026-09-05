<?php
$origin = $_SERVER['HTTP_ORIGIN'] ?? ''; if ($origin === 'https://findora.freehosting.dev' || $origin === 'http://localhost:5173') { header('Access-Control-Allow-Origin: ' . $origin); } header('Access-Control-Allow-Headers: Content-Type'); header('Access-Control-Allow-Methods: GET, OPTIONS'); header('Content-Type: application/json');
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

include __DIR__ . "/../config/db.php";

function getCount($conn, $sql) {
    $result = $conn->query($sql);

    if ($result) {
        $row = $result->fetch_assoc();
        return intval($row["total"]);
    }

    return 0;
}

$total_users = getCount($conn, "SELECT COUNT(*) AS total FROM users");
$total_lost_reports = getCount($conn, "SELECT COUNT(*) AS total FROM lost_report");
$total_found_reports = getCount($conn, "SELECT COUNT(*) AS total FROM found_report");
$total_users = getCount($conn, 'SELECT COUNT(*) AS total FROM users'); $total_lost_reports = getCount($conn, 'SELECT COUNT(*) AS total FROM lost_report'); $total_found_reports = getCount($conn, 'SELECT COUNT(*) AS total FROM found_report'); $total_suspicious_reports = getCount($conn, 'SELECT COUNT(*) AS total FROM suspicious_report'); $pending_lost_reports = getCount($conn, 'SELECT COUNT(*) AS total FROM lost_report WHERE status = 'pending''); $pending_found_reports = getCount($conn, 'SELECT COUNT(*) AS total FROM found_report WHERE status = 'pending''); $pending_suspicious_reports = getCount($conn, 'SELECT COUNT(*) AS total FROM suspicious_report WHERE status = 'pending'');

$total_matches = getCount($conn, "SELECT COUNT(*) AS total FROM matches");
$pending_matches = getCount($conn, "SELECT COUNT(*) AS total FROM matches WHERE status = 'pending'");
$verified_matches = getCount($conn, "SELECT COUNT(*) AS total FROM matches WHERE status = 'verified'");
$rejected_matches = getCount($conn, "SELECT COUNT(*) AS total FROM matches WHERE status = 'rejected'");

$total_notifications = getCount($conn, "SELECT COUNT(*) AS total FROM match_notification");
$total_complaints = getCount($conn, "SELECT COUNT(*) AS total FROM complaint");

echo json_encode(array(
    "status" => "success",
    "stats" => array(
        "total_users" => $total_users,
        "total_lost_reports" => $total_lost_reports,
        "total_found_reports" => $total_found_reports,
        'total_users' => $total_users,        'total_lost_reports' => $total_lost_reports,        'total_found_reports' => $total_found_reports,        'total_suspicious_reports' => $total_suspicious_reports,        'pending_lost_reports' => $pending_lost_reports,        'pending_found_reports' => $pending_found_reports,        'pending_suspicious_reports' => $pending_suspicious_reports,        'total_matches' => $total_matches,        'pending_matches' => $pending_matches,        'verified_matches' => $verified_matches,
        "total_matches" => $total_matches,
        "pending_matches" => $pending_matches,
        "verified_matches" => $verified_matches,
        "rejected_matches" => $rejected_matches,
        "total_notifications" => $total_notifications,
        "total_complaints" => $total_complaints
    )
));
?>