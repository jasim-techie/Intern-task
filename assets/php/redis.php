<?php
// Safely include autoloader if it exists (prevents Fatal Error 500)
$autoloadPath = __DIR__ . '/../../vendor/autoload.php';
if (file_exists($autoloadPath)) {
    require_once $autoloadPath;
}

try {
    $redis = null;
    $connected = false;

    // 1. Try Native Redis (Fastest, provided by PHP extension)
    if (class_exists('Redis')) {
        try {
            $redis = new Redis();
            // Silence warnings for connection (e.g. if server down)
            @$redis->connect("127.0.0.1", 6379, 2.5); // 2.5s timeout
            $connected = true;
        } catch (Exception $e) {
            $redis = null; // Fallback
        }
    }

    // 2. Try Predis (Composer library)
    if (!$connected && class_exists('Predis\Client')) {
        try {
            $redis = new Predis\Client([
                'scheme' => 'tcp',
                'host' => '127.0.0.1',
                'port' => 6379,
            ]);
            $redis->connect();
            $connected = true;
        } catch (Exception $e) {
            $redis = null;
        }
    }

    // 3. Fail if neither worked or connection failed
    if (!$connected) {
        throw new Exception("Could not connect to Redis (127.0.0.1:6379). Check if Docker container 'guvi-redis' is running.");
    }

} catch (Exception $e) {
    // Return clean JSON error
    die(json_encode(["status" => false, "message" => $e->getMessage()]));
}
?>