<?php
$conn = new mysqli('localhost', 'root', 'root', 'findora_db');
if ($conn->connect_error) {
    echo "ERROR: " . $conn->connect_error . PHP_EOL;
    exit(1);
}

$queries = [
    "ALTER TABLE `donation` ADD COLUMN `status` ENUM('pending','completed','failed','cancelled') NOT NULL DEFAULT 'pending' AFTER `amount`",
    "ALTER TABLE `donation` ADD COLUMN `payhere_payment_id` VARCHAR(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `status`",
    "ALTER TABLE `donation` ADD COLUMN `donor_name` VARCHAR(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `payhere_payment_id`",
    "ALTER TABLE `donation` ADD COLUMN `donor_email` VARCHAR(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `donor_name`",
    "ALTER TABLE `donation` ADD COLUMN `is_anonymous` TINYINT(1) NOT NULL DEFAULT 0 AFTER `donor_email`",
    "ALTER TABLE `donation` ADD KEY `idx_donation_status` (`status`)",
    "ALTER TABLE `donation` ADD KEY `idx_donation_payhere_id` (`payhere_payment_id`)",
];

foreach ($queries as $q) {
    if (!$conn->query($q)) {
        $err = $conn->error;
        // Skip if the column/key already exists (idempotent)
        if (
            stripos($err, 'Duplicate') !== false ||
            stripos($err, 'already exists') !== false ||
            stripos($err, 'Multiple') !== false
        ) {
            echo "SKIP (already applied): " . substr($q, 0, 80) . PHP_EOL;
        } else {
            echo "ERROR: {$err}" . PHP_EOL;
            echo "       Query: " . substr($q, 0, 100) . PHP_EOL;
        }
    } else {
        echo "OK: " . substr($q, 0, 80) . PHP_EOL;
    }
}

// Verify the final schema
$result = $conn->query("SHOW COLUMNS FROM `donation`");
echo PHP_EOL . "=== Final donation table columns ===" . PHP_EOL;
while ($row = $result->fetch_assoc()) {
    echo "  {$row['Field']} | {$row['Type']} | default={$row['Default']}" . PHP_EOL;
}

echo PHP_EOL . "Migration complete." . PHP_EOL;
$conn->close();
?>
