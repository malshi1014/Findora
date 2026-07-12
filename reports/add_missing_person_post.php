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
$full_name = isset($_POST["full_name"]) ? trim($_POST["full_name"]) : "";
$age = isset($_POST["age"]) && $_POST["age"] !== "" ? intval($_POST["age"]) : null;
$gender = isset($_POST["gender"]) ? trim($_POST["gender"]) : "";
$description = isset($_POST["description"]) ? trim($_POST["description"]) : "";
$distinguishing_marks = isset($_POST["distinguishing_marks"]) ? trim($_POST["distinguishing_marks"]) : "";
$missing_date = isset($_POST["missing_date"]) ? trim($_POST["missing_date"]) : "";
$missing_time = isset($_POST["missing_time"]) ? trim($_POST["missing_time"]) : "";
$district = isset($_POST["district"]) ? trim($_POST["district"]) : "";
$nearest_town = isset($_POST["nearest_town"]) ? trim($_POST["nearest_town"]) : "";
$last_seen_location = isset($_POST["last_seen_location"]) ? trim($_POST["last_seen_location"]) : "";
$guardian_contact_no = isset($_POST["guardian_contact_no"]) ? trim($_POST["guardian_contact_no"]) : "";

$missing_fields = array();

if ($user_id <= 0) {
    $missing_fields[] = "user_id";
}

if ($full_name === "") {
    $missing_fields[] = "full_name";
}

if ($description === "") {
    $missing_fields[] = "description";
}

if ($missing_date === "") {
    $missing_fields[] = "missing_date";
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
        "message" => "Only logged-in verified users or shop owners can submit missing person posts"
    ));
    exit();
}

$uploadDir = __DIR__ . "/../uploads/missing_people/";

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$conn->begin_transaction();

try {
    $status = "pending";

    $stmt = $conn->prepare("
        INSERT INTO missing_person_post
        (
            user_id,
            full_name,
            age,
            gender,
            description,
            distinguishing_marks,
            missing_date,
            missing_time,
            district,
            nearest_town,
            last_seen_location,
            guardian_contact_no,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    if (!$stmt) {
        throw new Exception("Insert query preparation failed: " . $conn->error);
    }

    $stmt->bind_param(
        "isissssssssss",
        $user_id,
        $full_name,
        $age,
        $gender,
        $description,
        $distinguishing_marks,
        $missing_date,
        $missing_time,
        $district,
        $nearest_town,
        $last_seen_location,
        $guardian_contact_no,
        $status
    );

    if (!$stmt->execute()) {
        throw new Exception("Missing person post insert failed: " . $stmt->error);
    }

    $person_post_id = $stmt->insert_id;

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

            $newFileName = "missing_person_" . $person_post_id . "_" . time() . "_" . $i . "." . $extension;
            $targetPath = $uploadDir . $newFileName;

            if (move_uploaded_file($tmpName, $targetPath)) {
                $imagePath = "uploads/missing_people/" . $newFileName;

                $imageStmt = $conn->prepare("
                    INSERT INTO missing_person_post_image
                    (person_post_id, image_path)
                    VALUES (?, ?)
                ");

                if (!$imageStmt) {
                    throw new Exception("Image insert query preparation failed: " . $conn->error);
                }

                $imageStmt->bind_param("is", $person_post_id, $imagePath);

                if (!$imageStmt->execute()) {
                    throw new Exception("Image insert failed: " . $imageStmt->error);
                }
            }
        }
    }
    createNotification(
    $conn,
    $user_id,
    "Your missing person report has been submitted and is waiting for admin approval.",
    "report_submitted",
    null
);

    $conn->commit();

    echo json_encode(array(
        "status" => "success",
        "message" => "Missing person post submitted successfully. It is pending admin approval.",
        "person_post_id" => $person_post_id
    ));
    exit();

} catch (Exception $e) {
    $conn->rollback();

    echo json_encode(array(
        "status" => "error",
        "message" => "Failed to submit missing person post",
        "error" => $e->getMessage()
    ));
    exit();
}
?>