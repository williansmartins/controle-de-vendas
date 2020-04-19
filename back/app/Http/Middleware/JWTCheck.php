<?php

namespace App\Http\Middleware;

use Illuminate\Support\Facades\Auth;

class JWTCheck extends \Tymon\JWTAuth\Middleware\BaseMiddleware
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
        if(!$token){
            return response()->json(['status' => 'error', 'message' => 'Faça login novamente. sem token: '], 500);
		}
		
        try {
            $entidadePesquisada = $request->complemento;
            $entidadesPermitidas = array("categoria", "concorrente"); 

            //dd($request); 

            // ignorando temporariamente
            // if (!in_array($entidadePesquisada, $entidadesPermitidas)) { 
            //     return response()->json(['status' => 'error', 'message' => 'Acesso não permitido (por entidade)'], 500);
            // }

			//nao sei bem o que isso faz
            $this->auth->authenticate();
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
        return $next($request);
    }
}