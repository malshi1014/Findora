<?php

function createNotification(
    $conn,
    $user_id,
    $message,
    $type,
    $match_id = null
) {
    $stmt = $conn->prepare("
        INSERT INTO match_notification
        (user_id, match_id, message, type, is_read)
        VALUES (?, ?, ?, ?, 0)
    ");

    if (!$stmt) {
        throw new Exception(
            "Notification prepare failed: " . $conn->error
        );
    }

    $stmt->bind_param(
        "iiss",
        $user_id,
        $match_id,
        $message,
        $type
    );

    if (!$stmt->execute()) {
        throw new Exception(
            "Notification insert failed: " . $stmt->error
        );
    }

    $notification_id = $stmt->insert_id;
    $stmt->close();

    return $notification_id;
}