<?php
$conn = new mysqli('localhost', 'root', 'root', 'findora_db');
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$res = $conn->query("SELECT * FROM email_notifications");
echo "\nEMAIL NOTIFICATIONS:\n";
if ($res) {
    while($row = $res->fetch_assoc()) {
        print_r($row);
    }
} else {
    echo "Error: " . $conn->error;
}
$conn->close();
