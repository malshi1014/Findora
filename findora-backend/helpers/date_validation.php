<?php
date_default_timezone_set('Asia/Colombo');

/**
 * Validates that a reported date and time are not in the future.
 * Returns true if valid, or false if date/time is in the future.
 */
function validateNotFutureDateTime($dateStr, $timeStr = "") {
    if (empty($dateStr)) {
        return true;
    }

    $currentDate = date('Y-m-d');

    if ($dateStr > $currentDate) {
        return false;
    }

    if ($dateStr < $currentDate) {
        return true;
    }

    // Selected date is today. If timeStr is empty, today's date alone is valid.
    if (empty(trim($timeStr))) {
        return true;
    }

    $currentSeconds = (int)date('H') * 3600 + (int)date('i') * 60 + (int)date('s');

    // Time can be a range e.g. "02:30 PM - 03:45 PM" or single time "02:30 PM" or "14:30"
    $parts = explode('-', $timeStr);

    foreach ($parts as $part) {
        $part = trim($part);
        if (empty($part)) continue;

        $timeSecs = parseTimeToSeconds($part);
        if ($timeSecs !== null && $timeSecs > $currentSeconds) {
            return false;
        }
    }

    return true;
}

function parseTimeToSeconds($timePart) {
    $timePart = trim($timePart);
    if (empty($timePart)) return null;

    if (preg_match('/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i', $timePart, $matches)) {
        $hour = intval($matches[1]);
        $minute = intval($matches[2]);
        $period = strtoupper($matches[3]);

        if ($period === 'PM' && $hour < 12) {
            $hour += 12;
        } else if ($period === 'AM' && $hour === 12) {
            $hour = 0;
        }

        return $hour * 3600 + $minute * 60;
    }

    if (preg_match('/^(\d{1,2}):(\d{2})$/', $timePart, $matches)) {
        $hour = intval($matches[1]);
        $minute = intval($matches[2]);
        return $hour * 3600 + $minute * 60;
    }

    return null;
}
