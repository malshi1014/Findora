<?php
require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/helpers/send_location_notifications.php';

// Truncate email_notifications table so we can test again for report ID 16
$conn->query("TRUNCATE TABLE email_notifications");

// Re-send the notification for the lost item
// Report type: lost_item
// Report ID: 16
// Nearest Town: Badulla
// Reporter ID: 5 (Assuming)
// Title: Test Lost Item
// Description: This is a test description

sendLocationNotifications(
    $conn,
    'lost_item',
    16,
    'Badulla',
    5,
    'Lost Laptop',
    'I lost my laptop in Badulla town near the bus stand.'
);

echo "Location notifications triggered for report 16.\n";
