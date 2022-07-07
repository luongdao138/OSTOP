var errFlg = 0;
jQuery(function($){
	$('#usernameLoading').hide();
	
	// 郵便番号検索
	$("#search").bind("click", function() {
		$(this).nextAll("p.error").remove();
		var zipAv = $(this).parent().find("[name=zipA]").val();
		var zipAt = $(this).parent().find("[name=zipA]").attr('title');
		var zipBv = $(this).parent().find("[name=zipB]").val();
		var zipBt = $(this).parent().find("[name=zipB]").attr('title');
	});
	
	$("form").submit(function() {
		// The error flag is initialized. 
		errFlg = 0;
		
		// バリデーション実行
		// ラジオボタン必須チェック
		$(":radio").filter(".validate").filter(".radioRequired").filter(function () {
			if (undefined == $("input[name="+$(this).attr("name")+"]:checked").val()) {
				$(this).parent().parent().parent().find("p.error").remove();
				$(this).parent().parent().parent().append("<p class='error'>必須項目です</p>");
				errFlg = 1;
			}
		});
		
		$(".validate").filter(function(){
			validate($(this));
			validCheckbox($(this));
			validRadio($(this));
			validPulldown($(this));
		});
		
		// It agrees to the rule. 
		$(".agreement").filter(function(){
			if(!$(this).is(':checked')){errFlg = 1}
		});
		
		if (errFlg != 0) {
			return false;
		}
	});

	/*
	* バリデーションチェック
	*/
	$(".validate").bind("blur", function() {
		validate($(this));
		validPulldown($(this));
	});
	$(".validate").bind("change", function() {
		validCheckbox($(this));
		validRadio($(this));
	});
});

function validate(obj) {
	obj.removeClass("error");
	obj.nextAll("p.error").remove();
			
	/* 汎用系 */
	// 必須項目のチェック
	obj.filter(".required").each(function(){
		obj.removeClass("error");
		obj.nextAll("p.error").remove();
			
		var text = obj.attr('value');
		var example = obj.attr('title');
				
		if(0 == text.length || text == example){
			obj.addClass("error");
			obj.parent().append("<p class='error'>必須項目です</p>")
			errFlg = 1;
		}
	});

	// 半角数字チェック
	obj.filter(".hankakuNumeric").each(function(){
		var text = obj.val();
		var example = obj.attr('title');
		
		if(0 != text.length && text != example){
			if(obj.val() && !obj.val().match(/^[0-9]+$/)){
				obj.addClass("error");
				obj.parent().append("<p class='error'>半角数字で入力してください</p>")
				errFlg = 1;
			}
		}
	});

	// 16桁チェック
	obj.filter(".16digits").each(function(){
		var text = obj.val();
		var example = obj.attr('title');
		
		if(0 != text.length && text != example){
			if(obj.val().length != 16) {
				obj.addClass("error");
					obj.parent().append("<p class='error'>16桁で入力してください</p>")
					errFlg = 1;
			}
		}
	});

	/* 専用系 */
	// ユーザチェック
	obj.filter(".userCheck").each(function(){
		var text = obj.val();
		var example = obj.attr('title');
		
		if(text == "" || text == example){
			$('#usernameResult').hide();
			obj.addClass("error");
			obj.parent().append("<p class='error'>必須項目です</p>");
			errFlg = 1;
		} else {
			$('#usernameLoading').show();
			
			// TODO ユーザチェックAPI（ダミー）
			$.post("/common/js/addon/check.php", {
				username: $('#username').val()
			}, function(response) {
				var result;
				if (0 == response) {
					obj.removeClass("error");
					result = '使用可能です。';
				} else {
					obj.addClass("error");
					result = 'ユーザ名はもう使われています。';
				}
				$('#usernameResult').fadeOut();
					setTimeout("finishAjax('usernameResult', '"+escape(result)+"')", 400);
			});
			return false;
		}
	});
	
	//メールアドレス書式チェック
	obj.filter(".mail").each(function(){
		obj.removeClass("error");
		obj.nextAll("p.error").eq(0).remove();
		
		var text = obj.val();
		var example = obj.attr('title');
		
		if(text == "" || text == example) {
			obj.addClass("error");
			//obj.parent().append("<p class='error'>必須項目です</p>");
			$("<p class='error mB0'>必須項目です</p>").insertAfter(obj);
			errFlg = 1;
		} else if(obj.val() && !obj.val().match(/^[A-Za-z0-9]+[\w-.]+@[\w\.-]+\.\w{2,}$/)){
			$("<p class='error mB0'>メールアドレスの形式が異なります</p>").insertAfter(obj);
			obj.addClass("error");
			errFlg = 1;
		}
	});

	//メールアドレス確認のチェック
	obj.filter(".mail_check").each(function(){
		obj.removeClass("error");
		obj.nextAll("p.error").remove();
		
		var text = obj.val();
		var example = obj.attr('title');
		
		if (text == "" || text == example){
			obj.addClass("error");
			obj.parent().append("<p class='error'>必須項目です</p>");
			errFlg = 1;
		} else if (obj.val() && obj.val()!=$(".mail").val()){
			$("<p class='error'>メールアドレスと内容が異なります</p>").insertAfter(obj);
			obj.addClass("error");
			errFlg = 1;
		}
	});
	
	// パスワードチェック
	obj.filter(".password").each(function(){
		obj.removeClass("error");
		//obj.nextAll("p.error").eq(0).remove();
		
		var text = obj.val();
		var example = obj.attr('title');
		
		if (text == "" || text == example){
			$("<p class='error'>必須項目です</p>").insertAfter(obj);
			obj.addClass("error");
			errFlg = 1;
		} else if (obj.val() && !obj.val().match(/^[a-zA-Z0-9]+$/)){
			$("<p class='error mB0'>半角英数字で入力してください</p>").insertAfter(obj);
			obj.addClass("error");
			errFlg = 1;
		} else if (obj.val().length < 6 || obj.val().length > 20){
			$("<p class='error mB0'>6～20文字で入力してください</p>").insertAfter(obj);
			obj.addClass("error");
			errFlg = 1;
		}
		
		obj.parent().find(".password_check").each(function(){
			if ($(this).val()==""){
				$("<p class='error'>必須項目です</p>").insertAfter($(this));
				$(this).addClass("error");
				errFlg = 1;
			} else if ($(this).val() && $(this).val()!=$(".password").val()){
				$("<p class='error'>パスワードと内容が異なります</p>").insertAfter($(this));
				$(this).addClass("error");
				errFlg = 1;
			} else {
				$(this).removeClass("error");
			}
		});
	});

	//パスワード確認のチェック
	obj.filter(".password_check").each(function(){
		obj.removeClass("error");
		obj.nextAll("p.error").remove();
		
		if (obj.val()==""){
			$("<p class='error'>必須項目です</p>").insertAfter(obj);
			obj.addClass("error");
			errFlg = 1;
		} else if (obj.val() && obj.val()!=$(".password").val()){
			$("<p class='error'>パスワードと内容が異なります</p>").insertAfter(obj);
			obj.addClass("error");
			errFlg = 1;
		}
	});

}

function validRadio(obj) {
	// ラジオボタン必須チェック
	// 既存エラー文言削除処理
	obj.filter(".radioRequired").each(function () {
		if (true == obj.is(':checked')) {
			obj.parent().parent().parent().find("p.error").remove();
		}
	});
}

function validCheckbox(obj) {
	// チェックボックス必須チェック
	obj.parent().parent().parent(".checkboxRequired").filter(function(){
		obj.find("p.error").remove();
		var count = 0;
				
		$(this).parent().find(".validate").each(function(){
			if (true == $(this).is(':checked')) {
				count++;
			}
		});
		
		if (count > 0) {
			$(this).find("p.error").remove();
		} else {
			$(this).find("p.error").remove();
			$(this).append("<p class='error'>必須項目です</p>");
			errFlg = 1;
		}
	});
}

function validPulldown(obj) {
	//必須項目のチェック
	obj.filter(".pulldownRequired").each(function(){
	obj.removeClass("error");
		obj.nextAll("p.error").remove();
		if (obj.val()==""){
			obj.parent().append("<p class='error'>必須項目です</p>");
			errFlg = 1;
		}
	});
}

function finishAjax(id, response) {
	$('#usernameLoading').hide();
	$('#'+id).html(unescape(response));
	$('#'+id).fadeIn();
}

function errorLogic(errFlg) {
	// エラー処理
	if (errFlg == 0) {
		$(":submit").attr('disabled','');
	} else {
		$(":submit").attr('disabled','disabled');
	}
}
