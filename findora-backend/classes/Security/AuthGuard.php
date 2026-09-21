<?php

require_once __DIR__ . "/SessionManager.php";

// Central authentication and authorization.
class AuthGuard
{
    public static function bootstrap(): void
    {
        $path = str_replace("\\", "/", $_SERVER["SCRIPT_NAME"] ?? "");
        $method = strtoupper($_SERVER["REQUEST_METHOD"] ?? "GET");

        // Start the session for all requests.
        SessionManager::start();

        if ($method === "OPTIONS") {
            http_response_code(200);
            exit();
        }

        // Public paths skip authentication entirely.
        if (self::isPublicPath($path)) {
            return;
        }

        self::requireAuthenticated();
        self::validateIdentityClaims();

        // Enforce role-based access.
        if (str_contains($path, "/admin/")) {
            self::requireRole("admin");
        }

        if (str_ends_with($path, "/reports/add_suspicious_report.php")) {
            self::requireAnyRole(array("shop_owner", "admin"));
        }

        if (!in_array($method, array("GET", "HEAD", "OPTIONS"), true)) {
            if (str_contains($path, '/interactions/')) {
                return;
            }
            self::validateCsrfToken();
        }
    }

    public static function requireAuthenticated(): array
    {
        $user = SessionManager::user();

        if ($user === null) {
            self::deny(401, "Authentication required");
        }

        return $user;
    }

    public static function requireRole(string $role): array
    {
        $user = self::requireAuthenticated();

        if (($user["role"] ?? null) !== $role) {
            self::deny(403, "Permission denied");
        }

        return $user;
    }

    public static function requireAnyRole(array $roles): array
    {
        $user = self::requireAuthenticated();

        if (!in_array($user["role"] ?? null, $roles, true)) {
            self::deny(403, "Permission denied");
        }

        return $user;
    }

    // Validate CSRF protection for mutating requests.
    public static function validateCsrfToken(): void
    {
        $provided = $_SERVER["HTTP_X_CSRF_TOKEN"] ?? "";
        $expected = SessionManager::csrfToken();

        if ($provided === "" || !hash_equals($expected, $provided)) {
            self::deny(403, "Invalid CSRF token");
        }
    }

    private static function isPublicPath(string $path): bool
    {
        $publicSuffixes = array(
            "/auth/login.php",
            "/auth/register.php",
            "/auth/shopregister.php",
            "/auth/logout.php",
            "/auth/session.php",
            "/donations/payhere_notify.php",
            "/interactions/get_interactions.php",
            "/migrate_complaint.php",
            "/complaints/send_complaint.php"
        );

        foreach ($publicSuffixes as $suffix) {
            if (str_ends_with($path, $suffix)) {
                return true;
            }
        }

        return str_contains($path, "/public_posts/");
    }

    // Prevent user ID impersonation.
    private static function validateIdentityClaims(): void
    {
        $sessionUserId = SessionManager::userId();
        $sessionRole = SessionManager::role();
        $claims = array_merge($_GET, $_POST);
        $contentType = $_SERVER["CONTENT_TYPE"] ?? "";

        if (stripos($contentType, "application/json") !== false) {
            $json = json_decode(file_get_contents("php://input"), true);
            if (is_array($json)) {
                $claims = array_merge($claims, $json);
            }
        }

        if (isset($claims["user_id"]) && (int) $claims["user_id"] !== $sessionUserId) {
            $path = str_replace("\\", "/", $_SERVER["SCRIPT_NAME"] ?? "");
            if ($sessionRole !== "admin" || !str_contains($path, "/admin/")) {
                self::deny(403, "You cannot access another user's data");
            }
        }

        if (isset($claims["admin_id"])) {
            if ($sessionRole !== "admin" || (int) $claims["admin_id"] !== $sessionUserId) {
                self::deny(403, "Invalid administrator identity");
            }
        }
    }

    private static function deny(int $status, string $message): void
    {
        http_response_code($status);
        header("Content-Type: application/json; charset=utf-8");
        echo json_encode(array("status" => "error", "message" => $message));
        exit();
    }
}
