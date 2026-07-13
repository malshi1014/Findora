<?php

interface NotificationServiceInterface
{
    public function send(
        int $userId,
        string $message,
        string $type,
        ?int $matchId = null
    ): int;
}

