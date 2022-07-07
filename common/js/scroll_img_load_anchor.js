$(window).on('load', function(){
  if(window.innerWidth <= 909){
    setTimeout(function(){
      if(location.hash){
        window.scrollTo(0, $(location.hash).offset().top - $(".titleArea").first().height());
      }
    }, 500);
  }
});