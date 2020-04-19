$(document).ready(function(){
	ContaAnos.init();
});

ContaAnos = {
		
	init: function(){
		ContaAnos.acoesDeElementos();
	},
		
	acoesDeElementos : function(){
		$("#mes-atual").click(function(e){
			e.preventDefault();
			var hoje = new Date();
			var ano = hoje.getFullYear();
			var mes = hoje.getMonth() + 1;
			mes = Geral.addZ(mes);

			window.location = "contas/" + ano + "-" + mes;
		});
		
	},
	

	
}