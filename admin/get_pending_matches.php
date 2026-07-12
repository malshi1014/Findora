<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

include __DIR__ . "/../config/db.php";

$sql = "
    SELECT 
        m.match_id,
        m.similarity_score,
        m.status,
        m.matched_at,

        lr.report_id AS lost_report_id,
        lr.title AS lost_title,
        lr.category AS lost_category,
        lr.description AS lost_description,
        lr.district AS lost_district,
        lr.location AS lost_location,
        lr.lost_date,
        lr.unique_identifiers AS lost_identifiers,
        lu.first_name AS lost_owner_first_name,
        lu.last_name AS lost_owner_last_name,
        lu.email AS lost_owner_email,
        lu.mobile AS lost_owner_mobile,

        fr.report_id AS found_report_id,
        fr.title AS found_title,
        fr.category AS found_category,
        fr.description AS found_description,
        fr.district AS found_district,
        fr.location AS found_location,
        fr.found_date,
        fr.unique_identifiers AS found_identifiers,
        fu.first_name AS finder_first_name,
        fu.last_name AS finder_last_name,
        fu.email AS finder_email,
        fu.mobile AS finder_mobile

    FROM matches m
    INNER JOIN lost_report lr ON m.lost_report_id = lr.report_id
    INNER JOIN found_report fr ON m.found_report_id = fr.report_id
    INNER JOIN users lu ON lr.user_id = lu.user_id
    INNER JOIN users fu ON fr.user_id = fu.user_id
    WHERE m.status = 'pending'
    ORDER BY m.similarity_score DESC, m.matched_at DESC
";

$result = $conn->query($sql);

$matches = array();

while ($row = $result->fetch_assoc()) {
    $matches[] = $row;
}

echo json_encode(array(
    "status" => "success",
    "total_pending_matches" => count($matches),
    "matches" => $matches
));
?>