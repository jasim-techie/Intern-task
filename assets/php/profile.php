<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
error_reporting(0);
ini_set('display_errors', 0);

require_once "redis.php";
require_once "db_mongo.php";

$token = $_POST['token'] ?? '';
$action = $_POST['action'] ?? '';

if (!$token) {
    echo json_encode(["status" => false, "message" => "No token provided"]);
    exit;
}

// Validate Token via Redis
$userId = $redis->get("session_$token");

if (!$userId) {
    echo json_encode(["status" => false, "message" => "Unauthorized"]);
    exit;
}

// Handle GET Profile
if ($action === 'get') {
    $profile = $profileCollection->findOne(
        ["user_id" => (int) $userId]
    );

    if ($profile) {
        echo json_encode([
            "status" => true,
            "data" => [
                "age" => $profile['age'] ?? '',
                "dob" => $profile['dob'] ?? '',
                "contact" => $profile['contact'] ?? ''
            ]
        ]);
    } else {
        echo json_encode(["status" => false, "message" => "Profile not found"]);
    }
    exit;
}

// Handle UPDATE Profile
if ($action === 'update') {
    $age = $_POST['age'] ?? '';
    $dob = $_POST['dob'] ?? '';
    $contact = $_POST['contact'] ?? '';

    $updateResult = $profileCollection->updateOne(
        ["user_id" => (int) $userId],
        [
            '$set' => [
                "age" => $age,
                "dob" => $dob,
                "contact" => $contact
            ]
        ],
        ['upsert' => true]
    );

    if ($updateResult->getModifiedCount() > 0 || $updateResult->getMatchedCount() > 0 || $updateResult->getUpsertedCount() > 0) {
        echo json_encode(["status" => true, "message" => "Profile updated successfully"]);
    } else {
        echo json_encode(["status" => false, "message" => "No changes made or update failed"]);
    }
    exit;
}

echo json_encode(["status" => false, "message" => "Invalid action"]);
?>