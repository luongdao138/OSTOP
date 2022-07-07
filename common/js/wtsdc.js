/*
(function(){
var getMeta = function(name){
    var elems;
    if (document.all){
        elems=document.all.tags("meta");
    }
    else if (document.documentElement){
        elems=document.getElementsByTagName("meta");
    }
    if (typeof(elems)!="undefined"){
        for (var i=1;i<=elems.length;i++){
            var meta=elems.item(i-1);
            if (meta.name&&(meta.name.indexOf(name)==0)){
                return meta.content;
                break;
            }
        }
    }
    return null;
}
var smm = (window.location.toString().match(/[&\?]smm=1/i) || getMeta("DCS.dcsuri") == "/mystarbucks-entry/CstbaseRegComp") ? "1" : false;
var p = "www.starbucks.co.jp/common/php/cookie.php";
var r = Math.floor(Math.random() * 99999999);
document.write("<SCR"+"IPT TYPE='text/javascript' SRC='"+"http"+(window.location.protocol.indexOf('https:')==0?'s':'')+"://"+p+"?smm="+smm+"&r="+r+"'><\/SCR"+"IPT>");
})();





var internaldomain = "starbucks.co.jp,discoveries.jp,smp.ne.jp,210.128.6.210,210.128.6.207";

// Code section for Enable Event Tracking
function dcsParseSvl(sv){
	sv=sv.split(" ").join("");
	sv=sv.split("\t").join("");
	sv=sv.split("\n").join("");
	var pos=sv.toUpperCase().indexOf("WT.SVL=");
	if (pos!=-1){
		var start=pos+8;
		var end=sv.indexOf('"',start);
		if (end==-1){
			end=sv.indexOf("'",start);
			if (end==-1){
				end=sv.length;
			}
		}
		return sv.substring(start,end);
	}
	return "";
}
function dcsIsOnsite(host){
	var doms=internaldomain;
    var aDoms=doms.split(',');
    for (var i=0;i<aDoms.length;i++){
		if (host.indexOf(aDoms[i])!=-1){
		       return 1;
		}
    }
    return 0;
}
function dcsIsHttp(e){
	return (e.href&&e.protocol&&(e.protocol.indexOf("http")!=-1))?true:false;
}

var gHref="";
var gFrame="";
function dcsSaveHref(evt){
	if (evt.preventDefault){
		if (evt.target.target){
			gFrame=evt.target.target.toLowerCase();
			if (gFrame=="_top"||gFrame=="_parent"){
			} else if (gFrame=="_self"){
				gFrame="";
			} else if (gFrame=="_blank"||!window.top[gFrame]){
				gFrame="";
				return;
			}
		}
		if (evt.target.href){
			evt.preventDefault();
			gHref=evt.target.href;
		} else {
			gFrame="";
		}
	}
}
function dcsLoadHref(evt){
	if (gHref.length>0){
		if (gFrame.length>0){
			window.open(gHref,gFrame);
		}else{
			window.location=gHref;
		}
		gHref=gFrame="";
	}
}
function dcsEvt(evt,tag){
	var e=evt.target||evt.srcElement;
	while (e.tagName&&(e.tagName!=tag)){
		e=e.parentElement||e.parentNode;
	}
	return e;
}
function dcsBind(event,func){
	if ((typeof(window[func])=="function")&&document.body){
		if (document.body.addEventListener){
			document.body.addEventListener(event, window[func], true);
		}
		else if(document.body.attachEvent){
			document.body.attachEvent("on"+event, window[func]);
		}
	}
}
function dcsET(){
	dcsBind("click","dcsOffsite");
	dcsBind("mousedown","dcsDownload");
	dcsBind("keypress","dcsDownload");
	dcsBind("mousedown","dcsRightClick");

}

// WebTrends SmartSource Data Collector
// Copyright (c) 1996-2006 WebTrends Inc. All rights reserved.
// $DateTime: 2006/03/01 12:51:54 $

// Code section for Track clicks to links leading offsite.
function dcsOffsite(evt){
	evt=evt||(window.event||"");
	if (evt){
		var e=dcsEvt(evt,"A");
		var host=e.hostname;
		if (host&&!dcsIsOnsite(host)){
			var qry=e.search?e.search.substring(e.search.indexOf("?")+1,e.search.length):"";
			var path=e.pathname?((e.pathname.indexOf("/")!=0)?"/"+e.pathname:e.pathname):"/";
			dcsSaveHref(evt);
			dcsMultiTrack("DCS.dcssip",host,"DCS.dcsuri",path,"DCS.dcsqry",qry,"WT.ti","Offsite:"+host+path,"WT.os","1");
			DCS.dcssip=DCS.dcsuri=DCS.dcsqry=WT.ti=WT.os="";
		}
	}
}

// Code section for Track clicks to download links.
function dcsDownload(evt){
	evt=evt||(window.event||"");
	var agt=navigator.userAgent.toLowerCase();
	var major=parseInt(navigator.appVersion);
	var nn=((agt.indexOf("mozilla")!=-1)&&(agt.indexOf("compatible")==-1));
	var nn_e=(nn&&(major>=4));
	var click = false;
	if (nn_e){
		if (typeof(evt.keyCode) == 'undefined') {
			if (evt.which == 1) {
				click = true;
			}
		} else {
			if (evt.keyCode == 13) {
				click = true;
			}
		}
	} else {
		if (evt.keyCode == 13) {
			click = true;
		} else if (typeof(evt.button) != 'undefined') {
			if (evt.button == 1) {
				click = true;
			}
		}
	}
	if (click) {
		var e=dcsEvt(evt,"A");
		var host=e.hostname;
		if (host&&dcsIsOnsite(host)){
			var path=e.pathname;
			if (dcsAllowTypes(path)){
				gHref="";
				dcsMultiTrack("DCS.dcssip",host,"DCS.dcsuri",path,"DCS.dcsref",window.location.href,"DCS.dcsqry",e.search||"","WT.ti",dcsDownloadTitle(e,path),"WT.dl","1");
				DCS.dcssip=DCS.dcsuri=DCS.dcsqry=WT.ti=WT.dl="";
			}
		}
	}
}

// Code section for Track right clicks to download links.
function dcsRightClick(evt){
	evt=evt||(window.event||"");
	if (evt){
		var btn=evt.which||evt.button;
		if (btn!=1){
			var e=dcsEvt(evt,"A");
			var host=e.hostname;
			if (host&&dcsIsOnsite(host)){
				var path=e.pathname;
				if (dcsAllowTypes(path)){
					gHref="";
					dcsMultiTrack("DCS.dcssip",host,"DCS.dcsuri",path,"DCS.dcsref",window.location.href,"DCS.dcsqry",e.search||"","WT.ti",dcsDownloadTitle(e,path),"WT.dl","1","WT.rc","1");
					DCS.dcssip=DCS.dcsuri=DCS.dcsqry=WT.ti=WT.dl=WT.rc="";
				}
			}
		}
	}
}

// typesに設定した拡張子へのリンクのみをSDC送信対象とする
// path_info形式(/aaa/bbb/ccc.cgi/ddd/eeeのようなURL)に対応
function dcsAllowTypes(path){
	var types="zip,exe,tar,pdf,wav,mp3,mov,mpg,avi,wmv,doc,xls";
	var ex_idx_from=path.lastIndexOf(".");
	var ex_idx_to=path.indexOf("/",ex_idx_from);
	ex_idx_to=ex_idx_to==-1?path.length:ex_idx_to
	if (path&&types.indexOf(path.substring(ex_idx_from+1,ex_idx_to))!=-1){
		return true;
	}
	return false;
}

// WT.tiにセットする文字列
function dcsDownloadTitle(e,path){
	if (!e.firstChild.tagName){										// アンカーのインラインが文字列の場合
		return e.innerHTML||"";										// WT.ti=(インラインの文字列)にする
	} else if (e.firstChild.alt!=""){								// アンカーのインラインがalt設定つきのimgの場合
		return e.firstChild.alt;									// WT.ti=(altの文字列)にする
	} else {														// それ以外の場合
		return "Download:"+((path.indexOf("/")!=0)?"/"+path:path);	// WT.ti=("Download:"+ファイルのトップからのパス)にする
	}
}

//fpc
var gDomain="sdc.netyear.net";
//main dcsid
var gDcsId="dcswkhdg8ovwt8ad8q85tc4y8_8d7i";
//var gDcsId="dcso6l4uqovwt8yf61k321z4a_7l7h";
//var gDcsId="test";
var gFpc="WT_FPC";
var gConvert=true;
if ((typeof(gConvert)!="undefined")&&gConvert&&(document.cookie.indexOf(gFpc+"=")==-1)&&(document.cookie.indexOf("WTLOPTOUT=")==-1)){
	document.write("<SCR"+"IPT TYPE='text/javascript' SRC='"+"http"+(window.location.protocol.indexOf('https:')==0?'s':'')+"://"+gDomain+"/"+gDcsId+"/wtid.js"+"'><\/SCR"+"IPT>");
}

//sdc
var gService = false;
var gTimeZone = 9;

// Code section for Enable First-Party Cookie Tracking
function dcsCookie(){
	if (typeof(dcsOther)=="function"){
		dcsOther();
	}
	else if (typeof(dcsPlugin)=="function"){
		dcsPlugin();
	}
	else if (typeof(dcsFPC)=="function"){
		dcsFPC(gTimeZone);
	}
}
function dcsGetCookie(name){
	var pos=document.cookie.indexOf(name+"=");
	if (pos!=-1){
		var start=pos+name.length+1;
		var end=document.cookie.indexOf(";",start);
		if (end==-1){
			end=document.cookie.length;
		}
		return unescape(document.cookie.substring(start,end));
	}
	return null;
}
function dcsGetCrumb(name,crumb){
	var aCookie=dcsGetCookie(name).split(":");
	for (var i=0;i<aCookie.length;i++){
		var aCrumb=aCookie[i].split("=");
		if (crumb==aCrumb[0]){
			return aCrumb[1];
		}
	}
	return null;
}
function dcsGetIdCrumb(name,crumb){
	var cookie=dcsGetCookie(name);
	var id=cookie.substring(0,cookie.indexOf(":lv="));
	var aCrumb=id.split("=");
	for (var i=0;i<aCrumb.length;i++){
		if (crumb==aCrumb[0]){
			return aCrumb[1];
		}
	}
	return null;
}
function dcsFPC(offset){
	if (typeof(offset)=="undefined"){
		return;
	}
	var name=gFpc;
	var dCur=new Date();
	dCur.setTime(dCur.getTime()+(dCur.getTimezoneOffset()*60000)+(offset*3600000));
	var dExp=new Date(dCur.getTime()+315360000000);
	var dSes=new Date(dCur.getTime());
	if (document.cookie.indexOf(name+"=")!=-1){
		var id=dcsGetIdCrumb(name,"id");
		var lv=parseInt(dcsGetCrumb(name,"lv"));
		var ss=parseInt(dcsGetCrumb(name,"ss"));
		if ((id==null)||(id=="null")||isNaN(lv)||isNaN(ss)){
			return;
		}
		WT.co_f=id;
		var dLst=new Date(lv);
		dSes.setTime(ss);
		if ((dCur.getTime()>(dLst.getTime()+1800000))||(dCur.getTime()>(dSes.getTime()+28800000))){
			dSes.setTime(dCur.getTime());
			WT.vt_f_s="1";
		}
		if ((dCur.getDay()!=dLst.getDay())||(dCur.getMonth()!=dLst.getMonth())||(dCur.getYear()!=dLst.getYear())){
			WT.vt_f_d="1";
		}
	}
	else{
		var tmpname=name+"_TMP=";
		document.cookie=tmpname+"1";
		if (document.cookie.indexOf(tmpname)!=-1){
			document.cookie=tmpname+"; expires=Thu, 01-Jan-1970 00:00:01 GMT";
			if ((typeof(gWtId)!="undefined")&&(gWtId!="")){
				WT.co_f=gWtId;
			}
			else if ((typeof(gTempWtId)!="undefined")&&(gTempWtId!="")){
				WT.co_f=gTempWtId;
				WT.vt_f="1";
			}
			else{
				WT.co_f="2";
				var cur=dCur.getTime().toString();
				for (var i=2;i<=(32-cur.length);i++){
					WT.co_f+=Math.floor(Math.random()*16.0).toString(16);
				}
				WT.co_f+=cur;
				WT.vt_f="1";
			}
			if (typeof(gWtAccountRollup)=="undefined"){
				WT.vt_f_a="1";
			}
			WT.vt_f_s="1";
			WT.vt_f_d="1";
		}
		else{
			WT.vt_f="2";
			WT.vt_f_a="2";
			return;
		}
	}
	WT.co_f=escape(WT.co_f);
	WT.vt_sid=WT.co_f+"."+dSes.getTime();
	var expiry="; expires="+dExp.toGMTString();
	document.cookie=name+"="+"id="+WT.co_f+":lv="+dCur.getTime().toString()+":ss="+dSes.getTime().toString()+expiry+"; path=/"+(((typeof(gFpcDom)!="undefined")&&(gFpcDom!=""))?("; domain="+gFpcDom):(""));
}

// Code section for Enable SmartView Transition Page tracking
function dcsTP(){
	var name="WT_DC";
	var expiry="; expires=Thu, 31-Dec-2020 08:00:00 GMT";
	var path="; path=/";
	var domain="";
	if ((document.cookie.indexOf(name+"=")!=-1)&&(dcsGetCrumb(name,"tsp")=="1")){
		WT.ttp="1";
	}
	if (dcsGetMeta("SmartView_Page")=="1"){
		WT.tsp="1";
		document.cookie=name+"=tsp=1"+expiry+path+domain;
	}
	else{
		document.cookie=name+"=; expires=Sun, 1-Jan-1995 00:00:00 GMT;"+path+domain;
	}
}
function dcsGetMeta(name){
	var elems;
	if (document.all){
		elems=document.all.tags("meta");
	}
	else if (document.documentElement){
		elems=document.getElementsByTagName("meta");
	}
	if (typeof(elems)!="undefined"){
		for (var i=1;i<=elems.length;i++){
			var meta=elems.item(i-1);
			if (meta.name&&(meta.name.indexOf(name)==0)){
				return meta.content;
				break;
			}
		}
	}
	return null;
}

// Code section for Use the new first-party cookie generated with this tag.
function dcsAdv(){
	dcsFunc("dcsET");
	dcsFunc("dcsCookie");
	dcsFunc("dcsAdSearch");
	dcsFunc("dcsTP");
}

var gImages=new Array;
var gIndex=0;
var DCS=new Object();
var WT=new Object();
var DCSext=new Object();
var gQP=new Array();
var gI18n=true;

if (window.RegExp){
	var RE={"%09":/\t/g,"%20":/ /g,"%23":/\#/g,"%26":/\&/g,"%2B":/\+/g,"%3F":/\?/g,"%5C":/\\/g,"%22":/\"/g};
	var I18NRE={"%25":/\%/g};
}

// Add customizations here

function dcsMultiTrack(){
	for (var i=0;i<arguments.length;i++){
		if (arguments[i].indexOf('WT.')==0){
				WT[arguments[i].substring(3)]=arguments[i+1];
				i++;
		}
		if (arguments[i].indexOf('DCS.')==0){
				DCS[arguments[i].substring(4)]=arguments[i+1];
				i++;
		}
		if (arguments[i].indexOf('DCSext.')==0){
				DCSext[arguments[i].substring(7)]=arguments[i+1];
				i++;
		}
	}
	var dCurrent=new Date();
	DCS.dcsdat=dCurrent.getTime();
	dcsTag();
}

function dcsVar(){
	var dCurrent=new Date();
	WT.tz=dCurrent.getTimezoneOffset()/60*-1;
	if (WT.tz==0){
		WT.tz="0";
	}
	WT.bh=dCurrent.getHours();
	WT.ul=navigator.appName=="Netscape"?navigator.language:navigator.userLanguage;
	if (typeof(screen)=="object"){
		WT.cd=navigator.appName=="Netscape"?screen.pixelDepth:screen.colorDepth;
		WT.sr=screen.width+"x"+screen.height;
	}
	if (typeof(navigator.javaEnabled())=="boolean"){
		WT.jo=navigator.javaEnabled()?"Yes":"No";
	}
	if (document.title){
		WT.ti=gI18n?dcsEscape(dcsEncode(document.title),I18NRE):document.title;
	}
	WT.js="Yes";
	WT.jv=dcsJV();
	if (document.body&&document.body.addBehavior){
		document.body.addBehavior("#default#clientCaps");
		if (document.body.connectionType){
			WT.ct=document.body.connectionType;
		}
		document.body.addBehavior("#default#homePage");
		WT.hp=document.body.isHomePage(location.href)?"1":"0";
	}
	if (parseInt(navigator.appVersion)>3){
		if ((navigator.appName=="Microsoft Internet Explorer")&&document.body){
			WT.bs=document.body.offsetWidth+"x"+document.body.offsetHeight;
		}
		else if (navigator.appName=="Netscape"){
			WT.bs=window.innerWidth+"x"+window.innerHeight;
		}
	}
	WT.fi="No";
	if (window.ActiveXObject){
		for(var i=10;i>0;i--){
			try{
				var flash = new ActiveXObject("ShockwaveFlash.ShockwaveFlash."+i);
				WT.fi="Yes";
				WT.fv=i+".0";
				break;
			}
			catch(e){
			}
		}
	}
	else if (navigator.plugins&&navigator.plugins.length){
		for (var i=0;i<navigator.plugins.length;i++){
			if (navigator.plugins[i].name.indexOf('Shockwave Flash')!=-1){
				WT.fi="Yes";
				WT.fv=navigator.plugins[i].description.split(" ")[2];
				break;
			}
		}
	}
	if (gI18n){
		WT.em=(typeof(encodeURIComponent)=="function")?"uri":"esc";
		if (typeof(document.defaultCharset)=="string"){
			WT.le=document.defaultCharset;
		} 
		else if (typeof(document.characterSet)=="string"){
			WT.le=document.characterSet;
		}
	}
	WT.sp="@@SPLITVALUE@@";
	DCS.dcsdat=dCurrent.getTime();
	DCS.dcssip=window.location.hostname;
	DCS.dcsuri=window.location.pathname;
	if (window.location.search){
		DCS.dcsqry=window.location.search;
		if (gQP.length>0){
			for (var i=0;i<gQP.length;i++){
				var pos=DCS.dcsqry.indexOf(gQP[i]);
				if (pos!=-1){
					var front=DCS.dcsqry.substring(0,pos);
					var end=DCS.dcsqry.substring(pos+gQP[i].length,DCS.dcsqry.length);
					DCS.dcsqry=front+end;
				}
			}
		}
	}
	if ((window.document.referrer!="")&&(window.document.referrer!="-")){
		if (!(navigator.appName=="Microsoft Internet Explorer"&&parseInt(navigator.appVersion)<4)){
			DCS.dcsref=gI18n?dcsEscape(window.document.referrer, I18NRE):window.document.referrer;
		}
	}
}

function dcsA(N,V){
	return "&"+N+"="+dcsEscape(V, RE);
}

function dcsEscape(S, REL){
	if (typeof(REL)!="undefined"){
		var retStr = new String(S);
		for (R in REL){
			retStr = retStr.replace(REL[R],R);
		}
		return retStr;
	}
	else{
		return escape(S);
	}
}

function dcsEncode(S){
	return (typeof(encodeURIComponent)=="function")?encodeURIComponent(S):escape(S);
}

function dcsCreateImage(dcsSrc){
	if (document.images){
		gImages[gIndex]=new Image;
		if ((typeof(gHref)!="undefined")&&(gHref.length>0)){
			gImages[gIndex].onload=gImages[gIndex].onerror=dcsLoadHref;
		}
		gImages[gIndex].src=dcsSrc;
		gIndex++;
	}
	else{
		document.write('<IMG ALT="" BORDER="0" NAME="DCSIMG" WIDTH="1" HEIGHT="1" SRC="'+dcsSrc+'">');
	}
}

function dcsMeta(){
	var elems;
	if (document.all){
		elems=document.all.tags("meta");
	}
	else if (document.documentElement){
		elems=document.getElementsByTagName("meta");
	}
	if (typeof(elems)!="undefined"){
		for (var i=1;i<=elems.length;i++){
			var meta=elems.item(i-1);
			if (meta.name){
				if (meta.name.indexOf('WT.')==0){
					WT[meta.name.substring(3)]=(gI18n&&(meta.name.indexOf('WT.ti')==0))?dcsEscape(dcsEncode(meta.content),I18NRE):meta.content;
				}
				else if (meta.name.indexOf('DCSext.')==0){
					DCSext[meta.name.substring(7)]=meta.content;
				}
				else if (meta.name.indexOf('DCS.')==0){
					DCS[meta.name.substring(4)]=(gI18n&&(meta.name.indexOf('DCS.dcsref')==0))?dcsEscape(meta.content,I18NRE):meta.content;
				}
			}
		}
	}
}

function dcsTag(){
	if (document.cookie.indexOf("WTLOPTOUT=")!=-1){
		return;
	}
	var P="http"+(window.location.protocol.indexOf('https:')==0?'s':'')+"://"+gDomain+(gDcsId==""?'':'/'+gDcsId)+"/dcs.gif?";
	for (N in DCS){
		if (DCS[N]) {
			P+=dcsA(N,DCS[N]);
		}
	}
	for (N in WT){
		if (WT[N]) {
			P+=dcsA("WT."+N,WT[N]);
		}
	}
	for (N in DCSext){
		if (DCSext[N]) {
			P+=dcsA(N,DCSext[N]);
		}
	}
	if (P.length>2048&&navigator.userAgent.indexOf('MSIE')>=0){
		P=P.substring(0,2040)+"&WT.tu=1";
	}
	dcsCreateImage(P);
}

function dcsJV(){
	var agt=navigator.userAgent.toLowerCase();
	var major=parseInt(navigator.appVersion);
	var mac=(agt.indexOf("mac")!=-1);
	var nn=((agt.indexOf("mozilla")!=-1)&&(agt.indexOf("compatible")==-1));
	var nn4=(nn&&(major==4));
	var nn6up=(nn&&(major>=5));
	var ie=((agt.indexOf("msie")!=-1)&&(agt.indexOf("opera")==-1));
	var ie4=(ie&&(major==4)&&(agt.indexOf("msie 4")!=-1));
	var ie5up=(ie&&!ie4);
	var op=(agt.indexOf("opera")!=-1);
	var op5=(agt.indexOf("opera 5")!=-1||agt.indexOf("opera/5")!=-1);
	var op6=(agt.indexOf("opera 6")!=-1||agt.indexOf("opera/6")!=-1);
	var op7up=(op&&!op5&&!op6);
	var jv="1.1";
	if (nn6up||op7up){
		jv="1.5";
	}
	else if ((mac&&ie5up)||op6){
		jv="1.4";
	}
	else if (ie5up||nn4||op5){
		jv="1.3";
	}
	else if (ie4){
		jv="1.2";
	}
	return jv;
}

function dcsFunc(func){
	if (typeof(window[func])=="function"){
		window[func]();
	}
}

dcsVar();
dcsMeta();
dcsFunc("dcsAdv");




function wt_member_call_back(smm, WEBTRENDS_ID2, WEBTRENDS_ID2_IS_NEW) {
    if (smm) {
        DCSext.smm = '1';
    }
    if (!WEBTRENDS_ID2_IS_NEW) {
        DCSext.WEBTRENDS_ID2 = WEBTRENDS_ID2;
    }
    dcsTag();
}
*/