var home = "";
var contentType = 'Content-type: text/plain; charset=UTF-8';

$(document).ready(function(){
	Geral.init();
});

Geral = {

	init: function(){
		Geral.prepararModais();
		$(".navbar-brand").click(function(){
			window.location = "index-admin.php";
		});
	},

	criarData: function(string){
		//from: 11/12/2013
		//to: new Date()
		
		var DD = string.substring(0,2); 
		var MM = string.substring(3,5);
		var YYYY = string.substring(6,10);

		var myDate = new Date( parseInt(YYYY,10), parseInt(MM,10)-1, parseInt(DD,10) );
		return myDate;
	},

	prepararModais: function(){
		ContaService.buscarModalDeMensagem().done(function(response){
			$("body").append(response);
		});
		ContaService.buscarModalDeExcluir().done(function(response){
			$("body").append(response);
		});
	},

	validarData: function(campo){
		var dataValida = Geral.isValidDate($(campo).val());
		if(!dataValida){
			alert("data inválida");
			$(campo).parent().addClass("has-error");
		}else{
			$(campo).parent().removeClass("has-error");
		}
	},
		
	getParameterByName : function( name ){
	  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	  var regexS = "[\\?&]"+name+"=([^&#]*)";
	  var regex = new RegExp( regexS );
	  var results = regex.exec( window.location.href );
	  if( results == null )
	    return "";
	  else
	    return decodeURIComponent(results[1].replace(/\+/g, " "));
	},
	
	redirecionar: function(url){
		window.location = url;
	},

	aplicarLoading: function() {
		// add the overlay with loading image to the page
//			console.info("loading open...");
        var over = '<div id="overlay">' +
            '<img id="loading" src="/img/w9.gif">' +
            '</div>';
        $(over).appendTo('body');

        // click on the overlay to remove it
        $('#overlay').click(function() {
            $(this).remove();
        });

        // hit escape to close the overlay
        $(document).keyup(function(e) {
            if (e.which === 27) {
                $('#overlay').remove();
            }
        });  
    },
    
    removerLoading: function() {
//	    	console.info("loading close...");
    	$('#overlay').remove();
    },
    
	isValidDate: function(stringval){
		var parts = stringval.split('/');
	    if (parts.length < 3)
	        return false;
	    else {
	        var day = parseInt(parts[0]);
	        var month = parseInt(parts[1]);
	        var year = parseInt(parts[2]);
	        if (isNaN(day) || isNaN(month) || isNaN(year)) {
	            return false;
	        }
	        if (day < 1 || year < 1)
	            return false;
	        if(month>12||month<1)
	            return false;
	        if ((month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) && day > 31)
	            return false;
	        if ((month == 4 || month == 6 || month == 9 || month == 11 ) && day > 30)
	            return false;
	        if (month == 2) {
	            if (((year % 4) == 0 && (year % 100) != 0) || ((year % 400) == 0 && (year % 100) == 0)) {
	                if (day > 29)
	                    return false;
	            } else {
	                if (day > 28)
	                    return false;
	            }      
	        }
	        return true;
	    }
	},
	
	sleep: function(milliseconds) {
	  	var start = new Date().getTime();
	  	for (var i = 0; i < 1e7; i++) {
	    	if ((new Date().getTime() - start) > milliseconds){
	      		break;
	    	}
	    }
	 },
	
	valorValido: function(item){
	 	return ((item!=undefined) && (item!=null) && (item!=""));
	},

	tratarCamposNullos: function(valor){
		if(!Geral.valorValido(valor)){
			valor = "-";
		}

		return valor;
	},

	apresentarMensagem : function(msg, segundos, tipo) {
		$('#mensagem-modal .mensagem').html(msg);
		// $(".modal-content .modal-body").append("<img class='icone'/>");
		// $(".modal-content .modal-body img").attr("src",
		// 		"/img/icone-mensagem-" + tipo + ".png");
		
		//se conseguiu salvar nome...
		var nome = "Usuário";
		if (typeof(Storage) !== "undefined") {
			nome = localStorage.getItem("nomeDoUsuario");
		}
		
		$(".modal-content #usuario").html(nome);
		$('#mensagem-modal').modal();
		setTimeout(Geral.fecharModal, segundos * 1000);
	},

	fecharModal : function() {
		$('#mensagem-modal').modal('hide');
		$('#mensagem-modal .mensagem').html("");
		// $(".modal-content .modal-body .icone").remove();
	},

	addZ: function(n){
		return n<10? '0'+n:''+n;
	}
}