<?php
ob_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
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
include __DIR__ . "/../helpers/create_notification.php";

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
$rejection_reason = isset($data["rejection_reason"]) ? trim($data["rejection_reason"]) : "";

if (
    $admin_id <= 0 ||
    $report_id <= 0 ||
    empty($report_type) ||
    empty($new_status)
) {
    ob_clean();
    echo json_encode(array(
        "status" => "error",
        "message" => "admin_id, report_id, report_type and status are required"
    ));
    exit();
}

$allowed_report_types = array(
    "lost",
    "found",
    "suspicious",
    "missing_pet",
    "missing_person"
);

if (!in_array($report_type, $allowed_report_types, true)) {
    ob_clean();
    echo json_encode(array(
        "status" => "error",
        "message" => "Invalid report type"
    ));
    exit();
}

$allowed_statuses = array(
    "pending",
    "active",
    "rejected"
);

if (!in_array($new_status, $allowed_statuses, true)) {
    ob_clean();
    echo json_encode(array(
        "status" => "error",
        "message" => "Invalid status"
    ));
    exit();
}

function tableExists($conn, $tableName) {
    $safeTable = $conn->real_escape_string($tableName);
    $result = $conn->query("SHOW TABLES LIKE '$safeTable'");
    return $result && $result->num_rows > 0;
}

function columnExists($conn, $tableName, $columnName) {
    $safeTable = $conn->real_escape_string($tableName);
    $safeColumn = $conn->real_escape_string($columnName);
    $result = $conn->query("SHOW COLUMNS FROM `$safeTable` LIKE '$safeColumn'");
    return $result && $result->num_rows > 0;
}

function firstExistingColumn($conn, $tableName, $columns) {
    foreach ($columns as $column) {
        if (columnExists($conn, $tableName, $column)) {
            return $column;
        }
    }

    return null;
}

function getReportConfig($conn, $report_type) {
    if ($report_type === "lost") {
        return array(
            "table" => "lost_report",
            "id_column" => "report_id",
            "user_column" => "user_id",
            "title_column" => "title",
            "status_column" => "status",
            "label" => "lost item report",
            "protect_matched" => true
        );
    }

    if ($report_type === "found") {
        return array(
            "table" => "found_report",
            "id_column" => "report_id",
            "user_column" => "user_id",
            "title_column" => "title",
            "status_column" => "status",
            "label" => "found item report",
            "protect_matched" => true
        );
    }

    if ($report_type === "missing_pet") {
        return array(
            "table" => "missing_pet_post",
            "id_column" => "pet_post_id",
            "user_column" => "user_id",
            "title_column" => "pet_name",
            "status_column" => "status",
            "label" => "missing pet post",
            "protect_matched" => false
        );
    }

    if ($report_type === "missing_person") {
        return array(
            "table" => "missing_person_post",
            "id_column" => "person_post_id",
            "user_column" => "user_id",
            "title_column" => "full_name",
            "status_column" => "status",
            "label" => "missing person post",
            "protect_matched" => false
        );
    }

    if ($report_type === "suspicious") {
        $table = "suspicious_report";

        if (!tableExists($conn, $table)) {
            return null;
        }

        $idColumn = firstExistingColumn($conn, $table, array(
            "report_id",
            "suspicious_report_id",
            "suspicious_id",
            "id"
        ));

        $userColumn = firstExistingColumn($conn, $table, array(
            "user_id",
            "shop_owner_id"
        ));

        $titleColumn = firstExistingColumn($conn, $table, array(
            "title",
            "item_name",
            "name"
        ));

        $statusColumn = firstExistingColumn($conn, $table, array(
            "status"
        ));

        if (!$idColumn || !$userColumn || !$statusColumn) {
            return null;
        }

        return array(
            "table" => $table,
            "id_column" => $idColumn,
            "user_column" => $userColumn,
            "title_column" => $titleColumn,
            "status_column" => $statusColumn,
            "label" => "suspicious item report",
            "protect_matched" => false
        );
    }

    return null;
}

try {
    $adminStmt = $conn->prepare("
        SELECT user_id, role
        FROM users
        WHERE user_id = ?
          AND role = 'admin'
        LIMIT 1
    ");

    if (!$adminStmt) {
        throw new Exception("Admin check prepare failed: " . $conn->error);
    }

    $adminStmt->bind_param("i", $admin_id);

    if (!$adminStmt->execute()) {
        throw new Exception("Admin check failed: " . $adminStmt->error);
    }

    $adminResult = $adminStmt->get_result();

    if ($adminResult->num_rows === 0) {
        ob_clean();
        echo json_encode(array(
            "status" => "error",
            "message" => "Permission denied. Admin access required."
        ));
        exit();
    }

    $config = getReportConfig($conn, $report_type);

    if ($config === null) {
        ob_clean();
        echo json_encode(array(
            "status" => "error",
            "message" => "Report configuration not found for this report type"
        ));
        exit();
    }

    $report_table = $config["table"];
    $id_column = $config["id_column"];
    $user_column = $config["user_column"];
    $title_column = $config["title_column"];
    $status_column = $config["status_column"];
    $report_label = $config["label"];
    $protect_matched = $config["protect_matched"];

    if (!tableExists($conn, $report_table)) {
        ob_clean();
        echo json_encode(array(
            "status" => "error",
            "message" => "Report table does not exist: " . $report_table
        ));
        exit();
    }

    $titleSelect = $title_column
        ? "`$title_column` AS report_title"
        : "'Suspicious Item Report' AS report_title";

    $checkSql = "
        SELECT
            `$id_column` AS report_id,
            `$user_column` AS owner_user_id,
            $titleSelect,
            `$status_column` AS current_status
        FROM `$report_table`
        WHERE `$id_column` = ?
        LIMIT 1
    ";

    $checkStmt = $conn->prepare($checkSql);

    if (!$checkStmt) {
        throw new Exception("Report check prepare failed: " . $conn->error);
    }

    $checkStmt->bind_param("i", $report_id);

    if (!$checkStmt->execute()) {
        throw new Exception("Report check failed: " . $checkStmt->error);
    }

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

    $owner_user_id = intval($report["owner_user_id"]);
    $report_title = $report["report_title"];
    $current_status = $report["current_status"];

    if ($protect_matched && $current_status === "matched") {
        ob_clean();
        echo json_encode(array(
            "status" => "error",
            "message" => "Matched reports cannot be changed"
        ));
        exit();
    }

    if ($current_status === $new_status) {
        ob_clean();
        echo json_encode(array(
            "status" => "error",
            "message" => "The report already has this status"
        ));
        exit();
    }

    $conn->begin_transaction();

    $updateSql = "
        UPDATE `$report_table`
        SET `$status_column` = ?
        WHERE `$id_column` = ?
    ";

    $updateStmt = $conn->prepare($updateSql);

    if (!$updateStmt) {
        throw new Exception("Update prepare failed: " . $conn->error);
    }

    $updateStmt->bind_param("si", $new_status, $report_id);

    if (!$updateStmt->execute()) {
        throw new Exception("Update failed: " . $updateStmt->error);
    }

    if ($new_status === "active") {
        $notification_message =
            'Your ' .
            $report_label .
            ' "' .
            $report_title .
            '" has been approved by the admin.';

        createNotification(
            $conn,
            $owner_user_id,
            $notification_message,
            "report_approved",
            null
        );
    }

    if ($new_status === "rejected") {
        $notification_message =
            'Your ' .
            $report_label .
            ' "' .
            $report_title .
            '" has been rejected by the admin.';

        if (!empty($rejection_reason)) {
            $notification_message .= " Reason: " . $rejection_reason;
        }

        createNotification(
            $conn,
            $owner_user_id,
            $notification_message,
            "report_rejected",
            null
        );
    }

    $action =
        "Updated " .
        $report_label .
        " #" .
        $report_id .
        " status to " .
        $new_status;

    $logStmt = $conn->prepare("
        INSERT INTO admin_log
        (admin_id, action)
        VALUES (?, ?)
    ");

    if ($logStmt) {
        $logStmt->bind_param("is", $admin_id, $action);
        $logStmt->execute();
    }

    $conn->commit();

    ob_clean();
    echo json_encode(array(
        "status" => "success",
        "message" => "Report status updated successfully"
    ));
    exit();

} catch (Exception $e) {
    if (isset($conn) && $conn->errno === 0 && $conn->in_transaction) {
        $conn->rollback();
    }

    ob_clean();
    echo json_encode(array(
        "status" => "error",
        "message" => "Failed to update report status",
        "error" => $e->getMessage()
    ));
    exit();
}
?>