<?php

require_once __DIR__ . "/../classes/Services/LocationNotificationService.php";

/**
 * Backward-compatible procedural wrapper for dispatching location-based email notifications.
 * Should be called AFTER a transaction is successfully committed.
 *
 * @param mysqli $conn
 * @param string $reportType (lost_item, found_item, missing_person, missing_pet)
 * @param int $reportId
 * @param string $nearestTown
 * @param int $reporterId
 * @param string $reportTitle
 * @param string $reportDescription
 */
function sendLocationNotifications(
    $conn,
    string $reportType,
    int $reportId,
    string $nearestTown,
    int $reporterId,
    string $reportTitle,
    string $reportDescription
) {
    if (empty($nearestTown)) {
        return;
    }
    
    $service = new LocationNotificationService($conn);
    $service->dispatch($reportType, $reportId, $nearestTown, $reporterId, $reportTitle, $reportDescription);
}
