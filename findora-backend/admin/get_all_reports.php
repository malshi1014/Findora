<?php
ob_start();

header("Access-Control-Allow-Origin: https://findora.freehosting.dev");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
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

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    ob_clean();
    echo json_encode(array(
        "status" => "error",
        "message" => "Only GET method is allowed"
    ));
    exit();
}

$admin_id = isset($_GET["admin_id"]) ? intval($_GET["admin_id"]) : 0;
$filter_status = isset($_GET["status"]) ? trim($_GET["status"]) : "all";

if ($admin_id <= 0) {
    ob_clean();
    echo json_encode(array(
        "status" => "error",
        "message" => "admin_id is required"
    ));
    exit();
}

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

    $statusConditionLost = "";
    $statusConditionFound = "";

    if ($filter_status !== "all") {
        $safe_status = $conn->real_escape_string($filter_status);
        $statusConditionLost = " AND l.status = '$safe_status' ";
        $statusConditionFound = " AND f.status = '$safe_status' ";
    }

    $lostSql = "
        SELECT 
            l.report_id,
            'lost' AS report_type,
            l.user_id,
            CONCAT(u.first_name, ' ', u.last_name) AS user_name,
            u.email AS user_email,
            u.mobile AS user_mobile,
            l.category,
            l.title,
            l.description,
            l.district,
            l.location,
            l.lost_date AS report_date,
            l.lost_time AS report_time,
            l.unique_identifiers,
            l.contact_no,
            l.status,
            l.created_at,
            (
                SELECT image_path 
                FROM lost_report_image 
                WHERE report_id = l.report_id 
                LIMIT 1
            ) AS image_path
        FROM lost_report l
        INNER JOIN users u ON l.user_id = u.user_id
        WHERE 1=1
        $statusConditionLost
        ORDER BY l.created_at DESC
    ";

    $foundSql = "
        SELECT 
            f.report_id,
            'found' AS report_type,
            f.user_id,
            CONCAT(u.first_name, ' ', u.last_name) AS user_name,
            u.email AS user_email,
            u.mobile AS user_mobile,
            f.category,
            f.title,
            f.description,
            f.district,
            f.location,
            f.found_date AS report_date,
            f.found_time AS report_time,
            f.unique_identifiers,
            f.contact_no,
            f.status,
            f.created_at,
            (
                SELECT image_path 
                FROM found_report_image 
                WHERE report_id = f.report_id 
                LIMIT 1
            ) AS image_path
        FROM found_report f
        INNER JOIN users u ON f.user_id = u.user_id
        WHERE 1=1
        $statusConditionFound
        ORDER BY f.created_at DESC
    ";

    $lostResult = $conn->query($lostSql);

    if (!$lostResult) {
        throw new Exception("Lost report query failed: " . $conn->error);
    }

    $foundResult = $conn->query($foundSql);

    if (!$foundResult) {
        throw new Exception("Found report query failed: " . $conn->error);
    }

    $reports = array();

    while ($row = $lostResult->fetch_assoc()) {
        $reports[] = $row;
    }

    while ($row = $foundResult->fetch_assoc()) {
        $reports[] = $row;
    }

    usort($reports, function ($a, $b) {
        return strtotime($b["created_at"]) - strtotime($a["created_at"]);
    });

    ob_clean();
    echo json_encode(array(
        "status" => "success",
        "reports" => $reports
    ));
    exit();

} catch (Exception $e) {
    ob_clean();
    echo json_encode(array(
        "status" => "error",
        "message" => "Failed to load reports",
        "error" => $e->getMessage()
    ));
    exit();
}
?>