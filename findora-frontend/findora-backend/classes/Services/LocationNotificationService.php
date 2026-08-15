<?php

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
        
        $envPath = __DIR__ . '/../../config/.env';
        if (file_exists($envPath)) {
            $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                if (strpos(trim($line), '#') !== 0) {
                    list($name, $value) = explode('=', $line, 2);
                    if (trim($name) === 'FRONTEND_BASE_URL') {
                        $this->frontendUrl = trim($value);
                    }
                }
            }
        }
        if (empty($this->frontendUrl)) {
            $this->frontendUrl = 'http://localhost:5173';
        }
    }

    public function dispatch(
        string $reportType,
        int $reportId,
        string $nearestTown,
        int $reporterId,
        string $reportTitle,
        string $reportDescription
    ): void {
        // STRICT REQUIREMENT: Only Missing Person and Missing Pet reports generate location-based emails.
        // Lost Item, Found Item, and Suspicious Item reports MUST NOT email nearby users.
        if ($reportType !== 'missing_person' && $reportType !== 'missing_pet') {
            return;
        }

        if (empty(trim($nearestTown))) {
            return;
        }

        try {
            // Find registered users matching nearest_town (excluding report creator)
            $matchedUsers = $this->userRepo->findUsersByNearestTown($nearestTown, $reporterId);

            if (empty($matchedUsers)) {
                return; // No users to notify
            }

            $subject = $this->buildSubject($reportType, $nearestTown);

            $sentEmails = [];

            foreach ($matchedUsers as $user) {
                $emailKey = strtolower(trim($user['email']));
                if (empty($emailKey) || isset($sentEmails[$emailKey])) {
                    continue; // Prevent duplicate emails to the same address
                }

                // Record the notification idempotently in the database
                if (!$this->recordNotification($reportType, $reportId, $user['user_id'], $user['email'])) {
                    continue; // Already sent, or DB error
                }

                $sentEmails[$emailKey] = true;

                // Send email notification
                $htmlBody = $this->buildEmailBody($user['first_name'], $reportType, $reportTitle, $reportDescription, $nearestTown);
                $this->emailService->send($user['email'], $subject, $htmlBody);
            }
        } catch (\Exception $e) {
            // Non-blocking catch
            error_log("LocationNotificationService Error: " . $e->getMessage());
        }
    }

    private function recordNotification(string $reportType, int $reportId, int $userId, string $email): bool
    {
        $stmt = $this->conn->prepare("
            INSERT IGNORE INTO email_notifications (report_type, report_id, user_id, email, status)
            VALUES (?, ?, ?, ?, 'sent')
        ");
        
        if (!$stmt) {
            error_log("Failed to prepare email_notifications insert: " . $this->conn->error);
            return false;
        }

        $stmt->bind_param("siis", $reportType, $reportId, $userId, $email);
        $result = $stmt->execute();
        
        $affectedRows = $stmt->affected_rows;
        $stmt->close();
        
        return $result && $affectedRows > 0;
    }

    private function buildSubject(string $reportType, string $nearestTown): string
    {
        if ($reportType === 'missing_person') {
            return "Findora Urgent Alert: Missing Person near {$nearestTown}";
        }
        if ($reportType === 'missing_pet') {
            return "Findora Alert: Missing Pet near {$nearestTown}";
        }
        return "Findora Alert: Report near {$nearestTown}";
    }

    private function buildEmailBody(string $userName, string $reportType, string $reportTitle, string $description, string $town): string
    {
        $loginUrl = rtrim($this->frontendUrl, '/') . '/login';
        
        $typeStr = ($reportType === 'missing_person') ? 'A missing person' : 'A missing pet';

        return "
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;'>
            <h2 style='color: #2563eb;'>Findora Location Alert</h2>
            <p>Hi <strong>{$userName}</strong>,</p>
            <p>{$typeStr} has just been reported in/near your registered town of <strong>{$town}</strong>.</p>
            
            <div style='background-color: #f8fafc; padding: 15px; border-left: 4px solid #2563eb; margin: 20px 0;'>
                <h3 style='margin-top: 0; color: #0f172a;'>{$reportTitle}</h3>
                <p style='color: #475569; font-size: 14px;'>{$description}</p>
            </div>
            
            <p>You might be able to help! Please log in to Findora to view more details, check images, or contact the guardian if you have any information.</p>
            
            <div style='text-align: center; margin: 30px 0;'>
                <a href='{$loginUrl}' style='background-color: #2563eb; color: white; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-weight: bold;'>Open Findora</a>
            </div>
            
            <hr style='border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;' />
            <p style='font-size: 12px; color: #64748b; text-align: center;'>
                You received this alert because your registered nearest town is {$town}.
            </p>
        </div>";
    }
}
