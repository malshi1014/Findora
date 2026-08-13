<?php
require_once __DIR__ . "/../classes/Security/AuthGuard.php";
AuthGuard::bootstrap();

$host = "localhost";
$username = "root";
$password = "root";
$database = "findora_db";

// MySQL database connection.
$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    error_log("Database connection failed: " . $conn->connect_error);
    http_response_code(500);
    echo json_encode(array(
        "status" => "error",
        "message" => "Database service is unavailable"
    ));
    exit();
}

$conn->set_charset("utf8mb4");
?>
