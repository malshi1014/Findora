<?php

header("Content-Type: application/json");

require_once __DIR__ . "/../config/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    echo json_encode(array("status" => "error", "message" => "Only GET method is allowed"));
    exit();
}

try {
    $query = "SELECT user_id, first_name, last_name, nic, email, mobile, role, district, nearest_town, account_status FROM users ORDER BY created_at DESC";
    $result = $conn->query($query);

    if (!$result) {
        throw new Exception("Database query failed");
    }

    $users = array();
    $stats = array(
        "total" => 0,
        "general" => 0,
        "verified" => 0,
        "shop_owners" => 0,
        "admins" => 0
    );

    while ($row = $result->fetch_assoc()) {
        $users[] = array(
            "real_id" => $row["user_id"],
            "id" => "#FN-" . str_pad($row["user_id"], 5, "0", STR_PAD_LEFT),
            "name" => $row["first_name"] . " " . $row["last_name"],
            "email" => $row["email"],
            "phone" => $row["mobile"],
            "role" => ucfirst(str_replace("_", " ", $row["role"])),
            "account_status" => $row["account_status"] ?? "active"
        );

        $stats["total"]++;

        if ($row["role"] === "general_user") {
            $stats["general"]++;
        } elseif ($row["role"] === "verified_user") {
            $stats["verified"]++;
        } elseif ($row["role"] === "shop_owner") {
            $stats["shop_owners"]++;
        } elseif ($row["role"] === "admin") {
            $stats["admins"]++;
        }
    }

    echo json_encode(array(
        "status" => "success",
        "data" => array(
            "users" => $users,
            "stats" => $stats
        )
    ));
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "status" => "error",
        "message" => $e->getMessage()
    ));
}
?>
