<?php
ob_start();

header("Access-Control-Allow-Origin: https://findora.freehosting.dev");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    ob_clean();
    echo json_encode(array(
        "status" => "success",
        "message" => "Preflight OK"
    ));
    exit();
}

include __DIR__ . "/../config/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    ob_clean();
    echo json_encode(array(
        "status" => "error",
        "message" => "Only POST method is allowed"
    ));
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if ($data === null) {
    ob_clean();
    echo json_encode(array(
        "status" => "error",
        "message" => "Invalid JSON input"
    ));
    exit();
}

$admin_id = isset($data["admin_id"]) ? intval($data["admin_id"]) : 0;
$report_id = isset($data["report_id"]) ? intval($data["report_id"]) : 0;
$report_type = isset($data["report_type"]) ? trim($data["report_type"]) : "";
$new_status = isset($data["status"]) ? trim($data["status"]) : "";

if ($admin_id <= 0 || $report_id <= 0 || empty($report_type) || empty($new_status)) {
    ob_clean();
    echo json_encode(array(
        "status" => "error",
        "message" => "admin_id, report_id, report_type and status are required"
    ));
    exit();
}

if ($report_type !== "lost" && $report_type !== "found") {
    ob_clean();
    echo json_encode(array(
        "status" => "error",
        "message" => "Invalid report type"
    ));
    exit();
}

$allowed_statuses = array("pending", "active", "rejected");

if (!in_array($new_status, $allowed_statuses)) {
    ob_clean();
    echo json_encode(array(
        "status" => "error",
        "message" => "Invalid status"
    ));
    exit();
}

$report_table = $report_type === "lost" ? "lost_report" : "found_report";

try {
    $adminStmt = $conn->prepare("
        SELECT user_id, role 
        FROM users 
        WHERE user_id = ? AND role = 'admin'
        LIMIT 1
    ");

    if (!$adminStmt) {
        throw new Exception("Admin check prepare failed: " . $conn->error);
    }

    $adminStmt->bind_param("i", $admin_id);
    $adminStmt->execute();
    $adminResult = $adminStmt->get_result();

    if ($adminResult->num_rows === 0) {
        ob_clean();
        echo json_encode(array(
            "status" => "error",
            "message" => "Permission denied. Admin access required."
        ));
        exit();
    }

    $checkStmt = $conn->prepare("
        SELECT report_id, status 
        FROM $report_table
        WHERE report_id = ?
        LIMIT 1
    ");

    if (!$checkStmt) {
        throw new Exception("Report check prepare failed: " . $conn->error);
    }

    $checkStmt->bind_param("i", $report_id);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();

    if ($checkResult->num_rows === 0) {
        ob_clean();
        echo json_encode(array(
            "status" => "error",
            "message" => "Report not found"
        ));
        exit();
    }

    $report = $checkResult->fetch_assoc();

    if ($report["status"] === "matched") {
        ob_clean();
        echo json_encode(array(
            "status" => "error",
            "message" => "Matched reports cannot be changed"
        ));
        exit();
    }

    $updateStmt = $conn->prepare("
        UPDATE $report_table
        SET status = ?
        WHERE report_id = ?
    ");

    if (!$updateStmt) {
        throw new Exception("Update prepare failed: " . $conn->error);
    }

    $updateStmt->bind_param("si", $new_status, $report_id);

    if (!$updateStmt->execute()) {
        throw new Exception("Update failed: " . $updateStmt->error);
    }

    $action = "Updated " . $report_type . " report #" . $report_id . " status to " . $new_status;

    $logStmt = $conn->prepare("
        INSERT INTO admin_log
        (admin_id, action)
        VALUES (?, ?)
    ");

    if ($logStmt) {
        $logStmt->bind_param("is", $admin_id, $action);
        $logStmt->execute();
    }

    ob_clean();
    echo json_encode(array(
        "status" => "success",
        "message" => "Report status updated successfully"
    ));
    exit();

} catch (Exception $e) {
    ob_clean();
    echo json_encode(array(
        "status" => "error",
        "message" => "Failed to update report status",
        "error" => $e->getMessage()
    ));
    exit();
}
?>