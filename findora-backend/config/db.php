<?php
$host = "sql200.infinityfree.com";
$username = "if0_42323628";
$password = "MALnav123";
$database = "if0_42323628_findora_db";

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