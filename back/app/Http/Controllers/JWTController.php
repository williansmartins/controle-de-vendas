<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Tymon\JWTAuth\JWTAuth;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Exceptions\JWTException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class JWTController extends Controller
{
    /**
     * API action to login
     * @param Request $request
     * @return Json Response
     */
    public function signIn(Request $request, JWTAuth $JWTAuth){
        $credentials = $request->only(['email', 'password']);
        try {
            $token = $JWTAuth->attempt($credentials);
            $user = $JWTAuth->toUser($token);

            if(!$token) {
                throw new AccessDeniedHttpException();
            }
        } catch (JWTException $e) {
            return response()->json(['status' => 'error', 'message' => 'Ocorreu um erro, entre em contato com o administrador'], 500);
        }
        return response()->json(['status' => 'ok', 'token' => $token, 'user' => $user]);
    }

    /**
     * Validando se ja existe o usuario na base
     * @param Request $request
     * @return Json Response
     */
    public function validarDisponibilidade(Request $request, JWTAuth $JWTAuth){
        $rules = ['email' => 'required|unique:users'];
                
        try {
            if($this->validate($request, $rules)){
                return response()->json(['status' => 'sucesso', 'message' => "nao sei porque caiu aqui"], 200);
            }else{
                return response()->json("ok", 200); 
            }
        } catch(\Exception $e) {
        	//cai aqui quando ja existe um usuario
            return response()->json(['status' => 'error', 'message' => "indisponivel"], 406);
        }

    }

    /**
     * API action to create a new user(register)
     * @param Request $request JWTAuth $JWTAuth
     * @return Json Response
     */
    public function signUp(Request $request, JWTAuth $JWTAuth){
        $rules = ['name' => 'required',
                'email' => 'required|unique:users',
                'password' => 'required',
                'tipo' => 'required'];
                
        //alguma coisa acontecendo aqui
        try {
            if($this->validate($request, $rules)){
                return response()->json(['status' => 'error']);
            }else{
        		//dd(2);
            	
            }
        } catch(\Exception $e) {
            $erro =  $e->getMessage();
            return response()->json(['status' => 'error', 'message' => "validacao"], 500);
        }

        $request['password'] = bcrypt($request['password']);
        $user = new User($request->all());
        
        try {
            if(!$user->save()) {
                throw new HttpException(500);
            }
        }catch(\Exception $e) {
            return response()->json(['status' => 'error', 'message' => "Erro ao criar conta"], 500);
        }    

        $token = $JWTAuth->fromUser($user);
        return response()->json(['status' => 'ok', 'token' => $token, 'user' => $user]);
    }

    /**
     * API action to generate password
     * @param Request $request
     * @return Json Response
     */
    public function genpass(Request $request){
        $password = $request['password'] = bcrypt($request['password']);
        
        try {
	        $user = new User($request->all());
        }catch(\Exception $e) {
            return response()->json(['status' => 'error', 'message' => "Erro ao gerar senha"], 500);
        }    

        return response()->json(['status' => 'ok', 'password' => $password]);
    }

    /**
     * API action to logout user
     * @param JWTAuth $JWTAuth
     * @return Void
     */
    public function logout(JWTAuth $JWTAuth){
        try {
            $JWTAuth->invalidate($JWTAuth->getToken());
        } catch (JWTException $e) {
            return response()->json(['status' => 'error', 'error' => 'Usuário não está logado']);
        }
    }

    /**
     * buscar todos usuarios
     * @param JWTAuth $JWTAuth
     * @return Void
     */
    public function getAll(JWTAuth $JWTAuth){
        try {
            $users = User::all();
            return response()->json($users);
        } catch (JWTException $e) {
            return response()->json(['status' => 'error', 'error' => 'Usuário não está logado']);
        }
    }

    /**
     * API action to get user information
     * @param JWTAuth $JWTAuth
     * @return Json response
     */
    public function getUser(JWTAuth $JWTAuth){
        try{
            $user = $JWTAuth->parseToken()->authenticate();
            return response()->json(['status' => 'ok', 'user' => $user]);
        } catch(JWTException $e){
            return response()->json(['status' => 'error', 'message' => 'Faça login novamente']);
        }
    }

    /**
     * API action to update user information
     * @param Request $request JWTAuth $JWTAuth
     * @return Json response
     */
    public function update(Request $request, JWTAuth $JWTAuth){
        try{
            $user = $JWTAuth->parseToken()->authenticate();
        } catch(JWTException $e){
            return response()->json(['status' => 'error', 'message' => 'Faça login novamente']);
        }
        $user->name = isset($request->name) ? $request->name : $user->name;
        $user->email = isset($request->email) ? $request->email : $user->email;
        $user->password = isset($request->password) ? bcrypt($request->password) : $user->password;
        $user->save();
        return response()->json(['status' => 'ok', 'user' => $user, 'token' => $JWTAuth->fromUser($user)]);
    }

    /**
     * API action to test if it's connected
     * @param JWTAuth $JWTAuth
     * @return Json response
     */
    public function isOnline(JWTAuth $JWTAuth){
        /*Se preferir fazer a verificação em cada action separada
          basta descomentar o trecho abaixo e retirar o middleware de api
          dentro do arquivo app/Http/routes.php
        try{
            $JWTAuth->parseToken()->authenticate();
        } catch(JWTException $e){
            return response()->json(['status' => 'error', 'message' => 'Faça login novamente']);
        }*/
        return response()->json(['status' => 'ok', 'message' => 'Você está logado']);
    }
}
