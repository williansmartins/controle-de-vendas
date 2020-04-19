<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\SoftDeletes;

class Conta extends Model
{
    //cofiguracoes
    use SoftDeletes;

    protected $table = 'movimento';
    public $timestamps = true;
    protected $primaryKey = 'id';
    protected $fillable = ['user_id', 'descricao', 'categoria', 'valor', 'vencimento', 'ultimaParcela', 'totalDeParcelas', 'tipo', 'detalhes', 'ultima_parcela', 'totalDeParcelas' ];
    // protected $hidden = ['ultimaParcela', 'totalDeParcelas'];
    // protected $guarded = ['efetuado', 'codigo', 'valorPago', 'forma'];

    protected $dates = ['deleted_at'];

    public function user(){
    	return $this->belongsTo('App\User');
    }

    public function getAllContas()
    {
        return self::all();
    }

    public function getAllContasLogado($id)
    {
        return Conta::all()->where('user_id', $id);
    }

    public function saveConta($id)
    {
        $input = Request::all();
        $conta = new Conta();
        $conta->fill($input);
        $conta->user_id = $id;
	
	//dd($conta->ultimaParcela);

      	if($conta->totalDeParcelas != ""){
        	$conta->quantidade_de_parcelas = $conta->totalDeParcelas;        	
        } 
	unset($conta->totalDeParcelas);

	
        if($conta->ultimaParcela != ""){
        	$conta->ultima_parcela = $conta->ultimaParcela;        	
        }
	unset($conta->ultimaParcela);  
        
	/*
        if($conta->efetuado == ""){
        	// dd("caiu");
        	$conta->efetuado = null;
        }
	*/

        $conta->save();

        $conta = Conta::find($conta->id);
        return $conta;
    }

    public function getConta($id)
    {
        $conta = Conta::find($id);
        if(is_null($conta)){
            return false;
        }else{
            return $conta;
        }
    }

    public function getContaPorPeriodo($ano, $mes, $id)
    {
	$contas = DB::select(" CALL buscarMovimentos('$ano-$mes', $id) ");
		

        //dd($contas);
        return $contas;
    }

    public function deleteConta($id)
    {
        $conta = Conta::find($id);
        if(is_null($conta)){
            return false;
        }else{
            return $conta->delete();
        }
    }

    public function updateConta($id)
    {
        $conta = Conta::find($id);

        if(is_null($conta)){
            return false;
        }else{
            $input = Request::all();
            $conta->fill(Request::all());
	    
	    //dd($conta->totalDeParcelas != "" || $conta->totalDeParcelas == 0);
      	    if($conta->totalDeParcelas != "" || $conta->totalDeParcelas == 0){
        	$conta->quantidade_de_parcelas = $conta->totalDeParcelas;        	
            } 
	    unset($conta->totalDeParcelas);
	    //dd($conta->quantidade_de_parcelas);
	
            if($conta->ultimaParcela != ""){
        	$conta->ultima_parcela = $conta->ultimaParcela;        	
            }
	    unset($conta->ultimaParcela);


	
            $conta->save();
            return $conta;
        }
    }


}
