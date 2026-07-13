<?php

require_once __DIR__ . "/../Contracts/NotificationServiceInterface.php";

class NotificationService implements NotificationServiceInterface
{
    private mysqli $connection;

    public function __construct(mysqli $connection)
    {
        $this->connection = $connection;
    }

    public function send(
        int $userId,
        string $message,
        string $type,
        ?int $matchId = null
    ): int {
        $statement = $this->connection->prepare("
            INSERT INTO match_notification
            (user_id, match_id, message, type, is_read)
            VALUES (?, ?, ?, ?, 0)
        ");

        if (!$statement) {
            throw new RuntimeException("Notification prepare failed");
        }

        $statement->bind_param("iiss", $userId, $matchId, $message, $type);

        if (!$statement->execute()) {
            $statement->close();
            throw new RuntimeException("Notification insert failed");
        }

        $notificationId = $statement->insert_id;
        $statement->close();

        return $notificationId;
    }
}

