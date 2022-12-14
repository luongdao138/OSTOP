/**
 * asyncga.js
 * @modified 2018/03/13
 * +Googleオプティマイズのタグ追加
 */

var ua = window.navigator.userAgent.toLowerCase();
if(!ua.match(/starbucksjapan/)){

(function(a,s,y,n,c,h,i,d,e){s.className+=' '+y;h.start=1*new Date;
h.end=i=function(){s.className=s.className.replace(RegExp(' ?'+y),'')};
(a[n]=a[n]||[]).hide=h;setTimeout(function(){i();h.end=null},c);h.timeout=c;
})(window,document.documentElement,'async-hide','dataLayer',100,
{'GTM-KPMGB59':true});

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

/* クロスサイトトラッキング */
/*
ga('create', 'UA-21606086-1', 'auto',{'allowLinker':true});
ga('require', 'linker');
ga('linker:autoLink', ['starbucks.co.jp'], false, true);
new UAMX.UAReqCustomVarDriver(UAParams);
ga('send', 'pageview');
*/

/*通常*/
ga('create', 'UA-21606086-1', 'auto');
ga('require', 'displayfeatures');
new UAMX.UAReqCustomVarDriver(UAParams);
ga('require', 'GTM-KPMGB59');
ga('send', 'pageview');

}