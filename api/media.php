<?php
require_once 'config.php';

validateToken();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    // $db = getDBConnection();
    // $result = $db->query('SELECT * FROM files ORDER BY created_at DESC');

    // get files from upload directory
    $uploadedFiles = glob(UPLOAD_DIR . '*');

    $files = [];
    foreach ($uploadedFiles as $file) {
        $files[] = [
            'name' => basename($file),
            'type' => mime_content_type($file),
            'url' => PATH_DIR . basename($file)
        ];
    }
    
    // $files = [];
    // while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
    //     $files[] = [
    //         'id' => $row['id'],
    //         'name' => $row['name'],
    //         'type' => $row['type'],
    //         'url' => PATH_DIR . $row['path'],
    //         'created_at' => $row['created_at']
    //     ];
    // }
    
    echo json_encode(['files' => $files]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch files']);
}