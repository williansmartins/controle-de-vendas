$(document).ready(function(){
	Clonar.init();
});

Clonar = {

	id: null,
	de_mes: null,
	de_ano: null,
	para_mes: null,
	para_ano: null,
	contas: null,
	unlock_de: false,
	unlock_para: false,
		
	init: function(){
		Clonar.aplicarCalendario();
		Clonar.acoesDeElementos();
	},

	aplicarCalendario: function(){
		$( "#de" ).datepicker({
			dateFormat: "mm/yy",
			dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
		    dayNamesMin: ['D','S','T','Q','Q','S','S','D'],
		    dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],
		    monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
		    monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
		    nextText: 'Próximo',
		    prevText: 'Anterior',
		    changeMonth: true,
      		changeYear: true,
      		showButtonPanel: true,
      		onClose: function(dateText, inst) { 
	            $(this).datepicker('setDate', new Date(inst.selectedYear, inst.selectedMonth, 1));
	            Clonar.de_mes = (inst.selectedMonth+1);
	            Clonar.de_ano = inst.selectedYear;
	            unlock_de = true;
	            Clonar.buscarMes();
	        },
	        beforeShow: function(input, inst) {
		       $('.ui-datepicker-calendar').addClass("xxx");
		   },
		});
		$( "#para" ).datepicker({
			dateFormat: "mm/yy",
			dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
		    dayNamesMin: ['D','S','T','Q','Q','S','S','D'],
		    dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],
		    monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
		    monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
		    nextText: 'Próximo',
		    prevText: 'Anterior',
		    changeMonth: true,
      		changeYear: true,
      		showButtonPanel: true,
      		onClose: function(dateText, inst) { 
	            $(this).datepicker('setDate', new Date(inst.selectedYear, inst.selectedMonth, 1));
	            Clonar.para_mes = (inst.selectedMonth+1);
	            Clonar.para_ano = inst.selectedYear;
	            unlock_para = true;
	        },
	        beforeShow: function(input, inst) {
		       $('.ui-datepicker-calendar').addClass("xxx");
		   },
		});
	},
	
	acoesDeElementos : function(){

		$("#buscar").click(function(e){
			e.preventDefault();
			Clonar.buscarMes();
		});

		$("#clonar").click(function(e){
			e.preventDefault();
			Clonar.clonarMes();
		});
		
	},

	mudarMeses: function(){
		var dfd = $.Deferred();
		Clonar.contas.forEach(function(entity, index){
			var novoVencimento = Geral.criarData(entity.vencimento);

			novoVencimento.setMonth(Clonar.para_mes-1);
			novoVencimento.setFullYear(Clonar.para_ano);

			entity.vencimento = novoVencimento.getFullYear()+"-"+(Geral.addZ(novoVencimento.getMonth()+1))+"-"+Geral.addZ(novoVencimento.getDate()) + " 0:00:00" ;
			entity.id = "";
		});
		Clonar.contas.forEach(function(entity, index){
			//console.info(entity.vencimento);
		});
		dfd.resolve();
		return dfd.promise();
	},

	clonarMes: function(){
		if( (Clonar.de_mes+Clonar.de_ano!=Clonar.para_mes+Clonar.para_ano) ) {
			Geral.aplicarLoading();
			
			Clonar.mudarMeses()
			.done(function(response){
				Clonar.contas.forEach(function(entity, index){
					ContaService.createEntity(entity)
					.success(function(response){
						//Geral.apresentarMensagem("Sucesso!", 3, "sucesso");
						//console.info(response);
					})
					.fail(function(response){
						Geral.apresentarMensagem("Ocorreu um erro.", 4, "erro");
					})
					.always(function(response){
						Geral.removerLoading();
						Geral.apresentarMensagem("Sucesso!", 4, "erro");
					});
				});
			})
			.fail(function(response){
				Geral.apresentarMensagem("Ocorreu um erro.", 4, "erro");
				Geral.removerLoading();
			})
			.always(function(response){

			});

		}else{
			alert("Não vai querer clonar um mês que é igual vai?");
		}
	},

	buscarMes: function(){

		var busca = Clonar.de_ano + "-" + Geral.addZ(Clonar.de_mes); 
		var url = "api.php/conta?order=vencimento&page=1,200&transform=1&filter[]=vencimento,cs,"+busca; 
		var type = "GET"; 
		var data = "";

		Geral.aplicarLoading();

		//chamada
		AjaxService.call(url, type, data)
		.success(function(response){
			var vos = response.conta;
			Clonar.contas = response.conta;

			Geral.removerLoading();
			ContaIndex.preencherTabelaDeCadastro(vos);
			$(".total").html("("+ vos.length +")");

			Geral.removerLoading();
			
			if(table!=null){table.destroy();}

			table = $(".table").DataTable({
				"pageLength": 100,
				"language": {
	                "url": "js/vendor/datatables/Portuguese-Brasil.json"
	            },
	            "dom": 'lrtip'
			});
			
		})
		.fail(function(response){
			Geral.apresentarMensagem("Ocorreu um erro.", 4, "erro");
			Geral.removerLoading();
		});
	},
	
}