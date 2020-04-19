$(document).ready(function(){
	
});

MoneyUtil = {
		
    formatCurrency: function() {
		$(".formatCurrency").formatCurrency({
			  decimalSymbol: ',', 
			  digitGroupSymbol: '.', 
			  positiveFormat: '%s %n',
			  negativeFormat: '-%s %n ',
			  colorize:true,
			  groupDigits: true,
			  symbol: 'R$ '
		});
	},
	
	trocarPontoPorVirgula: function( num ) {
		return num.toString().replace( '.', ',');
	},
	
	converterValorLiteralEmFloat: function( num ) {
		var numero = num.toString().replace( /\./g, ''); 	  //remover pontos de milhar
		numero = numero.toString().replace( 'R$', '');    //remover cifrão
		numero = numero.replace(/ /g,'');                 //remover espaço em branco
		numero = numero.replace( /,/g, '.');              //trocar virgulas por ponto
	    return parseFloat( numero ); 					  //converter em float
	},
	
	aplicarMascaraMoney: function(campo){
		$(campo).maskMoney({
			prefix:'R$ ', 
			allowNegative: true, 
			thousands:'.', 
			decimal:',', 
			affixesStay: true
		});
	},
	
	calcularBalanco: function(){
		var total = 0;
		$(".valor").each(function(){
			var valor = $(this).html();
			if(Geral.valorValido(valor)){
				valor = MoneyUtil.converterValorLiteralEmFloat(valor)
				total += valor;
			}
		})
		return total;
	},
	
	calcularSaida: function(){
		var total = 0;
		var cont = 0;
		$(".valor").each(function(){
			var valor = $(this).html();
			if(Geral.valorValido(valor)){
				valor = MoneyUtil.converterValorLiteralEmFloat(valor)
				if(valor<0){
					total += valor;
					cont++;
				}
			}
		})
		$("#cont-saida").html(cont);
		return total;
	},
	
	calcularPrioridade: function(numero){
		var total = 0;
		var cont = 0;
		$(".categoria_"+numero).each(function(){
			var valor = $(this).parent().parent().find(".valor").html();
			if(Geral.valorValido(valor)){
				valor = MoneyUtil.converterValorLiteralEmFloat(valor)
				if(valor>0){
					total += valor;
					cont++;
				}else{
					total += valor;
					cont++;
				}
			}
		})
		$("#cont-categoria_"+numero).html(cont);
		return total;
	},	

	calcularEntrada: function(){
		var total = 0;
		var cont = 0;
		$(".valor").each(function(){
			var valor = $(this).html();
			if(Geral.valorValido(valor)){
				valor = MoneyUtil.converterValorLiteralEmFloat(valor)
				if(valor>0){
					total += valor;
					cont++;
				}
			}
		})
		$("#cont-entrada").html(cont);
		return total;
	},
	
	calcularJaPago: function(){
		var total = 0;
		var cont = 0;
		$(".valorPago").each(function(){
			var valor = $(this).html();
			if(Geral.valorValido(valor)){
				valor = MoneyUtil.converterValorLiteralEmFloat(valor)
				if(valor<0){
					total += valor;
					cont++;
				}
			}
		})
		$("#cont-pago").html(cont);
		return total;
	},
	
	calcularBalanco: function(){
		var total = 0;
		$(".valor").each(function(){
			var valor = $(this).html();
			if(Geral.valorValido(valor)){
				valor = MoneyUtil.converterValorLiteralEmFloat(valor)
				total += valor;
			}
		})
		return total;
	},	

	calcularFaltaPagar: function(){
		var total = 0;
		//se a linha tiver valor negativo
		//verificar se ja foi pago
		//se nao foi pago  

		return total;
	},
		
}