<?php
$origin = $_SERVER['HTTP_ORIGIN'] ?? ''; if ($origin === 'https://findora.freehosting.dev' || $origin === 'http://localhost:5173') { header('Access-Control-Allow-Origin: ' . $origin); } header('Access-Control-Allow-Headers: Content-Type'); header('Access-Control-Allow-Methods: GET, OPTIONS'); header('Content-Type: application/json');
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

include __DIR__ . "/../config/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    echo json_encode(array(
        "status" => "error",
        "message" => "Only GET method is allowed"
    ));
    exit();
}

$user_id = isset($_GET["user_id"]) ? intval($_GET["user_id"]) : 0;
$report_id = isset($_GET["report_id"]) ? intval($_GET["report_id"]) : 0;
$report_type = isset($_GET["report_type"]) ? trim($_GET["report_type"]) : "";

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
} else {
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