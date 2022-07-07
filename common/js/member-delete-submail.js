$(function(){

    /* デフォルト */
    var error_message = '⼀定時間応答がないため、リクエストを中断しました。';

    /* 2016.05.16 会員情報管理 サブアドレス削除時ダイアログ */
    $(".js-subMailCofirmDialog-yes").on("click", function(e) {
    	e.preventDefault();
    	$.ajax({
    	    url: "/mystarbucks/mail-delete/index.php",
            timeout:30000,
            contentType: "application/json; charset=utf-8"
	    }).done(function(res, textStatus){
	        // 正常系
                $(".js-subMailDialog").find("dd").addClass("delMessage").text(res.message);
                $(".submail").empty();
                var membermailAdress = 'メール配信先を追加することができます' +
                                   '<span class="smallText">ログインには使用できません。</span>' +
                                   '<ul>' +
                                   '<li><a class="itemLink" href="/mystarbucks/mail-add/input/">追加する</a></li>' +
                                   '</ul>';
                $(".submail").append(membermailAdress);
	    }).fail(function(jqXHR, textStatus, errorThrown){
	        // 異常系
	        if(textStatus.indexOf("timeout") == -1)
	        {
                    error_message = $.parseJSON(jqXHR.responseText).message;
	        }
            $(".js-subMailDialog").find("dd").text(error_message);
	    }).complete(function(){
            $(".js-subMailDialog").fadeIn(300, function(){
				var timer = setTimeout(function(){
					clearTimeout(timer);
					$(".js-subMailDialog").fadeOut(300);
				}, 2000);
			});
	    });
    });
});