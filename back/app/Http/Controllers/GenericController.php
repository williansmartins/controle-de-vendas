<?php



namespace App\Http\Controllers;



use Illuminate\Http\Request;

use Illuminate\Http\Response;

use App\Http\Controllers\Controller;

use Tymon\JWTAuth\JWTAuth;

use GuzzleHttp\Client;

use DateTime;


class GenericController extends Controller{

    public function __construct(JWTAuth $jwt){
        config(['app.timezone' => 'America/Brasilia']);
        $this->jwt = $jwt;
        $this->user = $this->jwt->parseToken()->authenticate();
        $this->url = env('URL_API_REST','xxx');
    }

    public function getAll(Request $request, $complemento){ 
        

        //dd($request->getPathInfo()); //"/api/v1/generic/user"
        // dd($_SERVER['REQUEST_URI']); //"/apps/barramento/public/api/v1/generic/user?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ey

        $complemento = $_SERVER['REQUEST_URI'];
        // dd($complemento); // /apps/controlei-4.0.0-back/public/api/v1/generic/
        $complemento = substr($complemento, strpos($complemento, 'generic/') + strlen('generic/'));
        // dd($complemento);

        $client = new Client();
        $res = $client->request('GET', $this->url.$complemento, [ 

            'form_params' => [
                'client_id' => 'test_id',
                'secret' => 'test_secret',
            ]

        ]);

        return json_decode($res->getBody(), true);
    }

    public function getOne(Request $request, $complemento, $id){ 
        try{
            // $client = new Client();
            //ignorando o tratamento de erro interno do guzzle
            $client = new \GuzzleHttp\Client(['http_errors' => false]);

            $res = $client->request('GET', $this->url.$complemento.'/'.$id, [ ]);
            
            $statuscode = $res->getStatusCode();
            
            if (404 === $statuscode) {
                return response('erro', 404)
                ->header('Content-Type', 'text/plain');
            }
            return json_decode($res->getBody(), true);

        }catch(Exception $e){
            return response('Erro ao buscar um', 500)
            ->header('Content-Type', 'text/plain');
        }

    }

    public function getMine(Request $request, $complemento){ 
        $client = new Client();
        $res = $client->request('GET', $this->url.$complemento.'?filter=user_id,eq,'.$this->user->id.'&transform=1', [ ]);

        return json_decode($res->getBody(), true);
    }

    public function create(Request $request){
        $bodyContent = $request->getContent();

        $complemento = $_SERVER['REQUEST_URI'];
        $complemento = substr($complemento, strpos($complemento, 'generic/') + strlen('generic/'));

        $client = new Client();

        $bodyNok = json_decode($bodyContent, true);
        // $bodyOk = [
        //                 'name' => 'nome4',
        //                 'email' => 'email6@teste.com',
        //                 'tipo' => 'w',
        //                 'password' => 'password',
        //                 'created_at' => '2018-07-30 11:00:19',
        //                 'updated_at' => '2018-08-30 11:00:19'
        //             ];

        $arrayFinal = $bodyNok;

        // dd(config('app.timezone'));
        //dd($dataFormatada);
        //TODO: esta pegando horario errado(+3h +-)
        if( !isset($arrayFinal['created_at']) ){
            $hoje = new DateTime();
            $dataFormatada = $hoje->format('Y-m-d H:i:s');
            $arrayFinal['created_at'] = $dataFormatada;
        }
        $arrayFinal['updated_at'] = null;

        if( !isset($arrayFinal['user_id']) ){
            $arrayFinal['user_id'] = $this->user->id;
        }

        // dd($arrayFinal);

        try{
            $res = $client->request('POST', $this->url.$complemento, [ 
                'form_params' => $arrayFinal
            ]);

            return $res->getBody();

        }catch(Exception $e){
            return "erro ao criar: " . $e ;
        }
    }

    public function delete($complemento, $id){
        $this->url = $this->url.$complemento.'/'.$id;
        //dd($this->url);

        $client = new Client();
        $res = $client->request('DELETE', $this->url, [

        ]);

        return $res->getBody();
    }

    public function update(Request $request, $complemento, $id){
        $bodyContent = $request->getContent();
        $client = new Client();
        $bodyNok = json_decode($bodyContent, true);
        $arrayFinal = $bodyNok;

        $hoje = new DateTime();
        $dataFormatada = $hoje->format('Y-m-d H:i:s');
        $arrayFinal['updated_at'] = $dataFormatada;

        try{
            $res = $client->request('PUT', $this->url.$complemento.'/'.$id, [ 
                'form_params' => $arrayFinal
            ]);

            return $res->getBody();

        }catch(Exception $e){
            return "erro ao atualizar: " . $e ;
        }

    }

}