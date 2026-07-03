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

$user_id = isset($_POST["user_id"]) ? trim($_POST["user_id"]) : "";
$category = isset($_POST["category"]) ? trim($_POST["category"]) : "";
$title = isset($_POST["title"]) ? trim($_POST["title"]) : "";
$description = isset($_POST["description"]) ? trim($_POST["description"]) : "";
$district = isset($_POST["district"]) ? trim($_POST["district"]) : "";
$location = isset($_POST["location"]) ? trim($_POST["location"]) : "";
$found_date = isset($_POST["found_date"]) ? trim($_POST["found_date"]) : "";
$found_time = isset($_POST["found_time"]) ? trim($_POST["found_time"]) : "";
$unique_identifiers = isset($_POST["unique_identifiers"]) ? trim($_POST["unique_identifiers"]) : "";
$contact_no = isset($_POST["contact_no"]) ? trim($_POST["contact_no"]) : "";

$missing = array();

if (empty($user_id)) $missing[] = "user_id";
if (empty($category)) $missing[] = "category";
if (empty($title)) $missing[] = "title";
if (empty($description)) $missing[] = "description";
if (empty($district)) $missing[] = "district";
if (empty($location)) $missing[] = "location";
if (empty($found_date)) $missing[] = "found_date";
if (empty($contact_no)) $missing[] = "contact_no";

if (!empty($missing)) {
    echo json_encode(array(
        "status" => "error",
        "message" => "Please fill all required fields",
        "missing_fields" => $missing
    ));
    exit();
}

$conn->begin_transaction();

try {
    $stmt = $conn->prepare("
        INSERT INTO found_report
        (user_id, category, title, description, district, location, found_date, found_time, unique_identifiers, contact_no, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    ");

    $stmt->bind_param(
        "isssssssss",
        $user_id,
        $category,
        $title,
        $description,
        $district,
        $location,
        $found_date,
        $found_time,
        $unique_identifiers,
        $contact_no
    );

    $stmt->execute();
    $report_id = $stmt->insert_id;

    $uploaded_images = array();

    if (isset($_FILES["images"])) {
        $upload_dir = __DIR__ . "/../uploads/found_reports/";

        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }

        if (!is_array($_FILES["images"]["name"])) {
            $_FILES["images"]["name"] = array($_FILES["images"]["name"]);
            $_FILES["images"]["tmp_name"] = array($_FILES["images"]["tmp_name"]);
            $_FILES["images"]["error"] = array($_FILES["images"]["error"]);
        }

        for ($i = 0; $i < count($_FILES["images"]["name"]); $i++) {
            if ($_FILES["images"]["error"][$i] === UPLOAD_ERR_OK) {
                $original_name = basename($_FILES["images"]["name"][$i]);
                $file_extension = strtolower(pathinfo($original_name, PATHINFO_EXTENSION));

                $allowed_extensions = array("jpg", "jpeg", "png", "webp");

                if (!in_array($file_extension, $allowed_extensions)) {
                    continue;
                }

                $new_file_name = "found_" . $report_id . "_" . time() . "_" . $i . "." . $file_extension;
                $target_path = $upload_dir . $new_file_name;

                if (move_uploaded_file($_FILES["images"]["tmp_name"][$i], $target_path)) {
                    $image_path = "uploads/found_reports/" . $new_file_name;

                    $img_stmt = $conn->prepare("
                        INSERT INTO found_report_image
                        (report_id, image_path)
                        VALUES (?, ?)
                    ");

                    $img_stmt->bind_param("is", $report_id, $image_path);
                    $img_stmt->execute();

                    $uploaded_images[] = $image_path;
                }
            }
        }
    }

    $conn->commit();

    echo json_encode(array(
        "status" => "success",
        "message" => "Found report submitted successfully",
        "report_id" => $report_id,
        "uploaded_images_count" => count($uploaded_images),
        "uploaded_images" => $uploaded_images
    ));

} catch (Exception $e) {
    $conn->rollback();

    echo json_encode(array(
        "status" => "error",
        "message" => "Failed to submit found report",
        "error" => $e->getMessage()
    ));
}
?>