<?php

use App\Conta;

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::group(['prefix' => 'laravel'], function(){

	Route::get('/teste', function() {
	    return '<h1>Teste</h1>';
	});

	//Clear Cache facade value:
	Route::get('/clear-cache', function() {
	    $exitCode = Artisan::call('cache:clear');
	    return '<h1>Cache facade value cleared</h1>';
	});

	//Reoptimized class loader:
	Route::get('/optimize', function() {
	    $exitCode = Artisan::call('optimize');
	    return '<h1>Reoptimized class loader</h1>';
	});

	//Clear Route cache:
	Route::get('/route-cache', function() {
	    $exitCode = Artisan::call('route:cache');
	    return '<h1>Route cache cleared</h1>';
	});

	//Clear View cache:
	Route::get('/view-clear', function() {
	    $exitCode = Artisan::call('view:clear');
	    return '<h1>View cache cleared</h1>';
	});

	//Clear Config cache:
	Route::get('/config-cache', function() {
	    $exitCode = Artisan::call('config:cache');
	    return '<h1>Clear Config cleared</h1>';
	});
});


Route::match(array('GET', 'POST'), '/', function () {
    return view('index');
});

Route::group(['prefix' => 'api'], function(){
    
    Route::get('/', function() { 
        return view('index');
    });

    Route::group(['prefix' => 'v1'], function(){

        Route::get('/', function() { 
            return view('index');
        });
        
        //generic
        Route::group(['prefix' => 'generic', 'middleware' => 'api'], function(){
            Route::get('{complemento}', ['uses' => 'GenericController@getAll']);
            Route::get('{complemento}/{id}', ['uses' => 'GenericController@getOne']);
            Route::get('{complemento}/get/mine', ['uses' => 'GenericController@getMine']);
            Route::post('{complemento}', ['uses' => 'GenericController@create']);
            Route::delete('{complemento}/{id}', ['uses' => 'GenericController@delete']);
            Route::put('{complemento}/{id}', ['uses' => 'GenericController@update']);
        });

        //authenticated routes  
        Route::group(['prefix' => 'auth', 'middleware' => 'api'], function(){
            Route::get('user',          'JWTController@getUser');
            Route::post('user/update',  'JWTController@update');
            Route::get('online',        'JWTController@isOnline');
            Route::get('getAll',        'JWTController@getAll');
        });

        //not authenticated routes
        Route::post('signup',  'JWTController@signUp');
        Route::post('genpass', 'JWTController@genpass');
        Route::post('signin',  'JWTController@signIn');
        Route::post('logout',  'JWTController@logout');
        Route::post('validarDisponibilidade', 'JWTController@validarDisponibilidade');

        Route::get('categoria',   'ServicoController@getCategorias');
        Route::get('concorrenteMine',   'ServicoController@getConcorrentesMine');
        Route::get('concorrente', 'ServicoController@getConcorrentes');
        Route::post('upload',     'ServicoController@upload');
    });
});





