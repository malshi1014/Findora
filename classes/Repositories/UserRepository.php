<?php

require_once __DIR__ . "/../Contracts/UserRepositoryInterface.php";
require_once __DIR__ . "/AbstractRepository.php";

class UserRepository extends AbstractRepository implements UserRepositoryInterface
{
    public function findByLoginId(string $loginId): ?array
    {
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
}

