/*---------------
image rollover
----------------*/
$(function($){
	var outImgName = "-ovoff";
	var overImgName = "-ovon";
	var preload = new Array();

	if(document.getElementsByTagName){
		var imgTagData = $("img:not(.heading2Img img, img.notOver)");
		var reOverImg = new RegExp(outImgName + "+(\.[a-z]+)$");
		var reOutImg = new RegExp(overImgName + "+(\.[a-z]+)$");
		for(var i=0; i<imgTagData.length; i++){
			if(imgTagData[i].getAttribute("src") != null){
				if(imgTagData[i].getAttribute("src").match(reOverImg)){
					preload[i] = new Image();
					preload[i].src = imgTagData[i].getAttribute("src").replace(reOverImg, overImgName + "$1");
					imgTagData[i].onmouseover = function() {
						this.setAttribute("src", this.getAttribute("src").replace(reOverImg, overImgName + "$1"));
					}
					imgTagData[i].onmouseout = function() {
						this.setAttribute("src", this.getAttribute("src").replace(reOutImg, outImgName + "$1"));
					}
				}
			}
		}
	}
	if(document.getElementsByTagName){
		var inputTagData = document.getElementsByTagName("input");
		var reOverImg = new RegExp(outImgName + "+(\.[a-z]+)$");
		var reOutImg = new RegExp(overImgName + "+(\.[a-z]+)$");
		for(var i=0; i<inputTagData.length; i++){
			if(inputTagData[i].getAttribute("src") != null){
				if(inputTagData[i].src && inputTagData[i].getAttribute("src").match(reOverImg)){
					preload[i] = new Image();
					preload[i].src = inputTagData[i].getAttribute("src").replace(reOverImg, overImgName + "$1");
					inputTagData[i].onmouseover = function() {
						this.setAttribute("src", this.getAttribute("src").replace(reOverImg, overImgName + "$1"));
					}
					inputTagData[i].onmouseout = function() {
						this.setAttribute("src", this.getAttribute("src").replace(reOutImg, outImgName + "$1"));
					}
				}
			}
		}
	}
});

/*---------------
image rollover (with h2.heading2Img)
----------------*/
$(function($){
	$(".heading2Img a img").unbind("mouseenter").unbind("mouseleave");
	$(".heading2Img a").hover(function(){
		$this = $(this);
		$("img:first",$this).attr("src", $("img:first",$this).attr("src").replace("-ovoff", "-ovon"));
		}, function(){
		$("img:first",$this).attr("src", $("img:first",$this).attr("src").replace("-ovon", "-ovoff"));
	});
});

/*---------------
magaNav
----------------*/
$(function($){
	$("#megaNav img").each(function(){
		var onImg = $(this).attr("src").replace(/off\./ig, 'on.');
		$("<img>").attr("src",onImg);
	});

	$("#megaNav ul li").hover(function(){
		var onImg = $(this).find("img.mNavImg").attr("src").replace(/off\./ig, 'on.');
		$(this).find("img.mNavImg").attr("src",onImg);
		$(".megaNavSab" , this).css("display","block");
	},
	function(){
		var offImg = $(this).find("img.mNavImg").attr("src").replace(/on\./ig, 'off.');
		$(this).find("img.mNavImg").attr("src",offImg);
		$(".megaNavSab" , this).css("display","none");
	});
});

/*---------------
international
----------------*/
$(function($){
	var $contents = $("#internationalSub");
	$contents.css("display","none");
	$("#international").hover(function(){
		$("span.linkTop",$contents).html('<a href="javascript:void(0);"><img src="/common/images/nav-global-02-on.gif" width="90" height="31" alt="International" /></a>');
		$this = $contents.clone().prependTo("#international");
		$this.css("display","block");
	},
	function(){
		$this.css("display","none");
	});
});


/*---------------
smooth scroll
----------------*/
$.easing.quart = function (x, t, b, c, d) {
	return -c * ((t=t/d-1)*t*t*t - 1) + b;
};
/*Add .not("#prev").not("#next") 121025 Nara */
$(function($){
	$('a[href*="#"],area[href*="#"]').not("#prev").not("#next").bind("click", (function () {
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
			var $target = $(this.hash);
			$target = $target.length && $target || $('[name=' + this.hash.slice(1) +']');
			if ($target.length) {
				var targetOffset = $target.offset().top;
				$('html,body').animate({ scrollTop: targetOffset }, 1200, 'quart');
				return false;
			}
		}
	}));
});

/*---------------
facebook button
----------------*/
$(function($){
	$(".facebookBtn").html('<iframe src="https://www.facebook.com/plugins/like.php?locale=en_US&amp;href='+encodeURIComponent(window.location.href)+'&amp;layout=button_count&amp;show_faces=true&amp;width=120&amp;action=like&amp;colorscheme=light&amp;height=21" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:100px; height:21px;" allowTransparency="true"></iframe>');
	$(".facebookBtn02").html('<iframe src="https://www.facebook.com/plugins/like.php?locale=en_US&amp;href='+encodeURIComponent(window.location.href)+'&amp;layout=standard&amp;show_faces=true&amp;width=670&amp;action=like&amp;colorscheme=light&amp;height=80" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:690px; height:80px; margin-top:5px;" allowTransparency="true"></iframe>');
});

/*---------------
img-preload
----------------*/
$(function($){
	var n = $(".preLoadArea").size();
	if(!n==0){
		$(".preLoadArea img").lazyload({
				placeholder : "/common/images/loading.gif",
				effect : "fadeIn"
		});
	}
});

/*---------------
tab
----------------*/
function equalHeight(group) {
	tallest = 0;
	group.each(function() {
		thisHeight = $(this).height();
		if(thisHeight > tallest) {
			tallest = thisHeight;
		}
	});
	group.height(tallest);
}

$(function($){
	var targetElmNum = $(".tabList").size();
	if(!targetElmNum==0){
		equalHeight($(".tabList > li > a"));
		if($(".tabList > li > a").attr("href").charAt(0) == "#"){
			$(".tab").each(function() {
				$("div.tabBlock", this).hide();
				$("div.tabBlock:first", this).show();
				$(".tabList > li:first", this).addClass("active");

				var tabIndex = $("div.tabBlock", this);
				var tabNum = $(tabIndex).length-1;

				$(".tabList > li > a", this).unbind("click");

				var baseElm = this;
				$(".tabList > li", this).each(function(){
					var $target = $(this);
					$(this).find("a").click(function(){
						$(".tabList > li", baseElm).removeClass();
						$target.addClass("active");
						var targetID = $(this).attr("href");
						$("div.tabBlock", baseElm).hide();
						$(targetID).show();
						return false;
					});
				});
			});
		}
	}
});

/*---------------
popup window
----------------*/
$(function($){
	$(".popWin").click(function(){
		window.open(this.href, "","width=610,height=650,resizable=yes,scrollbars=yes");
		return false;
	});
});

    $("#back").click(function(){
        $('#seminar_cancel').attr('action','/seminar/cencel/input.html');
        $('#seminar_cancel').submit();
    });

    $("#cancel").click(function(){
        $('#seminar_cancel').attr('action','/seminar/cencel/confirm.html');
        $('#seminar_cancel').submit();
    });

/*---------------
dev用
----------------*/

if (location.hostname == "dev38.ini.co.jp" || location.hostname == "dev.starbucks.co.jp") {
	$(function($){
		$("a[href^='https://www.starbucks.co.jp']").each(function(){
			var href = $(this).attr('href');
			href = href.replace("https://www.starbucks.co.jp", "");
			$(this).attr('href',href)
		});
	});
}
