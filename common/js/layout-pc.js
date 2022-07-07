// JavaScript Document

if ((navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('iPad') > 0) || navigator.userAgent.indexOf('iPod') > 0 || navigator.userAgent.indexOf('Android') > 0) {
	document.write('<link rel="stylesheet" href="//www.starbucks.co.jp/common/css/layout-pc.css">');
	
	var metalist = document.getElementsByTagName('meta');
	var hasMeta = false;
	for(var i = 0; i < metalist.length; i++) {
		var name = metalist[i].getAttribute('name');
		if(name && name.toLowerCase() === 'viewport') {
			metalist[i].setAttribute('content', 'width=1230px, initial-scale=0.6, minimum-scale=0.6, maximum-scale=2.0, user-scalable=yes');
			hasMeta = true;
			break;
		}
	}
	if(!hasMeta) {
		var meta = document.createElement('meta');
		meta.setAttribute('name', 'viewport');
		meta.setAttribute('content', 'width=1230px, initial-scale=0.6, minimum-scale=0.6, maximum-scale=2.0, user-scalable=yes');
		document.getElementsByTagName('head')[0].appendChild(meta);
	}
}

if (navigator.userAgent.indexOf('iPad') > 0){
	navigator.userAgent.match(/CPU OS (\w+){1,3}/g);
    var osv=(RegExp.$1.replace(/_/g, '')+'00').slice(0,3);
    if(osv >= 700) {
		var newStyle = document.createElement('style');newStyle.type = "text/css";
		document.getElementsByTagName('head').item(0).appendChild(newStyle);
		css = document.styleSheets.item(0)
		//追加
		var idx = document.styleSheets[0].cssRules.length;
		css.insertRule("body { min-height: 1500px; }", idx);//末尾に追加
    }
}