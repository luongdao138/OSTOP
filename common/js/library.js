//----------------------------
// [object - navigator]
//----------------------------
function isWin () { return (navigator.appVersion.indexOf ("Win") != -1); }
function isMac () { return (navigator.appVersion.indexOf ("Mac") != -1); }
function isIE () { return (navigator.appName.indexOf ("Explorer") != -1); }
function isNS () { return (navigator.appName.indexOf ("Netscape") != -1); }
function isWinIE () { return (isWin () && isIE ()); }
function isWinNS () { return (isWin () && isNS ()); }
function isMacIE () { return (isMac () && isIE ()); }
function isMacNS () { return (isMac () && isNS ()); }
function isW3CDOM () { return (document.getElementById ? true : false); }
function isMSDOM () { return (document.all ? true : false); }
function isNCDOM () { return (document.layers ? true : false); }
function isDOM () { return (isW3CDOM () || isMSDOM () || isNCDOM ()); }

//----------------------------
// MouseOverImageFunction
//----------------------------
function SB_swapImgRestore() {
  var i,x,a=document.SB_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}
function SB_preloadImages() {
  var d=document; if(d.images){ if(!d.SB_p) d.SB_p=new Array();
    var i,j=d.SB_p.length,a=SB_preloadImages.arguments; for(i=0; i<a.length; i++)
    if (a[i].indexOf("#")!=0){ d.SB_p[j]=new Image; d.SB_p[j++].src=a[i];}}
}
function SB_findObj(n, d) {
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=SB_findObj(n,d.layers[i].document);
  if(!x && d.getElementById) x=d.getElementById(n); return x;
}
function SB_swapImage() {
  var i,j=0,x,a=SB_swapImage.arguments; document.SB_sr=new Array; for(i=0;i<(a.length-2);i+=3)
  if ((x=SB_findObj(a[i]))!=null){document.SB_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
}
//----------------------------
// PopUpWindowFunction
//----------------------------

// onclick="SB_popup (this.href,'name',100,100,0,0,0,1,0,1);return false;"
function SB_popup (SBurl,SBname,SBwidth,SBheight,SBtoolbar,SBlocation,SBstatus,SBscroll,SBmenu,SBresize){
	SBstr = "width=" + SBwidth;
	SBstr+= ",height=" + SBheight;
	if(SBtoolbar)SBstr+= ",toolbar";
	if(SBlocation)SBstr+= ",location";
	if(SBstatus)SBstr+= ",status";
	if(SBscroll)SBstr+= ",scrollbars";
	if(SBmenu)SBstr+= ",menubar";
	if(SBresize)SBstr+= ",resizable";
	popupwin = window.open(SBurl,SBname,SBstr);
	popupwin.focus();
}

// onclick="SB_popupLT (this.href,'name',100,100,0,0,0,1,0,1);return false;"
function SB_popupLT (SBurl,SBname,SBwidth,SBheight,SBtoolbar,SBlocation,SBstatus,SBscroll,SBmenu,SBresize){
	SBstr = "width=" + SBwidth;
	SBstr+= ",height=" + SBheight;
	if(SBtoolbar)SBstr+= ",toolbar";
	if(SBlocation)SBstr+= ",location";
	if(SBstatus)SBstr+= ",status";
	if(SBscroll)SBstr+= ",scrollbars";
	if(SBmenu)SBstr+= ",menubar";
	if(SBresize)SBstr+= ",resizable";
	SBstr+=",top=0";
	SBstr+=",left=0";
	popupwin = window.open(SBurl,SBname,SBstr);
	popupwin.focus();
}

/*
 * IE PNG Fix v1.4
 *
 * Copyright (c) 2006 Takashi Aida http://www.isella.com/aod2/
 *
 */

// IE5.5+ PNG Alpha Fix v1.0RC4
// (c) 2004-2005 Angus Turnbull http://www.twinhelix.com

// This is licensed under the CC-GNU LGPL, version 2.1 or later.
// For details, see: http://creativecommons.org/licenses/LGPL/2.1/

if (typeof IEPNGFIX == 'undefined') {
//--============================================================================

var IEPNGFIX = {
	blank:  'https://www.isella.com/aod2/images/blank.gif',
	filter: 'DXImageTransform.Microsoft.AlphaImageLoader',

	fixit: function (elem, src, method) {
		if (elem.filters[this.filter]) {
			var filter = elem.filters[this.filter];
			filter.enabled = true;
			filter.src = src;
			filter.sizingMethod = method;
		}
		else {
			elem.style.filter = 'progid:' + this.filter +
				'(src="' + src + '",sizingMethod="' + method + '")';
		}
	},

	fixwidth: function(elem) {
		if (elem.currentStyle.width == 'auto' &&
			elem.currentStyle.height == 'auto') {
			elem.style.width = elem.offsetWidth + 'px';
		}
	},

	fixchild: function(elem, recursive) {
		if (!/MSIE (5\.5|6\.|7\.)/.test(navigator.userAgent)) return;

		for (var i = 0, n = elem.childNodes.length; i < n; i++) {
			var childNode = elem.childNodes[i];
			if (childNode.style) {
				if (childNode.style.position) {
					childNode.style.position = childNode.style.position;
				}
				else {
					childNode.style.position = 'relative';
				}
			}
			if (recursive && childNode.hasChildNodes()) {
				this.fixchild(childNode, recursive);
			}
		}
	},

	fix: function(elem) {
		if (!/MSIE (5\.5|6\.|7\.)/.test(navigator.userAgent)) return;

		var bgImg =
			elem.currentStyle.backgroundImage || elem.style.backgroundImage;

		if (elem.tagName == 'IMG') {
			if ((/\.png$/i).test(elem.src)) {
				this.fixwidth(elem);
				this.fixit(elem, elem.src, 'scale');
				elem.src = this.blank;
				elem.runtimeStyle.behavior = 'none';
			}
		}
		else if (bgImg && bgImg != 'none') {
			if (bgImg.match(/^url[("']+(.*\.png)[)"']+$/i)) {
				var s = RegExp.$1;
				this.fixwidth(elem);
				elem.style.backgroundImage = 'none';
				this.fixit(elem, s, 'scale'); // crop | image | scale

				if (elem.tagName == 'A' && elem.style) {
					if (!elem.style.cursor) {
						elem.style.cursor = 'pointer';
					}
				}

				this.fixchild(elem);
				elem.runtimeStyle.behavior = 'none';
			}
		}
	},

	hover: function(elem, hvImg) {
		var bgImg = elem.style.backgroundImage;

		if (!bgImg && elem.currentStyle) bgImg = elem.currentStyle.backgroundImage;

		if (elem.tagName == 'IMG' && hvImg) {
			var image = elem.src;
			elem.onmouseover = function() {
				elem.src = hvImg;
				IEPNGFIX.fix(elem);
			};
			elem.onmouseout = function() {
				elem.src = image;
				IEPNGFIX.fix(elem);
			};
		}
		else if (bgImg && bgImg != 'none' && hvImg) {
			elem.onmouseover = function() {
				elem.style.backgroundImage = 'url(' + hvImg + ')';
				IEPNGFIX.fix(elem);
			};
			elem.onmouseout = function() {
				elem.style.backgroundImage = bgImg;
				IEPNGFIX.fix(elem);
			};
		}

		IEPNGFIX.fix(elem);
	}
};

//--============================================================================
} // end if (typeof IEPNGFIX == 'undefined')
