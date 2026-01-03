<?php
$conn = new mysqli(
    "127.0.0.1",
    "root",
    "root",
    "guvi_auth",
    3307   // IMPORTANT
);

if ($conn->connect_error) {
    die(json_encode([
        "status" => false,
        "message" => "MySQL Connection Failed: " . $conn->connect_error
    ]));
}
?>
