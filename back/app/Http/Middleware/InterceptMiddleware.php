<?php

namespace App\Http\Middleware;

use Request;
use Closure;
use Input;

class InterceptMiddleware {
    public function handle($request, Closure $next)
    {

		$token = Request::header('token');
		if( !$request->is('api/v1') ){
			if( false ){
				return redirect('/api/v1');
			}
			
        	//var_dump(123);
		}
        return $next($request);
    }


    public function opcoesNaoUsadasAinda(){
    	//busca todos valores enviado por url params
            $input = $request->all();

            //busca 1 valor enviado por url params
            $name = $request->input('name');

            //valor default
            $request->input('name', 'Sally');
            
            //busca dados do header
            // $header1 = 
            $contentType = Request::header('Content-Type');
            $header1 = Request::header('h1');

            //https?
            $https = Request::secure();

            //ajax?
            $ajax = Request::ajax();

            //pega url
            //http://localhost:8000/ai/v1/conta/id/112351"
            $url = $request->url();

            //url + params
            $urlCompleta = $request->fullUrl();

            //busca caminho digitado na URL
            //api/v1/conta/id/1234
            $request->path(); 

            //valida path
            //true/false
            $eh = $request->is('api/v1/conta/id/*');

            //metodo
            $metodo = $request->isMethod('post');
    }
}