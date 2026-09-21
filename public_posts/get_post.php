<?php

header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-store");

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);
    echo json_encode(array("status" => "error", "message" => "Only GET method is allowed"));
    exit();
}

require_once __DIR__ . "/../config/db.php";

$type = isset($_GET['type']) ? $_GET['type'] : '';
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if (empty($type) || $id <= 0) {
    http_response_code(400);
    echo json_encode(array("status" => "error", "message" => "Invalid parameters"));
    exit();
}

try {
    $sql = "";
    if ($type === "missing_person") {
        $sql = "
            SELECT
                CONCAT('missing-person-', mp.person_post_id) AS id,
                'missing_person' AS report_type,
                mp.full_name AS title,
                'Missing Person' AS category,
                mp.description,
                mp.district,
                mp.nearest_town,
                mp.last_seen_location,
                mp.missing_date AS report_date,
                mp.missing_time AS report_time,
                mp.guardian_contact_no AS contact_no,
                mp.created_at,
                (
                    SELECT mpi.image_path
                    FROM missing_person_post_image mpi
                    WHERE mpi.person_post_id = mp.person_post_id
                    ORDER BY mpi.image_id ASC
                    LIMIT 1
                ) AS image_path
            FROM missing_person_post mp
            WHERE mp.person_post_id = ? AND mp.status = 'active'
        ";
    } else if ($type === "missing_pet") {
        $sql = "
            SELECT
                CONCAT('missing-pet-', pet.pet_post_id) AS id,
                'missing_pet' AS report_type,
                pet.pet_name AS title,
                pet.pet_category AS category,
                pet.description,
                pet.district,
                pet.nearest_town,
                pet.last_seen_location,
                pet.lost_date AS report_date,
                pet.lost_time AS report_time,
                pet.guardian_contact_no AS contact_no,
                pet.created_at,
                (
                    SELECT ppi.image_path
                    FROM missing_pet_post_image ppi
                    WHERE ppi.pet_post_id = pet.pet_post_id
                    ORDER BY ppi.image_id ASC
                    LIMIT 1
                ) AS image_path
            FROM missing_pet_post pet
            WHERE pet.pet_post_id = ? AND pet.status = 'active'
        ";
    } else {
        http_response_code(400);
        echo json_encode(array("status" => "error", "message" => "Invalid type"));
        exit();
    }

    $statement = $conn->prepare($sql);
    $statement->bind_param("i", $id);

    if (!$statement->execute()) {
        throw new RuntimeException("Query failed");
    }

    $result = $statement->get_result();
    $post = $result->fetch_assoc();

    $statement->close();

    if ($post) {
        echo json_encode(array("status" => "success", "post" => $post));
    } else {
        echo json_encode(array("status" => "error", "message" => "Post not found"));
    }
} catch (Throwable $error) {
    error_log("Public get post error: " . $error->getMessage());
    http_response_code(500);
    echo json_encode(array("status" => "error", "message" => "Unable to load the post"));
}
