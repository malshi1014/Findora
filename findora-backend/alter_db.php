<?php
$conn = new mysqli("localhost", "root", "root", "findora_db");
if ($conn->connect_error) {
    $conn = new mysqli("localhost", "root", "", "findora_db");
}
$query = "ALTER TABLE users ADD account_status ENUM('active', 'suspended') DEFAULT 'active'";
if ($conn->query($query) === TRUE) {
    echo "Column added successfully";
} else {
    // If it already exists, it will throw an error, which is fine
    echo "Error: " . $conn->error;
}
?>
