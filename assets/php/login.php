<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
error_reporting(0);
ini_set('display_errors', 0);

require_once "db_mysql.php";
require_once "redis.php";

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

if (!$email || !$password) {
    echo json_encode(["status" => false, "message" => "Email and Password required"]);
    exit;
}

$stmt = $conn->prepare("SELECT id, password FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 1) {
    $user = $res->fetch_assoc();
    if (password_verify($password, $user['password'])) {
        // Generate a random token
        $token = bin2hex(random_bytes(16));

        // Store session in Redis: Key = session_TOKEN, Value = UserID
        // Expire in 1 hour (3600 seconds)
        $redis->setex("session_$token", 3600, $user['id']);

        echo json_encode([
            "status" => true,
            "message" => "Login successful",
            "token" => $token
        ]);
        exit;
    }
}

echo json_encode(["status" => false, "message" => "Invalid email or password"]);
?>