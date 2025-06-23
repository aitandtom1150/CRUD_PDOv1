<?php
require_once 'db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $stmt = $conn->prepare('INSERT INTO users (fname, lname, email, phone) VALUES (:firstname, :lastname, :email, :phone)');
        $stmt->execute([
            ':firstname' => $_POST['firstname'],
            ':lastname' => $_POST['lastname'],
            ':email' => $_POST['email'],
            ':phone' => $_POST['phone']
        ]);
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
    exit;
}

try {
    $stmt = $conn->query("SELECT * FROM users");
    $users = $stmt->fetchAll();
    echo json_encode($users);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
