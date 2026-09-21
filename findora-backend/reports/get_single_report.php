<?php

header("Content-Type: application/json");

include __DIR__ . "/../config/db.php";

$data = array_merge($_GET, $_POST);

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

$valid_types = array("lost", "found", "missing_person", "missing_pet");

if ($user_id <= 0 || $report_id <= 0 || empty($report_type) || !in_array($report_type, $valid_types)) {
    echo json_encode(array(
        "status" => "error",
        "message" => "user_id, report_id and report_type are required",
        "received" => array(
            "user_id" => $user_id,
            "report_id" => $report_id,
            "report_type" => $report_type
        )
    ));
    exit();
}

if ($report_type === "lost") {
    $sql = "
        SELECT
            report_id,
            user_id,
            category,
            title,
            description,
            district,
            location,
            lost_date AS report_date,
            lost_time AS report_time,
            unique_identifiers,
            contact_no,
            status,
            created_at
        FROM lost_report
        WHERE report_id = ? AND user_id = ?
        LIMIT 1
    ";
    $image_table = "lost_report_image";
    $id_column = "report_id";
} else if ($report_type === "found") {
    $sql = "
        SELECT
            report_id,
            user_id,
            category,
            title,
            description,
            district,
            location,
            found_date AS report_date,
            found_time AS report_time,
            unique_identifiers,
            contact_no,
            status,
            created_at
        FROM found_report
        WHERE report_id = ? AND user_id = ?
        LIMIT 1
    ";
    $image_table = "found_report_image";
    $id_column = "report_id";
} else if ($report_type === "missing_person") {
    $sql = "
        SELECT
            person_post_id AS report_id,
            person_post_id,
            user_id,
            'Missing Person' AS category,
            full_name AS title,
            full_name,
            description,
            district,
            nearest_town AS location,
            nearest_town,
            last_seen_location,
            missing_date AS report_date,
            missing_date,
            missing_time AS report_time,
            missing_time,
            distinguishing_marks AS unique_identifiers,
            distinguishing_marks,
            guardian_contact_no AS contact_no,
            guardian_contact_no,
            age,
            gender,
            status,
            created_at
        FROM missing_person_post
        WHERE person_post_id = ? AND user_id = ?
        LIMIT 1
    ";
    $image_table = "missing_person_post_image";
    $id_column = "person_post_id";
} else if ($report_type === "missing_pet") {
    $sql = "
        SELECT
            pet_post_id AS report_id,
            pet_post_id,
            user_id,
            pet_category AS category,
            pet_category,
            pet_name AS title,
            pet_name,
            description,
            district,
            nearest_town AS location,
            nearest_town,
            last_seen_location,
            lost_date AS report_date,
            lost_date,
            lost_time AS report_time,
            lost_time,
            unique_identifiers,
            guardian_contact_no AS contact_no,
            guardian_contact_no,
            status,
            created_at
        FROM missing_pet_post
        WHERE pet_post_id = ? AND user_id = ?
        LIMIT 1
    ";
    $image_table = "missing_pet_post_image";
    $id_column = "pet_post_id";
}

try {
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("ii", $report_id, $user_id);

    if (!$stmt->execute()) {
        throw new Exception("Execute failed: " . $stmt->error);
    }

    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(array(
            "status" => "error",
            "message" => "Report not found"
        ));
        exit();
    }

    $report = $result->fetch_assoc();
    $report["report_type"] = $report_type;

    // Fetch images
    $images = array();
    $imgStmt = $conn->prepare("
        SELECT image_id, image_path, uploaded_at
        FROM $image_table
        WHERE $id_column = ?
        ORDER BY image_id ASC
    ");
    if ($imgStmt) {
        $imgStmt->bind_param("i", $report_id);
        $imgStmt->execute();
        $imgResult = $imgStmt->get_result();
        while ($img = $imgResult->fetch_assoc()) {
            $images[] = $img;
        }
    }
    $report["images"] = $images;

    echo json_encode(array(
        "status" => "success",
        "report" => $report
    ));
    exit();

} catch (Exception $e) {
    echo json_encode(array(
        "status" => "error",
        "message" => "Failed to load report",
        "error" => $e->getMessage()
    ));
    exit();
}
?>
