<?php



namespace App\Http\Controllers;



use Illuminate\Http\Request;

use Illuminate\Http\Response;

use App\Http\Controllers\Controller;

use Tymon\JWTAuth\JWTAuth;

use GuzzleHttp\Client;

use DateTime;


class ServicoController extends Controller{

    public function __construct(){
        $this->url = env('URL_API_REST','xxx');
    }

    public function getCategorias(Request $request){ 
        $client = new Client();
        $res = $client->request('GET', $this->url."categoria?transform=1", [ ]);

        return json_decode($res->getBody(), true);
    }

    public function getConcorrentes(Request $request){ 
        $client = new Client();
        $res = $client->request('GET', $this->url."concorrente?transform=1", [ ]);

        return json_decode($res->getBody(), true);
    }

    public function upload(Request $request){
    
        if($request->hasFile('files') and $request->file('files')->isValid()){
    
        
            $file = $request->file('files'); 
            
            $destinationPath = public_path().DIRECTORY_SEPARATOR.'upload';

            //montando o nome
            // date_default_timezone_set('America/Sao_Paulo');
            $name = date("Y-m-d-H-i-s");
            // dd($name);
            // $extension = $file->guessExtension();
            // dd($extension);
            $fullName = $name.".jpg";
            // dd($fullName);
    
            $rrr = $request->file('files')->move($destinationPath, $fullName);
        
        
            return response()->json([
                'url' => $fullName,
                //'rrr' => $destinationPath, $fullName
            ]);
        }else{
            return response()->json([
                'nada bom' => 'nao mesmo',
            ]);
        }
    }

}