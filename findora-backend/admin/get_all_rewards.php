<?php
// ====================================================
// admin/get_all_rewards.php
// Returns all rewards with owner/finder info + stats
// + current reward_amount from system_config.
// Admin role required.
// GET /admin/get_all_rewards.php
// ====================================================

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit();
}

require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../classes/Security/AuthGuard.php";

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Only GET method is allowed"]);
    exit();
}

AuthGuard::requireRole("admin");

// ── 1. Aggregate stats ────────────────────────────────────────────────────────
$statsResult = $conn->query("
    SELECT
        COUNT(*)                                           AS total_rewards,
        COUNT(CASE WHEN status = 'pending'   THEN 1 END)  AS pending_count,
        COUNT(CASE WHEN status = 'paid'      THEN 1 END)  AS paid_count,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END)  AS cancelled_count,
        COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0) AS total_paid_out
    FROM reward
");

if (!$statsResult) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to fetch reward stats"]);
    exit();
}
$stats = $statsResult->fetch_assoc();

// ── 2. Current reward amount from system_config ───────────────────────────────
$configResult = $conn->query("
    SELECT config_value FROM system_config WHERE config_key = 'reward_amount' LIMIT 1
");
$currentRewardAmount = 100.00; // safe fallback
if ($configResult && $row = $configResult->fetch_assoc()) {
    $currentRewardAmount = (float) $row["config_value"];
}

// ── 3. All rewards with names ─────────────────────────────────────────────────
$listStmt = $conn->prepare("
    SELECT
        r.reward_id,
        r.match_id,
        r.amount,
        r.status,
        r.transaction_ref,
        r.paid_at,
        lr.title      AS lost_item_title,
        lr.category   AS lost_item_category,
        m.verified_at AS match_verified_at,
        fu.first_name AS finder_first_name,
        fu.last_name  AS finder_last_name,
        fu.email      AS finder_email,
        ou.first_name AS owner_first_name,
        ou.last_name  AS owner_last_name
    FROM reward r
    JOIN matches     m  ON m.match_id      = r.match_id
    JOIN lost_report lr ON lr.report_id    = m.lost_report_id
    JOIN users       fu ON fu.user_id      = r.finder_id
    JOIN users       ou ON ou.user_id      = r.owner_id
    ORDER BY r.reward_id DESC
    LIMIT 100
");

if (!$listStmt) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to prepare rewards list query"]);
    exit();
}

$listStmt->execute();
$result = $listStmt->get_result();
$rewards = [];

while ($row = $result->fetch_assoc()) {
    $rewards[] = [
        "reward_id"          => (int)  $row["reward_id"],
        "match_id"           => (int)  $row["match_id"],
        "amount"             => (float)$row["amount"],
        "status"             => $row["status"],
        "transaction_ref"    => $row["transaction_ref"],
        "paid_at"            => $row["paid_at"],
        "lost_item_title"    => $row["lost_item_title"],
        "lost_item_category" => $row["lost_item_category"],
        "match_verified_at"  => $row["match_verified_at"],
        "finder_name"        => trim($row["finder_first_name"] . " " . $row["finder_last_name"]),
        "finder_email"       => $row["finder_email"],
        "owner_name"         => trim($row["owner_first_name"] . " " . $row["owner_last_name"]),
    ];
}
$listStmt->close();

echo json_encode([
    "status"               => "success",
    "current_reward_amount"=> $currentRewardAmount,
    "stats"                => [
        "total_rewards"   => (int)   $stats["total_rewards"],
        "pending_count"   => (int)   $stats["pending_count"],
        "paid_count"      => (int)   $stats["paid_count"],
        "cancelled_count" => (int)   $stats["cancelled_count"],
        "total_paid_out"  => (float) $stats["total_paid_out"],
    ],
    "rewards"              => $rewards,
]);
?>
