<?php
// ====================================================
// GET /admin/get_all_donations.php
// Returns donation metrics and recent donations list
// for the admin dashboard. Admin role required.
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

// Admin-only endpoint
AuthGuard::requireRole("admin");

// --- Aggregate stats (completed donations only) ---
$statsResult = $conn->query("
    SELECT
        COUNT(*) AS total_donations,
        COALESCE(SUM(amount), 0) AS total_amount,
        COALESCE(AVG(amount), 0) AS avg_amount,
        COUNT(DISTINCT user_id) AS unique_donors
    FROM donation
    WHERE status = 'completed'
");

if (!$statsResult) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to fetch donation stats"]);
    exit();
}

$stats = $statsResult->fetch_assoc();

// --- Monthly total (completed, current calendar month) ---
$monthlyResult = $conn->query("
    SELECT COALESCE(SUM(amount), 0) AS monthly_total
    FROM donation
    WHERE status = 'completed'
      AND YEAR(donation_date) = YEAR(CURDATE())
      AND MONTH(donation_date) = MONTH(CURDATE())
");

$monthlyTotal = 0;
if ($monthlyResult) {
    $monthlyRow   = $monthlyResult->fetch_assoc();
    $monthlyTotal = (float) $monthlyRow["monthly_total"];
}

// --- Recent 20 donations (all statuses, admin can filter on frontend) ---
$recentStmt = $conn->prepare("
    SELECT
        d.donation_id,
        d.amount,
        d.status,
        d.payhere_payment_id,
        d.donor_name,
        d.donor_email,
        d.is_anonymous,
        d.donation_date,
        d.created_at,
        u.first_name,
        u.last_name,
        u.email AS user_email
    FROM donation d
    JOIN users u ON u.user_id = d.user_id
    ORDER BY d.created_at DESC
    LIMIT 20
");

if (!$recentStmt) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to prepare recent donations query"]);
    exit();
}

$recentStmt->execute();
$recentResult = $recentStmt->get_result();
$recentDonations = [];

while ($row = $recentResult->fetch_assoc()) {
    // Show donor_name if anonymous, otherwise fall back to full name from users table
    $row["display_name"] = $row["is_anonymous"]
        ? "Anonymous Donor"
        : ($row["donor_name"] ?: trim($row["first_name"] . " " . $row["last_name"]));
    $recentDonations[] = $row;
}

$recentStmt->close();

// --- Top 5 donors (by total completed amount) ---
$topStmt = $conn->prepare("
    SELECT
        d.user_id,
        u.first_name,
        u.last_name,
        COALESCE(SUM(d.amount), 0) AS total_given,
        MAX(d.is_anonymous) AS has_anonymous
    FROM donation d
    JOIN users u ON u.user_id = d.user_id
    WHERE d.status = 'completed'
    GROUP BY d.user_id
    ORDER BY total_given DESC
    LIMIT 5
");

if (!$topStmt) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to prepare top donors query"]);
    exit();
}

$topStmt->execute();
$topResult = $topStmt->get_result();
$topDonors = [];

while ($row = $topResult->fetch_assoc()) {
    $topDonors[] = [
        "name"        => $row["has_anonymous"] ? "Anonymous Donor" : trim($row["first_name"] . " " . $row["last_name"]),
        "total_given" => (float) $row["total_given"],
    ];
}

$topStmt->close();

echo json_encode([
    "status"           => "success",
    "stats"            => [
        "total_donations"  => (int)   $stats["total_donations"],
        "total_amount"     => (float) $stats["total_amount"],
        "avg_amount"       => (float) $stats["avg_amount"],
        "unique_donors"    => (int)   $stats["unique_donors"],
        "monthly_total"    => $monthlyTotal,
    ],
    "recent_donations" => $recentDonations,
    "top_donors"       => $topDonors,
]);
?>
