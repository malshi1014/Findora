<?php
// ====================================================
// POST /donations/payhere_notify.php
// PayHere IPN (Instant Payment Notification) listener.
// PayHere calls this endpoint after a payment completes.
// Must be publicly accessible (use ngrok for local dev).
// ====================================================

// No CORS headers needed – this endpoint is called by PayHere servers, not the browser.
header("Content-Type: text/plain; charset=utf-8");

require_once __DIR__ . "/../config/payhere.php";

// Bootstrap the database connection via config/db.php (AuthGuard treats this endpoint as public)
require_once __DIR__ . "/../config/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo "METHOD_NOT_ALLOWED";
    exit();
}

// --- Read IPN payload ---
$merchantId    = $_POST["merchant_id"]    ?? "";
$orderId       = $_POST["order_id"]       ?? "";
$paymentId     = $_POST["payment_id"]     ?? "";
$payhereAmount = $_POST["payhere_amount"] ?? "";
$payhereCurr   = $_POST["payhere_currency"] ?? "";
$statusCode    = isset($_POST["status_code"]) ? (int) $_POST["status_code"] : 0;
$receivedMd5   = $_POST["md5sig"]         ?? "";

// Log all incoming data for debugging
error_log("[PayHere IPN] Received: order={$orderId} status={$statusCode} amount={$payhereAmount} sig={$receivedMd5}");

// --- Validate merchant ID ---
if ($merchantId !== PAYHERE_MERCHANT_ID) {
    error_log("[PayHere IPN] Invalid merchant_id: {$merchantId}");
    http_response_code(400);
    echo "INVALID_MERCHANT";
    exit();
}

// --- Verify the cryptographic signature ---
if (!payhereVerifyNotification($orderId, $payhereAmount, $payhereCurr, $statusCode, $receivedMd5)) {
    error_log("[PayHere IPN] Hash verification FAILED for order={$orderId}");
    http_response_code(400);
    echo "HASH_MISMATCH";
    exit();
}

// --- Extract donation_id from order_id (format: FND-{donation_id}) ---
if (!preg_match('/^FND-(\d+)$/', $orderId, $matches)) {
    error_log("[PayHere IPN] Unrecognised order_id format: {$orderId}");
    http_response_code(400);
    echo "INVALID_ORDER_ID";
    exit();
}

$donationId = (int) $matches[1];

// --- Map PayHere status codes to our status values ---
// 2  = Success (payment captured)
// 0  = Pending
// -1 = Cancelled
// -2 = Failed
// -3 = Charged-back
switch ($statusCode) {
    case 2:
        $newStatus = "completed";
        break;
    case -1:
        $newStatus = "cancelled";
        break;
    case -2:
    case -3:
        $newStatus = "failed";
        break;
    default:
        // Pending or unknown – do not update
        error_log("[PayHere IPN] Unknown/pending status_code={$statusCode} for order={$orderId}");
        http_response_code(200);
        echo "OK_IGNORED";
        exit();
}

// --- Update the donation record ---
$stmt = $conn->prepare("
    UPDATE donation
    SET status = ?, payhere_payment_id = ?
    WHERE donation_id = ? AND status = 'pending'
");

if (!$stmt) {
    error_log("[PayHere IPN] Prepare failed: " . $conn->error);
    http_response_code(500);
    echo "DB_PREPARE_ERROR";
    exit();
}

$stmt->bind_param("ssi", $newStatus, $paymentId, $donationId);
$stmt->execute();

if ($stmt->affected_rows === 0) {
    // Already processed or not found – log but return 200 so PayHere stops retrying
    error_log("[PayHere IPN] No rows updated for donation_id={$donationId} (may already be processed)");
}

$stmt->close();
$conn->close();

error_log("[PayHere IPN] Updated donation_id={$donationId} to status={$newStatus}");

http_response_code(200);
echo "OK";
?>
