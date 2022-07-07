/*---------------
areaLink
----------------*/
$(function($){
	$('.areaLink').each(function() {
		$(this).bind('mouseover', function(e) {
			$('a', this).addClass('areaLinkHover');
		});
		$(this).bind('mouseout', function(e) {
			$('a', this).removeClass('areaLinkHover');
		});
		$(this).bind('click', function(e) {
			var uri = $('a', this).attr('href');
			location.href = uri;
		});
	});
});
