<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, X-CSRF-Token");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit();
}

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
