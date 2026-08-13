<?php
// ====================================================
// setup/migrate_system_config.php
// One-time migration: creates system_config table
// and seeds the default reward_amount = 100.00
// Run once via browser: http://localhost/findora-backend/setup/migrate_system_config.php
// ====================================================

$host   = "localhost";
$dbname = "findora_db";
$user   = "root";
$pass   = "root";

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "DB connect failed: " . $conn->connect_error]));
}

$conn->set_charset("utf8mb4");

$steps = [];

// ── 1. Create system_config table ────────────────────────────────────────────
$createTable = "
CREATE TABLE IF NOT EXISTS `system_config` (
  `config_id`    INT AUTO_INCREMENT PRIMARY KEY,
  `config_key`   VARCHAR(100) NOT NULL,
  `config_value` VARCHAR(255) NOT NULL,
  `description`  VARCHAR(255) DEFAULT NULL,
  `updated_at`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_config_key` (`config_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
";

// Attempt to add description column if it doesn't exist (ignore error if it does)
try {
    $conn->query("ALTER TABLE system_config ADD COLUMN description VARCHAR(255)");
} catch (Exception $e) {
    // Ignore duplicate column error
}

if ($conn->query($createTable)) {
    $steps[] = "✅ system_config table created (or already exists).";
} else {
    $steps[] = "❌ Failed to create system_config: " . $conn->error;
}

// ── 1b. Create reward table ──────────────────────────────────────────────────
$createRewardTable = "
CREATE TABLE IF NOT EXISTS `reward` (
  `reward_id`       INT AUTO_INCREMENT PRIMARY KEY,
  `match_id`        INT NOT NULL,
  `owner_id`        INT NOT NULL,
  `finder_id`       INT NOT NULL,
  `amount`          DECIMAL(10,2) NOT NULL DEFAULT '100.00',
  `status`          ENUM('pending','paid','cancelled') DEFAULT 'pending',
  `transaction_ref` VARCHAR(100) DEFAULT NULL,
  `paid_at`         TIMESTAMP NULL DEFAULT NULL,
  `created_at`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`match_id`)  REFERENCES `matches`(`match_id`) ON DELETE CASCADE,
  FOREIGN KEY (`owner_id`)  REFERENCES `users`(`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`finder_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
";

if ($conn->query($createRewardTable)) {
    $steps[] = "✅ reward table created (or already exists).";
} else {
    $steps[] = "❌ Failed to create reward table: " . $conn->error;
}

// ── 2. Seed reward_amount (100.00 LKR) ───────────────────────────────────────
$seedReward = "
INSERT INTO system_config (config_key, config_value, description)
VALUES ('reward_amount', '100.00', 'Mobile reload reward (LKR) given to finder on match verification')
ON DUPLICATE KEY UPDATE description = VALUES(description);
";

if ($conn->query($seedReward)) {
    $steps[] = "✅ reward_amount seeded with default Rs. 100.00 (skipped if already set).";
} else {
    $steps[] = "❌ Failed to seed reward_amount: " . $conn->error;
}

$conn->close();

header("Content-Type: text/html; charset=utf-8");
echo "<h2>System Config Migration</h2><ul>";
foreach ($steps as $step) {
    echo "<li>$step</li>";
}
echo "</ul><p><strong>Migration complete. You can delete this file after running it.</strong></p>";
?>
