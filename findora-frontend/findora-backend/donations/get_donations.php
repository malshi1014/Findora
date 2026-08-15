<?php
// ====================================================
// GET /donations/get_donations.php
// Returns the authenticated user's donation history.
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

$stmt = $conn->prepare("
    SELECT
        donation_id,
        amount,
        status,
        payhere_payment_id,
        donor_name,
        donor_email,
        is_anonymous,
        donation_date,
        created_at
    FROM donation
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT 50
");

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Query preparation failed"]);
    exit();
}

$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$donations = [];
while ($row = $result->fetch_assoc()) {
    $donations[] = $row;
}

$stmt->close();

echo json_encode([
    "status"    => "success",
    "donations" => $donations,
    "total"     => count($donations),
]);
?>
