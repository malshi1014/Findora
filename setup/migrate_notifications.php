<?php
require_once __DIR__ . '/../config/db.php';

echo "<h1>Running Notifications Migration</h1>";
echo "<pre>";

// 1. Add nearest_town to lost_report
try {
    $conn->query("ALTER TABLE lost_report ADD COLUMN nearest_town VARCHAR(100) NULL AFTER district");
    echo "Added nearest_town to lost_report.\n";
} catch (mysqli_sql_exception $e) {
    if (strpos($e->getMessage(), "Duplicate column name") !== false) {
        echo "nearest_town already exists in lost_report.\n";
    } else {
        echo "Error on lost_report: " . $e->getMessage() . "\n";
    }
}

// 2. Add nearest_town to found_report
try {
    $conn->query("ALTER TABLE found_report ADD COLUMN nearest_town VARCHAR(100) NULL AFTER district");
    echo "Added nearest_town to found_report.\n";
} catch (mysqli_sql_exception $e) {
    if (strpos($e->getMessage(), "Duplicate column name") !== false) {
        echo "nearest_town already exists in found_report.\n";
    } else {
        echo "Error on found_report: " . $e->getMessage() . "\n";
    }
}

// 3. Add email_notifications_enabled to users
try {
    $conn->query("ALTER TABLE users ADD COLUMN email_notifications_enabled TINYINT(1) DEFAULT 1 AFTER role");
    echo "Added email_notifications_enabled to users.\n";
} catch (mysqli_sql_exception $e) {
    if (strpos($e->getMessage(), "Duplicate column name") !== false) {
        echo "email_notifications_enabled already exists in users.\n";
    } else {
        echo "Error on users: " . $e->getMessage() . "\n";
    }
}

// 4. Create email_notifications table
$sql = "CREATE TABLE IF NOT EXISTS email_notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    report_type ENUM('lost_item','found_item','missing_person','missing_pet') NOT NULL,
    report_id INT NOT NULL,
    user_id INT NOT NULL,
    email VARCHAR(150) NOT NULL,
    status ENUM('sent','failed') DEFAULT 'sent',
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_notification (report_type, report_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

try {
    $conn->query($sql);
    echo "Created email_notifications table.\n";
} catch (mysqli_sql_exception $e) {
    echo "Error creating email_notifications: " . $e->getMessage() . "\n";
}

echo "\nMigration complete.\n";
echo "</pre>";
?>
