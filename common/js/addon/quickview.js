jQuery(function($) {
	function quickView() {
		$('a.thickbox').each(function() {
			if ($('img', this).size() === 0) return;
			$(this).css({
				'display' : 'block',
				'cursor' : 'pointer'
			});
			var spanTop = $('img', this).offset().top + 'px';
			var spanLeft = $('img', this).offset().left + 'px';
			var spanWidth = $('img', this).outerWidth(true) + 'px';
			var spanHeight = $('img', this).outerHeight(true) + 'px';
			var spanObj = $('<span>').css({
				'position' : 'absolute',
				'top' : '0',
				'left' : '0',
				'width' : spanWidth,
				'height' : spanHeight
			});
			$(this).append(spanObj);
			$(this).bind('mouseover', function(e) {
				$(spanObj, e.target).addClass('quickViewBtn');
			});
			$(this).bind('mouseout', function(e) {
				$(spanObj, e.target).removeClass('quickViewBtn');
			});
		});
		$('.quickViewHide').bind('click', function(e) {
			self.parent.tb_remove();
		});
	}
	quickView();
});
