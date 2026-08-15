<?php
// ====================================================
// rewards/get_my_rewards.php
// Returns the authenticated user's reward history
// as a finder (items they found and returned).
// GET /rewards/get_my_rewards.php
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

$sessionUser = AuthGuard::requireAuthenticated();
$userId      = (int) $sessionUser["user_id"];

// ── Aggregate stats for this finder ──────────────────────────────────────────
$statsStmt = $conn->prepare("
    SELECT
        COUNT(*)                                        AS total_rewards,
        COUNT(CASE WHEN status = 'paid'      THEN 1 END) AS paid_count,
        COUNT(CASE WHEN status = 'pending'   THEN 1 END) AS pending_count,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) AS cancelled_count,
        COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0) AS total_earned
    FROM reward
    WHERE finder_id = ?
");
$statsStmt->bind_param("i", $userId);
$statsStmt->execute();
$statsRow = $statsStmt->get_result()->fetch_assoc();
$statsStmt->close();

// ── Reward history list ───────────────────────────────────────────────────────
$listStmt = $conn->prepare("
    SELECT
        r.reward_id,
        r.match_id,
        r.amount,
        r.status,
        r.transaction_ref,
        r.paid_at,
        lr.title  AS lost_item_title,
        lr.category AS lost_item_category,
        m.verified_at AS match_verified_at,
        ou.first_name AS owner_first_name,
        ou.last_name  AS owner_last_name
    FROM reward r
    JOIN matches     m  ON m.match_id       = r.match_id
    JOIN lost_report lr ON lr.report_id     = m.lost_report_id
    JOIN users       ou ON ou.user_id       = r.owner_id
    WHERE r.finder_id = ?
    ORDER BY r.reward_id DESC
    LIMIT 50
");
$listStmt->bind_param("i", $userId);
$listStmt->execute();
$result = $listStmt->get_result();

$rewards = [];
while ($row = $result->fetch_assoc()) {
    $rewards[] = [
        "reward_id"          => (int) $row["reward_id"],
        "match_id"           => (int) $row["match_id"],
        "amount"             => (float) $row["amount"],
        "status"             => $row["status"],
        "transaction_ref"    => $row["transaction_ref"],
        "paid_at"            => $row["paid_at"],
        "lost_item_title"    => $row["lost_item_title"],
        "lost_item_category" => $row["lost_item_category"],
        "match_verified_at"  => $row["match_verified_at"],
        "owner_name"         => trim($row["owner_first_name"] . " " . $row["owner_last_name"]),
    ];
}
$listStmt->close();

echo json_encode([
    "status"  => "success",
    "stats"   => [
        "total_rewards"   => (int)   $statsRow["total_rewards"],
        "paid_count"      => (int)   $statsRow["paid_count"],
        "pending_count"   => (int)   $statsRow["pending_count"],
        "cancelled_count" => (int)   $statsRow["cancelled_count"],
        "total_earned"    => (float) $statsRow["total_earned"],
    ],
    "rewards" => $rewards,
]);
?>
