/*---------------
lazyload
----------------*/
jQuery(function($){
	$(".coffee5Col .coffeeImg a img").lazyload({
		placeholder : "/common/images/coffee/coffee-loading.gif",
		effect : "fadeIn"
	});
	
	$(".coffeeDetails .coffeeImg a>img").lazyload({
		placeholder : "/common/images/coffee/coffee-loading.gif",
		effect : "fadeIn"
	});
});
