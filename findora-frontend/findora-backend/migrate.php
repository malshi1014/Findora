<?php
$conn = new mysqli('localhost', 'root', 'root', 'findora_db');
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

try { $conn->query("ALTER TABLE lost_report ADD COLUMN nearest_town VARCHAR(100) NULL AFTER district"); echo "lost_report OK\n"; } catch (Exception $e) { echo $e->getMessage() . "\n"; }
try { $conn->query("ALTER TABLE found_report ADD COLUMN nearest_town VARCHAR(100) NULL AFTER district"); echo "found_report OK\n"; } catch (Exception $e) { echo $e->getMessage() . "\n"; }
try { $conn->query("ALTER TABLE users ADD COLUMN email_notifications_enabled TINYINT(1) DEFAULT 1 AFTER role"); echo "users OK\n"; } catch (Exception $e) { echo $e->getMessage() . "\n"; }

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

try { $conn->query($sql); echo "email_notifications OK\n"; } catch (Exception $e) { echo $e->getMessage() . "\n"; }

echo "Done.\n";
