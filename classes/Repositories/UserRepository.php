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
            SELECT user_id, first_name, last_name, nic, email, password_hash, role, account_status
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

    /**
     * Find users whose nearest_town OR district matches the given location.
     * Case-insensitive, trimmed comparison.
     * Excludes the reporter and users with no valid email.
     */
    public function findUsersByNearestTown(string $town, int $excludeUserId): array
    {
        // Match on nearest_town first (most specific)
        $statement = $this->connection->prepare("
            SELECT DISTINCT user_id, first_name, last_name, email
            FROM users
            WHERE (
                LOWER(TRIM(nearest_town)) = LOWER(TRIM(?))
                OR LOWER(TRIM(district)) = LOWER(TRIM(?))
            )
            AND user_id != ?
            AND (email_notifications_enabled = 1 OR email_notifications_enabled IS NULL)
            AND email IS NOT NULL
            AND TRIM(email) != ''
            AND account_status = 'active'
        ");

        if (!$statement) {
            error_log("[UserRepository] findUsersByNearestTown prepare failed: " . $this->connection->error);
            throw new RuntimeException("Database query preparation failed: " . $this->connection->error);
        }

        $statement->bind_param("ssi", $town, $town, $excludeUserId);

        if (!$statement->execute()) {
            error_log("[UserRepository] findUsersByNearestTown execute failed: " . $statement->error);
            throw new RuntimeException("Database query execution failed: " . $statement->error);
        }

        $result = $statement->get_result();

        $users = [];
        while ($row = $result->fetch_assoc()) {
            $users[] = $row;
        }

        $statement->close();

        error_log("[UserRepository] findUsersByNearestTown('$town'): found " . count($users) . " users");
        return $users;
    }
}

