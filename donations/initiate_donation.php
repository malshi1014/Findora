<?php
// ====================================================
// POST /donations/initiate_donation.php
// Creates a pending donation record and returns the
// PayHere Sandbox checkout parameters to the frontend.
// ====================================================

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit();
}

require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../config/payhere.php";
require_once __DIR__ . "/../classes/Security/AuthGuard.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Only POST method is allowed"]);
    exit();
}

// Require an authenticated session
$sessionUser = AuthGuard::requireAuthenticated();
$userId = (int) $sessionUser["user_id"];

// Parse JSON body
$body = json_decode(file_get_contents("php://input"), true);

if (!is_array($body)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid JSON body"]);
    exit();
}

// --- Validate inputs ---
$amount      = isset($body["amount"])     ? (float) $body["amount"]         : 0;
$donorName   = isset($body["donor_name"]) ? trim($body["donor_name"])       : "";
$donorEmail  = isset($body["donor_email"])? trim($body["donor_email"])       : "";
$isAnonymous = !empty($body["is_anonymous"]) ? 1 : 0;

if ($amount < 100) {
    http_response_code(422);
    echo json_encode(["status" => "error", "message" => "Minimum donation amount is Rs. 100"]);
    exit();
}

if (empty($donorName)) {
    http_response_code(422);
    echo json_encode(["status" => "error", "message" => "Donor name is required"]);
    exit();
}

if (empty($donorEmail) || !filter_var($donorEmail, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(["status" => "error", "message" => "A valid email address is required"]);
    exit();
}

// --- Insert a pending donation record to get the donation_id (order_id) ---
$conn->begin_transaction();

try {
    $stmt = $conn->prepare("
        INSERT INTO donation (user_id, amount, status, donor_name, donor_email, is_anonymous, donation_date)
        VALUES (?, ?, 'pending', ?, ?, ?, CURDATE())
    ");

    if (!$stmt) {
        throw new RuntimeException("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("idssi", $userId, $amount, $donorName, $donorEmail, $isAnonymous);

    if (!$stmt->execute()) {
        throw new RuntimeException("Insert failed: " . $stmt->error);
    }

    $donationId = $stmt->insert_id;
    $stmt->close();
    $conn->commit();

} catch (RuntimeException $e) {
    $conn->rollback();
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Could not create donation record", "error" => $e->getMessage()]);
    exit();
}

// --- Build PayHere checkout parameters ---
$orderId       = "FND-" . $donationId; // prefix to make order IDs meaningful
$formattedAmt  = number_format($amount, 2, ".", ""); // must be 2 decimal places
$hash          = payhereGenerateHash($orderId, $formattedAmt);

// PayHere requires first_name and last_name split
$nameParts = explode(" ", trim($donorName), 2);
$firstName = $nameParts[0];
$lastName  = isset($nameParts[1]) ? $nameParts[1] : "";

// Return URL (frontend will show a success/cancelled page based on query param)
$frontendBase  = "http://localhost:5173";
$returnUrl     = $frontendBase . "/user-dashboard/donation?payment=success&order=" . urlencode($orderId);
$cancelUrl     = $frontendBase . "/user-dashboard/donation?payment=cancelled&order=" . urlencode($orderId);

// notify_url must be a publicly accessible URL when testing with a real PayHere callback.
// For local development, replace with your ngrok URL:
// e.g. https://abc123.ngrok.io/findora-backend/donations/payhere_notify.php
$notifyUrl = "http://localhost/findora-backend/donations/payhere_notify.php";

echo json_encode([
    "status"         => "success",
    "donation_id"    => $donationId,
    "checkout_url"   => PAYHERE_CHECKOUT_URL,
    "params"         => [
        "merchant_id"  => PAYHERE_MERCHANT_ID,
        "return_url"   => $returnUrl,
        "cancel_url"   => $cancelUrl,
        "notify_url"   => $notifyUrl,
        "order_id"     => $orderId,
        "items"        => "Findora Platform Donation",
        "amount"       => $formattedAmt,
        "currency"     => PAYHERE_CURRENCY,
        "hash"         => $hash,
        "first_name"   => $firstName,
        "last_name"    => $lastName,
        "email"        => $donorEmail,
        "phone"        => "0000000000",
        "address"      => "N/A",
        "city"         => "Colombo",
        "country"      => "Sri Lanka",
    ],
]);
?>
