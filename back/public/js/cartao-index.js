$(document).ready(function(){
	CartaoIndex.acoesDeElementos();
	CartaoIndex.init();
});

var quantidadePorPagina = 10;
var quantidadeDeEntities = 0;
var quantidadeDeLis = 0;

CartaoIndex = {
		
	init: function(){
		Geral.aplicarLoading();
		CartaoController.getQuantidade().done(function(response){
			Geral.removerLoading();
			if(response.type="success"){
				quantidadeDeEntities = response.message;
				quantidadeDeLis = Math.floor(quantidadeDeEntities/quantidadePorPagina);
				CartaoIndex.popularPaginacao();
				CartaoIndex.findAllPaginado(0);
				$(".pagination>li:first").next().find("a").trigger( "click" );
			}else{
				alert(response.message);
			}
		});
	},
		
	acoesDeElementos : function(){
		$(".btn-excluir-confirmar").unbind().click(function(e){
			e.preventDefault();
			CartaoIndex.deleteEntity();
		});
		
		$(".btn-excluir").click(function(e){
			e.preventDefault();
			var id = $(this).parent().parent().data("id");
			$("#id").val(id);
		});
		
		$(".btn-editar").click(function(e){
			e.preventDefault();
			
			var id = $(this).parent().parent().data("id");
			$("#id").val(id);
			Geral.aplicarLoading();
			window.location = home + "/cartao/editar?id="+id;
		});

		$("#search").parent().find("button").click(function(e){
			CartaoIndex.find();
		});
		
		$(".pagination li .paginas").unbind().click(function(e){
			e.preventDefault();
			
			var posicao = $(this).data("posicao");
			CartaoIndex.findAllPaginado(posicao*quantidadePorPagina);
				
		});
		
		$(".paginacao").unbind().click(function(e){
			e.preventDefault();
			$("#bottom").toggle();
		});

		$(".pesquisa").unbind().click(function(e){
			e.preventDefault();
			$(".search").toggle();
		});
		
		$(".todos-meses").unbind().click(function(e){
			e.preventDefault();
			$("#meses").toggle();
		});
		
		$(".mes").unbind().click(function(e){
			e.preventDefault();
			CartaoIndex.buscarPorMes(this);
		});
		
	},

	popularPaginacao: function(){
		for (var cont = quantidadeDeLis; cont >=0; cont--) {
			var li = '<li><a href="#" class="paginas" data-posicao="'+cont+'">'+cont+'</a></li>';
			$(".pagination .prev").after(li);
		}
		
		CartaoIndex.acoesDeElementos();
	},
	
	find: function(){
		var search = $("#search").val();
		var params = {}
		params["search"] = search;
		Geral.aplicarLoading();
		CartaoControllerController.find(params).done(function(response){
			Geral.removerLoading();
			if(response.type="success"){
				var vos = response.vos;
				CartaoIndex.preencherTabela(vos);
				CartaoIndex.acoesDeElementos();
			}else{
				alert(response.message);
			}
		});	
	},
	
	findAll: function(){
		Geral.aplicarLoading();
		CartaoController.findAll().done(function(response){
			Geral.removerLoading();
			if(response.type="success"){
				var vos = response.vos;
				CartaoIndex.paginou(0); 
				CartaoIndex.preencherTabela(vos);
				CartaoIndex.acoesDeElementos();
			}else{
				alert(response.message);
			}
		});	
	},
	
	findAllPaginado: function(inicio){
		var params = {}
		params["inicio"] = inicio;
		params["total"] = quantidadePorPagina;
		
		Geral.aplicarLoading();
		CartaoController.findAllPaginado(params).done(function(response){
			Geral.removerLoading();
			if(response.type="success"){
				var vos = response.vos;
				CartaoIndex.preencherTabela(vos);
				CartaoIndex.acoesDeElementos();
			}else{
				alert(response.message);
			}
		});	
	},
	
	deleteEntity:function(){
		var params = CartaoController.getInputValues();
		
		Geral.aplicarLoading();
		CartaoController.deleteEntity(params).done(function(response){
			Geral.removerLoading();
			$('.modal').modal('toggle'); 
			$("#main").prepend('<div class="alert alert-success alert-dismissible" role="alert">' +
					'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + 
					'<strong> Item removido com sucesso! </strong>' + 
					'</div>');
			setTimeout(Geral.redirecionar, 2000, home + "/cartao/index");
		});
	},
	
	preencherTabela: function(vos){
		var valor = 0;
		var $container = $(".listagem");
		$container.empty();
		
		if(Geral.valorValido(vos)){
			vos.forEach(function(entity){
				valor += parseFloat(entity.valor);
				var element ='' +
				'<tr data-id="'+entity.id+'" >' +
				'	<td>'+entity.nomeDoBanco+'</td>' +
				'	<td>'+entity.agencia+'</td>' +
				'	<td>'+entity.conta+'</td>' +
				'	<td class="valor formatCurrency">'+entity.valor+'</td>' +
				'	<td class="actions">' +
				'		<a class="btn btn-success btn-xs btn-editar"" href="#">Editar</a>' +
				'		<a class="btn btn-danger btn-xs btn-excluir"  href="#" data-toggle="modal" data-target="#delete-modal">Excluir</a>' +
				'	</td>' +
				'</tr>';
				
				$container.append(element);
			});
			MoneyUtil.formatCurrency();
			$("#resumo #balanco-do-mes .resumo-valor").html(MoneyUtil.calcularBalanco());
			MoneyUtil.formatCurrency();
		}
	}, 
	
}