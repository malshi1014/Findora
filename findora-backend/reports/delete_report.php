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
    $data = array_merge($_GET, $_POST);
} else if (!empty($_POST) || !empty($_GET)) {
    $data = array_merge($_GET, $_POST, $data);
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

if ($report_type === "missing_person_post") $report_type = "missing_person";
if ($report_type === "missing_pet_post") $report_type = "missing_pet";
if ($report_type === "lost_report") $report_type = "lost";
if ($report_type === "found_report") $report_type = "found";

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
    $report_table = "lost_report";
    $id_column = "report_id";
    $image_table = "lost_report_image";
    $match_column = "lost_report_id";
} else if ($report_type === "found") {
    $report_table = "found_report";
    $id_column = "report_id";
    $image_table = "found_report_image";
    $match_column = "found_report_id";
} else if ($report_type === "missing_person") {
    $report_table = "missing_person_post";
    $id_column = "person_post_id";
    $image_table = "missing_person_post_image";
    $match_column = "";
} else if ($report_type === "missing_pet") {
    $report_table = "missing_pet_post";
    $id_column = "pet_post_id";
    $image_table = "missing_pet_post_image";
    $match_column = "";
}

$conn->begin_transaction();

try {
    // Check ownership and status
    $checkStmt = $conn->prepare("
        SELECT $id_column AS report_id, status
        FROM $report_table
        WHERE $id_column = ? AND user_id = ?
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
        WHERE $id_column = ?
    ");

    $imageStmt->bind_param("i", $report_id);
    $imageStmt->execute();
    $imageResult = $imageStmt->get_result();

    $imagePaths = array();

    while ($img = $imageResult->fetch_assoc()) {
        $imagePaths[] = $img["image_path"];
    }

    // Delete related pending/rejected matches if applicable
    if (!empty($match_column)) {
        $deleteMatchStmt = $conn->prepare("
            DELETE FROM matches
            WHERE $match_column = ? AND status != 'verified'
        ");
        $deleteMatchStmt->bind_param("i", $report_id);
        $deleteMatchStmt->execute();
    }

    // Delete image records
    $deleteImagesStmt = $conn->prepare("
        DELETE FROM $image_table
        WHERE $id_column = ?
    ");

    $deleteImagesStmt->bind_param("i", $report_id);
    $deleteImagesStmt->execute();

    // Delete report
    $deleteReportStmt = $conn->prepare("
        DELETE FROM $report_table
        WHERE $id_column = ? AND user_id = ?
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
