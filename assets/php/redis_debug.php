<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

echo "Checking vendor/autoload... ";
if (file_exists(__DIR__ . '/../../vendor/autoload.php')) {
    echo "Found.<br>";
    require_once __DIR__ . '/../../vendor/autoload.php';
} else {
    echo "Files missing!<br>";
}

echo "Checking Native Redis... ";
if (class_exists('Redis')) {
    echo "Exists.<br>";
    try {
        $r = new Redis();
        $r->connect('127.0.0.1', 6379);
        echo "Connected via Native Redis.<br>";
    } catch (Exception $e) {
        echo "Native Connect Failed: " . $e->getMessage() . "<br>";
    }
} else {
    echo "Not Found.<br>";
}

echo "Checking Predis... ";
if (class_exists('Predis\Client')) {
    echo "Exists.<br>";
    try {
        $client = new Predis\Client([
            'scheme' => 'tcp',
            'host' => '127.0.0.1',
            'port' => 6379,
        ]);
        $client->connect();
        echo "Connected via Predis.<br>";
    } catch (Exception $e) {
        echo "Predis Connect Failed: " . $e->getMessage() . "<br>";
    }
} else {
    echo "Not Found.<br>";
}
?>