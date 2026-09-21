<?php
require_once __DIR__ . '/config/db.php';
echo "=== users table ===\n";
$r = $conn->query('DESCRIBE users');
while($row = $r->fetch_assoc()) echo $row['Field'].' | '.$row['Type']."\n";

echo "\n=== email_notifications table ===\n";
$r2 = $conn->query("SHOW TABLES LIKE 'email_notifications'");
if ($r2->num_rows > 0) {
    $r3 = $conn->query('DESCRIBE email_notifications');
    while($row = $r3->fetch_assoc()) echo $row['Field'].' | '.$row['Type']."\n";
} else {
    echo "TABLE MISSING\n";
}

echo "\n=== match_reports table ===\n";
$r4 = $conn->query("SHOW TABLES LIKE 'match_reports'");
if ($r4->num_rows > 0) {
    $r5 = $conn->query('DESCRIBE match_reports');
    while($row = $r5->fetch_assoc()) echo $row['Field'].' | '.$row['Type']."\n";
} else {
    echo "TABLE MISSING\n";
}
