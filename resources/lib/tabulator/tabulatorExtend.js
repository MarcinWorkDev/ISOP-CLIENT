
(function(){
	
	$(function () {
		var token = $("meta[name='_csrf']").attr("content");
		var header = $("meta[name='_csrf_header']").attr("content");
		$(document).ajaxSend(function(e, xhr, options) {
			xhr.setRequestHeader(header, token);
		});
	});
	
	var statusColumn = function(value, data, cell, row, options) {
		var code;
		
		if (data.status) {
			code = '<img src="[[@{/resources/img/status_on.png}]]" data-toggle="tooltip" data-placement="top" title="Pacjent jest aktywny.">';
		} else {
			code = '<img src="[[@{/resources/img/status_off.png}]]" data-toggle="tooltip" data-placement="top" title="Pacjent jest nieaktywny.">';
		}
		
		if (data.user) {
			code += '<img src="[[@{/resources/img/web_account.png}]]" data-toggle="tooltip" data-placement="top" title="Pacjent posiada konto użytkownika.">';
		}
		
		return code;
	}
	
	var profilLinkColumn = function(value, data, cell, row, options) {
		return '<a class="btn btn-primary btn-xs" href="[[@{/pacjent/profil/}]]' + data.pacjentId + '" role="button">Profil pacjenta</a>';
	}
	
})();