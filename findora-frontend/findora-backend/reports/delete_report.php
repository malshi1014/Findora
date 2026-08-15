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

$user_id = isset($data["user_id"]) ? intval($data["user_id"]) : 0;
$report_id = isset($data["report_id"]) ? intval($data["report_id"]) : 0;
$report_type = isset($data["report_type"]) ? trim($data["report_type"]) : "";

if ($user_id <= 0 || $report_id <= 0 || empty($report_type)) {
    echo json_encode(array(
        "status" => "error",
        "message" => "user_id, report_id and report_type are required"
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
    $image_table = "lost_report_image";
    $upload_folder = "uploads/lost_reports/";
    $match_column = "lost_report_id";
} else {
    $report_table = "found_report";
    $image_table = "found_report_image";
    $upload_folder = "uploads/found_reports/";
    $match_column = "found_report_id";
}

$conn->begin_transaction();

try {
    // Check ownership and status
    $checkStmt = $conn->prepare("
        SELECT report_id, status
        FROM $report_table
        WHERE report_id = ? AND user_id = ?
        LIMIT 1
    ");

    $checkStmt->bind_param("ii", $report_id, $user_id);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();

    if ($checkResult->num_rows === 0) {
        echo json_encode(array(
            "status" => "error",
            "message" => "Report not found or you do not have permission to delete it"
        ));
        exit();
    }

    $report = $checkResult->fetch_assoc();

    if ($report["status"] === "matched") {
        echo json_encode(array(
            "status" => "error",
            "message" => "Matched reports cannot be deleted"
        ));
        exit();
    }

    // Get images before deleting
    $imageStmt = $conn->prepare("
        SELECT image_path
        FROM $image_table
        WHERE report_id = ?
    ");

    $imageStmt->bind_param("i", $report_id);
    $imageStmt->execute();
    $imageResult = $imageStmt->get_result();

    $imagePaths = array();

    while ($img = $imageResult->fetch_assoc()) {
        $imagePaths[] = $img["image_path"];
    }

    // Delete related pending/rejected matches
    $deleteMatchStmt = $conn->prepare("
        DELETE FROM matches
        WHERE $match_column = ? AND status != 'verified'
    ");

    $deleteMatchStmt->bind_param("i", $report_id);
    $deleteMatchStmt->execute();

    // Delete image records
    $deleteImagesStmt = $conn->prepare("
        DELETE FROM $image_table
        WHERE report_id = ?
    ");

    $deleteImagesStmt->bind_param("i", $report_id);
    $deleteImagesStmt->execute();

    // Delete report
    $deleteReportStmt = $conn->prepare("
        DELETE FROM $report_table
        WHERE report_id = ? AND user_id = ?
    ");

    $deleteReportStmt->bind_param("ii", $report_id, $user_id);
    $deleteReportStmt->execute();

    // Delete actual image files from uploads folder
    foreach ($imagePaths as $imagePath) {
        $fullPath = __DIR__ . "/../" . $imagePath;

        if (file_exists($fullPath)) {
            unlink($fullPath);
        }
    }

    $conn->commit();

    echo json_encode(array(
        "status" => "success",
        "message" => "Report deleted successfully"
    ));

} catch (Exception $e) {
    $conn->rollback();

    echo json_encode(array(
        "status" => "error",
        "message" => "Failed to delete report",
        "error" => $e->getMessage()
    ));
}
?>