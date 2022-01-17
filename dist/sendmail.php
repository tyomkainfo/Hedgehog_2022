<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';

$mail = new PHPMailer(true);
$mail->CharSet = 'UTF-8';
$mail->setLanguage('ru', 'PHPMailer/language');
$mail->IsHTML(true);

//от кого
$mail->setFrom("hedgehoginchina@example.com");
////кому отправить
$mail->addAddress("hedgehoginchina@protonmail.com");
////Тема письма
$mail->Subject = "hedgehoginchina.net";

$body = '';

if (trim(!empty($_POST['name']))) {
    $body .= '<p><strong>name: </strong>' . $_POST['name'] . '</p>';
}
if (trim(!empty($_POST['email']))) {
    $body .= '<p><strong>email: </strong>' . $_POST['email'] . '</p>';
}
if (trim(!empty($_POST['message']))) {
    $body .= '<p><strong>message: </strong>' . $_POST['message'] . '</p>';
}

$mail->Body = $body;

if (!$mail->send()) {
    $message = "Ошибка";
} else {
    $message = "Данные отправлены";
}

$response = ['message' => $message];

header("Content-type: application/json");
echo json_encode($response);
