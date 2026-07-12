<?php
ob_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
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

    $safe_status = $conn->real_escape_string($filter_status);

    $statusConditionLost = "";
    $statusConditionFound = "";
    $statusConditionSuspicious = "";
    $statusConditionPet = "";
    $statusConditionPerson = "";

    if ($filter_status !== "all") {
        $statusConditionLost = " AND l.status = '$safe_status' ";
        $statusConditionFound = " AND f.status = '$safe_status' ";
        $statusConditionSuspicious = " AND s.status = '$safe_status' ";
        $statusConditionPet = " AND p.status = '$safe_status' ";
        $statusConditionPerson = " AND mp.status = '$safe_status' ";
    }

    $reports = array();

    /*
    LOST REPORTS
    */
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
            NULL AS nearest_town,
            l.location,
            l.lost_date AS report_date,
            l.lost_time AS report_time,
            l.unique_identifiers,
            l.contact_no,
            l.status,
            l.created_at,
            NULL AS age,
            NULL AS gender,
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
    ";

    $lostResult = $conn->query($lostSql);

    if (!$lostResult) {
        throw new Exception("Lost report query failed: " . $conn->error);
    }

    while ($row = $lostResult->fetch_assoc()) {
        $reports[] = $row;
    }

    /*
    FOUND REPORTS
    */
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
            NULL AS nearest_town,
            f.location,
            f.found_date AS report_date,
            f.found_time AS report_time,
            f.unique_identifiers,
            f.contact_no,
            f.status,
            f.created_at,
            NULL AS age,
            NULL AS gender,
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
    ";

    $foundResult = $conn->query($foundSql);

    if (!$foundResult) {
        throw new Exception("Found report query failed: " . $conn->error);
    }

    while ($row = $foundResult->fetch_assoc()) {
        $reports[] = $row;
    }

    /*
    SUSPICIOUS REPORTS
    This part is made flexible because suspicious_report column names can differ.
    */
    if (tableExists($conn, "suspicious_report")) {
        $suspiciousIdColumn = firstExistingColumn($conn, "suspicious_report", array(
            "report_id",
            "suspicious_report_id",
            "suspicious_id",
            "id"
        ));

        $suspiciousUserColumn = firstExistingColumn($conn, "suspicious_report", array(
            "user_id",
            "shop_owner_id"
        ));

        $titleColumn = firstExistingColumn($conn, "suspicious_report", array(
            "title",
            "item_name",
            "name"
        ));

        $categoryColumn = firstExistingColumn($conn, "suspicious_report", array(
            "category",
            "item_category"
        ));

        $descriptionColumn = firstExistingColumn($conn, "suspicious_report", array(
            "description",
            "details"
        ));

        $districtColumn = firstExistingColumn($conn, "suspicious_report", array(
            "district"
        ));

        $nearestTownColumn = firstExistingColumn($conn, "suspicious_report", array(
            "nearest_town"
        ));

        $locationColumn = firstExistingColumn($conn, "suspicious_report", array(
            "location",
            "last_seen_location",
            "context"
        ));

        $dateColumn = firstExistingColumn($conn, "suspicious_report", array(
            "report_date",
            "suspicious_date",
            "created_at"
        ));

        $timeColumn = firstExistingColumn($conn, "suspicious_report", array(
            "report_time",
            "suspicious_time"
        ));

        $identifierColumn = firstExistingColumn($conn, "suspicious_report", array(
            "unique_identifiers",
            "identifiers",
            "imei",
            "serial_no"
        ));

        $contactColumn = firstExistingColumn($conn, "suspicious_report", array(
            "contact_no",
            "contact",
            "contact_info"
        ));

        $statusColumn = firstExistingColumn($conn, "suspicious_report", array(
            "status"
        ));

        $createdAtColumn = firstExistingColumn($conn, "suspicious_report", array(
            "created_at"
        ));

        if ($suspiciousIdColumn && $suspiciousUserColumn) {
            $titleSelect = $titleColumn ? "s.`$titleColumn`" : "'Suspicious Item'";
            $categorySelect = $categoryColumn ? "s.`$categoryColumn`" : "'Suspicious Item'";
            $descriptionSelect = $descriptionColumn ? "s.`$descriptionColumn`" : "''";
            $districtSelect = $districtColumn ? "s.`$districtColumn`" : "NULL";
            $nearestTownSelect = $nearestTownColumn ? "s.`$nearestTownColumn`" : "NULL";
            $locationSelect = $locationColumn ? "s.`$locationColumn`" : "''";

            if ($dateColumn === "created_at") {
                $dateSelect = "DATE(s.created_at)";
            } elseif ($dateColumn) {
                $dateSelect = "s.`$dateColumn`";
            } else {
                $dateSelect = "NULL";
            }

            $timeSelect = $timeColumn ? "s.`$timeColumn`" : "NULL";
            $identifierSelect = $identifierColumn ? "s.`$identifierColumn`" : "NULL";
            $contactSelect = $contactColumn ? "s.`$contactColumn`" : "NULL";
            $statusSelect = $statusColumn ? "s.`$statusColumn`" : "'pending'";
            $createdAtSelect = $createdAtColumn ? "s.`$createdAtColumn`" : "NOW()";

            $suspiciousImageSelect = "NULL AS image_path";

            if (tableExists($conn, "suspicious_report_image")) {
                $imageFkColumn = firstExistingColumn($conn, "suspicious_report_image", array(
                    $suspiciousIdColumn,
                    "report_id",
                    "suspicious_report_id",
                    "suspicious_id"
                ));

                if ($imageFkColumn) {
                    $suspiciousImageSelect = "
                        (
                            SELECT image_path 
                            FROM suspicious_report_image 
                            WHERE `$imageFkColumn` = s.`$suspiciousIdColumn`
                            LIMIT 1
                        ) AS image_path
                    ";
                }
            }

            $suspiciousSql = "
                SELECT
                    s.`$suspiciousIdColumn` AS report_id,
                    'suspicious' AS report_type,
                    s.`$suspiciousUserColumn` AS user_id,
                    CONCAT(u.first_name, ' ', u.last_name) AS user_name,
                    u.email AS user_email,
                    u.mobile AS user_mobile,
                    $categorySelect AS category,
                    $titleSelect AS title,
                    $descriptionSelect AS description,
                    $districtSelect AS district,
                    $nearestTownSelect AS nearest_town,
                    $locationSelect AS location,
                    $dateSelect AS report_date,
                    $timeSelect AS report_time,
                    $identifierSelect AS unique_identifiers,
                    $contactSelect AS contact_no,
                    $statusSelect AS status,
                    $createdAtSelect AS created_at,
                    NULL AS age,
                    NULL AS gender,
                    $suspiciousImageSelect
                FROM suspicious_report s
                INNER JOIN users u ON s.`$suspiciousUserColumn` = u.user_id
                WHERE 1=1
                $statusConditionSuspicious
            ";

            $suspiciousResult = $conn->query($suspiciousSql);

            if (!$suspiciousResult) {
                throw new Exception("Suspicious report query failed: " . $conn->error);
            }

            while ($row = $suspiciousResult->fetch_assoc()) {
                $reports[] = $row;
            }
        }
    }

    /*
    MISSING PET POSTS
    */
    if (tableExists($conn, "missing_pet_post")) {
        $petSql = "
            SELECT 
                p.pet_post_id AS report_id,
                'missing_pet' AS report_type,
                p.user_id,
                CONCAT(u.first_name, ' ', u.last_name) AS user_name,
                u.email AS user_email,
                u.mobile AS user_mobile,
                p.pet_category AS category,
                p.pet_name AS title,
                p.description,
                p.district,
                p.nearest_town,
                p.last_seen_location AS location,
                p.lost_date AS report_date,
                p.lost_time AS report_time,
                p.unique_identifiers,
                p.guardian_contact_no AS contact_no,
                p.status,
                p.created_at,
                NULL AS age,
                NULL AS gender,
                (
                    SELECT image_path 
                    FROM missing_pet_post_image 
                    WHERE pet_post_id = p.pet_post_id
                    LIMIT 1
                ) AS image_path
            FROM missing_pet_post p
            INNER JOIN users u ON p.user_id = u.user_id
            WHERE 1=1
            $statusConditionPet
        ";

        $petResult = $conn->query($petSql);

        if (!$petResult) {
            throw new Exception("Missing pet query failed: " . $conn->error);
        }

        while ($row = $petResult->fetch_assoc()) {
            $reports[] = $row;
        }
    }

    /*
    MISSING PERSON POSTS
    */
    if (tableExists($conn, "missing_person_post")) {
        $personSql = "
            SELECT 
                mp.person_post_id AS report_id,
                'missing_person' AS report_type,
                mp.user_id,
                CONCAT(u.first_name, ' ', u.last_name) AS user_name,
                u.email AS user_email,
                u.mobile AS user_mobile,
                'Missing Person' AS category,
                mp.full_name AS title,
                mp.description,
                mp.district,
                mp.nearest_town,
                mp.last_seen_location AS location,
                mp.missing_date AS report_date,
                mp.missing_time AS report_time,
                mp.distinguishing_marks AS unique_identifiers,
                mp.guardian_contact_no AS contact_no,
                mp.status,
                mp.created_at,
                mp.age,
                mp.gender,
                (
                    SELECT image_path 
                    FROM missing_person_post_image 
                    WHERE person_post_id = mp.person_post_id
                    LIMIT 1
                ) AS image_path
            FROM missing_person_post mp
            INNER JOIN users u ON mp.user_id = u.user_id
            WHERE 1=1
            $statusConditionPerson
        ";

        $personResult = $conn->query($personSql);

        if (!$personResult) {
            throw new Exception("Missing person query failed: " . $conn->error);
        }

        while ($row = $personResult->fetch_assoc()) {
            $reports[] = $row;
        }
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