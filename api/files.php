<?php
require_once 'config.php';

validateToken();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$filename = basename($path);

$filepath = UPLOAD_DIR . $filename;

if (!file_exists($filepath)) {
    http_response_code(404);
    echo json_encode(['error' => 'File not found']);
    exit;
}

$mimeType = mime_content_type($filepath);
header('Content-Type: ' . $mimeType);
header('Content-Length: ' . filesize($filepath));
readfile($filepath);