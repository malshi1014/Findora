<?php
header("Access-Control-Allow-Origin: https://findora.freehosting.dev");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    echo json_encode(array(
        "status" => "success",
        "message" => "Preflight OK"
    ));
    exit();
}

include __DIR__ . "/../config/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(array(
        "status" => "error",
        "message" => "Only POST method is allowed"
    ));
    exit();
}

$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);

if ($data === null) {
    echo json_encode(array(
        "status" => "error",
        "message" => "Invalid JSON input"
    ));
    exit();
}

$login_id = isset($data["login_id"]) ? trim($data["login_id"]) : "";
$password = isset($data["password"]) ? trim($data["password"]) : "";

if (empty($login_id) || empty($password)) {
    echo json_encode(array(
        "status" => "error",
        "message" => "NIC/Email and password are required"
    ));
    exit();
}

$stmt = $conn->prepare("
    SELECT user_id, first_name, last_name, nic, email, password_hash, role
    FROM users
    WHERE nic = ? OR email = ?
    LIMIT 1
");

if (!$stmt) {
    echo json_encode(array(
        "status" => "error",
        "message" => "Database query preparation failed"
    ));
    exit();
}

$stmt->bind_param("ss", $login_id, $login_id);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(array(
        "status" => "error",
        "message" => "Invalid NIC/Email or password"
    ));
    exit();
}

$user = $result->fetch_assoc();

if (!password_verify($password, $user["password_hash"])) {
    echo json_encode(array(
        "status" => "error",
        "message" => "Invalid NIC/Email or password"
    ));
    exit();
}

echo json_encode(array(
    "status" => "success",
    "message" => "Login successful",
    "user" => array(
        "user_id" => $user["user_id"],
        "first_name" => $user["first_name"],
        "last_name" => $user["last_name"],
        "nic" => $user["nic"],
        "email" => $user["email"],
        "role" => $user["role"]
    )
));
exit();
?>