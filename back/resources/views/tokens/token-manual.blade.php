<?php

$recebido = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ3aWxsaWFuc21hcnRpbnMuY29tIiwidXNlcm5hbWUiOiJ1c3VhcmlvMSIsImVtYWlsIjoiZW1haWxAdGVzdGUuY29tIiwiZW1haWwyIjoiZW1haWxAdGVzdGUuY29tMiJ9.mNFmcpzAbqgvW7VGfk6UTzhWtYYEYTWEqWTBEh7wYe8=';

function token(){
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

	return($token);
}

if($recebido === token()){
	echo "sucesso";
}else{
	echo "sai daqui";
}

