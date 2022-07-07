function meganav2018() {
  $(function() {
    // cookieでログイン・ログアウト判定追加
    function getCookie(c_name){
        var st="";
        var ed="";
        if(document.cookie.length>0){
            // クッキーの値を取り出す
            st=document.cookie.indexOf(c_name + "=");
            if(st!=-1){
                st=st+c_name.length+1;
                ed=document.cookie.indexOf(";",st);
                if(ed==-1) ed=document.cookie.length;
                // 値をデコードして返す
                return unescape(document.cookie.substring(st,ed));
            }
        }
        return "";
    }
  
    function enter() {
      var $e = $(this);
      var $caret = $e.find('> .nav-item-content > .caret');
      var $subnav = $e.find('.subnav');
    
      if (window.innerWidth <= 599) {
        $subnav.slideDown();
      } else {
        var poff = $e.offset();
        var off = $caret.position();
    
        $subnav.css({
          left: off.left,
          top: off.top
        }).show();
      }
    
      $e.addClass('expanded');
    }
  
    function exit() {
      var $e = $(this);
      var $subnav = $e.find('.subnav');
    
      if (window.innerWidth <= 599) {
        $subnav.slideUp();
      } else {
        $subnav.hide();
      }
    
      $e.removeClass('expanded');
    }
  
    if (window.innerWidth <= 599) {
      $('#meganav2018 .nav-item.has-sub')
        .on('click', '> .nav-item-content', function($ev) {
          var $e = $($ev.delegateTarget);
          if ($e.hasClass('expanded')) {
            exit.apply($ev.delegateTarget);
          }
          else {
            enter.apply($ev.delegateTarget);
          }
        });
      $('#meganav2018 .parent .nav-item').eq(1).addClass('expanded');
      $('#meganav2018 .parent .nav-item:eq(1) .subnav').show();
    } else {
      $('#meganav2018 .nav-item.has-sub')
        .on('mouseenter', '> .nav-item-content, > .subnav', function($ev) {
          enter.apply($ev.delegateTarget)
        })
        .on('mouseleave', '> .nav-item-content, > .subnav', function($ev) {
          exit.apply($ev.delegateTarget)
        })
    }
      
    (function() {
      function getMode() {
        return window.innerWidth <= 599 ? 'mobile' : 'desktop';
      }
    
      function onBreak() {
        $('#meganav2018 .nav-item.expanded').removeClass('expanded').css({display: 'none'});
      }
    
      var mode = getMode();
    
      $(window).on('resize', function() {
        var nmode = getMode();
      
        if (nmode != mode) {
          mode = nmode;
          onBreak();
        }
      });
    
    })();
  
    var member = getCookie('5e81a41e977d37ba4a7770fc0a16ca1a') ? {nickname: ''} : null;
  
    $('#meganav2018').addClass(member ? 'is-member' : 'is-guest');
  });
}