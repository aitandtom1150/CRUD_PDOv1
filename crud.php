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
// DELETE
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // อ่านข้อมูลจาก body ของ request (สำหรับ DELETE method)
    $data = json_decode(file_get_contents('php://input'), true);

    $id = $data['ID'] ?? null; // ใช้ Null Coalescing Operator เพื่อป้องกัน undefined index

    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'User ID is required.']);
        exit; // หยุดการทำงานถ้าไม่มี ID
    }

    try {
        $stmt = $conn->prepare('DELETE FROM users WHERE ID = :id');
        $stmt->execute([':id' => $id]);;
        echo json_encode(['success' => true, 'message' => 'User deleted successfully.']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $conn->query("SELECT * FROM users");
        $users = $stmt->fetchAll();
        echo json_encode($users);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
    exit;
}



// UPDATE , EDIT

// UPDATE ด้วย PDO
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);

    $id = $input['ID'];
    $fname = $input['fname'];
    $lname = $input['lname'];
    $email = $input['email'];
    $phone = $input['phone'];

    try {
        $stmt = $conn->prepare("UPDATE users SET fname = :fname, lname = :lname, email = :email, phone = :phone WHERE ID = :id");
        $stmt->execute([
            ':fname' => $fname,
            ':lname' => $lname,
            ':email' => $email,
            ':phone' => $phone,
            ':id' => $id
        ]);
        echo json_encode(['success' => true, 'message' => 'User updated']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }

    exit;
}

?>

