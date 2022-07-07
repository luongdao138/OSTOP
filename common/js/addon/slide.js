var topicsNum = topicsData.topic.length;
//var targetTopicIndex = 2;
var targetTopicIndex = Math.floor( Math.random() * topicsNum );
var topic = topicsData.topic[targetTopicIndex];
var headline = topic.headline;
if (headline.length>50) {
	headline = headline.substring(0, 49);
	headline += "...";
}
$("#topic_link").attr("href",topic.link);
$("#topic_src").attr("src",topic.src);
$("#topic_link").text(headline);
$("#topic_src").attr("alt",topic.caption);
$("#topic_link").attr("target","_blank");
/*
$("#topic_src").text(topic.caption);
*/
$(function() {
	$("#openarr").css({"visibility":"visible"});
	$("#closearr").css({"visibility":"hidden"});

	var winWidth = $('body').outerWidth(true);
	var winHeight = $(window).height();

	//画面下位置を取得
	var bottomPos = $(document).height() - $(window).height() -1000;
	if (bottomPos>1500) bottomPos=1500;
	var showFlug = false;

var defaultHeight = winHeight -93;


$("#add").css({"position":"fixed","top":defaultHeight});

$("#add").css({"visibility":"visible"});

var defaultLeft= winWidth;
var secondLeft= winWidth-20;
var duration_cnt = 700;
$("#add").css({"position":"fixed","left":defaultLeft});
animateFlg = true;


function slideAnime() {
if (animateFlg) {
		if ($(this).scrollTop() >= bottomPos) {

			if (showFlug == false) {

				showFlug = true;

				//$("#bbb").css({"position":"static"});
var leftmax = winWidth -443;
leftmax = leftmax + "px";

				$("#add").stop().animate({'left' : leftmax }, duration_cnt);
            	$("#openarr").css({"visibility":"hidden"});
            	$("#closearr").css({"visibility":"visible"});
			}
		} else {

			if (showFlug) {

				showFlug = false;
				$("#add").stop().animate({'left' : secondLeft}, duration_cnt);
            	$("#openarr").css({"visibility":"visible"});
            	$("#closearr").css({"visibility":"hidden"});
			}
		}
}
}
	$(window).scroll(slideAnime);

	//閉じるボタン
	$('#closearr').click(function(){
		$("#add").stop().animate({'left' : secondLeft}, duration_cnt);
		animateFlg = false;
            	$("#openarr").css({"visibility":"visible"});
            	$("#closearr").css({"visibility":"hidden"});
	});

	//閉じるボタン
	$('#close').click(function(){
$("#add").css({"visibility":"hidden"});
$("#openarr").css({"visibility":"hidden"});
$("#closearr").css({"visibility":"hidden"});
$(window).unbind("scroll",slideAnime);
	});

	//開くボタン
	$('#openarr').click(function(){
var leftmax = winWidth -443;
leftmax = leftmax + "px";

				$("#add").stop().animate({'left' : leftmax }, duration_cnt);
		animateFlg = false;
            	$("#openarr").css({"visibility":"hidden"});
            	$("#closearr").css({"visibility":"visible"});
	});
});
