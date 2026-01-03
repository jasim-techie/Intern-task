<?php
header("Content-Type: application/json");
error_reporting(0);
ini_set('display_errors', 0);

require "db_mysql.php";
require "db_mongo.php"; // Re-added to support profile creation

$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

if (!$name || !$email || !$password) {
    echo json_encode(["status" => false, "message" => "All fields required"]);
    exit;
}

$hash = password_hash($password, PASSWORD_BCRYPT);

$stmt = $conn->prepare(
    "INSERT INTO users (name,email,password) VALUES (?,?,?)"
);
$stmt->bind_param("sss", $name, $email, $hash);

if ($stmt->execute()) {
    $userId = $stmt->insert_id;

    // Create initial profile using the Mock MongoDB
    $profileCollection->insertOne([
        "user_id" => (int) $userId,
        "email" => $email,
        "age" => "",
        "dob" => "",
        "contact" => ""
    ]);

    echo json_encode([
        "status" => true,
        "message" => "Registered successfully",
        "profile_db" => "MongoDB (Mock/File)"
    ]);
} else {
    echo json_encode(["status" => false, "message" => "Email already exists"]);
}
?>