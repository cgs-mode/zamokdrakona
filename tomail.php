<?php
/**
 * Created by PhpStorm.
 * User: CGS-HOME
 * Date: 25.04.14
 * Time: 15:32
 */

header('Content-Type: text/html; charset= utf-8');

$emailAdmin = 'zamokdrakona@gmail.com';
$objZakaz = json_decode($_POST['objZakaz']);
$fio = $_POST['fio'];
$email = $_POST['email'];
$comment = $_POST['comment'];
$countUser = $_POST['countUser'];
$datatime = $_POST['datatime'];
$hall = $_POST['hall'];
$phone = $_POST['phone'];

$summa = $objZakaz->summa;

$itemOut = '';
$i=1;
foreach( $objZakaz->items as $item ){

    $name = $item->name;
    $weight = $item->weight;
    $count = $item->count;
    $price = $item->price;

    $items = "$i. $name - $count(шт.) - $price руб.";

    $itemOut .= $items . "\r\n<br />";
    $i++;
}

$message = "Заказ.\r\n<br /><br />";
$message .= "Количество человек: ".$countUser."\r\n<br /><br />";
$message .= $itemOut;
$message .= "<br />Итого: $summa руб.\r\n<br /><br />";
$message .= "Заказчик: $fio\r\n<br />";
$message .= "Дата и время проведения мероприятия: $datatime\r\n<br />";
$message .= "Зал: $hall\r\n<br />";
$message .= "Телефон: $phone\r\n<br />";
$message .= "Комментарий: $comment";

$header = "Content-Type: text/html; charset=utf-8\r\n";
$mailresult = mail($email, "Заказ с сайта zamokdrakona.ru", $message, "From: zamokdrakona.ru \r\n".$header);
mail($emailAdmin, "Заказ с сайта zamokdrakona.ru", $message, "From: zamokdrakona.ru \r\n".$header);
if ( $mailresult ) {
    return true;
} else {
    return false;
}