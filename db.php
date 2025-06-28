<?php
$host = 'localhost';
$db = 'crud_app';
$user = 'root';
$pass = 'root';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, // throw error
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // fetch แบบ array
];

try {
    $conn = new PDO($dsn, $user, $pass, $options);
    
    //echo "Connected";

} catch (\PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

?>