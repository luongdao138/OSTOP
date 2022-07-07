$(document).ready(function(){
  var url = window.location.pathname;
  var selector = $('.js-navList .navList li[data-href="'+url+'"]');
  var filename = url.substring(url.lastIndexOf('/') + 1).split("?")[0].split("#")[0];

  if(filename == 'index.html'){
  	urlCut = url.substring(0,url.lastIndexOf('/') + 1);
  	selector = $('.js-navList .navList li[data-href="'+urlCut+'"]');
  	console.log(selector);
  	$(selector).each(function() {
	    $(this).addClass('is-located');
	    var innerTxtNav = $(this).text();
	    $(this).children('a').remove();
	    $(this).append('<p>'+innerTxtNav+'</p>');    
	  });

  }else{
  	console.log(selector);
  	$(selector).each(function() {
	    $(this).addClass('is-located');
	    var innerTxtNav = $(this).text();
	    $(this).children('a').remove();
	    $(this).append('<p>'+innerTxtNav+'</p>');    
	  });
  }
  
});