var pageScriptProfile = {
	
	/******************************************************
	/	Deklaracje	zmiennych
	/*****************************************************/
	
	// wygenerowanie adresów obrazków
	icons: {
			avatarMaleIcon: '<img src="' + SOPIconfig.resourcesUrl + 'img/avatar_male.png" style="width: 20px;">',
			avatarFemaleIcon:  '<img src="' + SOPIconfig.resourcesUrl + 'img/avatar_female.png" style="width: 20px;">',
			avatarOtherIcon:  '<img src="' + SOPIconfig.resourcesUrl + 'img/avatar_other.png" style="width: 20px;">',
			avatarMale: '<img src="' + SOPIconfig.resourcesUrl + 'img/avatarMale.png" style="width: 128px;">',
			avatarFemale:  '<img src="' + SOPIconfig.resourcesUrl + 'img/avatarFemale.png" style="width: 128px;">',
			avatarOther:  '<img src="' + SOPIconfig.resourcesUrl + 'img/avatarOther.png" style="width: 128px;">',
			activeIcon:  '<img src="' + SOPIconfig.resourcesUrl + 'img/active.png" style="width: 18;">',
			deleteIcon:  '<img src="' + SOPIconfig.resourcesUrl + 'img/delete.png" style="width: 20;">',
			detailIcon:  '<img src="' + SOPIconfig.resourcesUrl + 'img/detail.png" style="width: 20;">',
			editIcon:  '<img src="' + SOPIconfig.resourcesUrl + 'img/edit.png" style="width: 20;">',
			userIcon:  '<img src="' + SOPIconfig.resourcesUrl + 'img/web_account.png" style="width: 20;">',
	},
		
	// konstruktor
	_create: function(){
				
		console.log('SOPI PageScript for Profile page loaded.');
		
		var icons = this.icons;
		
		/******************************************************
		/	Funkcje obsługi onClick - dodanie eventów
		/*****************************************************/
		
		// Usuwanie użytkownika AJAX
		$('#DcmButton').on('click',function(){
			var profileId =  parseInt($(this).attr('profileId'));
			
			$('#Dcm').modal('toggle');
						
			SOPI_ajaxJson({
				url: SOPIconfig.ajaxDomainUrl + 'api/module/profile/delete/' + profileId,
				method: 'DELETE',
				contentType: "application/json; charset=utf-8",
				record: profileId,
				message: 'Usunięcie profilu',
				actionSuccess: function(){
					$('#Plc').tabulator("deleteRow", profileId);
				}
			});
			
		});
		
		$('#ApcButton').on('click',function(){
						
			var collapse = $('#Apc');
			collapse.collapse('toggle');
		});
		
		$('#Apc').on('hide.bs.collapse', function () {
			$('#ApcButton').removeClass('btn-danger').addClass('btn-success');
			$('#ApcButton').html('Nowy profil');
			$('#ApcFormButton').html('Dodaj profil');
			$('#ApcFormButton').attr('profileId',false);
			
			$('#ApcInfoEdit').hide();
			$('#ApcInfoNew').show();
			
			$('#ApcForm').trigger("reset");
		});
		
		$('#ApcFormButton').on('click',function(){	
			
			var form = $('#ApcForm');
			
			if($(form).smkValidate()){
				var formJson = form.serializeJSON();
								
				if ($(this).attr('profileId') > 0) {
				
					formJson.profileId = $(this).attr('profileId');
					
					SOPI_ajaxJson({
						url: SOPIconfig.ajaxDomainUrl + 'api/module/profile/set/' + formJson.profileId,
						method: 'PUT',
						data: JSON.stringify(formJson),
						contentType: "application/json; charset=utf-8",
						record: formJson.profileId,
						message: 'Aktualizacja profilu',
						actionSuccess: function(){
							$('#Plc').tabulator("setData");
						}
					});
					
				} else {
					
					SOPI_ajaxJson({
						url: SOPIconfig.ajaxDomainUrl + 'api/module/profile/add',
						method: 'POST',
						data: JSON.stringify(formJson),
						contentType: "application/json; charset=utf-8",
						record: 'Nowy',
						message: 'Dodawanie nowego profilu',
						actionSuccess: function(){
							$('#Plc').tabulator("setData");
						}
					});
				}

			};
		});
		
		
		/******************************************************
		/	Definicje tabulatorów - wygenerowanie i wstawienie tabulatorów
		/*****************************************************/
			
		// Tabulator profili		
		$('#Plc').tabulator({
		ajaxURL: SOPIconfig.ajaxDomainUrl + 'api/module/profile/get',
		ajaxHeaders: { "X-Auth-Token": sessionStorage.getItem('authtoken') },
		index: 'profileId',
		fitColumns:true,
		pagination: true,
		paginationSize: 15,
		height: 550,
		sortable: false,
		tooltips:true,
		columns: 
			[
			 {
				title: "ID",
				field: "profileId",
				width: 40
			 },
			{
				title: 'Typ profilu',
				field: 'type',
				width: 100
			},
			{
				field: 'hasUser',
				formatter: function(value){ return value ? icons.userIcon : ''; },
				width: 32
			},
			{
				title: 'Nazwisko',
				field: 'nazwisko',
				width: 130,
				formatter: function(value){ return '<b>' + value + '</b>'; }
			},
			{
				title: 'Imie',
				field: 'imie',
				width: 110,
				formatter: function(value){ return '<b>' + value + '</b>'; }
			},
			{
				title: 'Pesel',
				field: 'pesel',
				width: 115
			},
			{
				title: 'Data urodzenia',
				field: 'dataUrodzenia',
				width: 120
			},
			{
				title: 'Płeć',
				field: 'plecName',
				width: 130,
				formatter: function(value, data){
					var avatarIcon;
					
					switch (data.plec){
						case 'M':
							avatarIcon = icons.avatarMaleIcon;
							break;
						case 'F':
							avatarIcon = icons.avatarFemaleIcon;
							break;
						default:
							avatarIcon = icons.avatarOtherIcon;
							break;
					}
					
					return avatarIcon + ' ' + value;
				}
			},
			{
				title: 'Mobile',
				field: 'mobile',
				width: 100,
				formatter: function(value){ return value > 0 ? value : ''; }
			},
			{
				title: 'Email',
				field: 'email',
				//width: 180
			},
			{
				formatter: function(){ return icons.detailIcon; },
				width: 32,
				onClick: function(e, cell, value, data){
					
					var titleItem = $('#PdmTitle');						
					var modal = $('#Pdm');
					
					titleItem.html('Profil');
					
					$('.PdmDataRow').each(function(index){
						
						var attr = $(this).attr("pdm-field");
						var val = data[attr]; 
						
						var more = {
							avatar: function(){
									var icon;
									
									switch (data.plec){
										case 'F': icon = icons.avatarFemale; break;
										case 'M': icon = icons.avatarMale; break;
										default: icon = icons.avatarOther; break;
									}
									
									return icon;
								},
							userStatus: function(){ return data.hasUser ? icons.userIcon + ' Do profilu jest przypisane konto użytkownika.' : 'Profil nie posiada przypisanego konta użytkownika.' }
						};
						
						if (val == null) {
							$(this).html(more[attr]);
						} else {
							$(this).html(val);
						}
					});
					
					modal.modal("show");
				},
			},
			{
				formatter: function(){ return icons.editIcon; },
				width: 32,
				onClick: function(e, cell, value, data){
					
					var collapse = $('#Apc');
					var form = $('#ApcForm');
										
					$('input[type!="radio"]', $(form)).each(function(){
												
						var attr = $(this).attr('name');
						var valu = data[attr];
						
						$(this).val(valu);
					});
					
					$('input[type="radio"]', $(form)).each(function(){
												
						var attr = $(this).attr('name');
						var valu = data[attr];
						
						var radi = $(this).val();
						
						if (valu == radi) {
							$(this).closest('.btn').button('toggle');
						}
					});
					
					$('#ApcButton').removeClass('btn-success').addClass('btn-danger');
					$('#ApcButton').html('Anuluj edycję');
					$('#ApcFormButton').html('Zapisz zmiany');
					$('#ApcFormButton').attr('profileId',data.profileId);
					$('#ApcInfoEdit').show();
					$('#ApcInfoNew').hide();
					
					$(collapse).collapse('show');
					
					$('html, body').animate({
						scrollTop: $(collapse).offset().top - 40
					}, 1000);
					
				}
			},
			 {
				// delete user
				onClick: function(e, cell, value, data){
					var modal = $('#Dcm');
					
					$('#DcmButton').attr('profileId',data.profileId);
					$('#DcmBody').html('Usunięcie profilu <u>spowoduje</u> również usunięcie użytkownika, <br>który jest przypisany do profilu.<br><br>Czy na pewno chcesz usunąć profil <b>' + data.nazwisko + ' ' + data.imie + ' (' + data.type + ')</b>?');
					$('#DcmTitle').html('Usuwanie profilu');
					
					modal.modal('show');
				},
				formatter: function(){ return icons.deleteIcon; },
				width: 32
			 },
			]
	});
	}
}