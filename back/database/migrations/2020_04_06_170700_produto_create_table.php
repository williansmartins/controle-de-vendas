<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ProdutoCreateTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
    	Schema::create('produto', function (Blueprint $table) {
            //core
            $table->increments('id');
            $table->string('titulo');
            $table->string('descricao');
            $table->string('marca');        
            $table->decimal('valor_pago', 8, 2);
            $table->decimal('valor_da_etiqueta', 8, 2);
            $table->decimal('valor_dolar', 8, 2);
            $table->decimal('imposto', 8, 2);
            $table->decimal('desconto', 8, 2);
            $table->string('status');       
            $table->string('pagamento_forma');      
            $table->string('pagamento_detalhes');       
            $table->string('comprador');        
            $table->string('imagem');       
            
            //track
            $table->timestamps();
            $table->softDeletes();
	    });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
    	Schema::dropIfExists('produto');
    }
}