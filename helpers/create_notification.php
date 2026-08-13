<?php

require_once __DIR__ . "/../classes/Services/NotificationService.php";

/**
 * Backward-compatible wrapper for existing procedural endpoints.
 */
function createNotification(
    $conn,
    $user_id,
    $message,
    $type,
    $match_id = null
) {
    $service = new NotificationService($conn);

    return $service->send(
        (int) $user_id,
        (string) $message,
        (string) $type,
        $match_id === null ? null : (int) $match_id
    );
}

