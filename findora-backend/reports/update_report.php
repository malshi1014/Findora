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

if ($data === null) {
    echo json_encode(array(
        "status" => "error",
        "message" => "Invalid JSON input"
    ));
    exit();
}

$user_id = isset($data["user_id"]) ? intval($data["user_id"]) : 0;
$report_id = isset($data["report_id"]) ? intval($data["report_id"]) : 0;
$report_type = isset($data["report_type"]) ? trim($data["report_type"]) : "";

$title = isset($data["title"]) ? trim($data["title"]) : "";
$category = isset($data["category"]) ? trim($data["category"]) : "";
$district = isset($data["district"]) ? trim($data["district"]) : "";
$location = isset($data["location"]) ? trim($data["location"]) : "";
$contact_no = isset($data["contact_no"]) ? trim($data["contact_no"]) : "";
$report_date = isset($data["report_date"]) ? trim($data["report_date"]) : "";
$report_time = isset($data["report_time"]) ? trim($data["report_time"]) : "";
$unique_identifiers = isset($data["unique_identifiers"]) ? trim($data["unique_identifiers"]) : "";
$description = isset($data["description"]) ? trim($data["description"]) : "";

$missing = array();

if ($user_id <= 0) $missing[] = "user_id";
if ($report_id <= 0) $missing[] = "report_id";
if (empty($report_type)) $missing[] = "report_type";
if (empty($title)) $missing[] = "title";
if (empty($category)) $missing[] = "category";
if (empty($district)) $missing[] = "district";
if (empty($location)) $missing[] = "location";
if (empty($contact_no)) $missing[] = "contact_no";
if (empty($report_date)) $missing[] = "report_date";
if (empty($description)) $missing[] = "description";

if (!empty($missing)) {
    echo json_encode(array(
        "status" => "error",
        "message" => "Please fill all required fields",
        "missing_fields" => $missing
    ));
    exit();
}

if ($report_type !== "lost" && $report_type !== "found") {
    echo json_encode(array(
        "status" => "error",
        "message" => "Invalid report type"
    ));
    exit();
}

if ($report_type === "lost") {
    $report_table = "lost_report";
    $date_column = "lost_date";
    $time_column = "lost_time";
} else {
    $report_table = "found_report";
    $date_column = "found_date";
    $time_column = "found_time";
}

try {
    $checkStmt = $conn->prepare("
        SELECT status
        FROM $report_table
        WHERE report_id = ? AND user_id = ?
        LIMIT 1
    ");

    if (!$checkStmt) {
        throw new Exception("Check prepare failed: " . $conn->error);
    }

    $checkStmt->bind_param("ii", $report_id, $user_id);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();

    if ($checkResult->num_rows === 0) {
        echo json_encode(array(
            "status" => "error",
            "message" => "Report not found or permission denied"
        ));
        exit();
    }

    $report = $checkResult->fetch_assoc();

    if ($report["status"] === "matched") {
        echo json_encode(array(
            "status" => "error",
            "message" => "Matched reports cannot be edited"
        ));
        exit();
    }

    $stmt = $conn->prepare("
        UPDATE $report_table
        SET 
            title = ?,
            category = ?,
            description = ?,
            district = ?,
            location = ?,
            $date_column = ?,
            $time_column = ?,
            unique_identifiers = ?,
            contact_no = ?,
            status = 'pending'
        WHERE report_id = ? AND user_id = ?
    ");

    if (!$stmt) {
        throw new Exception("Update prepare failed: " . $conn->error);
    }

    $stmt->bind_param(
        "sssssssssii",
        $title,
        $category,
        $description,
        $district,
        $location,
        $report_date,
        $report_time,
        $unique_identifiers,
        $contact_no,
        $report_id,
        $user_id
    );

    if (!$stmt->execute()) {
        throw new Exception("Update failed: " . $stmt->error);
    }

    echo json_encode(array(
        "status" => "success",
        "message" => "Report updated successfully"
    ));
    exit();

} catch (Exception $e) {
    echo json_encode(array(
        "status" => "error",
        "message" => "Failed to update report",
        "error" => $e->getMessage()
    ));
    exit();
}
?>