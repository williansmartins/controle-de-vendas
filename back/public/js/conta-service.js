ContaService = {

	buscarFaltaPagar: function(busca){
		return $.ajax({
			url: "api.php/conta?filter[]=valorPago,eq,&filter[]=vencimento,cs,"+busca+"&filter[]=valor,cs,-&satisfy=all&columns=valor&transform=1",
			type: "GET",
		});
	},

	createEntity: function(params) {
		return $.ajax({
			url: "api.php/conta/",
			type: "POST",
			data: params
		});
	},
	
	updateEntity: function(params) {
		return $.ajax({
			url: "api.php/conta/"+ContaEdit.id,
			type: "PUT",
			data: params
		});
	},
	
	deleteEntity: function(id){
		return $.ajax({
			url: "/api/v1/contas/"+id,
			type: "DELETE",
			headers: {
		        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		    }
		});
	},

	buscarModalDeMensagem: function(params){
		return $.ajax({
			type : "GET",
			contentType : contentType,
			url : "/modais/modal-mensagem.html",
			data: params
		});
	},	

	buscarModalDeExcluir: function(params){
		return $.ajax({
			type : "GET",
			contentType : contentType,
			url : "/modais/modal-excluir.html",
			data: params
		});
	},


}
