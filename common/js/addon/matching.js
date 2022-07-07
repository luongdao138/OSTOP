/*---------------
matching
----------------*/
jQuery(function($){
	var matching = $('#matching');
	$('#matchingBtn', matching).bind('click', function(e) {
		var uri = $('#matchingSel', matching).val();
		var option = 'width=595,height=563,0,0,0,1,0,1';
		var win = window.open(uri, 'popup', option);
		win.focus();
	});
});
