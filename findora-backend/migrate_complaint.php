<?php
require_once __DIR__ . "/config/db.php";

$queries = [
    "ALTER TABLE `complaint` ADD COLUMN `name` varchar(150) NULL AFTER `user_id`",
    "ALTER TABLE `complaint` ADD COLUMN `email` varchar(150) NULL AFTER `name`",
    "ALTER TABLE `complaint` ADD COLUMN `subject` varchar(255) NULL AFTER `email`",
    "ALTER TABLE `complaint` ADD COLUMN `admin_reply` text NULL AFTER `message`",
    "ALTER TABLE `complaint` ADD COLUMN `replied_at` timestamp NULL DEFAULT NULL AFTER `status`"
];

foreach ($queries as $sql) {
    try {
        if ($conn->query($sql)) {
            echo "Success: $sql\n";
        } else {
            echo "Notice/Error: " . $conn->error . "\n";
        }
    } catch (Exception $e) {
        echo "Exception (column may exist): " . $e->getMessage() . "\n";
    }
}
echo "Migration finished.\n";
?>
