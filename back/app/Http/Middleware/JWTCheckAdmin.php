<?php

namespace App\Http\Middleware;

use Illuminate\Support\Facades\Auth;

class JWTCheckAdmin extends \Tymon\JWTAuth\Middleware\BaseMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     *
     * @return mixed
     */
    public function handle($request, \Closure $next)
    {
        $token = $this->auth->setRequest($request)->getToken();
        if(!$token)
            return response()->json(['status' => 'error', 'message' => 'Faça login novamente']);
        try {
            $retorno = $this->auth->authenticate();

            if($retorno){
                if($retorno->tipo != "w"){
                    return response()->json(['status' => 'error', 'message' => "acesso nao permitido"]);
                }
            }else{
                return response()->json(['status' => 'error', 'message' => "acesso nao permitido"]);
            }
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
        return $next($request);
    }
}