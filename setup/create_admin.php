<?php
header("Content-Type: application/json");

include __DIR__ . "/../config/db.php";

$admins = [
    [
        "first_name" => "Malshi",
        "last_name" => "Navodya",
        "nic" => "200178802177",
        "email" => "cst23029@std.uwu.ac.lk",
        "mobile" => "0775002470",
        "district" => "Badulla",
        "nearest_town" => "Badulla",
        "role" => "admin",
        "password" => "Admin@12345"
    ],
    [
        "first_name" => "Navod",
        "last_name" => "Teshan",
        "nic" => "200231100836",
        "email" => "cst23064@std.uwu.ac.lk",
        "mobile" => "0712916663",
        "district" => "Badulla",
        "nearest_town" => "Badulla",
        "role" => "admin",
        "password" => "Admin@12345"
    ],
    [
        "first_name" => "Omindu",
        "last_name" => "Sandew",
        "nic" => "200304111488",
        "email" => "cst23005@std.uwu.ac.lk",
        "mobile" => "0775777793",
        "district" => "Badulla",
        "nearest_town" => "Badulla",
        "role" => "admin",
        "password" => "Admin@12345"
    ],
    [
        "first_name" => "Duvindu",
        "last_name" => "Weerathunga",
        "nic" => "200025903330",
        "email" => "cst23061@std.uwu.ac.lk",
        "mobile" => "0716468321",
        "district" => "Badulla",
        "nearest_town" => "Badulla",
        "role" => "admin",
        "password" => "Admin@12345"
    ]
];

$created = [];
$existing = [];
$errors = [];

foreach ($admins as $admin) {
    $check = $conn->prepare("SELECT user_id FROM users WHERE email = ? OR nic = ?");
    $check->bind_param("ss", $admin["email"], $admin["nic"]);
    $check->execute();
    $result = $check->get_result();

    if ($result->num_rows > 0) {
        $existing[] = $admin["email"];
        continue;
    }

    $password_hash = password_hash($admin["password"], PASSWORD_DEFAULT);

    $stmt = $conn->prepare("
        INSERT INTO users 
        (first_name, last_name, nic, email, mobile, password_hash, district, nearest_town, role)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->bind_param(
        "sssssssss",
        $admin["first_name"],
        $admin["last_name"],
        $admin["nic"],
        $admin["email"],
        $admin["mobile"],
        $password_hash,
        $admin["district"],
        $admin["nearest_town"],
        $admin["role"]
    );

    if ($stmt->execute()) {
        $created[] = $admin["email"];
    } else {
        $errors[] = [
            "email" => $admin["email"],
            "error" => $stmt->error
        ];
    }
}

echo json_encode([
    "status" => "completed",
    "created_admins" => $created,
    "existing_admins" => $existing,
    "errors" => $errors,
    "default_password" => "Admin@12345"
]);
?>