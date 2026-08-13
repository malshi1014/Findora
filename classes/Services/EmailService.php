<?php

// Load PHPMailer classes manually since we didn't use Composer
require_once __DIR__ . '/../../vendor/PHPMailer/src/Exception.php';
require_once __DIR__ . '/../../vendor/PHPMailer/src/PHPMailer.php';
require_once __DIR__ . '/../../vendor/PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class EmailService
{
    private $host;
    private $port;
    private $username;
    private $password;
    private $encryption;
    private $fromAddress;
    private $fromName;

    public function __construct()
    {
        $this->loadEnv();
    }

    private function loadEnv()
    {
        $envPath = __DIR__ . '/../../config/.env';
        if (!file_exists($envPath)) {
            error_log("EmailService: .env file not found");
            return;
        }

        $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            if (strpos(trim($line), '#') === 0) {
                continue;
            }
            list($name, $value) = explode('=', $line, 2);
            $name = trim($name);
            $value = trim($value);

            if (!array_key_exists($name, $_SERVER) && !array_key_exists($name, $_ENV)) {
                putenv(sprintf('%s=%s', $name, $value));
                $_ENV[$name] = $value;
                $_SERVER[$name] = $value;
            }
        }

        $this->host = getenv('MAIL_HOST') ?: 'smtp.gmail.com';
        $this->port = getenv('MAIL_PORT') ?: 587;
        $this->username = getenv('MAIL_USERNAME');
        $this->password = getenv('MAIL_PASSWORD');
        $this->encryption = getenv('MAIL_ENCRYPTION') ?: 'tls';
        $this->fromAddress = getenv('MAIL_FROM_ADDRESS');
        $this->fromName = getenv('MAIL_FROM_NAME') ?: 'Findora';
    }

    public function send(string $to, string $subject, string $htmlBody): bool
    {
        if (empty($this->username) || empty($this->password)) {
            error_log("EmailService Error: SMTP credentials are not configured in .env");
            return false;
        }

        $mail = new PHPMailer(true);

        try {
            // Server settings
            $mail->isSMTP();
            $mail->Host       = $this->host;
            $mail->SMTPAuth   = true;
            $mail->Username   = $this->username;
            $mail->Password   = $this->password;
            $mail->SMTPSecure = $this->encryption === 'ssl' ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = $this->port;

            // Recipients
            $mail->setFrom($this->fromAddress, $this->fromName);
            $mail->addAddress($to);

            // Content
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body    = $htmlBody;
            
            $altBody = strip_tags($htmlBody);
            $mail->AltBody = $altBody;

            $mail->send();
            return true;
        } catch (Exception $e) {
            error_log("EmailService Error: Message could not be sent. Mailer Error: {$mail->ErrorInfo}");
            return false;
        }
    }
}
