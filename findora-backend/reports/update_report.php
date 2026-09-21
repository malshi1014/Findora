<?php

header("Content-Type: application/json");

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

if (!is_array($data)) {
    $data = $_POST;
} else if (!empty($_POST)) {
    $data = array_merge($data, $_POST);
}

$user_id = 0;
if (isset($data["user_id"])) $user_id = intval($data["user_id"]);
else if (isset($data["userId"])) $user_id = intval($data["userId"]);

$report_id = 0;
if (isset($data["report_id"])) $report_id = intval($data["report_id"]);
else if (isset($data["person_post_id"])) $report_id = intval($data["person_post_id"]);
else if (isset($data["pet_post_id"])) $report_id = intval($data["pet_post_id"]);
else if (isset($data["post_id"])) $report_id = intval($data["post_id"]);
else if (isset($data["id"])) $report_id = intval($data["id"]);
else if (isset($data["reportId"])) $report_id = intval($data["reportId"]);

$report_type = "";
if (isset($data["report_type"])) $report_type = trim($data["report_type"]);
else if (isset($data["type"])) $report_type = trim($data["type"]);
else if (isset($data["post_type"])) $report_type = trim($data["post_type"]);
else if (isset($data["reportType"])) $report_type = trim($data["reportType"]);

if ($report_type === "missing_person_post" || $report_type === "missing-person" || $report_type === "person") $report_type = "missing_person";
if ($report_type === "missing_pet_post" || $report_type === "missing-pet" || $report_type === "pet") $report_type = "missing_pet";
if ($report_type === "lost_report" || $report_type === "lost-report") $report_type = "lost";
if ($report_type === "found_report" || $report_type === "found-report") $report_type = "found";

$title = "";
if (isset($data["title"])) $title = trim($data["title"]);
else if (isset($data["full_name"])) $title = trim($data["full_name"]);
else if (isset($data["pet_name"])) $title = trim($data["pet_name"]);
else if (isset($data["name"])) $title = trim($data["name"]);

$category = "";
if (isset($data["category"])) $category = trim($data["category"]);
else if (isset($data["pet_category"])) $category = trim($data["pet_category"]);
if (empty($category) && $report_type === "missing_person") $category = "Missing Person";

$district = isset($data["district"]) ? trim($data["district"]) : "";

$location = "";
if (isset($data["location"])) $location = trim($data["location"]);
else if (isset($data["nearest_town"])) $location = trim($data["nearest_town"]);
else if (isset($data["last_seen_location"])) $location = trim($data["last_seen_location"]);

$last_seen_location = isset($data["last_seen_location"]) && !empty($data["last_seen_location"]) ? trim($data["last_seen_location"]) : $location;

$contact_no = "";
if (isset($data["contact_no"])) $contact_no = trim($data["contact_no"]);
else if (isset($data["guardian_contact_no"])) $contact_no = trim($data["guardian_contact_no"]);
else if (isset($data["phone"])) $contact_no = trim($data["phone"]);
else if (isset($data["contact"])) $contact_no = trim($data["contact"]);

$report_date = "";
if (isset($data["report_date"])) $report_date = trim($data["report_date"]);
else if (isset($data["missing_date"])) $report_date = trim($data["missing_date"]);
else if (isset($data["lost_date"])) $report_date = trim($data["lost_date"]);
else if (isset($data["found_date"])) $report_date = trim($data["found_date"]);
else if (isset($data["date"])) $report_date = trim($data["date"]);

$report_time = "";
if (isset($data["report_time"])) $report_time = trim($data["report_time"]);
else if (isset($data["missing_time"])) $report_time = trim($data["missing_time"]);
else if (isset($data["lost_time"])) $report_time = trim($data["lost_time"]);
else if (isset($data["found_time"])) $report_time = trim($data["found_time"]);
else if (isset($data["time"])) $report_time = trim($data["time"]);

$unique_identifiers = "";
if (isset($data["unique_identifiers"])) $unique_identifiers = trim($data["unique_identifiers"]);
else if (isset($data["distinguishing_marks"])) $unique_identifiers = trim($data["distinguishing_marks"]);

$description = isset($data["description"]) ? trim($data["description"]) : (isset($data["details"]) ? trim($data["details"]) : "");

$age = isset($data["age"]) && $data["age"] !== "" ? intval($data["age"]) : null;
$gender = isset($data["gender"]) ? trim($data["gender"]) : "";

$valid_types = array("lost", "found", "missing_person", "missing_pet");

if ($user_id <= 0 || $report_id <= 0 || empty($report_type) || !in_array($report_type, $valid_types)) {
    echo json_encode(array(
        "status" => "error",
        "message" => "Valid user_id, report_id and report_type are required",
        "received" => array(
            "user_id" => $user_id,
            "report_id" => $report_id,
            "report_type" => $report_type
        )
    ));
    exit();
}

try {
    if ($report_type === "lost") {
        $checkStmt = $conn->prepare("SELECT * FROM lost_report WHERE report_id = ? AND user_id = ? LIMIT 1");
        $checkStmt->bind_param("ii", $report_id, $user_id);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();

        if ($checkResult->num_rows === 0) {
            echo json_encode(array("status" => "error", "message" => "Report not found or permission denied"));
            exit();
        }

        $report = $checkResult->fetch_assoc();
        if ($report["status"] !== "pending") {
            echo json_encode(array("status" => "error", "message" => "Only pending reports can be edited"));
            exit();
        }

        if (empty($title)) $title = $report["title"];
        if (empty($category)) $category = $report["category"];
        if (empty($description)) $description = $report["description"];
        if (empty($district)) $district = $report["district"];
        if (empty($location)) $location = $report["location"];
        if (empty($report_date)) $report_date = $report["lost_date"];
        if (empty($report_time)) $report_time = $report["lost_time"];
        if (empty($unique_identifiers)) $unique_identifiers = $report["unique_identifiers"];
        if (empty($contact_no)) $contact_no = $report["contact_no"];

        $stmt = $conn->prepare("
            UPDATE lost_report
            SET title = ?, category = ?, description = ?, district = ?, location = ?, lost_date = ?, lost_time = ?, unique_identifiers = ?, contact_no = ?, status = 'pending'
            WHERE report_id = ? AND user_id = ?
        ");
        $stmt->bind_param("sssssssssii", $title, $category, $description, $district, $location, $report_date, $report_time, $unique_identifiers, $contact_no, $report_id, $user_id);
        $stmt->execute();

    } else if ($report_type === "found") {
        $checkStmt = $conn->prepare("SELECT * FROM found_report WHERE report_id = ? AND user_id = ? LIMIT 1");
        $checkStmt->bind_param("ii", $report_id, $user_id);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();

        if ($checkResult->num_rows === 0) {
            echo json_encode(array("status" => "error", "message" => "Report not found or permission denied"));
            exit();
        }

        $report = $checkResult->fetch_assoc();
        if ($report["status"] !== "pending") {
            echo json_encode(array("status" => "error", "message" => "Only pending reports can be edited"));
            exit();
        }

        if (empty($title)) $title = $report["title"];
        if (empty($category)) $category = $report["category"];
        if (empty($description)) $description = $report["description"];
        if (empty($district)) $district = $report["district"];
        if (empty($location)) $location = $report["location"];
        if (empty($report_date)) $report_date = $report["found_date"];
        if (empty($report_time)) $report_time = $report["found_time"];
        if (empty($unique_identifiers)) $unique_identifiers = $report["unique_identifiers"];
        if (empty($contact_no)) $contact_no = $report["contact_no"];

        $stmt = $conn->prepare("
            UPDATE found_report
            SET title = ?, category = ?, description = ?, district = ?, location = ?, found_date = ?, found_time = ?, unique_identifiers = ?, contact_no = ?, status = 'pending'
            WHERE report_id = ? AND user_id = ?
        ");
        $stmt->bind_param("sssssssssii", $title, $category, $description, $district, $location, $report_date, $report_time, $unique_identifiers, $contact_no, $report_id, $user_id);
        $stmt->execute();

    } else if ($report_type === "missing_person") {
        $checkStmt = $conn->prepare("SELECT * FROM missing_person_post WHERE person_post_id = ? AND user_id = ? LIMIT 1");
        $checkStmt->bind_param("ii", $report_id, $user_id);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();

        if ($checkResult->num_rows === 0) {
            echo json_encode(array("status" => "error", "message" => "Report not found or permission denied"));
            exit();
        }

        $report = $checkResult->fetch_assoc();
        if ($report["status"] !== "pending") {
            echo json_encode(array("status" => "error", "message" => "Only pending reports can be edited"));
            exit();
        }

        if (empty($title)) $title = $report["full_name"];
        if ($age === null && isset($report["age"])) $age = $report["age"];
        if (empty($gender)) $gender = $report["gender"];
        if (empty($description)) $description = $report["description"];
        if (empty($unique_identifiers)) $unique_identifiers = $report["distinguishing_marks"];
        if (empty($report_date)) $report_date = $report["missing_date"];
        if (empty($report_time)) $report_time = $report["missing_time"];
        if (empty($district)) $district = $report["district"];
        if (empty($location)) $location = $report["nearest_town"];
        if (empty($last_seen_location)) $last_seen_location = $report["last_seen_location"];
        if (empty($contact_no)) $contact_no = $report["guardian_contact_no"];

        $stmt = $conn->prepare("
            UPDATE missing_person_post
            SET full_name = ?, age = ?, gender = ?, description = ?, distinguishing_marks = ?, missing_date = ?, missing_time = ?, district = ?, nearest_town = ?, last_seen_location = ?, guardian_contact_no = ?, status = 'pending'
            WHERE person_post_id = ? AND user_id = ?
        ");
        $stmt->bind_param("sisssssssssii", $title, $age, $gender, $description, $unique_identifiers, $report_date, $report_time, $district, $location, $last_seen_location, $contact_no, $report_id, $user_id);
        $stmt->execute();

    } else if ($report_type === "missing_pet") {
        $checkStmt = $conn->prepare("SELECT * FROM missing_pet_post WHERE pet_post_id = ? AND user_id = ? LIMIT 1");
        $checkStmt->bind_param("ii", $report_id, $user_id);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();

        if ($checkResult->num_rows === 0) {
            echo json_encode(array("status" => "error", "message" => "Report not found or permission denied"));
            exit();
        }

        $report = $checkResult->fetch_assoc();
        if ($report["status"] !== "pending") {
            echo json_encode(array("status" => "error", "message" => "Only pending reports can be edited"));
            exit();
        }

        if (empty($title)) $title = $report["pet_name"];
        if (empty($category)) $category = $report["pet_category"];
        if (empty($description)) $description = $report["description"];
        if (empty($unique_identifiers)) $unique_identifiers = $report["unique_identifiers"];
        if (empty($report_date)) $report_date = $report["lost_date"];
        if (empty($report_time)) $report_time = $report["lost_time"];
        if (empty($district)) $district = $report["district"];
        if (empty($location)) $location = $report["nearest_town"];
        if (empty($last_seen_location)) $last_seen_location = $report["last_seen_location"];
        if (empty($contact_no)) $contact_no = $report["guardian_contact_no"];

        $stmt = $conn->prepare("
            UPDATE missing_pet_post
            SET pet_name = ?, pet_category = ?, description = ?, unique_identifiers = ?, lost_date = ?, lost_time = ?, district = ?, nearest_town = ?, last_seen_location = ?, guardian_contact_no = ?, status = 'pending'
            WHERE pet_post_id = ? AND user_id = ?
        ");
        $stmt->bind_param("ssssssssssii", $title, $category, $description, $unique_identifiers, $report_date, $report_time, $district, $location, $last_seen_location, $contact_no, $report_id, $user_id);
        $stmt->execute();
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
