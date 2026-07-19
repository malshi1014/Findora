<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
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
include __DIR__ . "/../helpers/create_notification.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(array(
        "status" => "error",
        "message" => "Only POST method is allowed"
    ));
    exit();
}

$user_id = isset($_POST["user_id"]) ? intval($_POST["user_id"]) : 0;
$pet_name = isset($_POST["pet_name"]) ? trim($_POST["pet_name"]) : "";
$pet_category = isset($_POST["pet_category"]) ? trim($_POST["pet_category"]) : "";
$description = isset($_POST["description"]) ? trim($_POST["description"]) : "";
$unique_identifiers = isset($_POST["unique_identifiers"]) ? trim($_POST["unique_identifiers"]) : "";
$lost_date = isset($_POST["lost_date"]) ? trim($_POST["lost_date"]) : "";
$lost_time = isset($_POST["lost_time"]) ? trim($_POST["lost_time"]) : "";
$district = isset($_POST["district"]) ? trim($_POST["district"]) : "";
$nearest_town = isset($_POST["nearest_town"]) ? trim($_POST["nearest_town"]) : "";
$last_seen_location = isset($_POST["last_seen_location"]) ? trim($_POST["last_seen_location"]) : "";
$guardian_contact_no = isset($_POST["guardian_contact_no"]) ? trim($_POST["guardian_contact_no"]) : "";

$missing_fields = array();

if ($user_id <= 0) {
    $missing_fields[] = "user_id";
}

if ($pet_name === "") {
    $missing_fields[] = "pet_name";
}

if ($pet_category === "") {
    $missing_fields[] = "pet_category";
}

if ($description === "") {
    $missing_fields[] = "description";
}

if ($lost_date === "") {
    $missing_fields[] = "lost_date";
}

if ($last_seen_location === "") {
    $missing_fields[] = "last_seen_location";
}

if ($guardian_contact_no === "") {
    $missing_fields[] = "guardian_contact_no";
}

if (!empty($missing_fields)) {
    echo json_encode(array(
        "status" => "error",
        "message" => "Required fields are missing",
        "missing_fields" => $missing_fields
    ));
    exit();
}

if (strtotime($lost_date) === false) {
    echo json_encode(array(
        "status" => "error",
        "message" => "Invalid lost date format"
    ));
    exit();
}

$today = date("Y-m-d");
if ($lost_date > $today) {
    echo json_encode(array(
        "status" => "error",
        "message" => "Lost date cannot be in the future"
    ));
    exit();
}

$userCheck = $conn->prepare("
    SELECT user_id, role
    FROM users
    WHERE user_id = ?
    LIMIT 1
");

if (!$userCheck) {
    echo json_encode(array(
        "status" => "error",
        "message" => "User check query preparation failed",
        "error" => $conn->error
    ));
    exit();
}

$userCheck->bind_param("i", $user_id);
$userCheck->execute();
$userResult = $userCheck->get_result();

if ($userResult->num_rows === 0) {
    echo json_encode(array(
        "status" => "error",
        "message" => "Invalid user"
    ));
    exit();
}

$user = $userResult->fetch_assoc();

if (
    $user["role"] !== "verified_user" &&
    $user["role"] !== "shop_owner" &&
    $user["role"] !== "admin"
) {
    echo json_encode(array(
        "status" => "error",
        "message" => "Only logged-in verified users or shop owners can submit missing pet posts"
    ));
    exit();
}

$uploadDir = __DIR__ . "/../uploads/missing_pets/";

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$conn->begin_transaction();

try {
    $status = "pending";

    $stmt = $conn->prepare("
        INSERT INTO missing_pet_post
        (
            user_id,
            pet_name,
            pet_category,
            description,
            unique_identifiers,
            lost_date,
            lost_time,
            district,
            nearest_town,
            last_seen_location,
            guardian_contact_no,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    if (!$stmt) {
        throw new Exception("Insert query preparation failed: " . $conn->error);
    }

    $stmt->bind_param(
        "isssssssssss",
        $user_id,
        $pet_name,
        $pet_category,
        $description,
        $unique_identifiers,
        $lost_date,
        $lost_time,
        $district,
        $nearest_town,
        $last_seen_location,
        $guardian_contact_no,
        $status
    );

    if (!$stmt->execute()) {
        throw new Exception("Missing pet post insert failed: " . $stmt->error);
    }

    $pet_post_id = $stmt->insert_id;

    if (isset($_FILES["images"]) && isset($_FILES["images"]["name"])) {
        $allowedExtensions = array("jpg", "jpeg", "png", "webp");

        for ($i = 0; $i < count($_FILES["images"]["name"]); $i++) {
            if ($_FILES["images"]["error"][$i] !== UPLOAD_ERR_OK) {
                continue;
            }

            $originalName = $_FILES["images"]["name"][$i];
            $tmpName = $_FILES["images"]["tmp_name"][$i];

            $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

            if (!in_array($extension, $allowedExtensions)) {
                continue;
            }

            $newFileName = "missing_pet_" . $pet_post_id . "_" . time() . "_" . $i . "." . $extension;
            $targetPath = $uploadDir . $newFileName;

            if (move_uploaded_file($tmpName, $targetPath)) {
                $imagePath = "uploads/missing_pets/" . $newFileName;

                $imageStmt = $conn->prepare("
                    INSERT INTO missing_pet_post_image
                    (pet_post_id, image_path)
                    VALUES (?, ?)
                ");

                if (!$imageStmt) {
                    throw new Exception("Image insert query preparation failed: " . $conn->error);
                }

                $imageStmt->bind_param("is", $pet_post_id, $imagePath);

                if (!$imageStmt->execute()) {
                    throw new Exception("Image insert failed: " . $imageStmt->error);
                }
            }
        }
    }
    createNotification(
    $conn,
    $user_id,
    "Your missing pet report has been submitted and is waiting for admin approval.",
    "report_submitted",
    null
);

    $conn->commit();

    echo json_encode(array(
        "status" => "success",
        "message" => "Missing pet post submitted successfully. It is pending admin approval.",
        "pet_post_id" => $pet_post_id
    ));
    exit();

} catch (Exception $e) {
    $conn->rollback();

    echo json_encode(array(
        "status" => "error",
        "message" => "Failed to submit missing pet post",
        "error" => $e->getMessage()
    ));
    exit();
}
?>