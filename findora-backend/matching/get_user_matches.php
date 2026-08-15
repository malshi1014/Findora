<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit();
}

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);
    echo json_encode(array(
        "status" => "error",
        "message" => "Only GET method is allowed"
    ));
    exit();
}

require_once __DIR__ . "/../config/db.php";

$userId = isset($_GET["user_id"]) ? filter_var($_GET["user_id"], FILTER_VALIDATE_INT) : false;

if ($userId === false || $userId <= 0) {
    http_response_code(400);
    echo json_encode(array(
        "status" => "error",
        "message" => "A valid user_id is required"
    ));
    exit();
}

/**
 * Convert a database row into the report object expected by Matches.jsx.
 */
function buildReportPayload($row, $prefix, $reportType) {
    $imagePath = $row[$prefix . "_image_path"] ?? null;

    return array(
        "report_id" => (int) $row[$prefix . "_report_id"],
        "user_id" => (int) $row[$prefix . "_user_id"],
        "report_type" => $reportType,
        "title" => $row[$prefix . "_title"],
        "description" => $row[$prefix . "_description"],
        "category" => $row[$prefix . "_category"],
        "district" => $row[$prefix . "_district"],
        "location" => $row[$prefix . "_location"],
        "report_date" => $row[$prefix . "_date"],
        "report_time" => $row[$prefix . "_time"],
        "unique_identifiers" => $row[$prefix . "_identifiers"],
        "contact_no" => $row[$prefix . "_contact_no"],
        "image_path" => $imagePath,
        "images" => $imagePath
            ? array(array("image_path" => $imagePath))
            : array()
    );
}

try {
    // Verify that the requested user exists before looking up their matches.
    $userStatement = $conn->prepare("SELECT user_id FROM users WHERE user_id = ? LIMIT 1");
    $userStatement->bind_param("i", $userId);
    $userStatement->execute();

    if ($userStatement->get_result()->num_rows === 0) {
        http_response_code(404);
        echo json_encode(array(
            "status" => "error",
            "message" => "User not found"
        ));
        exit();
    }

    $statement = $conn->prepare("
        SELECT
            m.match_id,
            m.similarity_score,
            m.status,
            m.matched_at,
            m.verified_at,

            lr.report_id AS lost_report_id,
            lr.user_id AS lost_user_id,
            lr.title AS lost_title,
            lr.description AS lost_description,
            lr.category AS lost_category,
            lr.district AS lost_district,
            lr.location AS lost_location,
            lr.lost_date AS lost_date,
            lr.lost_time AS lost_time,
            lr.unique_identifiers AS lost_identifiers,
            lr.contact_no AS lost_contact_no,
            (
                SELECT lri.image_path
                FROM lost_report_image lri
                WHERE lri.report_id = lr.report_id
                ORDER BY lri.image_id ASC
                LIMIT 1
            ) AS lost_image_path,

            fr.report_id AS found_report_id,
            fr.user_id AS found_user_id,
            fr.title AS found_title,
            fr.description AS found_description,
            fr.category AS found_category,
            fr.district AS found_district,
            fr.location AS found_location,
            fr.found_date AS found_date,
            fr.found_time AS found_time,
            fr.unique_identifiers AS found_identifiers,
            fr.contact_no AS found_contact_no,
            (
                SELECT fri.image_path
                FROM found_report_image fri
                WHERE fri.report_id = fr.report_id
                ORDER BY fri.image_id ASC
                LIMIT 1
            ) AS found_image_path

        FROM matches m
        INNER JOIN lost_report lr ON lr.report_id = m.lost_report_id
        INNER JOIN found_report fr ON fr.report_id = m.found_report_id
        WHERE m.status IN ('verified', 'completed')
          AND (lr.user_id = ? OR fr.user_id = ?)
        ORDER BY COALESCE(m.verified_at, m.matched_at) DESC, m.match_id DESC
    ");

    $statement->bind_param("ii", $userId, $userId);
    $statement->execute();
    $result = $statement->get_result();
    $matches = array();

    while ($row = $result->fetch_assoc()) {
        $lostReport = buildReportPayload($row, "lost", "Lost report");
        $foundReport = buildReportPayload($row, "found", "Found report");
        $userOwnsLostReport = (int) $row["lost_user_id"] === (int) $userId;

        $matches[] = array(
            "match_id" => (int) $row["match_id"],
            "status" => $row["status"],
            "similarity_score" => (float) $row["similarity_score"],
            "matched_at" => $row["matched_at"],
            "verified_at" => $row["verified_at"],
            "source_report" => $userOwnsLostReport ? $lostReport : $foundReport,
            "matched_report" => $userOwnsLostReport ? $foundReport : $lostReport
        );
    }

    echo json_encode(array(
        "status" => "success",
        "total_matches" => count($matches),
        "matches" => $matches
    ), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
} catch (Throwable $error) {
    error_log("get_user_matches.php: " . $error->getMessage());
    http_response_code(500);
    echo json_encode(array(
        "status" => "error",
        "message" => "Failed to load verified matches"
    ));
}
?>
