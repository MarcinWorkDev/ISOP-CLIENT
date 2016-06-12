var pageScriptMyProfile = {
	
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
		
		$('#EpcButton').on('click',function(){
			$('#Epc').collapse('toggle');
		});
		
		$('#EpcFormCancelButton').on('click',function(){
			$('#Epc').collapse('toggle');
		});
		
		$('#EpcFormButton').on('click',function(){
			var form = $('#EpcForm');
						
			if($(form).smkValidate()){
				var formJson = form.serializeJSON();
				
				var origin = SOPI_userInfo.profile;
			
				$.each(formJson,function(index,value){
					origin[index] = value;
				});
				
				SOPI_ajaxJson({
					url: SOPIconfig.ajaxDomainUrl + 'api/module/myprofile/set',
					method: 'PUT',
					data: JSON.stringify(origin),
					contentType: "application/json; charset=utf-8",
					record: origin.profileId,
					message: 'Aktualizacja profilu',
					actionSuccess: function(){
						location.reload();
					}
				});
				
				$('#Epc').collapse('hide');
			};
		});
		
		$.ajax({
			url: SOPIconfig.ajaxDomainUrl + 'api/module/myprofile',
			method: 'GET',
			contentType: "application/json; charset=utf-8",
			headers:{ "X-Auth-Token": sessionStorage.getItem('authtoken')},
			success: function(data){
				$('input', $('#EpcForm')).each(function(){
					var attr = $(this).attr('name');
					var valu = data[attr];
						
					$(this).val(valu);
				});
				
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
			}
		});
	}
}