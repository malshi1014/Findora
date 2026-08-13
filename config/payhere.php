<?php
// ====================================================
// Findora: PayHere Sandbox Configuration
// ====================================================

// PayHere Sandbox merchant credentials
define('PAYHERE_MERCHANT_ID', '1237447');
define('PAYHERE_MERCHANT_SECRET', '1686104520109296992329694735602173129164');

// Use the sandbox checkout URL for all payment initiations
define('PAYHERE_CHECKOUT_URL', 'https://sandbox.payhere.lk/pay/checkout');

// Default currency for all transactions
define('PAYHERE_CURRENCY', 'LKR');

/**
 * Generate the MD5 hash signature required by PayHere for initiating a checkout.
 *
 * Formula: strtoupper(md5(merchant_id + order_id + amount + currency + strtoupper(md5(merchant_secret))))
 *
 * @param string $orderId The unique order/donation ID.
 * @param string $amount  The payment amount formatted to 2 decimal places.
 * @return string The uppercase MD5 hash.
 */
function payhereGenerateHash(string $orderId, string $amount): string
{
    $merchantSecretHash = strtoupper(md5(PAYHERE_MERCHANT_SECRET));
    return strtoupper(md5(PAYHERE_MERCHANT_ID . $orderId . $amount . PAYHERE_CURRENCY . $merchantSecretHash));
}

/**
 * Verify the hash received in the PayHere IPN (notify_url) callback.
 *
 * Formula: strtoupper(md5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + strtoupper(md5(merchant_secret))))
 *
 * @param string $orderId     The order/donation ID from the IPN payload.
 * @param string $amount      The amount from the IPN payload.
 * @param string $currency    The currency code from the IPN payload.
 * @param int    $statusCode  The status_code from the IPN payload.
 * @param string $receivedMd5 The md5sig value sent by PayHere.
 * @return bool True if the hash is valid.
 */
function payhereVerifyNotification(string $orderId, string $amount, string $currency, int $statusCode, string $receivedMd5): bool
{
    $merchantSecretHash = strtoupper(md5(PAYHERE_MERCHANT_SECRET));
    $expected = strtoupper(md5(PAYHERE_MERCHANT_ID . $orderId . $amount . $currency . $statusCode . $merchantSecretHash));
    return hash_equals($expected, strtoupper($receivedMd5));
}
?>
