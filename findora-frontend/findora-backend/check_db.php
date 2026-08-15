<?php
$conn = new mysqli('localhost', 'root', 'root', 'findora_db');
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$res = $conn->query("SHOW TABLES");
echo "TABLES:\n";
while($row = $res->fetch_row()) {
    echo $row[0] . "\n";
}

$res = $conn->query("SELECT * FROM system_config");
echo "\nSYSTEM CONFIG:\n";
if ($res) {
    while($row = $res->fetch_assoc()) {
        print_r($row);
    }
} else {
    echo "No system_config table or error: " . $conn->error;
}
$conn->close();
