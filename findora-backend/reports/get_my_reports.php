<?php
header("Access-Control-Allow-Origin: https://findora.freehosting.dev");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

include __DIR__ . "/../config/db.php";

$user_id = isset($_GET["user_id"]) ? intval($_GET["user_id"]) : 0;

if ($user_id <= 0) {
    echo json_encode(array(
        "status" => "error",
        "message" => "user_id is required"
    ));
    exit();
}

try {
    $lostReports = array();
    $foundReports = array();

    // Get lost reports
    $lostStmt = $conn->prepare("
        SELECT 
            report_id,
            user_id,
            category,
            title,
            description,
            district,
            location,
            lost_date,
            lost_time,
            unique_identifiers,
            contact_no,
            status,
            created_at
        FROM lost_report
        WHERE user_id = ?
        ORDER BY created_at DESC
    ");

    $lostStmt->bind_param("i", $user_id);
    $lostStmt->execute();
    $lostResult = $lostStmt->get_result();

    while ($row = $lostResult->fetch_assoc()) {
        $imageStmt = $conn->prepare("
            SELECT image_id, image_path, uploaded_at
            FROM lost_report_image
            WHERE report_id = ?
        ");

        $imageStmt->bind_param("i", $row["report_id"]);
        $imageStmt->execute();
        $imageResult = $imageStmt->get_result();

        $images = array();

        while ($img = $imageResult->fetch_assoc()) {
            $images[] = $img;
        }

        $row["report_type"] = "lost";
        $row["images"] = $images;

        $lostReports[] = $row;
    }

    // Get found reports
    $foundStmt = $conn->prepare("
        SELECT 
            report_id,
            user_id,
            category,
            title,
            description,
            district,
            location,
            found_date,
            found_time,
            unique_identifiers,
            contact_no,
            status,
            created_at
        FROM found_report
        WHERE user_id = ?
        ORDER BY created_at DESC
    ");

    $foundStmt->bind_param("i", $user_id);
    $foundStmt->execute();
    $foundResult = $foundStmt->get_result();

    while ($row = $foundResult->fetch_assoc()) {
        $imageStmt = $conn->prepare("
            SELECT image_id, image_path, uploaded_at
            FROM found_report_image
            WHERE report_id = ?
        ");

        $imageStmt->bind_param("i", $row["report_id"]);
        $imageStmt->execute();
        $imageResult = $imageStmt->get_result();

        $images = array();

        while ($img = $imageResult->fetch_assoc()) {
            $images[] = $img;
        }

        $row["report_type"] = "found";
        $row["images"] = $images;

        $foundReports[] = $row;
    }

    echo json_encode(array(
        "status" => "success",
        "lost_reports_count" => count($lostReports),
        "found_reports_count" => count($foundReports),
        "lost_reports" => $lostReports,
        "found_reports" => $foundReports
    ));

} catch (Exception $e) {
    echo json_encode(array(
        "status" => "error",
        "message" => "Failed to load reports",
        "error" => $e->getMessage()
    ));
}
?>