<?php
$host = "your_database_host";
$username = "your_database_username";
$password = "your_database_password";
$database = "your_database_name";

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    echo json_encode(array(
        "status" => "error",
        "message" => "Database connection failed: " . $conn->connect_error
    ));
    exit();
}

$conn->set_charset("utf8mb4");
?>