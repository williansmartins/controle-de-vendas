$(document).ready(function(){
	CartaoEdit.acoesDeElementos();
	CartaoEdit.findEntity();
	CartaoEdit.init();
});

CartaoEdit = {
		
	init: function(){
		$("#nome_do_banco").focus();
		$("#ultima_atualizacao").mask("99/99/9999");
		MoneyUtil.aplicarMascaraMoney('#valor');
		
		$( ".data" ).datepicker({
			dateFormat: "dd/mm/yy",
			dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
		    dayNamesMin: ['D','S','T','Q','Q','S','S','D'],
		    dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],
		    monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
		    monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
		    nextText: 'Próximo',
		    prevText: 'Anterior'
		});
	},
	
	acoesDeElementos : function(){
		$("#ovo1").click(function(e){
			e.preventDefault();
			CartaoEdit.ovo1();
		});
		
		$("#form-salvar").submit(function(e){
			e.preventDefault();
			CartaoEdit.salvar();
		});
		
		$(".clear").click(function(e){
			e.preventDefault();
			var bind = $(this).data("bind");
			$("#"+bind).val("");
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
	
	salvar: function(){
		if($("#acao").val()=="update"){
			CartaoEdit.updateEntity();
		}else{
			CartaoEdit.saveEntity();
		}
	},

	findEntity: function(){
		var id = Geral.getParameterByName("id");
		if(id!=""){
			var params = {}
			params["id"] = id;
			CartaoController.findById(params).done(function(response){
				if(response.type == "success"){
					CartaoEdit.preencherDadosDaEntity(response.vo);
					// $("#codigo").attr("disabled", true);
					$("#acao").val("update");
				}else{
					console.error("Erro ao buscar Entity");
				}
			});
		}
	},
	
	saveEntity: function(){
		var params = CartaoController.getInputValues();
		
		CartaoController.saveEntity(params).done(function(response){
			if(response.type=="success"){
				console.info("SUCESSO");
				alert("Cadastrado efetuado com sucesso!");
				$("#main").prepend('<div class="alert alert-success alert-dismissible" role="alert">' +
						'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + 
						'<strong> Sucesso! </strong>' + 
						'</div>');
				setTimeout(Geral.redirecionar, 2000, home + "/cartao/index");
			}else{
				alert("Ocorreu um erro: " + response.message);
				console.info("ERRO");
			}
		});
	},
	
	updateEntity: function(){
		var params = CartaoController.getInputValues();

		CartaoController.updateEntity(params).done(function(response){
			if(response.type=="success"){
				console.info("SUCESSO");
				$("#main").prepend('<div class="alert alert-success alert-dismissible" role="alert">' +
						'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + 
						'<strong> Salvo com sucesso! </strong>' + 
						'</div>');
				setTimeout(Geral.redirecionar, 2000, home + "/cartao/index");
			}else{
				alert("Ocorreu um erro: " + response.message);
				console.info("ERRO");
			}
		});
	},
	
	preencherDadosDaEntity: function(entity){
		$("#id").val(entity.id);
		
		$("#nomeDoBanco").val(entity.nomeDoBanco);
		$("#numeroDoBanco").val(entity.numeroDoBanco);
		$("#agencia").val(entity.agencia);
		$("#conta").val(entity.conta);
		$("#gerente").val(entity.gerente);
		$("#senhaCartao").val(entity.senhaCartao);
		$("#senhaInternet").val(entity.senhaInternet);
		$("#senhaToken").val(entity.senhaToken);
		$("#senhaLetras").val(entity.senhaLetras);
		
		$("#valor").val(entity.valor);
		$("#ultimaAtualizacao").val(entity.ultimaAtualizacaoFormatada);
		$("#tipo").val(entity.tipo);
		
	},

	ovo1: function(){
		$("#id").val("1");
		$("#nomeDoBanco").val("Bradesco");
		$("#numeroDoBanco").val("123");
		$("#agencia").val("2384");
		$("#conta").val("64265-7");
		$("#gerente").val("Alex");
		$("#senhaCartao").val("123_cartao");
		$("#senhaInternet").val("123_internet");
		$("#senhaToken").val("123_token");
		$("#senhaLetras").val("123_letras");
		$("#valor").val("R$ 1234.99");
		$("#ultimaAtualizacao").val("11/12/2016");
		$("#tipo").val("corrente");
	},
}