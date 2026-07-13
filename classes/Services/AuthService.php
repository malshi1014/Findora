<?php

require_once __DIR__ . "/../Contracts/UserRepositoryInterface.php";

class AuthService
{
    private UserRepositoryInterface $users;

    public function __construct(UserRepositoryInterface $users)
    {
        $this->users = $users;
    }

    public function authenticate(string $loginId, string $password): ?array
    {
        $user = $this->users->findByLoginId($loginId);

        if ($user === null || !password_verify($password, $user["password_hash"])) {
            return null;
        }

        // Password hashes never leave the authentication service.
        unset($user["password_hash"]);

        return $user;
    }

    public function getRedirectUrl(string $role): string
    {
        if ($role === "admin") {
            return "/admin";
        }

        if ($role === "shop_owner") {
            return "/shop-owner";
        }

        return "/user-dashboard";
    }
}

