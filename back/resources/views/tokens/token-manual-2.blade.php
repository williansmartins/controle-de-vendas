<?php
//phpInfo();

$secret = 'bob';

$header = [
	'typ' => 'JWT',
	'alg' => 'HS256'
];

$header = json_encode($header);
$header = base64_encode($header);

$payload = [
	'iss' => 'williansmartins.com',
	'username' => 'usuario1',
	'email' => 'email@teste.com',
	'email2' => 'email@teste.com2'
];


$payload = json_encode($payload);
$payload = base64_encode($payload);

$signature = hash_hmac('sha256', '$header.$payload', $secret, true);
$signature = base64_encode($signature);




$token = "$header.$payload.$signature";

echo($token);exit;


