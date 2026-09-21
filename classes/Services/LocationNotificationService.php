<?php

/**
 * LocationNotificationService
 *
 * Sends city-based email alerts for Missing Person and Missing Pet reports.
 * Uses the REPORT's nearest_town field (not the reporter's user city) to
 * determine which registered users to notify.
 *
 * Only triggers for missing_person and missing_pet report types.
 * Lost/Found item reports MUST NOT trigger city-wide alerts.
 */

require_once __DIR__ . '/EmailService.php';
require_once __DIR__ . '/../Repositories/UserRepository.php';

class LocationNotificationService
{
    private $conn;
    private $emailService;
    private $userRepo;
    private $frontendUrl;

    public function __construct($conn)
    {
        $this->conn = $conn;
        $this->emailService = new EmailService();
        $this->userRepo = new UserRepository($conn);

        // Read frontend URL from .env
        $envPath = __DIR__ . '/../../config/.env';
        if (file_exists($envPath)) {
            $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                if (strpos(trim($line), '#') === 0) continue;
                if (strpos($line, '=') === false) continue;
                list($name, $value) = explode('=', $line, 2);
                if (trim($name) === 'FRONTEND_BASE_URL') {
                    $this->frontendUrl = trim($value);
                }
            }
        }
        if (empty($this->frontendUrl)) {
            $isProd = (!empty($_SERVER['HTTP_HOST']) && strpos($_SERVER['HTTP_HOST'], 'findora.software') !== false);
            $this->frontendUrl = $isProd ? 'https://findora.software' : 'http://localhost:5173';
        }
    }

    /**
     * Dispatch location-based email alerts.
     *
     * IMPORTANT: nearestTown comes from the REPORT's nearest_town field,
     * NOT from the reporting user's registered city.
     *
     * @param string $reportType  'missing_person' or 'missing_pet' only
     * @param int    $reportId    ID of the report in its table
     * @param string $nearestTown The report's nearest_town field value
     * @param int    $reporterId  User ID of the person who submitted the report (excluded from notifications)
     * @param string $reportTitle Name/title of missing person or pet
     * @param string $reportDescription Description text
     */
    public function dispatch(
        string $reportType,
        int $reportId,
        string $nearestTown,
        int $reporterId,
        string $reportTitle,
        string $reportDescription
    ): void {
        // STRICT: Only Missing Person and Missing Pet generate location-based emails.
        if ($reportType !== 'missing_person' && $reportType !== 'missing_pet') {
            echo "[LocationNotificationService] Skipped: report type '$reportType' does not trigger location alerts.\n";
            return;
        }

        $nearestTown = trim($nearestTown);
        if (empty($nearestTown)) {
            echo "[LocationNotificationService] Skipped: nearestTown is empty for report ID $reportId.\n";
            return;
        }

        echo "[LocationNotificationService] Processing $reportType alert for report ID $reportId. Report location city: $nearestTown\n";

        try {
            // Ensure email_notifications table exists (defensive)
            $this->ensureEmailNotificationsTable();

            // Fetch extra report details for richer email content
            $reportDetails = $this->fetchReportDetails($reportType, $reportId);

            // Find users whose registered nearest_town matches the REPORT's nearest_town.
            $matchedUsers = $this->userRepo->findUsersByNearestTown($nearestTown, $reporterId);

            echo "[LocationNotificationService] Found " . count($matchedUsers) . " users in city: $nearestTown\n";

            if (empty($matchedUsers)) {
                return;
            }

            $subject = $this->buildSubject($reportType, $nearestTown);
            $sentEmails = [];
            $sentCount = 0;
            $failCount = 0;

            foreach ($matchedUsers as $user) {
                $emailKey = strtolower(trim($user['email']));
                if (empty($emailKey) || isset($sentEmails[$emailKey])) {
                    continue;
                }

                // Check if notification was already sent successfully. If not, mark pending.
                if (!$this->prepareNotification($reportType, $reportId, $user['user_id'], $user['email'])) {
                    echo "[LocationNotificationService] Skipped duplicate/sent for user {$user['user_id']} on $reportType #$reportId\n";
                    continue;
                }

                $sentEmails[$emailKey] = true;

                $htmlBody = $this->buildEmailBody(
                    $user['first_name'],
                    $reportType,
                    $reportTitle,
                    $reportDescription,
                    $nearestTown,
                    $reportDetails
                );

                $result = $this->emailService->send($user['email'], $subject, $htmlBody);
                if ($result) {
                    $sentCount++;
                    $this->updateNotificationStatus($reportType, $reportId, $user['user_id'], 'sent');
                    echo "[LocationNotificationService] Sent email to {$user['email']} for $reportType #$reportId\n";
                } else {
                    $failCount++;
                    $this->updateNotificationStatus($reportType, $reportId, $user['user_id'], 'failed');
                    echo "[LocationNotificationService] Failed to send email to {$user['email']} for $reportType #$reportId\n";
                }
            }

            echo "[LocationNotificationService] Done. Sent: $sentCount, Failed: $failCount for $reportType #$reportId in $nearestTown\n";

        } catch (\Throwable $e) {
            echo "[LocationNotificationService] Critical Error: " . $e->getMessage() . "\n";
        }
    }

    /**
     * Fetch extra details from the report table for richer email content.
     */
    private function fetchReportDetails(string $reportType, int $reportId): array
    {
        if ($reportType === 'missing_person') {
            $stmt = $this->conn->prepare("
                SELECT full_name, age, gender, description, distinguishing_marks,
                       missing_date, missing_time, district, nearest_town,
                       last_seen_location, guardian_contact_no
                FROM missing_person_post
                WHERE person_post_id = ?
                LIMIT 1
            ");
        } elseif ($reportType === 'missing_pet') {
            $stmt = $this->conn->prepare("
                SELECT pet_name, pet_category, description, unique_identifiers,
                       lost_date, lost_time, district, nearest_town,
                       last_seen_location, guardian_contact_no
                FROM missing_pet_post
                WHERE pet_post_id = ?
                LIMIT 1
            ");
        } else {
            return [];
        }

        if (!$stmt) return [];

        $stmt->bind_param('i', $reportId);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $stmt->close();

        return $result ?? [];
    }

    /**
     * Prepares the notification by checking if it was already sent.
     * If not sent (missing or failed), it creates/updates the status to 'pending' and returns true.
     * If already 'sent', it returns false.
     */
    private function prepareNotification(string $reportType, int $reportId, int $userId, string $email): bool
    {
        $checkStmt = $this->conn->prepare("SELECT status FROM email_notifications WHERE report_type = ? AND report_id = ? AND user_id = ? LIMIT 1");
        if (!$checkStmt) {
            error_log("[LocationNotificationService] Failed to prepare check query: " . $this->conn->error);
            return true; // Proceed if table is broken
        }

        $checkStmt->bind_param("sii", $reportType, $reportId, $userId);
        $checkStmt->execute();
        $result = $checkStmt->get_result()->fetch_assoc();
        $checkStmt->close();

        if ($result) {
            if ($result['status'] === 'sent') {
                return false; // Already sent successfully
            }
            // If failed, update to pending for retry
            $updStmt = $this->conn->prepare("UPDATE email_notifications SET status = 'pending', email = ? WHERE report_type = ? AND report_id = ? AND user_id = ?");
            if ($updStmt) {
                $updStmt->bind_param("ssii", $email, $reportType, $reportId, $userId);
                $updStmt->execute();
                $updStmt->close();
            }
            return true;
        }

        // Doesn't exist, insert as pending
        $insStmt = $this->conn->prepare("INSERT IGNORE INTO email_notifications (report_type, report_id, user_id, email, status) VALUES (?, ?, ?, ?, 'pending')");
        if ($insStmt) {
            $insStmt->bind_param("siis", $reportType, $reportId, $userId, $email);
            $insStmt->execute();
            $insStmt->close();
        }

        return true;
    }

    /**
     * Updates the status of the notification after sending attempt.
     */
    private function updateNotificationStatus(string $reportType, int $reportId, int $userId, string $status): void
    {
        $stmt = $this->conn->prepare("
            UPDATE email_notifications
            SET status = ?, sent_at = CURRENT_TIMESTAMP
            WHERE report_type = ? AND report_id = ? AND user_id = ?
        ");
        if ($stmt) {
            $stmt->bind_param("ssii", $status, $reportType, $reportId, $userId);
            $stmt->execute();
            $stmt->close();
        }
    }

    /**
     * Ensure the email_notifications table exists (defensive for production).
     */
    private function ensureEmailNotificationsTable(): void
    {
        $this->conn->query("
            CREATE TABLE IF NOT EXISTS `email_notifications` (
                `notification_id` int NOT NULL AUTO_INCREMENT,
                `report_type` varchar(50) NOT NULL,
                `report_id` int NOT NULL,
                `user_id` int NOT NULL,
                `email` varchar(150) NOT NULL,
                `status` varchar(20) NOT NULL DEFAULT 'sent',
                `sent_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (`notification_id`),
                UNIQUE KEY `unique_notification` (`report_type`, `report_id`, `user_id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ");
    }

    private function buildSubject(string $reportType, string $nearestTown): string
    {
        if ($reportType === 'missing_person') {
            return "Findora Missing Person Alert - {$nearestTown}";
        }
        if ($reportType === 'missing_pet') {
            return "Findora Missing Pet Alert - {$nearestTown}";
        }
        return "Findora Alert - {$nearestTown}";
    }

    private function buildEmailBody(
        string $userName,
        string $reportType,
        string $reportTitle,
        string $reportDescription,
        string $town,
        array $details
    ): string {
        $loginUrl = rtrim($this->frontendUrl, '/');

        if ($reportType === 'missing_person') {
            return $this->buildMissingPersonEmail($userName, $reportTitle, $reportDescription, $town, $details, $loginUrl);
        }
        if ($reportType === 'missing_pet') {
            return $this->buildMissingPetEmail($userName, $reportTitle, $reportDescription, $town, $details, $loginUrl);
        }
        return '';
    }

    private function buildMissingPersonEmail(
        string $userName,
        string $fullName,
        string $description,
        string $town,
        array $d,
        string $loginUrl
    ): string {
        $age = !empty($d['age']) ? htmlspecialchars($d['age']) . ' years old' : 'Unknown age';
        $gender = !empty($d['gender']) ? htmlspecialchars($d['gender']) : 'Unknown';
        $lastSeen = !empty($d['last_seen_location']) ? htmlspecialchars($d['last_seen_location']) : htmlspecialchars($town);
        $missingDate = !empty($d['missing_date']) ? htmlspecialchars($d['missing_date']) : 'Unknown date';
        $missingTime = !empty($d['missing_time']) ? htmlspecialchars($d['missing_time']) : '';
        $dateTime = $missingDate . ($missingTime ? ' at ' . $missingTime : '');
        $marks = !empty($d['distinguishing_marks']) ? htmlspecialchars($d['distinguishing_marks']) : '';
        $contact = !empty($d['guardian_contact_no']) ? htmlspecialchars($d['guardian_contact_no']) : '';
        $district = !empty($d['district']) ? htmlspecialchars($d['district']) : '';

        return "
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;'>
            <div style='background-color: #dc2626; color: white; padding: 15px; border-radius: 8px 8px 0 0; text-align: center;'>
                <h2 style='margin: 0;'>&#9888; MISSING PERSON ALERT</h2>
                <p style='margin: 5px 0 0 0; font-size: 14px;'>Reported in your area: <strong>{$town}</strong>" . ($district ? ", {$district}" : "") . "</p>
            </div>

            <div style='padding: 20px;'>
                <p>Hi <strong>" . htmlspecialchars($userName) . "</strong>,</p>
                <p>A missing person has been reported in/near your registered city of <strong>{$town}</strong>. Please review the details below — you may be able to help.</p>

                <div style='background-color: #fef2f2; padding: 15px; border-left: 4px solid #dc2626; margin: 20px 0; border-radius: 4px;'>
                    <h3 style='margin-top: 0; color: #0f172a;'>" . htmlspecialchars($fullName) . "</h3>
                    <table style='width: 100%; font-size: 14px; color: #334155;'>
                        <tr><td style='padding: 4px 0;'><strong>Gender:</strong></td><td>{$gender}</td></tr>
                        <tr><td style='padding: 4px 0;'><strong>Age:</strong></td><td>{$age}</td></tr>
                        <tr><td style='padding: 4px 0;'><strong>Missing Since:</strong></td><td>{$dateTime}</td></tr>
                        <tr><td style='padding: 4px 0;'><strong>Last Seen Location:</strong></td><td>{$lastSeen}</td></tr>
                        " . ($marks ? "<tr><td style='padding: 4px 0;'><strong>Identifying Features:</strong></td><td>{$marks}</td></tr>" : "") . "
                    </table>
                    " . ($description ? "<p style='margin-top: 10px; color: #475569; font-size: 14px;'><strong>Description:</strong> " . htmlspecialchars($description) . "</p>" : "") . "
                </div>

                " . ($contact ? "<p style='font-size: 14px;'><strong>If you have any information, contact the family directly at:</strong> {$contact}</p>" : "") . "

                <p>Or visit Findora to view full details including photos:</p>

                <div style='text-align: center; margin: 30px 0;'>
                    <a href='{$loginUrl}' style='background-color: #dc2626; color: white; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-weight: bold;'>View Report in Findora</a>
                </div>

                <hr style='border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;' />
                <p style='font-size: 12px; color: #64748b; text-align: center;'>
                    You received this alert because your registered nearest town is <strong>{$town}</strong>.
                </p>
            </div>
        </div>";
    }

    private function buildMissingPetEmail(
        string $userName,
        string $petName,
        string $description,
        string $town,
        array $d,
        string $loginUrl
    ): string {
        $petCategory = !empty($d['pet_category']) ? htmlspecialchars($d['pet_category']) : 'Pet';
        $lastSeen = !empty($d['last_seen_location']) ? htmlspecialchars($d['last_seen_location']) : htmlspecialchars($town);
        $lostDate = !empty($d['lost_date']) ? htmlspecialchars($d['lost_date']) : 'Unknown date';
        $lostTime = !empty($d['lost_time']) ? htmlspecialchars($d['lost_time']) : '';
        $dateTime = $lostDate . ($lostTime ? ' at ' . $lostTime : '');
        $identifiers = !empty($d['unique_identifiers']) ? htmlspecialchars($d['unique_identifiers']) : '';
        $contact = !empty($d['guardian_contact_no']) ? htmlspecialchars($d['guardian_contact_no']) : '';
        $district = !empty($d['district']) ? htmlspecialchars($d['district']) : '';

        return "
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;'>
            <div style='background-color: #d97706; color: white; padding: 15px; border-radius: 8px 8px 0 0; text-align: center;'>
                <h2 style='margin: 0;'>&#128062; MISSING PET ALERT</h2>
                <p style='margin: 5px 0 0 0; font-size: 14px;'>Reported in your area: <strong>{$town}</strong>" . ($district ? ", {$district}" : "") . "</p>
            </div>

            <div style='padding: 20px;'>
                <p>Hi <strong>" . htmlspecialchars($userName) . "</strong>,</p>
                <p>A missing {$petCategory} has been reported near your registered city of <strong>{$town}</strong>. If you spot this pet, please help return them home!</p>

                <div style='background-color: #fffbeb; padding: 15px; border-left: 4px solid #d97706; margin: 20px 0; border-radius: 4px;'>
                    <h3 style='margin-top: 0; color: #0f172a;'>" . htmlspecialchars($petName) . " <span style='font-weight: normal; font-size: 14px;'>({$petCategory})</span></h3>
                    <table style='width: 100%; font-size: 14px; color: #334155;'>
                        <tr><td style='padding: 4px 0;'><strong>Last Seen:</strong></td><td>{$lastSeen}</td></tr>
                        <tr><td style='padding: 4px 0;'><strong>Date/Time:</strong></td><td>{$dateTime}</td></tr>
                        " . ($identifiers ? "<tr><td style='padding: 4px 0;'><strong>Identifying Features:</strong></td><td>{$identifiers}</td></tr>" : "") . "
                    </table>
                    " . ($description ? "<p style='margin-top: 10px; color: #475569; font-size: 14px;'><strong>Description:</strong> " . htmlspecialchars($description) . "</p>" : "") . "
                </div>

                " . ($contact ? "<p style='font-size: 14px;'><strong>If you have spotted this pet, please contact the owner at:</strong> {$contact}</p>" : "") . "

                <p>Or visit Findora to view photos and full details:</p>

                <div style='text-align: center; margin: 30px 0;'>
                    <a href='{$loginUrl}' style='background-color: #d97706; color: white; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-weight: bold;'>View Report in Findora</a>
                </div>

                <hr style='border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;' />
                <p style='font-size: 12px; color: #64748b; text-align: center;'>
                    You received this alert because your registered nearest town is <strong>{$town}</strong>.
                </p>
            </div>
        </div>";
    }
}
