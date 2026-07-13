<?php
$host = "localhost";
$username = "root";
$password = "root";
$database = "findora_db";

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    echo json_encode([
        "status" => "error",
        "message" => "Database connection failed: " . $conn->connect_error
    ]);
    exit();
}

$conn->set_charset("utf8mb4");
?>