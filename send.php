<?php
// send.php — handler for ktiphairextension.com contact form

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name    = trim($_POST['name'] ?? '');
    $phone   = trim($_POST['phone'] ?? '');
    $service = trim($_POST['service'] ?? '');

    // Where leads are sent (local mailbox on Namecheap)
    $to      = 'info@ktiphairextension.com';
    $subject = 'New booking request — ktiphairextension.com';

    $message  = "New booking request from ktiphairextension.com\n\n";
    $message .= "Name: $name\n";
    $message .= "Phone: $phone\n";
    $message .= "Service: $service\n";
    $message .= "Time: " . date('Y-m-d H:i:s') . "\n";

    $headers  = "From: no-reply@ktiphairextension.com\r\n";
    $headers .= "Reply-To: contact@luxehairstylist.com\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    if (mail($to, $subject, $message, $headers)) {
        http_response_code(200);
        echo 'OK';
    } else {
        http_response_code(500);
        echo 'ERROR';
    }
} else {
    http_response_code(405);
    echo 'Method not allowed';
}
?>
