<?php

require_once __DIR__ . "/../Contracts/UserRepositoryInterface.php";
require_once __DIR__ . "/AbstractRepository.php";

// OOP: inheritance and interface use.
class UserRepository extends AbstractRepository implements UserRepositoryInterface
{
    public function findByLoginId(string $loginId): ?array
    {
        // Prepared statement to prevent SQL injection.
        $statement = $this->connection->prepare("
            SELECT user_id, first_name, last_name, nic, email, password_hash, role
            FROM users
            WHERE nic = ? OR email = ?
            LIMIT 1
        ");

        if (!$statement) {
            throw new RuntimeException("Database query preparation failed");
        }

        $statement->bind_param("ss", $loginId, $loginId);

        if (!$statement->execute()) {
            throw new RuntimeException("Database query execution failed");
        }

        $result = $statement->get_result();
        $user = $result->num_rows > 0 ? $result->fetch_assoc() : null;
        $statement->close();

        return $user;
    }

    public function findUsersByNearestTown(string $town, int $excludeUserId): array
    {
        $statement = $this->connection->prepare("
            SELECT user_id, first_name, email
            FROM users
            WHERE LOWER(TRIM(nearest_town)) = LOWER(TRIM(?))
            AND user_id != ?
            AND email_notifications_enabled = 1
            AND email IS NOT NULL
        ");

        if (!$statement) {
            throw new RuntimeException("Database query preparation failed: " . $this->connection->error);
        }

        $statement->bind_param("si", $town, $excludeUserId);

        if (!$statement->execute()) {
            throw new RuntimeException("Database query execution failed");
        }

        $result = $statement->get_result();
        
        $users = [];
        while ($row = $result->fetch_assoc()) {
            $users[] = $row;
        }

        $statement->close();

        return $users;
    }
}
