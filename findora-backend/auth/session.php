<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, X-CSRF-Token");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit();
}

require_once __DIR__ . "/../config/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);
    echo json_encode(array("status" => "error", "message" => "Only GET method is allowed"));
    exit();
}

if (!SessionManager::isAuthenticated()) {
    http_response_code(401);
    echo json_encode(array("status" => "error", "authenticated" => false));
    exit();
}

echo json_encode(array(
    "status" => "success",
    "authenticated" => true,
    "csrf_token" => SessionManager::csrfToken(),
    "user" => SessionManager::user()
));
?>
