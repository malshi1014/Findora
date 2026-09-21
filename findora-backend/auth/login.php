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

$ipAddress = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';

// Eagerly ensure the rate-limit table exists (no-op if already present).
$conn->query("
    CREATE TABLE IF NOT EXISTS login_attempts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ip_address VARCHAR(45) NOT NULL,
        login_id VARCHAR(255) NOT NULL,
        attempt_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_ip_login (ip_address, login_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
");

// Rate-limit check — isolated so any DB failure here never blocks login.
try {
    $chkStmt = $conn->prepare("SELECT COUNT(*) as attempts FROM login_attempts WHERE ip_address = ? AND login_id = ? AND attempt_time >= DATE_SUB(NOW(), INTERVAL 15 MINUTE)");
    if ($chkStmt) {
        $chkStmt->bind_param("ss", $ipAddress, $loginId);
        $chkStmt->execute();
        $chkRes = $chkStmt->get_result()->fetch_assoc();
        $chkStmt->close();
        if ($chkRes && $chkRes['attempts'] >= 5) {
            http_response_code(429);
            echo json_encode(array("status" => "error", "message" => "Too many failed login attempts. Please try again in 15 minutes."));
            exit();
        }
    }
} catch (Throwable $rateLimitError) {
    error_log("login.php rate-limit check failed: " . $rateLimitError->getMessage());
    // Degrade gracefully — allow login to continue.
}

try {
    $authService = new AuthService(new UserRepository($conn));
    $user = $authService->authenticate($loginId, $password);

    if ($user === null) {
        // Record failed attempt (best-effort, non-fatal).
        try {
            $insStmt = $conn->prepare("INSERT INTO login_attempts (ip_address, login_id) VALUES (?, ?)");
            if ($insStmt) {
                $insStmt->bind_param("ss", $ipAddress, $loginId);
                $insStmt->execute();
                $insStmt->close();
            }
            $conn->query("DELETE FROM login_attempts WHERE attempt_time < DATE_SUB(NOW(), INTERVAL 15 MINUTE)");
        } catch (Throwable $recordError) {
            error_log("login.php attempt record failed: " . $recordError->getMessage());
        }

        http_response_code(401);
        echo json_encode(array("status" => "error", "message" => "Invalid NIC/Email or password"));
        exit();
    }

    // On successful login, clear attempts for this IP/account (best-effort).
    try {
        $delStmt = $conn->prepare("DELETE FROM login_attempts WHERE ip_address = ? AND login_id = ?");
        if ($delStmt) {
            $delStmt->bind_param("ss", $ipAddress, $loginId);
            $delStmt->execute();
            $delStmt->close();
        }
    } catch (Throwable $clearError) {
        error_log("login.php clear attempts failed: " . $clearError->getMessage());
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
