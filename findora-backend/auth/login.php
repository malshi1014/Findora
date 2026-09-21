<?php
ob_start();
header("Content-Type: application/json");

require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../classes/Repositories/UserRepository.php";
require_once __DIR__ . "/../classes/Services/AuthService.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(array("status" => "error", "message" => "Only POST method is allowed"));
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(array("status" => "error", "message" => "Invalid JSON input"));
    exit();
}

$loginId = isset($data["login_id"]) ? trim($data["login_id"]) : "";
$password = isset($data["password"]) ? (string) $data["password"] : "";

if ($loginId === "" || $password === "") {
    http_response_code(400);
    echo json_encode(array("status" => "error", "message" => "NIC/Email and password are required"));
    exit();
}

try {
    $authService = new AuthService(new UserRepository($conn));
    $user = $authService->authenticate($loginId, $password);

    if ($user === null) {
        http_response_code(401);
        echo json_encode(array("status" => "error", "message" => "Invalid NIC/Email or password"));
        exit();
    }

    if (isset($user['account_status']) && $user['account_status'] === 'suspended') {
        http_response_code(403);
        echo json_encode(array("status" => "error", "message" => "Your account has been suspended. Please contact support."));
        exit();
    }

    SessionManager::login($user);
    $safeUser = SessionManager::user();

    ob_clean();
    echo json_encode(array(
        "status" => "success",
        "message" => "Login successful",
        "redirect_url" => $authService->getRedirectUrl($safeUser["role"]),
        "csrf_token" => SessionManager::csrfToken(),
        "user" => $safeUser
    ));
} catch (Throwable $error) {
    error_log("login.php: " . $error->getMessage());
    http_response_code(500);
    echo json_encode(array("status" => "error", "message" => "Login service is temporarily unavailable"));
}
exit();
