$j1111 = $.noConflict(true);
var supportTouch = 'ontouchend' in document;
var EVENT_CLICK = supportTouch ? 'click' : 'click';
var EVENT_TOUCHSTART = supportTouch ? 'touchstart' : 'mousedown';
var EVENT_TOUCHMOVE = supportTouch ? 'touchmove' : 'mousemove';
var EVENT_TOUCHEND = supportTouch ? 'touchend' : 'mouseup';
var isIe8 = (checkBrowser() == 'ie8')? true: false;
(function($){
function uuid(len, radix){
var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''), uuid = [], i;
radix = radix || chars.length;
if(len){
for(i = 0; i < len; i++){
uuid[i] = chars[0 | Math.random()*radix]
};
}else{
var r;
uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
uuid[14] = '4';
for(i = 0; i < 36; i++){
if(!uuid[i]){
r = 0 | Math.random()*16;
uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
};
};
};
return uuid.join('');
}
$(function(){
$('a.js-preventDoubleClick').click(function(){
if(!$(this).hasClass('.is-doubleClick')){
$('.is-doubleClick').removeClass('is-doubleClick');
$(this).addClass('is-doubleClick');
location.href = $(this).attr('href');
}
return false;
});
});
$(function(){
$(".popWin").on('click',function(){
window.open(this.href, "","width=610,height=650,resizable=yes,scrollbars=yes");
return false;
});
});
$(function(){
var domain = location.hostname;
var path = location.pathname;
if(domain == 'cart2.starbucks.co.jp'||domain == 'cart.starbucks.co.jp'){
var character = 'sjis';
}else{
var character = 'utf8';
}
$.ajax({
url: 'https:'+window.DOMAIN_WWW_API+'/api/getNickName.php',
timeout: 30000,
dataType: 'jsonp',
jsonpCallback: 'response' + uuid(17),
data: {
form: 'jsonp',
character: character
},
success: $.proxy(function(res){
if(res.loginStatus == 1){
if($('.megaNav.min').size() == 0){
$('.js-megaNav .serviceAndLogin').addClass('login');
var userName = 'Hello, '+res.userName+'<span>さん</span>';
var login = $('.js-login');
login.find('.topics').addClass('name').addClass('js-name');
login.find('.topics .question,.topics a').remove();
login.find('.js-name').html(userName);
login.find('.login').remove();
login.find('.logout').removeClass('hide');
login.find('.signUp').remove();
}else{
$('.js-login').removeClass('hide');
var userName = res.userName+'さん';
$('.megaNav .js-name').html(userName);
}
}
}, this),
error: $.proxy(function(res){
}, this)
});
});
$(function (){
$('.js-open').parent('li').on(EVENT_CLICK,function(){
var isActive = $(this).hasClass('active');
$('.overlay').css('display', 'none');
$('.js-open').parent('li').removeClass('active');
$('.refine').removeClass('is-opened');
if(!isActive){
var overlayClass = $(this).attr('data-obj');
$(this).addClass('active');
var ov = $('header.global .overlay.'+overlayClass);
ov.css('display', 'block');
if(overlayClass != 'serviceAndLogin') setMegaNavSlide(ov);
}
return false;
});
$('.js-close').on(EVENT_CLICK,function(){
$('.overlay').css('display', 'none');
$('.js-megaNav li').removeClass('active');
return false;
});
var timer = false;
var isDefaultDevice = checkDevice();
$(window).resize(function(){
if (timer !== false) {
clearTimeout(timer);
}
timer = setTimeout(function() {
var isNowDevice = checkDevice();
if(isDefaultDevice != isNowDevice || isNowDevice != 'pc'){
isDefaultDevice = isNowDevice;
$('header.global .overlay:visible').each(function(){
if(!isIe8) setMegaNavSlide($(this));
});
}
}, 200);
});
var flipsnap = new Array();
var defaultPoint = new Array();
var defaultCol = new Array();
var newPoint = new Array();
var newCol = new Array();
var changeCol = new Array();
if(!isIe8){
$('header.global .overlay').not('.serviceAndLogin').each(function(){
var ovClass = $(this).attr('data-obj');
var newsContainer = $(this);
flipsnap[ovClass] = Flipsnap('.'+ovClass+' .newsSnap');
flipsnap[ovClass].element.addEventListener('fstouchend', function(ev) {
newPoint[ovClass] = ev.newPoint;
if(defaultPoint[ovClass] != newPoint[ovClass]){
defaultPoint[ovClass] = newPoint[ovClass];
}
}, false);
var $pointer = newsContainer.find('.indicator li');
flipsnap[ovClass].element.addEventListener('fspointmove', function() {
$pointer.filter('.active').removeClass('active');
$pointer.eq(flipsnap[ovClass].currentPoint).addClass('active');
}, false);
var $next = newsContainer.find('.next').on('click',function() {
flipsnap[ovClass].toNext();
});
var $prev = newsContainer.find('.prev').on('click',function() {
flipsnap[ovClass].toPrev();
});
flipsnap[ovClass].element.addEventListener('fspointmove', function() {
if(!flipsnap[ovClass].hasNext()){
$next.addClass('disable');
}else{
$next.removeClass('disable');
}
if(!flipsnap[ovClass].hasPrev()){
$prev.addClass('disable');
}else{
$prev.removeClass('disable');
}
}, false);
});
}
function setMegaNavSlide(obj){
var colWidth = 300;
var padding = 20;
var ovClass = obj.attr('data-obj');
var newsContainer = obj;
var newsContainerItemWidth = newsContainer.find('.news').innerWidth();
var newsItem = newsContainer.find('.newsSnap li');
var newsItemNum = newsItem.size();
var newsContainerWidth = newsContainerItemWidth*newsItemNum;
var distance = newsContainerItemWidth;
defaultCol[ovClass] = (newsContainer.innerWidth()/colWidth > 2 && checkDevice() != "sp") ? 2 : 1;
if(newCol[ovClass] == undefined) newCol[ovClass] = 0;
if(defaultCol[ovClass] != newCol[ovClass]){
changeCol[ovClass] = defaultCol[ovClass] - newCol[ovClass];
newCol[ovClass] = defaultCol[ovClass];
}else{
changeCol[ovClass] = 0;
}
if(defaultCol[ovClass] == 2){
var maxPoint = Math.ceil((newsItemNum-2) / 2);
var maxPoint2 = Math.ceil((newsItemNum) / 2)+1;
newsContainerItemWidth = newsContainerItemWidth / 2;
}else{
var maxPoint = (newsItemNum-1);
var maxPoint2 = (newsItemNum+1);
}
newsContainer.find('.newsView').width(newsContainerWidth);
newsItem.width(newsContainerItemWidth-padding);
flipsnap[ovClass] = Flipsnap('.'+ovClass+' .newsSnap', {
distance: distance,
maxPoint: maxPoint
});
if(defaultPoint[ovClass] != undefined){
if(changeCol[ovClass] == -1){
defaultPoint[ovClass] = (defaultPoint[ovClass]*2);
}else if(changeCol[ovClass] == 1){
defaultPoint[ovClass] = Math.floor((defaultPoint[ovClass]/2));
}
flipsnap[ovClass].moveToPoint(defaultPoint[ovClass]);
}
newsContainer.find('.indicator li').css('display','')
newsContainer.find('.indicator li:nth-child(n+'+maxPoint2+')').css('display','none')
if(defaultPoint[ovClass] == 0){
newsContainer.find('.indicator li').removeClass()
newsContainer.find('.indicator li:first-child').addClass('active')
newsContainer.find('.controls li.prev').addClass('disable')
}
}
});
$(function(){
setUtilityNavPosition();
setUtilityNavWithFooter();
});
var timer = false;
$(window).resize(function(){
if (timer !== false) {
clearTimeout(timer);
}
timer = setTimeout(function() {
setUtilityNavPosition();
setUtilityNavWithFooter();
}, 200);
});
$(function (){
$('.js-shareFb,.js-shareTw,.js-shareLn').on('click',function(){
var sys = $(this).attr('class');
var url = $(this).attr('data-url');
var ttl = $("title").text().replace(" | ", "｜");
if ((navigator.userAgent.indexOf('iPhone') > 0 && navigator.userAgent.indexOf('iPad') == -1) || navigator.userAgent.indexOf('iPod') > 0 || navigator.userAgent.indexOf('Android') > 0) {
if(sys == 'js-shareFb'){
window.location.href='https://www.facebook.com/sharer.php?u='+url;
}else if(sys == 'js-shareTw'){
window.location.href='https://twitter.com/intent/tweet?url='+url+'&amp;text='+ttl;
}else if(sys == 'js-shareLn'){
window.location.href='https://line.naver.jp/R/msg/text/?'+ttl+'%0D%0A'+url;
}
}else{
if(sys == 'js-shareFb'){
window.open('https://www.facebook.com/sharer.php?u='+url,'share','width=632,height=456,location=yes,resizable=yes,toolbar=no,menubar=no,scrollbars=no,status=no');
}else if(sys == 'js-shareTw'){
window.open('https://twitter.com/intent/tweet?url='+url+'&amp;text='+ttl,'share','width=632,height=456,location=yes,resizable=yes,toolbar=no,menubar=no,scrollbars=no,status=no');
}
}
return false;
});
$('.js-pulldown').on('click',function(){
var obj = $(this).next();
if(obj.is(':visible')){
obj.removeClass('is-opened')
}else{
$('.global .overlay').css('display','none');
$('.megaNav li').removeClass('active');
$('.refine').removeClass('is-opened');
obj.addClass('is-opened')
}
return false;
});
$('.js-toggleButton').on('click',function(){
$('.js-pulldown').next().removeClass('is-opened');
});
$('.sns .js-closeButton').on('click',function(){
$(this).parent('.pulldown').removeClass('is-opened');
});
});
$(function(){
$(document).on('click touchend',function(e){
if(!$.contains($('.global')[0], e.target) && $('.global .overlay').is(':visible')){
$('.global .overlay').css('display','none');
$('.megaNav li').removeClass('active');
}else{
if($('.refine').size() > 0){
var eventClass = e.target.className;
var eventSrc = e.target.src;
if(typeof eventSrc != 'undefined'){
eventSrc = eventSrc.split('/');
eventSrc = eventSrc[eventSrc.length -1];
eventSrc = eventSrc.indexOf('img-icon-question-store.png');
}else{
eventSrc = -1;	}
if(eventClass.indexOf('refine') < 0 && eventClass.indexOf('js-toggleButton') < 0 && eventSrc < 0){
for(var i = 0; i < $('.refine').size(); i++){
if(!$.contains($('.refine')[i], e.target)){
$('.refine').eq(i).removeClass('is-opened');
}
}
}
}
}
});
});
$(function (){
$('.js-pinterest').on('click',function(){
var url = location.href;
var text = $("meta[name=description]").attr("content");
var imgIndex = $('.slide li.thumbnailList .thumbnails li.is-selected').index();
var img = $('.js-enlargerMouseArea li').eq(imgIndex).children('img').attr('src');
img = '//' + location.hostname + img;
window.open('https://www.pinterest.com/pin/create/button/?url=' + url + '&media=' + img + '&description=' + text);
return false;
});
});
$(function(){
$("#forPosOverlay").colorbox({
inline: true,
width: "auto"
});
});
$(function (){
$('aside.welcome .js-closeButton').on('click',function(){
var welcomeH = $('aside.welcome').outerHeight();
$('aside.welcome').animate({"marginTop": -(welcomeH)}, "slow", function(){
$(this).hide();
});
});
});
$(function (){
var scroll_start_x = 0;
var agent = navigator.userAgent;
if(agent.indexOf('Android 2.3') > 0){
$('.tableWrap, .highlight .graph').each(function() {
$(this).on({
'touchstart'	: function(e) {
scroll_start_x = e.originalEvent.touches[0].pageX;
},
'touchmove'	: function(e) {
var scroll_end_x = e.originalEvent.touches[0].pageX;
$(this).scrollLeft($(this).scrollLeft() - (scroll_end_x - scroll_start_x));
}
});
});
}
});
$(function (){
$(window).on("load", function(){
if(document.URL.match('/customize/')) {
$("a").hover(function(){
$(this).find('img').attr('src', $(this).find('img').attr('src').replace('-ovoff', '-ovon'));
}, function(){
if (!$(this).hasClass('current')) {
$(this).find('img').attr('src', $(this).find('img').attr('src').replace('-ovon', '-ovoff'));
}
});
}
});
});
$(function(){
var $setElm = $('.sideBar .navListThumbnail li .textArea p.heading');
var cutFigureCSR = '35';
var cutFigurePR = '37';
var afterTxt = '...';
$setElm.each(function(){
var textLength = $(this).text().length;
var textTrimCSR = $(this).text().substr(0,(cutFigureCSR))
var textTrimPR = $(this).text().substr(0,(cutFigurePR))
if(document.URL.match('/csr/csrnews/')) {
if(cutFigureCSR < textLength) {
$(this).html(textTrimCSR + afterTxt).css({visibility:'visible'});
} else if(cutFigureCSR >= textLength) {
$(this).css({visibility:'visible'});
}
}else if(document.URL.match('/press_release/')) {
if(cutFigurePR < textLength) {
$(this).html(textTrimPR + afterTxt).css({visibility:'visible'});
} else if(cutFigurePR >= textLength) {
$(this).css({visibility:'visible'});
}
}
});
});
$(function (){
$(".isSoldout .check").remove();
});
$(function (){
$("article.forCms .newContents").find('img').wrap('<div class="imgWrap"></div>');
});
$(function (){
var winW = $(window).width();
$('.enlargedVisual img').css('min-width',winW);
});
function setUtilityNavWithFooter(){
var winW = $(window).width();
if(0 < $("nav.utility.os, nav.utility.is-cartActive").size()){
var navH = $('nav.utility').height();
$('footer.global').css('margin-bottom', navH);
}
}
$(function (){
if(0 < $("aside.welcome").size()){
var contents = $('.mainContents');
if(contents.hasClass('notExNav')||contents.hasClass('withLocalNav')){
$('aside.welcome').addClass('align');
}
}
});
$(function(){
if( navigator.userAgent.match(/MSIE 8/) ) {
$('nav.utility.os .js-expandableContent, nav.utility.cart .js-expandableContent').addClass('forIe8');
$('.productDetail .js-gallery .enlargedVisual').addClass('forIe8');
$('.productDetail .js-gallery .zoomContents .zoom').css('display', 'none');
$('.productDetail .js-gallery .slide,.js-gallery .slide LI.thumbnailList').css('overflow', 'visible');
$('.productDetail .js-gallery .slide LI.thumbnailList .thumbnails').css('max-width', '230px');
$('.productDetail .js-gallery .slide LI.thumbnailList .thumbnails li').css('margin-bottom', '5px');
$('.productDetail .visibleArea').remove();
$('.slide li.thumbnailList .thumbnails li').on('click',function(){
var imgIndex = $(this).index();
var imgW = 290;
$('.productDetail .visualContainer .images').css('left', -imgW*imgIndex);
});
}
});
function setUtilityNavPosition(){
var utility = $('.utility');
if(checkDevice() == 'pc'){
var utilityH = utility.outerHeight(true);
var winH = $(window).height();
if(winH < utilityH){
$(utility).css('position','absolute');
}else{
$(utility).css('position','fixed');
}
}else{
$(utility).css('position','fixed');
}
}
})($j1111);
function checkDevice(){
var pcMin = 910;
var tabMin = 600;
var width = window.innerWidth;
if((width > pcMin)||(navigator.userAgent.indexOf('MSIE 8') != -1)){
return 'pc';
}else if(pcMin > width && width >= tabMin){
return 'tab';
}else{
return 'sp';
}
}
function checkBrowser(){
var userAgent = window.navigator.userAgent.toLowerCase();
var appVersion = window.navigator.appVersion.toLowerCase();
if(userAgent.indexOf('opera') != -1) {
return 'opera';
}else if(userAgent.indexOf('msie') != -1) {
if(appVersion.indexOf("msie 6.") != -1) {
return 'ie6';
}else if(appVersion.indexOf("msie 7.") != -1) {
return 'ie7';
}else if(appVersion.indexOf("msie 8.") != -1) {
return 'ie8';
}else if(appVersion.indexOf("msie 9.") != -1) {
return 'ie9';
}else{
return 'ie';
}
}else if(userAgent.indexOf('chrome') != -1) {
return 'chrome';
}else if(userAgent.indexOf('safari') != -1) {
return 'safari';
}else if(userAgent.indexOf('gecko') != -1) {
return 'gecko';
}else{
return false;
}
}
