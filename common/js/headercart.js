/**
 * headercart.js
 * @modified 2013/12/17
 */
 
var uuid = function(len, radix){
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
};
/**
 * カート参照
 */
function reqCartReference(){

	//console.log(window.DOMAIN_API);
	
	$.ajax({
		url: window.DOMAIN_API + '/b/pc/xml/Cart.html?mthd=96',
		timeout: 30000,
		dataType: 'jsonp',
		jsonpCallback: 'response' + uuid(17),
		data: {
			form: 'jsonp',
			sc: 'SBJ'
		},
		success: $.proxy(function(res){
			if(parseInt(res.resultCode, 10) === 0){
				setCartQty(res.response.cart.itemQty);
			}else{
				//this._$dialog.showErrorDialog(res.errorCode);
			};
		}, this),
		error: $.proxy(function(res){
			//this._$dialog.showErrorDialog('000');
		}, this)
	});
};
/**
 * カート内の商品数を表示
 */
function setCartQty(num){
	
	var normalIcon = $(".osIcon").eq(0);
	var zeroIcon = $(".osIcon").eq(1);
	
	//switch
	if( (num == 0 || num == "0") && zeroIcon.hasClass("none") )
	{
		normalIcon.addClass('none');
		zeroIcon.removeClass('none');
	}
	
	if( (num != 0 || num != "0") && normalIcon.hasClass("none") )
	{
		normalIcon.removeClass('none');
		zeroIcon.addClass('none');
	}
	
	//update
	$(".js-headercart-qty").text(num);
}


(function($, window, document, undefined){
	
	//カート参照の後、カート内の商品数を表示
	reqCartReference();
	
}(jQuery, window, this.document));






