<?php
require_once 'config.php';

validateToken();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    if (!isset($_FILES['files'])) {
        throw new Exception('No file uploaded');
    }

    $files = $_FILES['files'];
    $count = $_POST['count'];

    $uploadedFiles = [];    

    for ($i = 0; $i < $count; $i++) {

        $fileName = basename($files['name'][$i]);
        $fileType = $files['type'][$i];
        $tmp_name = $files['tmp_name'][$i];
    
        // Validate file type
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'];
        if (!in_array($fileType, $allowedTypes)) {
            throw new Exception('Invalid file type');
        }
    
        // Create upload directory if it doesn't exist
        if (!file_exists(UPLOAD_DIR)) {
            mkdir(UPLOAD_DIR, 0777, true);
        }
    
        // Generate unique filename
        $uniqueName = uniqid() . '_' . $fileName;
        $uploadPath = UPLOAD_DIR . $uniqueName;
    
        if (!move_uploaded_file($tmp_name, $uploadPath)) {
            throw new Exception('Failed to move uploaded file');
        }
    
        // Store file info in database
        /* $db = getDBConnection();
        $stmt = $db->prepare('INSERT INTO files (name, type, path) VALUES (:name, :type, :path)');
        $stmt->bindValue(':name', $fileName, SQLITE3_TEXT);
        $stmt->bindValue(':type', $fileType, SQLITE3_TEXT);
        $stmt->bindValue(':path', $uniqueName, SQLITE3_TEXT);
        $stmt->execute(); */
    
        $uploadedFiles[] = [
        'success' => true,
            'file' => [
                // 'id' => $db->lastInsertRowID(),
                'name' => $fileName,
                'type' => $fileType,
                'url' => PATH_DIR . $uniqueName
            ]
        ];
    }
    
    echo json_encode(['files' => $uploadedFiles]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
}