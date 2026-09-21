<?php

class EmailService
{
    private $apiKey;
    private $fromAddress;
    private $fromName;
    private $envLoaded = false;

    public function __construct()
    {
        $this->loadEnv();
    }

    private function loadEnv()
    {
        $envPath = __DIR__ . '/../../config/.env';

        if (!file_exists($envPath)) {
            error_log(json_encode(["env_error" => ".env file NOT found", "path" => $envPath]));
            return;
        }

        $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if ($lines === false) {
            error_log(json_encode(["env_error" => "Failed to read .env file"]));
            return;
        }

        // Parse directly into local map — do NOT rely on getenv() which fails on FastCGI hosts
        $envVars = [];
        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line) || $line[0] === '#') {
                continue;
            }
            if (strpos($line, '=') === false) {
                continue;
            }
            list($name, $value) = explode('=', $line, 2);
            $name  = trim($name);
            $value = trim($value);
            // Strip surrounding quotes
            if (preg_match('/^"(.*)"$/s', $value, $m) || preg_match("/^'(.*)'$/s", $value, $m)) {
                $value = $m[1];
            }
            $envVars[$name] = $value;
        }

        $this->apiKey      = isset($envVars['BREVO_API_KEY'])    ? $envVars['BREVO_API_KEY']    : '';
        $this->fromAddress = isset($envVars['MAIL_FROM_ADDRESS']) ? $envVars['MAIL_FROM_ADDRESS'] : '';
        $this->fromName    = isset($envVars['MAIL_FROM_NAME'])    ? $envVars['MAIL_FROM_NAME']    : 'Findora';
        $this->envLoaded   = true;

        // Diagnostic — never logs actual key value
        error_log(json_encode([
            "env_loaded"       => true,
            "api_key_detected" => !empty($this->apiKey),
            "api_key_length"   => strlen($this->apiKey),
            "sender"           => $this->fromAddress,
            "from_name"        => $this->fromName,
        ]));
    }

    public function send(string $to, string $subject, string $htmlBody): bool
    {
        $to = filter_var(trim($to), FILTER_VALIDATE_EMAIL);
        if (!$to) {
            error_log(json_encode([
                "error"     => "Invalid recipient",
                "recipient" => $to,
            ]));
            return false;
        }

        $hasApiKey = !empty($this->apiKey);
        if (!$hasApiKey) {
            error_log(json_encode([
                "error"     => "API key missing",
                "recipient" => $to,
            ]));
            return false;
        }

        if (empty($this->fromAddress) || !filter_var($this->fromAddress, FILTER_VALIDATE_EMAIL)) {
            error_log(json_encode([
                "error"     => "Invalid sender address",
                "recipient" => $to,
                "sender"    => $this->fromAddress
            ]));
            return false;
        }

        $url = 'https://api.brevo.com/v3/smtp/email';

        $data = [
            'sender' => [
                'name'  => $this->fromName,
                'email' => $this->fromAddress
            ],
            'to' => [
                [
                    'email' => $to
                ]
            ],
            'subject'     => $subject,
            'htmlContent' => $htmlBody
        ];

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

        // Secure SSL Verification
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);

        // Timeouts
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);

        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'accept: application/json',
            'api-key: ' . $this->apiKey,
            'content-type: application/json'
        ]);

        $response  = curl_exec($ch);
        $httpCode  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($response === false) {
            error_log(json_encode([
                "recipient"        => $to,
                "sender"           => $this->fromAddress,
                "api_key_detected" => $hasApiKey,
                "http_code"        => 0,
                "curl_error"       => $curlError,
                "brevo_response"   => null,
                "executed"         => false
            ]));
            return false;
        }

        if ($httpCode >= 200 && $httpCode < 300) {
            return true;
        } else {
            error_log(json_encode([
                "recipient"        => $to,
                "sender"           => $this->fromAddress,
                "api_key_detected" => $hasApiKey,
                "http_code"        => $httpCode,
                "curl_error"       => $curlError,
                "brevo_response"   => $response,
                "executed"         => true
            ]));
            return false;
        }
    }
}
