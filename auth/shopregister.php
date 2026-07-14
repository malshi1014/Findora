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
    echo json_encode(array(
        "status" => "error",
        "message" => "Only POST method is allowed"
    ));
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if ($data === null) {
    echo json_encode(array(
        "status" => "error",
        "message" => "Invalid JSON input"
    ));
    exit();
}

$first_name = isset($data["first_name"]) ? trim($data["first_name"]) : "";
$last_name = isset($data["last_name"]) ? trim($data["last_name"]) : "";
$nic = isset($data["nic"]) ? trim($data["nic"]) : "";
$email = isset($data["email"]) ? trim($data["email"]) : "";
$mobile = isset($data["mobile"]) ? trim($data["mobile"]) : "";
$password = isset($data["password"]) ? trim($data["password"]) : "";
$district = isset($data["district"]) ? trim($data["district"]) : "";
$nearest_town = isset($data["nearest_town"]) ? trim($data["nearest_town"]) : "";

$role = "shop_owner";

// Server-side input validation.
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

// Keep related inserts atomic.
$conn->begin_transaction();

// Roll back safely on errors.
try {
    $check = $conn->prepare("SELECT user_id FROM users WHERE nic = ? OR email = ? LIMIT 1");
    if (!$check) {
        throw new Exception("Database query preparation failed");
    }

    $check->bind_param("ss", $nic, $email);
    $check->execute();
    $result = $check->get_result();

    if ($result->num_rows > 0) {
        throw new Exception("NIC or email already exists");
    }

    // Secure one-way password hashing.
    $password_hash = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $conn->prepare("
        INSERT INTO users
        (first_name, last_name, nic, email, mobile, password_hash, district, nearest_town, role)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    if (!$stmt) {
        throw new Exception("User registration failed");
    }

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

    if (!$stmt->execute()) {
        throw new Exception("User registration failed");
    }

    $user_id = $stmt->insert_id;

    $shop_columns_result = $conn->query("SHOW COLUMNS FROM shop_owner");
    $shop_columns = array();

    if ($shop_columns_result) {
        while ($column = $shop_columns_result->fetch_assoc()) {
            $shop_columns[] = $column["Field"];
        }
    }

    if ($shop_columns_result && in_array("user_id", $shop_columns)) {
        $shop_fields = array("user_id");
        $shop_values = array($user_id);

        if (in_array("shop_name", $shop_columns)) {
            $shop_fields[] = "shop_name";
            $shop_values[] = $first_name . " " . $last_name . "'s Shop";
        }

        if (in_array("owner_name", $shop_columns)) {
            $shop_fields[] = "owner_name";
            $shop_values[] = $first_name . " " . $last_name;
        }

        if (in_array("first_name", $shop_columns)) {
            $shop_fields[] = "first_name";
            $shop_values[] = $first_name;
        }

        if (in_array("last_name", $shop_columns)) {
            $shop_fields[] = "last_name";
            $shop_values[] = $last_name;
        }

        if (in_array("mobile", $shop_columns)) {
            $shop_fields[] = "mobile";
            $shop_values[] = $mobile;
        }

        if (in_array("email", $shop_columns)) {
            $shop_fields[] = "email";
            $shop_values[] = $email;
        }

        if (in_array("nic", $shop_columns)) {
            $shop_fields[] = "nic";
            $shop_values[] = $nic;
        }

        if (in_array("district", $shop_columns)) {
            $shop_fields[] = "district";
            $shop_values[] = $district;
        }

        if (in_array("nearest_town", $shop_columns)) {
            $shop_fields[] = "nearest_town";
            $shop_values[] = $nearest_town;
        }

        if (count($shop_fields) > 1) {
            $placeholders = implode(", ", array_fill(0, count($shop_fields), "?"));
            $sql = "INSERT INTO shop_owner (" . implode(", ", $shop_fields) . ") VALUES (" . $placeholders . ")";
            $shop_stmt = $conn->prepare($sql);

            if (!$shop_stmt) {
                throw new Exception("Shop owner registration failed");
            }

            $types = str_repeat("s", count($shop_values));
            $params = array($types);
            foreach ($shop_values as $key => $value) {
                $params[] = &$shop_values[$key];
            }

            call_user_func_array(array($shop_stmt, "bind_param"), $params);

            if (!$shop_stmt->execute()) {
                throw new Exception("Shop owner registration failed");
            }
        }
    }

    $conn->commit();

    echo json_encode(array(
        "status" => "success",
        "message" => "Registration successful",
        "redirect_url" => "/login",
        "user" => array(
            "user_id" => $user_id,
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
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(array(
        "status" => "error",
        "message" => $e->getMessage()
    ));
}
?>
