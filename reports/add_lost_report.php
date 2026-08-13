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
require_once __DIR__ . "/../helpers/send_location_notifications.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(array(
        "status" => "error",
        "message" => "Only POST method is allowed"
    ));
    exit();
}

$user_id = isset($_POST["user_id"]) ? intval($_POST["user_id"]) : 0;
$category = isset($_POST["category"]) ? trim($_POST["category"]) : "";
$title = isset($_POST["title"]) ? trim($_POST["title"]) : "";
$description = isset($_POST["description"]) ? trim($_POST["description"]) : "";
$district = isset($_POST["district"]) ? trim($_POST["district"]) : "";
$nearest_town = isset($_POST["nearest_town"]) ? trim($_POST["nearest_town"]) : "";
$location = isset($_POST["location"]) ? trim($_POST["location"]) : "";
$lost_date = isset($_POST["lost_date"]) ? trim($_POST["lost_date"]) : "";
$lost_time = isset($_POST["lost_time"]) ? trim($_POST["lost_time"]) : "";
$unique_identifiers = isset($_POST["unique_identifiers"]) ? trim($_POST["unique_identifiers"]) : "";
$contact_no = isset($_POST["contact_no"]) ? trim($_POST["contact_no"]) : "";

$missing = array();

if ($user_id <= 0) $missing[] = "user_id";
if (empty($category)) $missing[] = "category";
if (empty($title)) $missing[] = "title";
if (empty($description)) $missing[] = "description";
if (empty($nearest_town)) $missing[] = "nearest_town";
if (empty($location)) $missing[] = "location";
if (empty($lost_date)) $missing[] = "lost_date";
if (empty($contact_no)) $missing[] = "contact_no";

if (!empty($missing)) {
    echo json_encode(array(
        "status" => "error",
        "message" => "Please fill all required fields",
        "missing_fields" => $missing,
        "received_post" => $_POST
    ));
    exit();
}

$conn->begin_transaction();

try {
    $stmt = $conn->prepare("
        INSERT INTO lost_report
        (user_id, category, title, description, district, nearest_town, location, lost_date, lost_time, unique_identifiers, contact_no, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    ");

    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param(
        "issssssssss",
        $user_id,
        $category,
        $title,
        $description,
        $district,
        $nearest_town,
        $location,
        $lost_date,
        $lost_time,
        $unique_identifiers,
        $contact_no
    );

    if (!$stmt->execute()) {
        throw new Exception("Insert lost report failed: " . $stmt->error);
    }

    $report_id = $stmt->insert_id;
    $uploaded_images = array();

    if (isset($_FILES["images"])) {
        $upload_dir = __DIR__ . "/../uploads/lost_reports/";

        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }

        $image_names = $_FILES["images"]["name"];
        $image_tmp_names = $_FILES["images"]["tmp_name"];
        $image_errors = $_FILES["images"]["error"];

        if (!is_array($image_names)) {
            $image_names = array($image_names);
            $image_tmp_names = array($image_tmp_names);
            $image_errors = array($image_errors);
        }

        for ($i = 0; $i < count($image_names); $i++) {
            if ($image_errors[$i] !== UPLOAD_ERR_OK) {
                continue;
            }

            $original_name = basename($image_names[$i]);
            $file_extension = strtolower(pathinfo($original_name, PATHINFO_EXTENSION));

            $allowed_extensions = array("jpg", "jpeg", "png", "webp");

            if (!in_array($file_extension, $allowed_extensions)) {
                continue;
            }

            $new_file_name = "lost_" . $report_id . "_" . time() . "_" . $i . "." . $file_extension;
            $target_path = $upload_dir . $new_file_name;

            if (move_uploaded_file($image_tmp_names[$i], $target_path)) {
                $image_path = "uploads/lost_reports/" . $new_file_name;

                $img_stmt = $conn->prepare("
                    INSERT INTO lost_report_image
                    (report_id, image_path)
                    VALUES (?, ?)
                ");

                if (!$img_stmt) {
                    throw new Exception("Image prepare failed: " . $conn->error);
                }

                $img_stmt->bind_param("is", $report_id, $image_path);

                if (!$img_stmt->execute()) {
                    throw new Exception("Image insert failed: " . $img_stmt->error);
                }

                $uploaded_images[] = $image_path;
            }
        }
    }
    createNotification(
    $conn,
    $user_id,
    "Your lost report has been submitted and is waiting for admin approval.",
    "report_submitted",
    null
);

    $conn->commit();
    
    // Dispatch email notifications (non-blocking, failures won't break the response)
    sendLocationNotifications($conn, 'lost_item', $report_id, $nearest_town, $user_id, $title, $description);

    echo json_encode(array(
        "status" => "success",
        "message" => "Lost report submitted successfully",
        "report_id" => $report_id,
        "uploaded_images_count" => count($uploaded_images),
        "uploaded_images" => $uploaded_images,
        "files_received" => isset($_FILES["images"])
    ));
    exit();

} catch (Exception $e) {
    $conn->rollback();

    echo json_encode(array(
        "status" => "error",
        "message" => "Failed to submit lost report",
        "error" => $e->getMessage()
    ));
    exit();
}
?>