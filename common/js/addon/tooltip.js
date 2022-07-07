/*---------------
tooltip
----------------*/
$(function(){
	var headerW = $('header.global').width();
	var tooltipContents = $('<p id="tooltipInfo"><span></span></p>');
	$('#contentsMainIn').append(tooltipContents);

	$('.tooltip').on('mouseenter', function() {
		var str = $('.tooltipContents', this).text();

		var welcomeDisplay = $("aside.welcome").css("display"); 
		if ( welcomeDisplay == 'none' ){
			var welcomeH = 0;
		} else {
			var welcomeH = $('aside.welcome').height();
		}
		$('#tooltipInfo span').text(str);
		
		var tooltipX = $('img', this).offset().left;
		var tooltipY = ($('img', this).offset().top + $('img', this).height());
		var tooltipX = tooltipX - headerW;
		var tooltipY = tooltipY - welcomeH;
		$('#tooltipInfo').css('left', tooltipX);
		$('#tooltipInfo').css('top', tooltipY);
		$('#tooltipInfo').show();
	});
	
	$('.tooltip').on('mouseleave', function() {
		$('#tooltipInfo').hide();
	});
});
