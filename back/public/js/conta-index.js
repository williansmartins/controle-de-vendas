$(document).ready(function(){
	if($("body").hasClass("contaIndex")){
		ContaIndex.init();
	}
});

var quantidadePorPagina = 10;
var mostrar = false;
var table = null;

ContaIndex = {

	id: null,
		
	init: function(){
		//this.buscaInicial();
		//ContaIndex.buscarFaltaPagar();
		ContaIndex.acoesDeElementos();
	},
		
	acoesDeElementos : function(){
		table = $(".table").DataTable({
			"pageLength": 100,
			"language": {
                "url": "/js/vendor/datatables/Portuguese-Brasil.json"
            },
            "dom": 'lrtip'
		});

		$('body').on('click', '.btn-excluir', function() {
			var id = $(this).parent().parent().data("id");
			$("#id").val(id);
		});

		$('body').on('click', '.btn-excluir-confirmar', function() {
			$('#delete-modal').modal('hide');
			ContaIndex.deleteEntity();
		});

		//$(".total").html("("+ vos.length +")");

		$("#anos").unbind().click(function(e){
			window.location = "conta-anos.php";
		});

		
		$(".btn-editar").click(function(e){
			e.preventDefault();
			
			var id = $(this).parent().parent().data("id");
			$("#id").val(id);
			var busca = Geral.getParameterByName("busca");
			window.location = "conta-edit.php?id="+id+"&busca="+busca;
		});

		// $("#search").parent().find("button").click(function(e){
		// 	ContaIndex.find();
		// });

		$('#search').on( 'keyup', function () {
		    table.search( this.value ).draw();
		} );
		
		$(".pagination li .paginas").unbind().click(function(e){
			e.preventDefault();
			
			var posicao = $(this).data("posicao");
			ContaIndex.findAllPaginado(posicao*quantidadePorPagina);
				
		});
		
		$(".prioridades").unbind().click(function(e){
			e.preventDefault();
			$("#prioridades").toggle();
			ContaIndex.trocarFundosDasPrioridades();
		});

		$(".paginacao").unbind().click(function(e){
			e.preventDefault();
			$("#bottom").toggle();
		});

		$(".pesquisa").unbind().click(function(e){
			e.preventDefault();
			$(".search").toggle();
		});
		
		$(".mes-atual").unbind().click(function(e){
			e.preventDefault();
			ContaIndex.buscarContasDoMes();
		});
		
		$(".todos-meses").unbind().click(function(e){
			e.preventDefault();
			$("#meses").toggle();
		});
		
		$(".mes").unbind().click(function(e){
			e.preventDefault();
			ContaIndex.buscarPorMes(this);
		});
		
		$("#nova_conta").unbind().click(function(e){
			e.preventDefault();
			var busca = Geral.getParameterByName("busca");
			window.location = "conta-edit.php?busca="+busca;
		});
	},

	buscarFaltaPagar: function(){
		var busca = Geral.getParameterByName("busca");

		ContaService.buscarFaltaPagar(busca)
		.success(function(response){
			var resultado = response.conta;
			var total = ContaIndex.calcularFaltaPagar(resultado);
			$("#resumo2 #falta-pagar .resumo-valor").html(total);
			MoneyUtil.formatCurrency();
		})
		.fail(function(response){
			Geral.apresentarMensagem("Ocorreu um erro.", 4, "erro");
		});
	},

	calcularFaltaPagar: function(resultado){
		var total = 0;
		var cont = 0;
		for (var i = 0; i<resultado.length; i++) {
			var valor = MoneyUtil.converterValorLiteralEmFloat(resultado[i]["valor"]);
			total += valor;
			cont++;
		}
		$("#cont-falta-pagar").html(cont);
		return total;
	},

	buscaInicial: function(){
		
		// var busca = Geral.getParameterByName("busca");
		
		// var url = "api.php/conta?order=vencimento&page=1,200&transform=1&filter[]=vencimento,cs,"+busca; 
		// var type = "GET";
		// var data = "";

		// Geral.aplicarLoading();

		//chamada
		// AjaxService.call(url, type, data)
		// .success(function(response){
		// 	var vos = response.conta;

		// 	$(".mes span").html("");
		// 	Geral.removerLoading();
		// 	ContaIndex.preencherTabelaDeCadastro(vos);
		// 	$(".total").html("("+ vos.length +")");

		// 	ContaIndex.acoesDeElementos();
		// 	Geral.removerLoading();
		// 	table = $(".table").DataTable({
		// 		"pageLength": 100,
		// 		"language": {
	 //                "url": "js/vendor/datatables/Portuguese-Brasil.json"
	 //            },
	 //            "dom": 'lrtip'
		// 	});
			
		// })
		// .fail(function(response){
		// 	Geral.apresentarMensagem("Ocorreu um erro.", 4, "erro");
		// 	Geral.removerLoading();
		// });
	},

	trocarFundosDasPrioridades: function(){
		mostrar=!mostrar;
		var table = $('.table').DataTable();

		if(mostrar){
			$(".categoria_0").parent().parent().addClass("background-green");
			$(".categoria_1").parent().parent().addClass("background-purple");
			$(".categoria_2").parent().parent().addClass("background-gray");
			$(".categoria_3").parent().parent().addClass("background-red");
			$(".categoria_4").parent().parent().addClass("background-blue");
			
			// Sort by column 1 and then re-draw
			table
			    .order( [ 9, 'asc' ] )
			    .draw();
		}else{
			$(".categoria_0").parent().parent().removeClass("background-green");
			$(".categoria_1").parent().parent().removeClass("background-purple");
			$(".categoria_2").parent().parent().removeClass("background-gray");
			$(".categoria_3").parent().parent().removeClass("background-red");
			$(".categoria_4").parent().parent().removeClass("background-blue");

			// Sort by column 1 and then re-draw
			table
			    .order( [ 0, 'asc' ] )
			    .draw();
		}

 
	},
	
	preencherTabelaDeCadastro: function(vos){
		var $container = $(".listagem");
		$container.empty();
		
		if(Geral.valorValido(vos)){
			var cont = 0;
			vos.forEach(function(entity){
				ContaIndex.adicionarLinha($container, entity, ++cont);
				ContaIndex.validarStatus(entity);
			});
			
			MoneyUtil.formatCurrency();

			$("#resumo #saida .resumo-valor").html(MoneyUtil.calcularSaida());
			$("#resumo #entrada .resumo-valor").html(MoneyUtil.calcularEntrada());
			$("#resumo #balanco-do-mes .resumo-valor").html(MoneyUtil.calcularBalanco());
			$("#resumo2 #ja-pago .resumo-valor").html(MoneyUtil.calcularJaPago());
			
			$("#resumo #prioridade0 .resumo-valor").html(MoneyUtil.calcularPrioridade(0));
			$("#resumo #prioridade1 .resumo-valor").html(MoneyUtil.calcularPrioridade(1));
			$("#resumo #prioridade2 .resumo-valor").html(MoneyUtil.calcularPrioridade(2));
			$("#resumo #prioridade3 .resumo-valor").html(MoneyUtil.calcularPrioridade(3));
			$("#resumo #prioridade4 .resumo-valor").html(MoneyUtil.calcularPrioridade(4));
			
			
			MoneyUtil.formatCurrency();
		}
	}, 
	
	validarStatus: function(entity){
		var $labelDeStatus = $("#status_"+entity.id);
		if(Geral.valorValido(entity.efetuado)){
			$labelDeStatus.addClass("label-success");
		}else{
			$labelDeStatus.addClass("label-danger");
		}
	},
	
	adicionarLinha: function($container, entity, cont){
		entity.vencimento = $.datepicker.formatDate('dd/mm/yy', new Date(entity.vencimento));

		var element ='' +
		'<tr data-id="'+entity.id+'" >' +
		'	<td>'+cont+'</td>' +
		'	<td class="hide">'+entity.id+'</td>' +
		'	<td>'+entity.vencimento+'</td>' +
		'	<td>'+entity.efetuado+'</td>' +
		'	<td>'+entity.descricao+'</td>' +
		'	<td class="hide">'+entity.forma+'</td>' +
		'	<td class="valor formatCurrency">'+entity.valor+'</td>' +
		'	<td class="valorPago formatCurrency">'+entity.valorPago+'</td>' +
		'	<td> <span class="status label" id="status_'+entity.id+'">--</span></td>' +
		'	<td> <span class="categoria categoria_'+entity.categoria+'">'+entity.categoria+'</span></td>' +
		'	<td class="actions">' +
		'		<a class="btn btn-success btn-xs btn-editar"  href="#">Editar</a>' +
		'		<a class="btn btn-danger btn-xs btn-excluir"  href="#" data-toggle="modal" data-target="#delete-modal">Excluir</a>' +
		'	</td>' +
		'</tr>';
		
		$container.append(element);
	},
	
	deleteEntity: function(){
		var id = $("#id").val();
		
		Geral.aplicarLoading();
		ContaService.deleteEntity(id)
		.success(function(response){
			Geral.removerLoading();
			Geral.apresentarMensagem("sucesso!", 3, "sucesso");
			setTimeout(ContaIndex.removerLinha, 3000, id);
		})
		.fail(function(response){
			Geral.removerLoading();
			Geral.apresentarMensagem("Ocorreu um erro.", 4, "erro");
		});
	},

	removerLinha: function(id){
		$(".listagem tr[data-id='"+id+"']").fadeToggle();
	},
	
}