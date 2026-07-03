<?php
header("Access-Control-Allow-Origin: https://findora.freehosting.dev");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

include __DIR__ . "/config/db.php";

echo json_encode([
    "status" => "success",
    "message" => "Findora database connected successfully"
]);
?>