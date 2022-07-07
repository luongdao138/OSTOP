jQuery = jQuery || $;
jQuery(function($){
	var pairs = document.cookie.split('; ');
	var not_view_flg = '0';
	for (var i = 0, l = pairs.length; i != l; i++) {
		var prop = pairs[i].split('=');
		if (decodeURIComponent(prop[0].replace(/\+/g, '%20')) == 'notViewFlg') {
			not_view_flg = decodeURIComponent(prop[1].replace(/\+/g, '%20'));
		}
	}
	// リファラーが同ドメインの場合、非表示
	// 特定ページの場合、非表示
	if (document.referrer.indexOf('starbucks.co.jp') != -1 ||
		location.href.indexOf('notice') != -1 ||
		location.href.indexOf('utm_') != -1 ||
		location.href.indexOf('register') != -1 ||
		location.pathname == '' ||
		location.pathname == '/' ||
		location.pathname == '/index.html')
	{
		not_view_flg = '1';
	}
	if (not_view_flg == '1') {
		$('aside.welcome').remove();
	} else {
		$('aside.welcome').removeClass('disabled');
	}

});
