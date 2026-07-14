<?php

// Secure PHP session handling.
class SessionManager
{
    private const SESSION_NAME = "findora_session";
    private const IDLE_TIMEOUT_SECONDS = 1800;
    private const REGENERATE_SECONDS = 900;

    public static function start(): void
    {
        if (session_status() === PHP_SESSION_ACTIVE) {
            return;
        }

        $isHttps = !empty($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] !== "off";

        ini_set("session.use_strict_mode", "1");
        ini_set("session.use_only_cookies", "1");
        ini_set("session.cookie_httponly", "1");
        ini_set("session.cookie_samesite", "Lax");

        // Secure session cookie settings.
        session_name(self::SESSION_NAME);
        session_set_cookie_params(array(
            "lifetime" => 0,
            "path" => "/",
            "domain" => "",
            "secure" => $isHttps,
            "httponly" => true,
            "samesite" => "Lax"
        ));

        session_start();
        self::enforceTimeouts();
    }

    // Create an authenticated session.
    public static function login(array $user): void
    {
        self::start();
        session_regenerate_id(true);

        $_SESSION["user"] = array(
            "user_id" => (int) $user["user_id"],
            "first_name" => $user["first_name"],
            "last_name" => $user["last_name"],
            "nic" => $user["nic"],
            "email" => $user["email"],
            "role" => $user["role"]
        );
        // Generate a CSRF token.
        $_SESSION["csrf_token"] = bin2hex(random_bytes(32));
        $_SESSION["last_activity"] = time();
        $_SESSION["last_regenerated"] = time();
        $_SESSION["user_agent_hash"] = self::currentUserAgentHash();
    }

    public static function logout(): void
    {
        self::start();
        $_SESSION = array();

        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), "", array(
                "expires" => time() - 42000,
                "path" => $params["path"],
                "domain" => $params["domain"],
                "secure" => $params["secure"],
                "httponly" => $params["httponly"],
                "samesite" => $params["samesite"] ?? "Lax"
            ));
        }

        session_destroy();
    }

    public static function isAuthenticated(): bool
    {
        self::start();
        return isset($_SESSION["user"]["user_id"]);
    }

    public static function user(): ?array
    {
        return self::isAuthenticated() ? $_SESSION["user"] : null;
    }

    public static function userId(): ?int
    {
        $user = self::user();
        return $user === null ? null : (int) $user["user_id"];
    }

    public static function role(): ?string
    {
        $user = self::user();
        return $user["role"] ?? null;
    }

    public static function csrfToken(): string
    {
        self::start();

        if (empty($_SESSION["csrf_token"])) {
            $_SESSION["csrf_token"] = bin2hex(random_bytes(32));
        }

        return $_SESSION["csrf_token"];
    }

    // Enforce timeout and ID renewal.
    private static function enforceTimeouts(): void
    {
        if (!isset($_SESSION["user"])) {
            return;
        }

        $now = time();
        $lastActivity = (int) ($_SESSION["last_activity"] ?? $now);
        $storedAgent = $_SESSION["user_agent_hash"] ?? "";

        if (
            ($now - $lastActivity) > self::IDLE_TIMEOUT_SECONDS ||
            !hash_equals($storedAgent, self::currentUserAgentHash())
        ) {
            self::logout();
            return;
        }

        $_SESSION["last_activity"] = $now;
        $lastRegenerated = (int) ($_SESSION["last_regenerated"] ?? 0);

        if (($now - $lastRegenerated) > self::REGENERATE_SECONDS) {
            session_regenerate_id(true);
            $_SESSION["last_regenerated"] = $now;
        }
    }

    private static function currentUserAgentHash(): string
    {
        return hash("sha256", $_SERVER["HTTP_USER_AGENT"] ?? "unknown");
    }
}
