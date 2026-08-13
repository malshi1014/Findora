<?php
// Connect directly to bypass AuthGuard (CLI only)
$conn = new mysqli('localhost', 'root', 'root', 'findora_db');
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$conn->set_charset('utf8mb4');

require_once __DIR__ . '/helpers/send_location_notifications.php';

// First, clear the old duplicate-prevention entries for report 16
$conn->query("DELETE FROM email_notifications WHERE report_id = 16 AND report_type = 'lost_item'");
echo "Cleared old notification records for report 16.\n";

// Fetch the actual report data from the DB
$res = $conn->query("SELECT lr.*, u.first_name, u.last_name FROM lost_report lr 
    JOIN users u ON u.user_id = lr.user_id 
    WHERE lr.report_id = 16 LIMIT 1");

if (!$res || $res->num_rows === 0) {
    echo "Report 16 not found.\n";
    exit;
}

$report = $res->fetch_assoc();
echo "Found report: " . $report['title'] . " | Town: " . $report['nearest_town'] . "\n";

// Send notifications
sendLocationNotifications(
    $conn,
    'lost_item',
    (int)$report['report_id'],
    $report['nearest_town'],
    (int)$report['user_id'],
    $report['title'],
    $report['description']
);

echo "Notifications dispatched! Check email_notifications table for results.\n";

// Show results
$res2 = $conn->query("SELECT * FROM email_notifications WHERE report_id = 16");
echo "\nEmail notification records:\n";
while ($row = $res2->fetch_assoc()) {
    echo "  → " . $row['email'] . " | Status: " . $row['status'] . " | Sent at: " . $row['sent_at'] . "\n";
}
