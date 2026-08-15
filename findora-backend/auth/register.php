<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

include __DIR__ . "/../config/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(array("status" => "error", "message" => "Only POST method is allowed"));
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
if ($data === null) {
    echo json_encode(array("status" => "error", "message" => "Invalid JSON input"));
    exit();
}

$first_name = isset($data["first_name"]) ? trim($data["first_name"]) : "";
$last_name = isset($data["last_name"]) ? trim($data["last_name"]) : "";
$nic = isset($data["nic"]) ? strtoupper(trim($data["nic"])) : "";
$email = isset($data["email"]) ? strtolower(trim($data["email"])) : "";
$mobile = isset($data["mobile"]) ? trim($data["mobile"]) : "";
$password = isset($data["password"]) ? trim($data["password"]) : "";
$district = isset($data["district"]) ? trim($data["district"]) : "";
$nearest_town = isset($data["nearest_town"]) ? trim($data["nearest_town"]) : "";
$role = "verified_user";

// Required fields check
if (empty($first_name) || empty($last_name) || empty($nic) || empty($email) || empty($mobile) || empty($password) || empty($district) || empty($nearest_town)) {
    echo json_encode(array("status" => "error", "message" => "Please fill all required fields"));
    exit();
}

// First/Last Name validation
if (!preg_match("/^[a-zA-Z\s\-']{2,50}$/", $first_name) || !preg_match("/^[a-zA-Z\s\-']{2,50}$/", $last_name)) {
    echo json_encode(array("status" => "error", "message" => "Invalid name format"));
    exit();
}

// Email validation
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254) {
    echo json_encode(array("status" => "error", "message" => "Invalid email format"));
    exit();
}

// NIC validation (Sri Lankan formats)
if (!preg_match("/^([0-9]{9}[VX]|[0-9]{12})$/", $nic)) {
    echo json_encode(array("status" => "error", "message" => "Invalid NIC format"));
    exit();
}

// Mobile validation (Starts with 07 and 10 digits)
if (!preg_match("/^07[0-9]{8}$/", $mobile)) {
    echo json_encode(array("status" => "error", "message" => "Invalid mobile number format"));
    exit();
}

// Password validation
if (strlen($password) < 8 || strlen($password) > 72 || !preg_match("/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/", $password)) {
    echo json_encode(array("status" => "error", "message" => "Password does not meet complexity requirements"));
    exit();
}

// District Validation
$valid_districts = ["Ampara","Anuradhapura","Badulla","Batticaloa","Colombo","Galle","Gampaha","Hambantota","Jaffna","Kalutara","Kandy","Kegalle","Kilinochchi","Kurunegala","Mannar","Matale","Matara","Monaragala","Mullaitivu","Nuwara Eliya","Polonnaruwa","Puttalam","Ratnapura","Trincomalee","Vavuniya"];
if (!in_array($district, $valid_districts)) {
    echo json_encode(array("status" => "error", "message" => "Invalid district selected"));
    exit();
}

// Database Uniqueness Checks
$check = $conn->prepare("SELECT email, nic, mobile FROM users WHERE email = ? OR nic = ? OR mobile = ? LIMIT 1");
if (!$check) {
    echo json_encode(array("status" => "error", "message" => "Database query failed"));
    exit();
}

$check->bind_param("sss", $email, $nic, $mobile);
$check->execute();
$result = $check->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    if ($row['email'] === $email) {
        echo json_encode(array("status" => "error", "message" => "Email is already registered"));
    } else if ($row['nic'] === $nic) {
        echo json_encode(array("status" => "error", "message" => "NIC is already registered"));
    } else if ($row['mobile'] === $mobile) {
        echo json_encode(array("status" => "error", "message" => "Mobile number is already registered"));
    }
    exit();
}

// Secure one-way password hashing.
$password_hash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conn->prepare("
    INSERT INTO users
    (first_name, last_name, nic, email, mobile, password_hash, district, nearest_town, role)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
");

if (!$stmt) {
    echo json_encode(array("status" => "error", "message" => "Failed to prepare registration statement"));
    exit();
}

$stmt->bind_param("sssssssss", $first_name, $last_name, $nic, $email, $mobile, $password_hash, $district, $nearest_town, $role);

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
    echo json_encode(array("status" => "error", "message" => "Registration failed"));
}
?>
