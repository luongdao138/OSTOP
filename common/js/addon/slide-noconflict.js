var topicsNum = topicsData.topic.length;
//var targetTopicIndex = 2;
var targetTopicIndex = Math.floor( Math.random() * topicsNum );
var topic = topicsData.topic[targetTopicIndex];
var headline = topic.headline;
if (headline.length>50) {
	headline = headline.substring(0, 49);
	headline += "...";
}
jQuery("#topic_link").attr("href",topic.link);
jQuery("#topic_src").attr("src",topic.src);
jQuery("#topic_link").text(headline);
jQuery("#topic_src").attr("alt",topic.caption);
jQuery("#topic_link").attr("target","_blank");
/*
jQuery("#topic_src").text(topic.caption);
*/
jQuery(function() {
	jQuery("#openarr").css({"visibility":"visible"});
	jQuery("#closearr").css({"visibility":"hidden"});

	var winWidth = jQuery('body').outerWidth(true);
	var winHeight = jQuery(window).height();

	//画面下位置を取得
	var bottomPos = jQuery(document).height() - jQuery(window).height() -1000;
	if (bottomPos>1500) bottomPos=1500;
	var showFlug = false;

var defaultHeight = winHeight -93;


jQuery("#add").css({"position":"fixed","top":defaultHeight});

jQuery("#add").css({"visibility":"visible"});

var defaultLeft= winWidth;
var secondLeft= winWidth-20;
var duration_cnt = 700;
jQuery("#add").css({"position":"fixed","left":defaultLeft});
animateFlg = true;


function slideAnime() {
if (animateFlg) {
		if (jQuery(this).scrollTop() >= bottomPos) {

			if (showFlug == false) {

				showFlug = true;

				//jQuery("#bbb").css({"position":"static"});
var leftmax = winWidth -443;
leftmax = leftmax + "px";

				jQuery("#add").stop().animate({'left' : leftmax }, duration_cnt);
            	jQuery("#openarr").css({"visibility":"hidden"});
            	jQuery("#closearr").css({"visibility":"visible"});
			}
		} else {

			if (showFlug) {

				showFlug = false;
				jQuery("#add").stop().animate({'left' : secondLeft}, duration_cnt);
            	jQuery("#openarr").css({"visibility":"visible"});
            	jQuery("#closearr").css({"visibility":"hidden"});
			}
		}
}
}
	jQuery(window).scroll(slideAnime);

	//閉じるボタン
	jQuery('#closearr').click(function(){
		jQuery("#add").stop().animate({'left' : secondLeft}, duration_cnt);
		animateFlg = false;
            	jQuery("#openarr").css({"visibility":"visible"});
            	jQuery("#closearr").css({"visibility":"hidden"});
	});

	//閉じるボタン
	jQuery('#close').click(function(){
jQuery("#add").css({"visibility":"hidden"});
jQuery("#openarr").css({"visibility":"hidden"});
jQuery("#closearr").css({"visibility":"hidden"});
jQuery(window).unbind("scroll",slideAnime);
	});

	//開くボタン
	jQuery('#openarr').click(function(){
var leftmax = winWidth -443;
leftmax = leftmax + "px";

				jQuery("#add").stop().animate({'left' : leftmax }, duration_cnt);
		animateFlg = false;
            	jQuery("#openarr").css({"visibility":"hidden"});
            	jQuery("#closearr").css({"visibility":"visible"});
	});
});
