<?php
require_once __DIR__ . '/classes/Services/EmailService.php';

try {
    $emailService = new EmailService();
    $emailService->send(
        'malshinavodya1014@gmail.com', 
        'Test Email from Findora', 
        '<h1>Hello!</h1><p>Your SMTP credentials are working perfectly!</p>'
    );
    echo "Test email sent successfully to malshinavodya1014@gmail.com\n";
} catch (Exception $e) {
    echo "Failed to send email: " . $e->getMessage() . "\n";
}
