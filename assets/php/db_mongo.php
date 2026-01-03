<?php
// Connect to MongoDB (Docker service: guvi-mongo)
// Ensure composer autoloader is loaded (usually by redis.php, but safe to check)
$autoloadPath = __DIR__ . '/../../vendor/autoload.php';
if (file_exists($autoloadPath)) {
    require_once $autoloadPath;
}

// Check if MongoDB extension is loaded
if (!extension_loaded('mongodb')) {
    http_response_code(500);
    echo json_encode(["status" => false, "message" => "PHP MongoDB extension is not enabled on this server."]);
    exit;
}

try {
    $client = new MongoDB\Client("mongodb://localhost:27017");
    $profileCollection = $client->guvi_base->guvi_users;
} catch (Exception $e) {
    // If connection fails, return 500 error
    http_response_code(500);
    echo json_encode(["status" => false, "message" => "Database connection error: " . $e->getMessage()]);
    exit;
}
?>