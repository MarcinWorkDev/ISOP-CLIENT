var pageScriptMySchedule = {
	
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
		scheduleIcon: '<img src="' + SOPIconfig.resourcesUrl + 'img/schedule.png" style="width: 20;">',
		scheduleIcon2: '<img src="' + SOPIconfig.resourcesUrl + 'img/schedule2.png" style="width: 20;">'
	},
		
	// konstruktor
	_create: function(){
				
		console.log('SOPI PageScript for Schedule page loaded.');

		var icons = this.icons;
		
		/******************************************************
		/	Funkcje obsługi onClick - dodanie eventów
		/*****************************************************/
		
		$('#SdmDeleteButton').on('click',function(){
			$('#Sdm').modal('hide');
			
			var scheduleId = $('#SdmDeleteButton').prop('scheduleId');
			
			SOPI_ajaxJson({
				url: SOPIconfig.ajaxDomainUrl + 'api/module/schedule/delete/' + scheduleId,
				method: 'DELETE',
				contentType: "application/json; charset=utf-8",
				record: scheduleId,
				message: 'Usuwanie terminu wizyty',
				actionSuccess: function(){
					$('#SccCalendar').fullCalendar('refetchEvents');
				}
			});
		});
		
		/******************************************************
		/	Definicje tabulatorów - wygenerowanie i wstawienie tabulatorów
		/*****************************************************/
		$('#SccCalendarOwner').html(SOPI_userInfo.profile.nazwisko + ' ' + SOPI_userInfo.profile.imie + ' (' + SOPI_userInfo.profile.pesel + ')');
		$('#SccCalendarOwner').prop('profileId',SOPI_userInfo.profile.profileId);
										
		$('#SccCalendar').fullCalendar({
			loading: function( isLoading, view ) {
				if(isLoading) {
					$('#SccCalendarLoaderStatus').removeClass('progress-bar-success').addClass('progress-bar-striped');
					$('#SccCalendarLoaderStatus').html('Trwa wczytywanie danych...');
				} else {
					$('#SccCalendarLoaderStatus').removeClass('progress-bar-striped').addClass('progress-bar-success');
					$('#SccCalendarLoaderStatus').html('Dane zostały wczytane.');
				}
			},
			events: SOPIconfig.ajaxDomainUrl + 'api/module/myschedule',
			editable: false,
			timezone: 'UTC',
			selectable: true,
			selectHelper: true,
			selectOverlap: false,
			select: function(start, end){
				var eventData;
				var now = moment();	
							
				for (var m = moment(start); m.isBefore(end); m.add(1,'hour')) {
										
					if (m.isBefore(now)) {
						$('#SccCalendar').fullCalendar('unselect');
						continue;
					}
					
					me = moment(m).add(1,'hour');
					
					eventData = {
						title: 'Nowy termin',
						start: m,
						end: me
					};
					
					var profileId = $('#SccCalendarOwner').prop('profileId');
					var data = {
						profileId: profileId,
						start: eventData.start.format('YYYY-MM-DD HH:mm'),
						end: eventData.end.format('YYYY-MM-DD HH:mm')
					};
					
					SOPI_ajaxJson({
						url: SOPIconfig.ajaxDomainUrl + 'api/module/schedule/event/set',
						method: 'POST',
						data: JSON.stringify(data),
						contentType: "application/json; charset=utf-8",
						record: 'Nowy',
						message: 'Dodawanie terminu wizyty',
						actionSuccess: function(){
							$('#SccCalendar').fullCalendar('refetchEvents');
						}
					});
					
				}
				
				$('#SccCalendar').fullCalendar('unselect');

			},
			defaultView: 'agendaWeek',
			//hiddenDays: [ 6,0 ],
			columnFormat: 'dd, D MMMM',
			views: 
				{
					agenda:
						{
							allDaySlot: false,
							slotDuration: '01:00:00',
							minTime: '06:00',
							maxTime: '21:00'
						}
				},
			height: 400,
			eventClick:  function(event, jsEvent, view) {
				$('#SdmTitle').html(event.title + ' (' + event.start.format('YYYY-MM-DD') + ', ' + event.start.format('HH:mm') + ' - ' + event.end.format('HH:mm') + ')');
				
				if(parseInt(event.visitId) > 0){
					$('#SdmDeleteButton').hide();
					$('#SdmBody').html(event.description + '<br><br>Termin wizyty zarezerwowany <br>- dyżur nie może zostać odwołany.');
				} else if (event.past){
					$('#SdmDeleteButton').hide();
				} else {
					$('#SdmDeleteButton').show();
					$('#SdmBody').html(event.description);
					$('#SdmDeleteButton').prop('scheduleId',event.scheduleId);
				}
							
				$('#Sdm').modal();
			}
		});
	}
}