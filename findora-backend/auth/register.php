<?php
header("Access-Control-Allow-Origin: https://findora.freehosting.dev");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
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

$data = json_decode(file_get_contents("php://input"), true);

$first_name = isset($data["first_name"]) ? trim($data["first_name"]) : "";
$last_name = isset($data["last_name"]) ? trim($data["last_name"]) : "";
$nic = isset($data["nic"]) ? trim($data["nic"]) : "";
$email = isset($data["email"]) ? trim($data["email"]) : "";
$mobile = isset($data["mobile"]) ? trim($data["mobile"]) : "";
$password = isset($data["password"]) ? trim($data["password"]) : "";
$district = isset($data["district"]) ? trim($data["district"]) : "";
$nearest_town = isset($data["nearest_town"]) ? trim($data["nearest_town"]) : "";

$role = "verified_user";

if (
    empty($first_name) ||
    empty($last_name) ||
    empty($nic) ||
    empty($email) ||
    empty($mobile) ||
    empty($password)
) {
    echo json_encode(array(
        "status" => "error",
        "message" => "Please fill all required fields"
    ));
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(array(
        "status" => "error",
        "message" => "Invalid email address"
    ));
    exit();
}

$check = $conn->prepare("SELECT user_id FROM users WHERE nic = ? OR email = ? LIMIT 1");
$check->bind_param("ss", $nic, $email);
$check->execute();
$result = $check->get_result();

if ($result->num_rows > 0) {
    echo json_encode(array(
        "status" => "error",
        "message" => "NIC or email already exists"
    ));
    exit();
}

$password_hash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conn->prepare("
    INSERT INTO users
    (first_name, last_name, nic, email, mobile, password_hash, district, nearest_town, role)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
");

$stmt->bind_param(
    "sssssssss",
    $first_name,
    $last_name,
    $nic,
    $email,
    $mobile,
    $password_hash,
    $district,
    $nearest_town,
    $role
);

if ($stmt->execute()) {
    echo json_encode(array(
        "status" => "success",
        "message" => "Registration successful",
        "user" => array(
            "user_id" => $stmt->insert_id,
            "first_name" => $first_name,
            "last_name" => $last_name,
            "nic" => $nic,
            "email" => $email,
            "mobile" => $mobile,
            "district" => $district,
            "nearest_town" => $nearest_town,
            "role" => $role
        )
    ));
} else {
    echo json_encode(array(
        "status" => "error",
        "message" => "Registration failed"
    ));
}
?>