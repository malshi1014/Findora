<?php
ob_start();

header("Content-Type: application/json; charset=utf-8");

require_once __DIR__ . "/../config/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(array("status" => "error", "message" => "Only POST method is allowed"));
    exit();
}

if (SessionManager::isAuthenticated()) {
    AuthGuard::validateCsrfToken();
}

SessionManager::logout();
echo json_encode(array("status" => "success", "message" => "Logged out successfully"));
?>
