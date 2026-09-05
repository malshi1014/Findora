<?php
$origin = $_SERVER['HTTP_ORIGIN'] ?? ''; if ($origin === 'https://findora.freehosting.dev' || $origin === 'http://localhost:5173') { header('Access-Control-Allow-Origin: ' . $origin); } header('Access-Control-Allow-Headers: Content-Type'); header('Access-Control-Allow-Methods: GET, OPTIONS'); header('Content-Type: application/json');
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); echo json_encode(array('status' => 'success', 'message' => 'Preflight OK')); exit(); }
    exit();
}

include __DIR__ . "/../config/db.php";

if ($_SERVER['REQUEST_METHOD'] !== 'GET') { echo json_encode(array('status' => 'error', 'message' => 'Only GET method is allowed')); exit(); }
$user_id = isset($_GET["user_id"]) ? intval($_GET["user_id"]) : 0;

if ($user_id <= 0) {
    echo json_encode(array(
        "status" => "error",
if ($user_id <= 0) { echo json_encode(array('status' => 'error', 'message' => 'Valid user_id is required')); exit(); }
    ));
    exit();
}

function getImages($conn, $table, $idColumn, $idValue) {    $images = array();    $stmt = $conn->prepare(" SELECT image_id, image_path, uploaded_at FROM $table WHERE $idColumn = ? ORDER BY image_id ASC ");    if (!$stmt) { return $images; }    $stmt->bind_param('i', $idValue);    $stmt->execute();    $result = $stmt->get_result();    while ($row = $result->fetch_assoc()) { $images[] = $row; }    return $images; } $lost_reports = array(); $lostStmt = $conn->prepare('SELECT * FROM lost_report WHERE user_id = ? ORDER BY report_id DESC'); if ($lostStmt) {
    $lostStmt->bind_param("i", $user_id);
    $lostStmt->execute();
    $lostResult = $lostStmt->get_result();

    while ($row = $lostResult->fetch_assoc()) {
$lostStmt->bind_param('i', $user_id); $lostStmt->execute(); $lostResult = $lostStmt->get_result(); $lost_reports = array(); while ($row = $lostResult->fetch_assoc()) { $row['images'] = getImages($conn, 'lost_report_image', 'report_id', intval($row['report_id'])); $lost_reports[] = $row; }
    $foundStmt->bind_param("i", $user_id);
    $foundStmt->execute();
    $foundResult = $foundStmt->get_result();

    while ($row = $foundResult->fetch_assoc()) {
$foundStmt->bind_param('i', $user_id); $foundStmt->execute(); $foundResult = $foundStmt->get_result(); $found_reports = array(); while ($row = $foundResult->fetch_assoc()) { $row['images'] = getImages($conn, 'found_report_image', 'report_id', intval($row['report_id'])); $found_reports[] = $row; } $missing_pet_posts = array(); $petStmt = $conn->prepare('SELECT * FROM missing_pet_post WHERE user_id = ? ORDER BY pet_post_id DESC'); if ($petStmt) { $petStmt->bind_param('i', $user_id); $petStmt->execute(); $petResult = $petStmt->get_result(); while ($row = $petResult->fetch_assoc()) { $row['report_id'] = $row['pet_post_id']; $row['title'] = $row['pet_name']; $row['category'] = $row['pet_category']; $row['location'] = $row['last_seen_location']; $row['contact_no'] = $row['guardian_contact_no']; $row['report_date'] = $row['lost_date']; $row['report_time'] = $row['lost_time']; $row['report_type'] = 'missing_pet'; $row['images'] = getImages($conn, 'missing_pet_post_image', 'pet_post_id', intval($row['pet_post_id'])); $missing_pet_posts[] = $row; } } $missing_person_posts = array(); $personStmt = $conn->prepare('SELECT * FROM missing_person_post WHERE user_id = ? ORDER BY person_post_id DESC'); if ($personStmt) { $personStmt->bind_param('i', $user_id); $petStmt->execute(); $petResult = $personStmt->get_result(); while ($row = $petResult->fetch_assoc()) { $row['report_id'] = $row['person_post_id']; $row['title'] = $row['full_name']; $row['category'] = 'Missing Person'; $row['location'] = $row['last_seen_location']; $row['contact_no'] = $row['guardian_contact_no']; $row['report_date'] = $row['missing_date']; $row['report_time'] = $row['missing_time']; $row['unique_identifiers'] = $row['distinguishing_marks']; $row['report_type'] = 'missing_person'; $row['images'] = getImages($conn, 'missing_person_post_image', 'person_post_id', intval($row['person_post_id'])); $missing_person_posts[] = $row; } } echo json_encode(array('status' => 'success', 'message' => 'Reports loaded successfully', 'lost_reports' => $lost_reports, 'found_reports' => $found_reports, 'missing_pet_posts' => $missing_pet_posts, 'missing_person_posts' => $missing_person_posts)); exit();
?>