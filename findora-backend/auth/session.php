<?php
ob_start();
header("Content-Type: application/json; charset=utf-8");

// session.php bypasses db.php/AuthGuard on purpose.
// It directly starts the session and reports authentication status.
require_once __DIR__ . "/../classes/Security/SessionManager.php";
SessionManager::start();

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    ob_clean();
    http_response_code(405);
    echo json_encode(array("status" => "error", "message" => "Only GET method is allowed"));
    exit();
}

ob_clean();

if (!SessionManager::isAuthenticated()) {
    echo json_encode(array("status" => "success", "authenticated" => false));
    exit();
}

echo json_encode(array(
    "status" => "success",
    "authenticated" => true,
    "csrf_token" => SessionManager::csrfToken(),
    "user" => SessionManager::user()
));
