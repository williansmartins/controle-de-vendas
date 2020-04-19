<?php

namespace App\Http\Controllers;

use App\Conta;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\JWTAuth;

class ContaController extends Controller
{

    protected $conta = null;

    public function __construct(Conta $conta, JWTAuth $jwt){
        $this->conta = $conta;
        $this->jwt = $jwt;
        $this->user = $this->jwt->parseToken()->authenticate();
    }

    public function getAllContas()
    {
        return $this->conta->getAllContas();
    }

    public function getAllContasLogado()
    {
        return $this->conta->getAllContasLogado($this->user->id);
    }

    public function getConta($id)
    {
        $conta = $this->conta->getConta($id);
        if(!$conta){
            return response()->json(['response', 'Objeto não encontrado'], 400);
        }else{
            return response()->json(['response', $conta], 200);
        }
    }

    public function getContaPorPeriodo($ano, $mes)
    {
        return $this->conta->getContaPorPeriodo($ano, $mes, $this->user->id);
    }

    public function deleteConta($id)
    {
        $response = $this->conta->deleteConta($id);
        if(!$response){
            return response()->json(['response', 'Objeto não encontrado'], 400);
        }else{
            return response()->json(['response', 'Objeto removido com sucesso'], 200); 
        }
    }

    public function updateConta($id)
    {
        $conta = $this->conta->updateConta($id);
        if(!$conta){
            return response()->json(['response', 'Objeto não encontrado'], 400);
        }else{
            return response()->json(['response', $conta], 200);
        }
    }

    public function saveConta()
    {
        return $this->conta->saveConta($this->user->id);
    }

}