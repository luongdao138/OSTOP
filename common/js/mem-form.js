/**
 * jquery.jpostal.js ver2.7
 * 
 * Copyright 2014, Aoki Makoto, Ninton G.K. http://www.ninton.co.jp
 * 
 * Released under the MIT license - http://en.wikipedia.org/wiki/MIT_License
 * 
 * Requirements
 * jquery.js
 */
function JpostalDatabase ( i_options ) {
	this.address = [];	// database cache
	this.map     = {
	};
	this.url     = {
		'http'  : '//jpostal-1006.appspot.com/json/',
		'https' : '//jpostal-1006.appspot.com/json/',
	};
	
	this.find = function ( i_postcode ) {
		var	address = [];
		
		for ( var i = 0; i < this.address.length; ++i ) {
			if ( this.address[i][0] == '_' + i_postcode ) {
				address = this.address[i];
			}
		}
		
		return address;
	};
	
	this.get = function ( i_postcode ) {
		//	--------------------------------------------------
		//	i_postcode	find()	find()	result
		//				1234567	123
		//	--------------------------------------------------
		//	1			-		-		defaults
		//	12			-		-		defaults
		//	123			-		Y		find( '123' )
		//	123			-		N		defaults
		//	1234		-		Y		find( '123' )
		//	1234		-		N		defaults
		//	1234567		Y		-		find( '1234567' )
		//	1234567		N		Y		find( '123' )
		//	1234567		N		N		defaults
		//	--------------------------------------------------
		var defaults = ['', '', '', '', '', '', '', '', ''];
		var	address;
		var	head3;
		
		switch ( i_postcode.length ) {
			case 3:
			case 4:
			case 5:
			case 6:
				head3 = i_postcode.substr(0, 3);
				address = this.find(head3);
				address = $.extend( defaults, address );
				break;
				
			case 7:
				address = this.find(i_postcode);
				if ( !address ) {
					head3 = i_postcode.substr(0, 3);
					address = this.find(head3);
				}
				address = $.extend( defaults, address );
				break;
			
			default:
				address = defaults;
				break;
		}
		
		return address;
	};

	this.getUrl = function ( i_head3 ) {
		var url = '';
		
		switch ( window.location.protocol ) {
			case 'http:':
				url = this.url['http'];
				break;
			
			case 'https:':
				url = this.url['https'];
				break;
		}
		url = url + i_head3 + '.json';
		
		return url;
	};

	this.request = function ( i_postcode, i_callback ) {
		var _this = this;
		var head3 = i_postcode.substr(0, 3);
		
		if ( i_postcode.length <= 2 || this.getStatus(head3) != 'none' || head3.match(/[^0-9]/) ) {
			return false;
		}
		this.setStatus(head3, 'waiting');
		
		var url = this.getUrl( head3 );
		
		var options = { 
			async         : false,
			dataType      : 'jsonp',
			jsonpCallback : 'jQuery_jpostal_callback',
			type          : 'GET',
			url           : url,
			success       : function(i_data, i_dataType) {
				i_callback();
			},
			error         : function(i_XMLHttpRequest, i_textStatus, i_errorThrown) {
			},
			timeout : 5000	// msec
		};
		$.ajax( options );
		return true;
	};
	
	this.save = function ( i_data ) {
		for ( var i = 0; i < i_data.length; ++i ) {
			var	rcd = i_data[i];
			var postcode = rcd[0];
			
			if ( typeof this.map[postcode] == 'undefined' ) {
				this.address.push( rcd );
				this.map[postcode] = {state : 'complete', time : 0};
			} else if ( this.map[postcode].state == 'waiting' ) {
				this.address.push( rcd );
				this.map[postcode].state = 'complete';
			}
		}
	};

	this.getStatus = function ( i_postcode ) {
		//	--------------------------------------------------
		//	#	['_001']	..state		.time		result
		//	--------------------------------------------------
		//	1	 =undefined	-			-			none
		//	2	!=undefined	'complete'	-			complete
		//	3	!=undefined	'waiting'	<5sec		waiting
		//	4	!=undefined	'waiting'	>=5sec		none
		//	--------------------------------------------------
		var st = '';
		var	postcode = '_' + i_postcode;
		
		if ( typeof this.map[postcode] == 'undefined' ) {
			// # 1
			st = 'none';
			
		} else if ( 'complete' == this.map[postcode].state ) {
			// # 2
			st = 'complete';
			
		} else {
			var t_ms = (new Date()).getTime() - this.map[postcode].time;
			if ( t_ms < 5000 ) {
				// # 3
				st = 'waiting';
			
			} else {
				// # 4
				st = 'none';
			}
		}
		
		return st;
	};
	
	this.setStatus = function ( i_postcode ) {
		var	postcode = '_' + i_postcode;
		
		if ( typeof this.map[postcode] == 'undefined' ) {
			this.map[postcode] = {
				state : 'waiting',
				time  : 0
			};
		}
		
		this.map[postcode].time = (new Date()).getTime();
	};

}

function Jpostal ( i_JposDb ) {
	this.address  = '';
	this.jposDb   = i_JposDb;
	this.options  = {};
	this.postcode = '';
	this.minLen   = 3;
	
	this.displayAddress = function () {
		if ( this.postcode == '000info') {
			this.address[2] += ' ' + this.getScriptSrc();
		}
		
		for ( var key in this.options.address ) {
			var s = this.formatAddress( this.options.address[key], this.address );
			if ( this.isSelectTagForPrefecture( key, this.options.address[key] ) ) {
				this.setSelectTagForPrefecture( key, s );
			} else {
				$(key).val( s );
			}
		}
	};
	
	this.isSelectTagForPrefecture = function( i_key, i_fmt ) {
		// 都道府県のSELECTタグか？
		switch ( i_fmt ) {
			case '%3':
			case '%p':
			case '%prefecture':
				if ( $(i_key).get(0).tagName.toUpperCase() == 'SELECT' ) {
					f = true;
				} else {
					f = false;
				}	
				break;

			default:
				f = false;
				break;
		}
		return f;
	}

	this.setSelectTagForPrefecture = function ( i_key, i_value ) {
		// 都道府県のSELECTタグ
		// ケース1: <option value="東京都">東京都</option>
		$(i_key).val(i_value);
		if ( $(i_key).val() == i_value ) {
			return;
		}

		// ケース2: valueが数値(自治体コードの場合が多い)
		//	テキストが「北海道」を含むかどうかで判断する
		//	<option value="01">北海道(01)</option>
		//	<option value="1">1.北海道</option>
		value = '';
		var el = $(i_key)[0];
		for ( var i = 0; i < el.options.length; ++i ) {
			var p = el.options[i].text.indexOf( i_value );
			if ( 0 <= p ) {
				value = el.options[i].value;
				break;
			}
		}

		if ( value != '' ) {
			$(i_key).val( value );
		}

	}

	this.formatAddress = function ( i_fmt, i_address ) {
		var	s = i_fmt;
		
		s = s.replace( /%3|%p|%prefecture/, i_address[1] );
		s = s.replace( /%4|%c|%city/      , i_address[2] );
		s = s.replace( /%5|%t|%town/      , i_address[3] );
		s = s.replace( /%6|%a|%address/   , i_address[4] );
		s = s.replace( /%7|%n|%name/      , i_address[5] );
		
		s = s.replace( /%8/      , i_address[6] );
		s = s.replace( /%9/      , i_address[7] );
		s = s.replace( /%10/      , i_address[8] );
		
		return s;
	};

	this.getScriptSrc = function () {
		var src = '';
		
		var	el_arr = document.getElementsByTagName('script');
		for ( var i = 0; i < el_arr.length; ++i ) {
			if ( 0 <= el_arr[i].src.search(/jquery.jpostal.js/) ) {
				src = el_arr[i].src; 		
			}
		}

		return src;
	}

	this.init = function ( i_options ) {
		
		if ( typeof i_options.postcode == 'undefined' ) {
			throw new Error('postcode undefined');
		}
		if ( typeof i_options.address == 'undefined' ) {
			throw new Error('address undefined');
		}
		
		this.options.postcode = [];
		if ( typeof i_options.postcode == 'string' ) {
			this.options.postcode.push( i_options.postcode );
		} else {
			this.options.postcode = i_options.postcode;
		}
		
		this.options.address = i_options.address;
		
		if ( typeof i_options.url != 'undefined' ) {
			this.jposDb.url = i_options.url;
		}
	};
	
	this.main = function () {
		this.scanPostcode();
		if ( this.postcode.length < this.minLen ) {
			// git hub issue #4: 郵便番号欄が0～2文字のとき、住所欄を空欄にせず、入力内容を維持してほしい 
			return ;
		}
		
		var _this = this;
		var f = this.jposDb.request( this.postcode, function () {
			_this.callback();
		});
		if ( !f ) {
			this.callback();
		}
	};
	
	this.callback = function () {
		this.address = this.jposDb.get( this.postcode );
		this.displayAddress();
	};

	this.scanPostcode = function () {
		var s = '';
		
		switch ( this.options.postcode.length ) {
			case 0:
				break;
			
			case 1:
				//	github issue #8: 1つ目を空欄、2つ目を「001」としても、「001」として北海道札幌市を表示してしまう
				//	----------------------------------------
				//	case	postcode	result
				//	----------------------------------------
				//	1		''			''
				//	1		12			''
				//	2		123			123
				//	2		123-		123
				//	2		123-4		123
				//	3		123-4567	1234567
				//	2		1234		123
				//	4		1234567		1234567
				//	----------------------------------------
				s = String($(this.options.postcode[0]).val());
				if ( 0 <= s.search(/^([0-9]{3})([0-9A-Za-z]{4})/) ) {
					// case 4
					s = RegExp.$1 + '' +  RegExp.$2;
				} else if ( 0 <= s.search(/^([0-9]{3})-([0-9A-Za-z]{4})/) ) {
					// case 3
					s = RegExp.$1 + '' +  RegExp.$2;
				} else if ( 0 <= s.search(/^([0-9]{3})/) ) {
					// case 2
					s = RegExp.$1;
				} else {
					// case 1
					s = '';
				}
				break;
			
			case 2:
				//	github issue #8: 1つ目を空欄、2つ目を「001」としても、「001」として北海道札幌市を表示してしまう
				//	----------------------------------------
				//	case	post1	post2	result
				//	----------------------------------------
				//	1		''		---		''
				//	1		12		---		''
				//	2		123		''		123
				//	2		123		4		123
				//	3		123		4567	1234567
				//	----------------------------------------
				var s3 = String($(this.options.postcode[0]).val());
				var s4 = String($(this.options.postcode[1]).val());
				if ( 0 <= s3.search(/^[0-9]{3}$/) ) {
					if ( 0 <= s4.search(/^[0-9A-Za-z]{4}$/) ) {
						// case 3
						s = s3 + s4;					
					} else {
						// case 2
						s = s3;
					}
				} else {
					// case 1
					s = '';
				}
				break;
		}
		
		this.postcode = s;
	};	
}

//	MEMO: For the following reason, JposDb was put on the global scope, not local scope. 
//	---------------------------------------------------------------------
// 	data file	callback			JposDb scope
//	---------------------------------------------------------------------
//	001.js		JposDb.save			global scope
//	001.js.php	$_GET['callback']	local scopde for function($){}
//	---------------------------------------------------------------------
var JposDb = new JpostalDatabase();

function jQuery_jpostal_callback( i_data ) {
	JposDb.save( i_data );
}

// (function($) {
// 	$.fn.jpostal = function( i_options ){
// 		var Jpos = new Jpostal( JposDb );
// 		Jpos.init( i_options );
		
// 		if ( typeof i_options.click == 'string' && i_options.click != '' ) {
// 			$(i_options.click).bind('click', function(e) {
// 				Jpos.main();
// 			});			
// 		} else {
// 			for ( var i = 0; i < Jpos.options.postcode.length; ++i ) {
// 				var selector = Jpos.options.postcode[i];
// 				$(selector).bind('keyup change', function(e) {
// 					Jpos.main();
// 				});
// 			}
// 		}
// 	};
// })(jQuery);

// !custom : trigger button click
(function($j1111) {
	$j1111.fn.jpostal = function( i_options ){
		var Jpos = new Jpostal( JposDb );
		Jpos.init( i_options );
		
		if ( typeof i_options.click == 'string' && i_options.click != '' ) {
			$j1111(i_options.click).on('click', function(e) {
				Jpos.main();
			});			
		} else {
			for ( var i = 0; i < Jpos.options.postcode.length; ++i ) {
				var selector = Jpos.options.postcode[i],
						autoTrigger = $j1111(selector).closest('ul').find('.js-autoAddressInput');

				autoTrigger.on('click', function(e) {
					var timer = false;
					e.preventDefault();
					Jpos.main();

					if (timer !== false) {
						clearTimeout(timer);
					}
					timer = setTimeout(function() {
							labelUpdate();
					},200);

					function labelUpdate() {
						var $prefectures = $j1111('.js-prefectures');
						var _val = $prefectures.find(':selected').text();
						var $label = $prefectures.prev('.js-label');
						$label.text(_val);
					};
				});

			}
		}
	};
})($j1111);

/*! jQuery Validation Plugin - v1.15.0 - 2/24/2016
 * http://jqueryvalidation.org/
 * Copyright (c) 2016 Jorn Zaefferer; Licensed MIT */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof module&&module.exports?module.exports=a(require("jquery")):a($j1111)}(function(a){a.extend(a.fn,{validate:function(b){if(!this.length)return void(b&&b.debug&&window.console&&console.warn("Nothing selected, can't validate, returning nothing."));var c=a.data(this[0],"validator");return c?c:(this.attr("novalidate","novalidate"),c=new a.validator(b,this[0]),a.data(this[0],"validator",c),c.settings.onsubmit&&(this.on("click.validate",":submit",function(b){c.settings.submitHandler&&(c.submitButton=b.target),a(this).hasClass("cancel")&&(c.cancelSubmit=!0),void 0!==a(this).attr("formnovalidate")&&(c.cancelSubmit=!0)}),this.on("submit.validate",function(b){function d(){var d,e;return c.settings.submitHandler?(c.submitButton&&(d=a("<input type='hidden'/>").attr("name",c.submitButton.name).val(a(c.submitButton).val()).appendTo(c.currentForm)),e=c.settings.submitHandler.call(c,c.currentForm,b),c.submitButton&&d.remove(),void 0!==e?e:!1):!0}return c.settings.debug&&b.preventDefault(),c.cancelSubmit?(c.cancelSubmit=!1,d()):c.form()?c.pendingRequest?(c.formSubmitted=!0,!1):d():(c.focusInvalid(),!1)})),c)},valid:function(){var b,c,d;return a(this[0]).is("form")?b=this.validate().form():(d=[],b=!0,c=a(this[0].form).validate(),this.each(function(){b=c.element(this)&&b,b||(d=d.concat(c.errorList))}),c.errorList=d),b},rules:function(b,c){if(this.length){var d,e,f,g,h,i,j=this[0];if(b)switch(d=a.data(j.form,"validator").settings,e=d.rules,f=a.validator.staticRules(j),b){case"add":a.extend(f,a.validator.normalizeRule(c)),delete f.messages,e[j.name]=f,c.messages&&(d.messages[j.name]=a.extend(d.messages[j.name],c.messages));break;case"remove":return c?(i={},a.each(c.split(/\s/),function(b,c){i[c]=f[c],delete f[c],"required"===c&&a(j).removeAttr("aria-required")}),i):(delete e[j.name],f)}return g=a.validator.normalizeRules(a.extend({},a.validator.classRules(j),a.validator.attributeRules(j),a.validator.dataRules(j),a.validator.staticRules(j)),j),g.required&&(h=g.required,delete g.required,g=a.extend({required:h},g),a(j).attr("aria-required","true")),g.remote&&(h=g.remote,delete g.remote,g=a.extend(g,{remote:h})),g}}}),a.extend(a.expr[":"],{blank:function(b){return!a.trim(""+a(b).val())},filled:function(b){var c=a(b).val();return null!==c&&!!a.trim(""+c)},unchecked:function(b){return!a(b).prop("checked")}}),a.validator=function(b,c){this.settings=a.extend(!0,{},a.validator.defaults,b),this.currentForm=c,this.init()},a.validator.format=function(b,c){return 1===arguments.length?function(){var c=a.makeArray(arguments);return c.unshift(b),a.validator.format.apply(this,c)}:void 0===c?b:(arguments.length>2&&c.constructor!==Array&&(c=a.makeArray(arguments).slice(1)),c.constructor!==Array&&(c=[c]),a.each(c,function(a,c){b=b.replace(new RegExp("\\{"+a+"\\}","g"),function(){return c})}),b)},a.extend(a.validator,{defaults:{messages:{},groups:{},rules:{},errorClass:"error",pendingClass:"pending",validClass:"valid",errorElement:"label",focusCleanup:!1,focusInvalid:!0,errorContainer:a([]),errorLabelContainer:a([]),onsubmit:!0,ignore:":hidden",ignoreTitle:!1,onfocusin:function(a){this.lastActive=a,this.settings.focusCleanup&&(this.settings.unhighlight&&this.settings.unhighlight.call(this,a,this.settings.errorClass,this.settings.validClass),this.hideThese(this.errorsFor(a)))},onfocusout:function(a){this.checkable(a)||!(a.name in this.submitted)&&this.optional(a)||this.element(a)},onkeyup:function(b,c){var d=[16,17,18,20,35,36,37,38,39,40,45,144,225];9===c.which&&""===this.elementValue(b)||-1!==a.inArray(c.keyCode,d)||(b.name in this.submitted||b.name in this.invalid)&&this.element(b)},onclick:function(a){a.name in this.submitted?this.element(a):a.parentNode.name in this.submitted&&this.element(a.parentNode)},highlight:function(b,c,d){"radio"===b.type?this.findByName(b.name).addClass(c).removeClass(d):a(b).addClass(c).removeClass(d)},unhighlight:function(b,c,d){"radio"===b.type?this.findByName(b.name).removeClass(c).addClass(d):a(b).removeClass(c).addClass(d)}},setDefaults:function(b){a.extend(a.validator.defaults,b)},messages:{required:"This field is required.",remote:"Please fix this field.",email:"Please enter a valid email address.",url:"Please enter a valid URL.",date:"Please enter a valid date.",dateISO:"Please enter a valid date ( ISO ).",number:"Please enter a valid number.",digits:"Please enter only digits.",equalTo:"Please enter the same value again.",maxlength:a.validator.format("Please enter no more than {0} characters."),minlength:a.validator.format("Please enter at least {0} characters."),rangelength:a.validator.format("Please enter a value between {0} and {1} characters long."),range:a.validator.format("Please enter a value between {0} and {1}."),max:a.validator.format("Please enter a value less than or equal to {0}."),min:a.validator.format("Please enter a value greater than or equal to {0}."),step:a.validator.format("Please enter a multiple of {0}.")},autoCreateRanges:!1,prototype:{init:function(){function b(b){var c=a.data(this.form,"validator"),d="on"+b.type.replace(/^validate/,""),e=c.settings;e[d]&&!a(this).is(e.ignore)&&e[d].call(c,this,b)}this.labelContainer=a(this.settings.errorLabelContainer),this.errorContext=this.labelContainer.length&&this.labelContainer||a(this.currentForm),this.containers=a(this.settings.errorContainer).add(this.settings.errorLabelContainer),this.submitted={},this.valueCache={},this.pendingRequest=0,this.pending={},this.invalid={},this.reset();var c,d=this.groups={};a.each(this.settings.groups,function(b,c){"string"==typeof c&&(c=c.split(/\s/)),a.each(c,function(a,c){d[c]=b})}),c=this.settings.rules,a.each(c,function(b,d){c[b]=a.validator.normalizeRule(d)}),a(this.currentForm).on("focusin.validate focusout.validate keyup.validate",":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'], [type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], [type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], [type='radio'], [type='checkbox'], [contenteditable]",b).on("click.validate","select, option, [type='radio'], [type='checkbox']",b),this.settings.invalidHandler&&a(this.currentForm).on("invalid-form.validate",this.settings.invalidHandler),a(this.currentForm).find("[required], [data-rule-required], .required").attr("aria-required","true")},form:function(){return this.checkForm(),a.extend(this.submitted,this.errorMap),this.invalid=a.extend({},this.errorMap),this.valid()||a(this.currentForm).triggerHandler("invalid-form",[this]),this.showErrors(),this.valid()},checkForm:function(){this.prepareForm();for(var a=0,b=this.currentElements=this.elements();b[a];a++)this.check(b[a]);return this.valid()},element:function(b){var c,d,e=this.clean(b),f=this.validationTargetFor(e),g=this,h=!0;return void 0===f?delete this.invalid[e.name]:(this.prepareElement(f),this.currentElements=a(f),d=this.groups[f.name],d&&a.each(this.groups,function(a,b){b===d&&a!==f.name&&(e=g.validationTargetFor(g.clean(g.findByName(a))),e&&e.name in g.invalid&&(g.currentElements.push(e),h=h&&g.check(e)))}),c=this.check(f)!==!1,h=h&&c,c?this.invalid[f.name]=!1:this.invalid[f.name]=!0,this.numberOfInvalids()||(this.toHide=this.toHide.add(this.containers)),this.showErrors(),a(b).attr("aria-invalid",!c)),h},showErrors:function(b){if(b){var c=this;a.extend(this.errorMap,b),this.errorList=a.map(this.errorMap,function(a,b){return{message:a,element:c.findByName(b)[0]}}),this.successList=a.grep(this.successList,function(a){return!(a.name in b)})}this.settings.showErrors?this.settings.showErrors.call(this,this.errorMap,this.errorList):this.defaultShowErrors()},resetForm:function(){a.fn.resetForm&&a(this.currentForm).resetForm(),this.invalid={},this.submitted={},this.prepareForm(),this.hideErrors();var b=this.elements().removeData("previousValue").removeAttr("aria-invalid");this.resetElements(b)},resetElements:function(a){var b;if(this.settings.unhighlight)for(b=0;a[b];b++)this.settings.unhighlight.call(this,a[b],this.settings.errorClass,""),this.findByName(a[b].name).removeClass(this.settings.validClass);else a.removeClass(this.settings.errorClass).removeClass(this.settings.validClass)},numberOfInvalids:function(){return this.objectLength(this.invalid)},objectLength:function(a){var b,c=0;for(b in a)a[b]&&c++;return c},hideErrors:function(){this.hideThese(this.toHide)},hideThese:function(a){a.not(this.containers).text(""),this.addWrapper(a).hide()},valid:function(){return 0===this.size()},size:function(){return this.errorList.length},focusInvalid:function(){if(this.settings.focusInvalid)try{a(this.findLastActive()||this.errorList.length&&this.errorList[0].element||[]).filter(":visible").focus().trigger("focusin")}catch(b){}},findLastActive:function(){var b=this.lastActive;return b&&1===a.grep(this.errorList,function(a){return a.element.name===b.name}).length&&b},elements:function(){var b=this,c={};return a(this.currentForm).find("input, select, textarea, [contenteditable]").not(":submit, :reset, :image, :disabled").not(this.settings.ignore).filter(function(){var d=this.name||a(this).attr("name");return!d&&b.settings.debug&&window.console&&console.error("%o has no name assigned",this),this.hasAttribute("contenteditable")&&(this.form=a(this).closest("form")[0]),d in c||!b.objectLength(a(this).rules())?!1:(c[d]=!0,!0)})},clean:function(b){return a(b)[0]},errors:function(){var b=this.settings.errorClass.split(" ").join(".");return a(this.settings.errorElement+"."+b,this.errorContext)},resetInternals:function(){this.successList=[],this.errorList=[],this.errorMap={},this.toShow=a([]),this.toHide=a([])},reset:function(){this.resetInternals(),this.currentElements=a([])},prepareForm:function(){this.reset(),this.toHide=this.errors().add(this.containers)},prepareElement:function(a){this.reset(),this.toHide=this.errorsFor(a)},elementValue:function(b){var c,d,e=a(b),f=b.type;return"radio"===f||"checkbox"===f?this.findByName(b.name).filter(":checked").val():"number"===f&&"undefined"!=typeof b.validity?b.validity.badInput?"NaN":e.val():(c=b.hasAttribute("contenteditable")?e.text():e.val(),"file"===f?"C:\\fakepath\\"===c.substr(0,12)?c.substr(12):(d=c.lastIndexOf("/"),d>=0?c.substr(d+1):(d=c.lastIndexOf("\\"),d>=0?c.substr(d+1):c)):"string"==typeof c?c.replace(/\r/g,""):c)},check:function(b){b=this.validationTargetFor(this.clean(b));var c,d,e,f=a(b).rules(),g=a.map(f,function(a,b){return b}).length,h=!1,i=this.elementValue(b);if("function"==typeof f.normalizer){if(i=f.normalizer.call(b,i),"string"!=typeof i)throw new TypeError("The normalizer should return a string value.");delete f.normalizer}for(d in f){e={method:d,parameters:f[d]};try{if(c=a.validator.methods[d].call(this,i,b,e.parameters),"dependency-mismatch"===c&&1===g){h=!0;continue}if(h=!1,"pending"===c)return void(this.toHide=this.toHide.not(this.errorsFor(b)));if(!c)return this.formatAndAdd(b,e),!1}catch(j){throw this.settings.debug&&window.console&&console.log("Exception occurred when checking element "+b.id+", check the '"+e.method+"' method.",j),j instanceof TypeError&&(j.message+=".  Exception occurred when checking element "+b.id+", check the '"+e.method+"' method."),j}}if(!h)return this.objectLength(f)&&this.successList.push(b),!0},customDataMessage:function(b,c){return a(b).data("msg"+c.charAt(0).toUpperCase()+c.substring(1).toLowerCase())||a(b).data("msg")},customMessage:function(a,b){var c=this.settings.messages[a];return c&&(c.constructor===String?c:c[b])},findDefined:function(){for(var a=0;a<arguments.length;a++)if(void 0!==arguments[a])return arguments[a]},defaultMessage:function(b,c){var d=this.findDefined(this.customMessage(b.name,c.method),this.customDataMessage(b,c.method),!this.settings.ignoreTitle&&b.title||void 0,a.validator.messages[c.method],"<strong>Warning: No message defined for "+b.name+"</strong>"),e=/\$?\{(\d+)\}/g;return"function"==typeof d?d=d.call(this,c.parameters,b):e.test(d)&&(d=a.validator.format(d.replace(e,"{$1}"),c.parameters)),d},formatAndAdd:function(a,b){var c=this.defaultMessage(a,b);this.errorList.push({message:c,element:a,method:b.method}),this.errorMap[a.name]=c,this.submitted[a.name]=c},addWrapper:function(a){return this.settings.wrapper&&(a=a.add(a.parent(this.settings.wrapper))),a},defaultShowErrors:function(){var a,b,c;for(a=0;this.errorList[a];a++)c=this.errorList[a],this.settings.highlight&&this.settings.highlight.call(this,c.element,this.settings.errorClass,this.settings.validClass),this.showLabel(c.element,c.message);if(this.errorList.length&&(this.toShow=this.toShow.add(this.containers)),this.settings.success)for(a=0;this.successList[a];a++)this.showLabel(this.successList[a]);if(this.settings.unhighlight)for(a=0,b=this.validElements();b[a];a++)this.settings.unhighlight.call(this,b[a],this.settings.errorClass,this.settings.validClass);this.toHide=this.toHide.not(this.toShow),this.hideErrors(),this.addWrapper(this.toShow).show()},validElements:function(){return this.currentElements.not(this.invalidElements())},invalidElements:function(){return a(this.errorList).map(function(){return this.element})},showLabel:function(b,c){var d,e,f,g,h=this.errorsFor(b),i=this.idOrName(b),j=a(b).attr("aria-describedby");h.length?(h.removeClass(this.settings.validClass).addClass(this.settings.errorClass),h.html(c)):(h=a("<"+this.settings.errorElement+">").attr("id",i+"-error").addClass(this.settings.errorClass).html(c||""),d=h,this.settings.wrapper&&(d=h.hide().show().wrap("<"+this.settings.wrapper+"/>").parent()),this.labelContainer.length?this.labelContainer.append(d):this.settings.errorPlacement?this.settings.errorPlacement(d,a(b)):d.insertAfter(b),h.is("label")?h.attr("for",i):0===h.parents("label[for='"+this.escapeCssMeta(i)+"']").length&&(f=h.attr("id"),j?j.match(new RegExp("\\b"+this.escapeCssMeta(f)+"\\b"))||(j+=" "+f):j=f,a(b).attr("aria-describedby",j),e=this.groups[b.name],e&&(g=this,a.each(g.groups,function(b,c){c===e&&a("[name='"+g.escapeCssMeta(b)+"']",g.currentForm).attr("aria-describedby",h.attr("id"))})))),!c&&this.settings.success&&(h.text(""),"string"==typeof this.settings.success?h.addClass(this.settings.success):this.settings.success(h,b)),this.toShow=this.toShow.add(h)},errorsFor:function(b){var c=this.escapeCssMeta(this.idOrName(b)),d=a(b).attr("aria-describedby"),e="label[for='"+c+"'], label[for='"+c+"'] *";return d&&(e=e+", #"+this.escapeCssMeta(d).replace(/\s+/g,", #")),this.errors().filter(e)},escapeCssMeta:function(a){return a.replace(/([\\!"#$%&'()*+,./:;<=>?@\[\]^`{|}~])/g,"\\$1")},idOrName:function(a){return this.groups[a.name]||(this.checkable(a)?a.name:a.id||a.name)},validationTargetFor:function(b){return this.checkable(b)&&(b=this.findByName(b.name)),a(b).not(this.settings.ignore)[0]},checkable:function(a){return/radio|checkbox/i.test(a.type)},findByName:function(b){return a(this.currentForm).find("[name='"+this.escapeCssMeta(b)+"']")},getLength:function(b,c){switch(c.nodeName.toLowerCase()){case"select":return a("option:selected",c).length;case"input":if(this.checkable(c))return this.findByName(c.name).filter(":checked").length}return b.length},depend:function(a,b){return this.dependTypes[typeof a]?this.dependTypes[typeof a](a,b):!0},dependTypes:{"boolean":function(a){return a},string:function(b,c){return!!a(b,c.form).length},"function":function(a,b){return a(b)}},optional:function(b){var c=this.elementValue(b);return!a.validator.methods.required.call(this,c,b)&&"dependency-mismatch"},startRequest:function(b){this.pending[b.name]||(this.pendingRequest++,a(b).addClass(this.settings.pendingClass),this.pending[b.name]=!0)},stopRequest:function(b,c){this.pendingRequest--,this.pendingRequest<0&&(this.pendingRequest=0),delete this.pending[b.name],a(b).removeClass(this.settings.pendingClass),c&&0===this.pendingRequest&&this.formSubmitted&&this.form()?(a(this.currentForm).submit(),this.formSubmitted=!1):!c&&0===this.pendingRequest&&this.formSubmitted&&(a(this.currentForm).triggerHandler("invalid-form",[this]),this.formSubmitted=!1)},previousValue:function(b,c){return a.data(b,"previousValue")||a.data(b,"previousValue",{old:null,valid:!0,message:this.defaultMessage(b,{method:c})})},destroy:function(){this.resetForm(),a(this.currentForm).off(".validate").removeData("validator").find(".validate-equalTo-blur").off(".validate-equalTo").removeClass("validate-equalTo-blur")}},classRuleSettings:{required:{required:!0},email:{email:!0},url:{url:!0},date:{date:!0},dateISO:{dateISO:!0},number:{number:!0},digits:{digits:!0},creditcard:{creditcard:!0}},addClassRules:function(b,c){b.constructor===String?this.classRuleSettings[b]=c:a.extend(this.classRuleSettings,b)},classRules:function(b){var c={},d=a(b).attr("class");return d&&a.each(d.split(" "),function(){this in a.validator.classRuleSettings&&a.extend(c,a.validator.classRuleSettings[this])}),c},normalizeAttributeRule:function(a,b,c,d){/min|max|step/.test(c)&&(null===b||/number|range|text/.test(b))&&(d=Number(d),isNaN(d)&&(d=void 0)),d||0===d?a[c]=d:b===c&&"range"!==b&&(a[c]=!0)},attributeRules:function(b){var c,d,e={},f=a(b),g=b.getAttribute("type");for(c in a.validator.methods)"required"===c?(d=b.getAttribute(c),""===d&&(d=!0),d=!!d):d=f.attr(c),this.normalizeAttributeRule(e,g,c,d);return e.maxlength&&/-1|2147483647|524288/.test(e.maxlength)&&delete e.maxlength,e},dataRules:function(b){var c,d,e={},f=a(b),g=b.getAttribute("type");for(c in a.validator.methods)d=f.data("rule"+c.charAt(0).toUpperCase()+c.substring(1).toLowerCase()),this.normalizeAttributeRule(e,g,c,d);return e},staticRules:function(b){var c={},d=a.data(b.form,"validator");return d.settings.rules&&(c=a.validator.normalizeRule(d.settings.rules[b.name])||{}),c},normalizeRules:function(b,c){return a.each(b,function(d,e){if(e===!1)return void delete b[d];if(e.param||e.depends){var f=!0;switch(typeof e.depends){case"string":f=!!a(e.depends,c.form).length;break;case"function":f=e.depends.call(c,c)}f?b[d]=void 0!==e.param?e.param:!0:(a.data(c.form,"validator").resetElements(a(c)),delete b[d])}}),a.each(b,function(d,e){b[d]=a.isFunction(e)&&"normalizer"!==d?e(c):e}),a.each(["minlength","maxlength"],function(){b[this]&&(b[this]=Number(b[this]))}),a.each(["rangelength","range"],function(){var c;b[this]&&(a.isArray(b[this])?b[this]=[Number(b[this][0]),Number(b[this][1])]:"string"==typeof b[this]&&(c=b[this].replace(/[\[\]]/g,"").split(/[\s,]+/),b[this]=[Number(c[0]),Number(c[1])]))}),a.validator.autoCreateRanges&&(null!=b.min&&null!=b.max&&(b.range=[b.min,b.max],delete b.min,delete b.max),null!=b.minlength&&null!=b.maxlength&&(b.rangelength=[b.minlength,b.maxlength],delete b.minlength,delete b.maxlength)),b},normalizeRule:function(b){if("string"==typeof b){var c={};a.each(b.split(/\s/),function(){c[this]=!0}),b=c}return b},addMethod:function(b,c,d){a.validator.methods[b]=c,a.validator.messages[b]=void 0!==d?d:a.validator.messages[b],c.length<3&&a.validator.addClassRules(b,a.validator.normalizeRule(b))},methods:{required:function(b,c,d){if(!this.depend(d,c))return"dependency-mismatch";if("select"===c.nodeName.toLowerCase()){var e=a(c).val();return e&&e.length>0}return this.checkable(c)?this.getLength(b,c)>0:b.length>0},email:function(a,b){return this.optional(b)||/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(a)},url:function(a,b){return this.optional(b)||/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(a)},date:function(a,b){return this.optional(b)||!/Invalid|NaN/.test(new Date(a).toString())},dateISO:function(a,b){return this.optional(b)||/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(a)},number:function(a,b){return this.optional(b)||/^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(a)},digits:function(a,b){return this.optional(b)||/^\d+$/.test(a)},minlength:function(b,c,d){var e=a.isArray(b)?b.length:this.getLength(b,c);return this.optional(c)||e>=d},maxlength:function(b,c,d){var e=a.isArray(b)?b.length:this.getLength(b,c);return this.optional(c)||d>=e},rangelength:function(b,c,d){var e=a.isArray(b)?b.length:this.getLength(b,c);return this.optional(c)||e>=d[0]&&e<=d[1]},min:function(a,b,c){return this.optional(b)||a>=c},max:function(a,b,c){return this.optional(b)||c>=a},range:function(a,b,c){return this.optional(b)||a>=c[0]&&a<=c[1]},step:function(b,c,d){var e=a(c).attr("type"),f="Step attribute on input type "+e+" is not supported.",g=["text","number","range"],h=new RegExp("\\b"+e+"\\b"),i=e&&!h.test(g.join());if(i)throw new Error(f);return this.optional(c)||b%d===0},equalTo:function(b,c,d){var e=a(d);return this.settings.onfocusout&&e.not(".validate-equalTo-blur").length&&e.addClass("validate-equalTo-blur").on("blur.validate-equalTo",function(){a(c).valid()}),b===e.val()},remote:function(b,c,d,e){if(this.optional(c))return"dependency-mismatch";e="string"==typeof e&&e||"remote";var f,g,h,i=this.previousValue(c,e);return this.settings.messages[c.name]||(this.settings.messages[c.name]={}),i.originalMessage=i.originalMessage||this.settings.messages[c.name][e],this.settings.messages[c.name][e]=i.message,d="string"==typeof d&&{url:d}||d,h=a.param(a.extend({data:b},d.data)),i.old===h?i.valid:(i.old=h,f=this,this.startRequest(c),g={},g[c.name]=b,a.ajax(a.extend(!0,{mode:"abort",port:"validate"+c.name,dataType:"json",data:g,context:f.currentForm,success:function(a){var d,g,h,j=a===!0||"true"===a;f.settings.messages[c.name][e]=i.originalMessage,j?(h=f.formSubmitted,f.resetInternals(),f.toHide=f.errorsFor(c),f.formSubmitted=h,f.successList.push(c),f.invalid[c.name]=!1,f.showErrors()):(d={},g=a||f.defaultMessage(c,{method:e,parameters:b}),d[c.name]=i.message=g,f.invalid[c.name]=!0,f.showErrors(d)),i.valid=j,f.stopRequest(c,j)}},d)),"pending")}}});var b,c={};a.ajaxPrefilter?a.ajaxPrefilter(function(a,b,d){var e=a.port;"abort"===a.mode&&(c[e]&&c[e].abort(),c[e]=d)}):(b=a.ajax,a.ajax=function(d){var e=("mode"in d?d:a.ajaxSettings).mode,f=("port"in d?d:a.ajaxSettings).port;return"abort"===e?(c[f]&&c[f].abort(),c[f]=b.apply(this,arguments),c[f]):b.apply(this,arguments)})});



$j1111.extend($j1111.validator.messages, {
	required: "必須項目です",
	maxlength: $j1111.validator.format("{0} 文字以内で入力してください"),
	minlength: $j1111.validator.format("{0} 文字以上で入力してください"),
	rangelength: $j1111.validator.format("{0} 文字以上 {1} 文字以内で入力してください"),
	email: "メールアドレスを入力してください",
	url: "URLを入力してください",
	dateISO: "日付を入力してください",
	number: "半角数字を入力してください",
	digits: "0-9までを入力してください",
	equalTo: "同じ値を入力してください",
	range: $j1111.validator.format(" {0} から {1} までの値を入力してください"),
	max: $j1111.validator.format("{0} 以下の値を入力してください"),
	min: $j1111.validator.format("{0} 以上の値を入力してください"),
	creditcard: "クレジットカード番号を入力してください"
});

$j1111.validator.addMethod("mail", function(value, element) {
//console.log('mail validate');
	return this.optional(element) || /^([*/\\._A-Za-z0-9-+]+)@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/.test(value);
}, "メールアドレスを入力してください");

//select 必須項目 (value="0"以外)
$j1111.validator.addMethod("selectRequired", function(value, element) {
	return this.optional(element) || value != 0 ;
}, "必須項目です");
//全角カタカナのみ
$j1111.validator.addMethod("katakana", function(value, element) {
	return this.optional(element) || /^([ァ-ヶー]+)$/.test(value);
}, "全角カタカナを入力してください");
//半角アルファベット（大文字･小文字）のみ
$j1111.validator.addMethod("alphabet", function(value, element) {
	return this.optional(element) || /^([a-zA-z\s]+)$/.test(value);
}, "半角英字を入力してください");
//半角アルファベット（大文字･小文字）もしくは数字のみ
$j1111.validator.addMethod("alphanum", function(value, element) {
	return this.optional(element) || /^([a-zA-Z0-9]+)$/.test(value);
}, "半角英数字を入力してください");
//数字（正）のみ
$j1111.validator.addMethod("number", function(value, element) {
	return this.optional(element) || /^([0-9]+)$/.test(value);
}, "半角数字を入力してください");
//Password Strength 記号か数字が含まれているか
$j1111.validator.addMethod("passStrength", function(value, element) {
  return this.optional(element) || /[\d\!\"#\$%&\'\(\)\*\+-\.,/:;<=>\?@\^_\`\[\]\{\}]/.test(value) && /[A-Z]/.test(value) && /[a-z]/.test(value);
},"パスワードの条件を満たしていません");
//住所欄合計が100文字以下か判定
$j1111.validator.addMethod("checkAddress", function(value, element) {

	var checkAddressGroup = [
		'.js-validate_city',        // 市区町村
		'.js-validate_houseNumber', // 丁目・番地
		'.js-validate_buildingName' // マンションアパート名
	]
	var _groupLen = [];

	function sum(arr) {
		var sum = 0;
		arr.forEach(function(elm) {
			sum += elm;
		});
		return sum;
	}

	$j1111.each(checkAddressGroup,function(i,el) {
		var _val = $j1111(el).val();
		var _len = _val.length;

		_groupLen.push(_len);
	});
	// console.log(sum(_groupLen));

	return this.optional(element) || sum(_groupLen) <= 100;

},"「市区町村」「丁目・番地」「マンションアパート名」の項目の合計が100文字以内になるように調整してください");
//電話番号欄で合計10文字以上
$j1111.validator.addMethod("checkPhone", function(value, element) {

	var checkPhoneGroup = [
		'.js-validate_phoneNum1', //電話番号1
		'.js-validate_phoneNum2', //電話番号2
		'.js-validate_phoneNum3'  //電話番号3
	]
	var _groupLen = [];

	function sum(arr) {
		var sum = 0;
		arr.forEach(function(elm) {
			sum += elm;
		});
		return sum;
	}

	$j1111.each(checkPhoneGroup,function(i,el) {
		var _val = $j1111(el).val();
		var _len = _val.length;

		_groupLen.push(_len);
	});
	// console.log(sum(_groupLen));

	return this.optional(element) || sum(_groupLen) >= 10;

},"電話番号欄の合計が10文字以上になるように入力してください");
//パスワード欄の変更確認
$j1111.validator.addMethod("different", function(value, element) {
	var currentVal = $j1111('.js-validate_currentPass').val();
	return this.optional(element) || !currentVal.test(value);
},"現在のパスワードと別のパスワードを入力してください。");
$j1111.validator.addMethod("notSymbol", function(value, element) {
  return this.optional(element) || !/[\!\"#\$%&\'\(\)\*\+-\.,/:;<=>\?@\^_\`\[\]\{\}]/.test(value);
},"記号は使用できません。");

// 誕生日の不正チェック
$j1111.validator.addMethod("birthdayCombination", function(value, element) {
	function format(num){
		if(num === "0") return "-";
		return num;
	}

	var combinedBirthday = format($j1111('.js-validate_year').val()) + format($j1111('.js-validate_month').val()) + format($j1111('.js-validate_day').val());
	//---または数字6-8桁のみ正常
	return /(\-{3}|\d{6,8})/.test(combinedBirthday);
},"生年月日を正しく入力してください");

$j1111(document).ready(function($j1111) {

/*
	Load myStarbucks :
	www.starbucksより表示コンテンツを読み込み
*/
if($j1111('.infoMyStarbucks').size() > 0){
	
	// clientid判定
	var referrer = document.referrer;
	var clientId = (referrer.indexOf('https://card') !== -1) ? "?clientid=card"
		: (referrer.indexOf('https://cart') !== -1) ? "?clientid=cart"
		: (referrer.indexOf('https://enq') !== -1) ? "?clientid=enq"
		: "";

// パスワードリマインダーなどリンク
var reminderHtml = '<ul class="pwReset">' +
'<li><a href="http:' + DOMAIN_WWW_API + '/notice/20161752.php" class="itemLink">ログイン方法等変更のお知らせ</a></li>' +
'<li><a href="https:' + DOMAIN_MEM + '/mystarbucks/pw-reset/input/" class="itemLink">パスワードをお忘れの方はこちら</a></li>' +
'</ul>';

// パスワード変更に関する注意
var pwNoteHtml = '<ul class="notesList">' +
'<li>My Starbucks会員サービスを安全にご利用頂くために、定期的なパスワード変更を推奨しています。</li>' +
'<li>パスワードの変更は、ログイン後「会員情報管理」にて実施いただけます。</li>' +
'</ul>';

// SP用HTMLを変数に代入
var spHtml = '<div id="spLoad">' +
'<p class="explain">会員でない方は</p>' +
'<ul class="btns">' +
'<li><a class="btn btnGhost btnBlock" href="https:' + DOMAIN_WWW_API + '/register/mystarbucks/input/'+ clientId +'">My Starbucks会員登録</a></li>' +
'</ul>' +
'<p class="explain">My Starbucksは、スターバックスをより楽しむための会員サービス。一足早い新商品の情報や会員限定のサービスをご利用いただけます。</p>' +
'<p class="assist"><a class="itemLink js-overlayTrigger js-overlayTypeInline" href="#js-modalMyStarbucks" target="_blank">My Starbucksとは</a></p>' +
'</div>';

// PC用HTMLを変数に代入
var pcHtml = '<div id="pcLoad">' +
'<h3 class="title">新規会員登録（無料）</h3>' +
'<p class="assist"><a class="itemLink js-overlayTrigger js-overlayTypeInline" href="#js-modalMyStarbucks" target="_blank">My Starbucksとは</a></p>' +
'<p class="explain">My Starbucksは、スターバックスをより楽しむための会員サービスです。一足早い新商品の情報や会員限定のサービスをご利用頂けます。<br>入会費、年会費などはかかりません。</p>' +
'<ul class="btns">' +
'<li><a class="btn btnPrimary btnBlock" href="https:' + DOMAIN_WWW_API.replace("dev.","st.") + '/register/mystarbucks/input/'+ clientId +'">My Starbucks会員登録</a></li>' +
'</ul>' +
'</div>';

$j1111('.js-reminderLoad').html(reminderHtml);
$j1111('.js-pwNoteLoad').html(pwNoteHtml);
$j1111('.infoMyStarbucks.js-spLoad').html(spHtml);
$j1111('.infoMyStarbucks.js-pcLoad').html(pcHtml);
}

/*
	pullDown :
	値変更時に.js-labelにoptionのテキストを反映
*/
	$j1111('.js-pullDown').each(function() {
		var $t = $j1111(this);
		$opt = $t.find('.js-label').next('select');

		$opt.on('change',function() {
			var $item = $j1111(this);
			var _val = $item.find(':selected').text();
			var $label = $item.prev('.js-label');

			$label.text(_val);

		});

	});


/*
	checkbox :

*/
	$j1111('.js-customCheckbox').each(function() {
	
		var $self = $j1111(this),
				$checkbox = $self.find('input[type="checkbox"]');

		// Load state
		if($checkbox.prop('checked') === false || $checkbox.hasClass('is-checked') === true) {
			$checkbox.removeClass('is-checked');
		} else if($checkbox.prop('checked') === true) {
			$checkbox.addClass('is-checked');
		}

		// Change state
		$checkbox.on('change', function(){
			if($checkbox.hasClass('is-checked') === true) {
				$checkbox.prop('checked',false).removeClass('is-checked');
			} else {
				$checkbox.prop('checked',true).addClass('is-checked');
			}
		});

	});


/*
	チェックボックスとボタン(button)および下層のチェックボックスの同期制御
*/
$j1111.fn.checkSync = function(options){

	var defaults = {
		syncItem: '.js-syncItem',
		itemType: 'button', //['button' | 'checkbox']
		loadState: 'disabled' //['disabled']
	};

	var opts = $j1111.extend(true, {}, defaults, options);

	return this.each(function() {
		var $self = $j1111(this),
				$sync = $j1111(opts.syncItem);

		// Load state
		if(opts.loadState === 'disabled' && $self.prop('checked') === false) {
			$sync.prop('disabled',true).addClass('is-disabled');
		}

		// Change state
		$self.on('change', function(){

			if($sync.prop('disabled') === true) {
				$sync.prop('disabled',false).removeClass('is-disabled');
			} else {
				$sync.prop('disabled',true).addClass('is-disabled');
			}

			if(opts.itemType === 'checkbox') {
				$sync.prop('checked',false).removeClass('is-checked');
			}

		});

	});

};

$j1111('.js-syncCheck').checkSync({syncItem: '.js-syncCheckSubmit'});
$j1111('.js-checkParent').checkSync({syncItem: '.js-checkChild',itemType: 'checkbox'});


/*
	Container Scroll Modal :
	Componentのcolorboxを使用
*/
$j1111('.js-overlayTrigger').each(function() {
	var $self = $j1111(this),
			$html = $j1111('html'),
			_mType = false;

	if($self.attr('href') == "#js-modalMyStarbucks") {
		// モーダルコンテンツ「My Starbucksとは」を変数に代入
		var infoMyStarbucks = '<div class="modalContainer" id="js-modalMyStarbucks">' +
		'<div class="detail aboutMyStarbucks">' +
		'<h2>My Starbucksとは</h2>' +
		'<div class="row">' +
		'<div class="col1">' +
		'<dl class="container">' +
 		'<dt><p><img src="/common/images/mem-form/img-howto-mystarbucks-pic07.jpg" alt="スターバックス® リワード イメージ"></p></dt>' +
		'<dd>' +
		'<h3>スターバックス® リワード</h3>' +
		'<p>Starを集めると、さまざまな商品と交換できるプログラム。</p>' +
		'</dd>' +
		'</dl>' +
		'<!-- col1 --></div>' +
		'<div class="col1">' +
		'<dl class="container">' +
		'<dt><p><img src="/common/images/mem-form/img-howto-mystarbucks-pic01.jpg" alt="スターバックス カード イメージ"></p></dt>' +
		'<dd>' +
		'<h3>スターバックス カード</h3>' +
		'<p>Web登録いただくと、オンライン入金、オートチャージ、紛失時の残高補償サービス、別カードへの残高移行など便利な機能やサービスをご利用いただけます。</p>' +
		'</dd>' +
		'</dl>' +
		'<!-- col1 --></div>' +
		'<!-- row --></div>' +
		'<div class="row">' +
		'<div class="col1">' +
		'<dl class="container">' +
		'<dt><p><img src="/common/images/mem-form/img-howto-mystarbucks-pic02.jpg" alt="オンラインストア イメージ"></p></dt>' +
		'<dd>' +
		'<h3>オンラインストア</h3>' +
		'<p>スターバックスのコーヒー豆、器具、タンブラーなどをご自宅までお届けします。オンラインストア限定のギフトラッピングもご用意しています。</p>' +
		'</dd>' +
		'</dl>' +
		'<!-- col1 --></div>' +
		'<div class="col1">' +
		'<dl class="container">' +
		'<dt><p><img src="/common/images/mem-form/img-howto-mystarbucks-pic03.jpg" alt="先行告知メール イメージ"></p></dt>' +
		'<dd>' +
		'<h3>先行告知メール</h3>' +
		'<p>お店で新しく発売されるビバレッジやグッズ、プレゼントなどの情報を一足早くご案内します。</p>' +
		'</dd>' +
		'</dl>' +
		'<!-- col1 --></div>' +
		'<!-- row --></div>' +
		'<div class="row">' +
		'<div class="col1">' +
		'<dl class="container">' +
		'<dt><p><img src="/common/images/mem-form/img-howto-mystarbucks-pic04.jpg" alt="Starbucks Mail News イメージ"></p></dt>' +
		'<dd>' +
		'<h3>Starbucks Mail News</h3>' +
		'<p>新商品、プレゼント情報、新店舗の情報などをご登録情報に合わせてメールでご案内します。</p>' +
		'<ul class="notes">' +
		'<li><span class="mark">※</span>配信内容や頻度はお選びいただけます。</li>' +
		'</ul>' +
		'</dd>' +
		'</dl>' +
		'<!-- col1 --></div>' +
		'<div class="col1">' +
		'<dl class="container">' +
		'<dt><p><img src="/common/images/mem-form/img-howto-mystarbucks-pic05.jpg" alt="コーヒーセミナー イメージ"></p></dt>' +
		'<dd>' +
		'<h3>コーヒーセミナー</h3>' +
		'<p>人気のコーヒーセミナーに、一般のお客様より一日早くご予約いただけます。また、復習ムービーの閲覧、受講履歴の管理、コーヒーセミナーご招待チケットプレゼントへのご応募なども行えます。</p>' +
		'</dd>' +
		'</dl>' +
		'<!-- col1 --></div>' +
		'<!-- row --></div>' +
		'<div class="row">' +
		'<div class="col1">' +
		'<dl class="container">' +
		'<dt><p><img src="/common/images/mem-form/img-howto-mystarbucks-pic06.jpg" alt="お気に入りの一杯をさがそう イメージ"></p></dt>' +
		'<dd>' +
		'<h3>お気に入りの一杯をさがそう</h3>' +
		'<p>自分好みのカスタマイズが見つかったらMy FAVORITESに登録しましょう。レジでのオーダーにも便利です。ドリンクを楽しんだ後は、感想をコメントすることもできます。</p>' +
		'</dd>' +
		'</dl>' +
		'<!-- col1 --></div>' +
		'<!-- /.row --></div>' +

		'<p class="button close contentBottom js-colorBoxCloseButton">閉じる</p>' +
		'<!-- /.detail.aboutCoffee --></div>' +
		'<!-- /.modalContainer --></div>';
		if(!$j1111('#js-hideModalContainer').size() > 0) {
			$j1111('body').append('<div id="js-hideModalContainer" style="display:none">'+infoMyStarbucks+'</div>');
		}
	}

	// Inline typeで表示
	if($self.hasClass('js-overlayTypeInline')) _mType = true;

	$self.colorbox({
		inline: _mType,
		onOpen: function(){
			$html.addClass('modalOpen');

			// Close イベントの再反映
			$j1111('.js-colorBoxCloseButton').off('click');
			$j1111('.js-colorBoxCloseButton').on('click',function() {
				$j1111(this).colorbox.close();
			});
		},
		onComplete: function(){
			var winH = window.innerHeight ? window.innerHeight: $(window).height(),
					$cb = $j1111('#colorbox'),
					cbH = $cb.outerHeight(),
					cbT = $cb.get( 0 ).offsetTop,
					docH = cbH+cbT*2;

			if(winH < docH) {
				$html.addClass('modalContainerScroll');
			}


			// ご利用規約のコンテンツのa要素を外部リンクに設定
			var $policyContents = $j1111('#colorbox .detail.policy').find('.contents');
			if($policyContents.size() > 0){
				$policyContents.find('a').attr('target','_blank');
			}

		},
		onClosed: function(){
			$html.removeClass('modalOpen modalContainerScroll');
		}

	});

});

/*
	Container Scroll Sotre Modal:
	Componentのcolorboxを使用
*/
$j1111('.js-overlaySotreModalTrigger').each(function() {
	var $self = $j1111(this),
			$html = $j1111('html'),
			$sotre = $('#js-sotreModal .modalContainer'),
			$search = $sotre.find('.view_search'),
			$result = $sotre.find('.view_result'),
			$searchField = $search.find('.wordSearch'),
			$searchSubmit = $search.find('.searchButtonSubmit');

	shopSearchInit();

	$self.colorbox({
		inline: true,
		href: $sotre,
		onOpen: function(){
			$html.addClass('modalOpen');
		},
		onComplete: function(){
			var winH = window.innerHeight ? window.innerHeight: $(window).height(),
					$cb = $j1111('#colorbox'),
					cbH = $cb.outerHeight(),
					cbT = $cb.get( 0 ).offsetTop,
					docH = cbH+cbT*2;

			if(winH < docH) {
				$html.addClass('modalContainerScroll');
			}
			$searchSubmit.on('click',function(e) {
				e.preventDefault();
				shopSearchUpdate();
			});
			$searchField.on('keydown',function(e) {
				//エンターキーで送信ボタンをクリック
				if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
					$j1111(this)
						.closest('.searchDetailContainer')
						.find('.searchButtonSubmit')
						.trigger('click');
					return false;
				}
			});
		},
		onClosed: function(){
			$html.removeClass('modalOpen modalContainerScroll');
			shopSearchHide();
		}

	});

	function shopSearchInit(){
		shopSearchHide();
		$result.find('.js-storeSearchBack').on('click',function() {
			$search.css('display','block');
			$result.css('display','none');
			$j1111.colorbox.resize();
			return false;
		});
	}
	function shopSearchUpdate(){
		if($search.css('display') === 'block') {
			$search.css('display','none');
			$result.fadeIn(200, function() {
				$j1111.colorbox.resize();
			});
		} else {
			$result.css('display','none');
			$search.fadeIn(200, function() {
				$j1111.colorbox.resize();
			});
		}
	}
	function shopSearchHide(){
		$searchSubmit.off('click');
		$searchField.off('keydown');
		$search.css('display','block');
		$result.css('display','none');
	}
});

/*
	住所の自動入力 :
	jquery.jpostal.js
*/
if($j1111('.js-autoAddressInput').size() > 0) {
	$j1111('.js-postalCode1').jpostal({
		url : {
			'http'  : '/common/json/jpostal/',
			'https' : '/common/json/jpostal/'
		},
		postcode : [
			'.js-postalCode1',
			'.js-postalCode2'
		],
		address : {
			'.js-prefectures'  : '%3',
			'.js-city'  : '%4 %5',
		}
	});
};

// バリデーションを有効化
var $form = $j1111('.js-validateSubmit');
var _passCheck = false;
var validator = $form.validate({
	validClass: "is-valid",
	errorClass: "is-error",
	groups: {
		fullname: "family_name given_name",
		fullnameKana: "family_name_kana given_name_kana",
		phoneNum: "phone_number_1 phone_number_2 phone_number_3",
		postalCode: "postal_code_1 postal_code_2",
		birthDate: "birthdate_year birthdate_month birthdate_day"
	},
	highlight: function(element, errorClass, validClass) {
		var _elm = $j1111(element);
		_elm.addClass(errorClass).removeClass(validClass);
		// groups指定の要素 input処理
		if(_elm.hasClass('customInput') === true && _elm.closest('.comboItems').size() > 0) {
			errChecker(_elm,true);
		}
	},
	unhighlight: function(element, errorClass, validClass) {
		var _elm = $j1111(element);
		_elm.removeClass(errorClass).addClass(validClass);
		// groups指定の要素 input処理
		if (_elm.hasClass('customInput') === true && _elm.closest('.comboItems').size() > 0){
			var selfCell = _elm.closest('dd');
			var viewErr = selfCell.find('.viewError');

			if(selfCell.find('.customInput.is-error').size() == 0){
				viewErr.empty().hide();
			}
			errChecker(_elm,false);
		}
	},
	success: function(label, element) {
		var _elm = $j1111(element);

		//パスワード欄の変更確認
		var currentPass = $j1111(".js-validate_currentPass");
		var changePass = $j1111(".js-validate_changePass");
		if(currentPass.length > 0){
			//現在のパスワードのチェックイベント
			currentPass.on('blur focusout',function(){
				pwCurrentCheck();
			});
			//新しいパスワードのチェックイベント
			changePass.on('blur focusout',function(){
				pwCurrentCheck();
			});
		}

		if(_elm.closest('.passSync').size() > 0 && _elm.hasClass('js-validate_pass') === true) {
			// 強度判定 登録可能時の処理
			if(_passCheck){
				var _val = $j1111(element).val();

				var _mixNumSymbol = /[\d]/.test(_val) && /[\!\"#\$%&\'\(\)\*\+-\.,/:;<=>\?@\^_\`\[\]\{\}]/.test(_val);
				if(_val !== "") {
					if(_mixNumSymbol){
						label
							.addClass("is-valid validStrong")
							.text("強");
					} else {
						label
							.removeClass('validStrong')
							.addClass("is-valid")
							.text("中（数字と記号の組み合わせを推奨します）");
					}
				} else {
					label
						.removeClass("is-valid validStrong");
				}
			}else{
				$j1111(label[0]).remove();
			}
		} else {
			$j1111(label[0]).remove();
			// groups指定の要素 input処理
			if (_elm.hasClass('customInput') === true && _elm.closest('.comboItems').size() > 0){
				var selfCell = _elm.closest('dd');
				var viewErr = selfCell.find('.viewError');

				if(selfCell.find('.customInput.is-error').size() == 0){
					viewErr.empty().hide();
				}
			}
		}
	},
	errorPlacement: function(error, element) {
		var groupsErrors = function(error, element) {
			var selfCell = element.closest('dd');
			var viewErr = selfCell.find('label.viewError');
			var defErr = "";
			var self = $j1111(element);
			var selfName = self.attr("name");
			var errorArr = [];
			selfCell.append(error);
			if(viewErr.size() == 0){
				defErr = selfCell.find('label.is-error');
				defErr.after('<label class="viewError"></label>');
				viewErr.hide();
			}
			error.remove();

			if(viewErr.size() == 0){
				viewErr = selfCell.find('.viewError');
			}
			// エラー表示
			var errMap = $form.validate().errorMap;
			for(key in errMap){
				if(selfName == key){
					viewErr.show().text(errMap[key]);
				}
			}
			errChecker(self,false);
		}

		if (element.is('select.options') === true && element.closest('.js-pullDown').children().size() == 1) {
			// select（必須）のエラー出力位置
			element.closest('.js-pullDown').after(error);
		} else if (element.is('select.options') === true && element.closest('.js-pullDown').children().size() > 1) {
			// select groups指定の要素
			groupsErrors(error, element);
		}	else if (element.closest('.passSync').size() > 0 && element.hasClass('js-validate_pass') === true) {
			// 強度判定 登録不可時の処理
			element.after(error);
			error.removeClass('is-valid');
		} else if (element.hasClass('customInput') === true && element.closest('.comboItems').size() == 0){
			// inputのエラー出力位置
			element.after(error);
		} else if (element.hasClass('customInput') === true && element.closest('.comboItems').size() > 0){
			// groups指定の要素 input処理
			groupsErrors(error, element);
		} else if (element.hasClass('js-validate_mail') === true){
			// メール欄のエラー出力位置
			element.after(error);
		} else {
			// デフォルトのエラー出力位置
			element.closest('dd').append(error);
		}
	}
});
$j1111('.js-validateSubmit .js-customCheckbox input[type="checkbox"], .js-validateSubmit input[type="radio"]').on('click', function() {
	$form.validate().element( this );
});

if($form.size() > 0) {
	// inputのチェックイベントを発火
	var validInputs = $form.find('.customInput').not('.js-validate_pass');
	validInputs.on('focusout change keyup',function(){
		var self = $j1111(this);
		var selfVal = self.val();
		if(selfVal !== ""){
			self.valid();
		}
		errChecker(self);
	});
	var validPassInput = $form.find('.customInput.js-validate_pass');
	validPassInput.on('focusout change keyup',function(){
		var self = $j1111(this);
		var selfVal = self.val();
		if(selfVal !== ""){
			self.valid();
		}
		errChecker(self);
	});
	// pullDownのチェックイベントを発火
	var validPullDown = $form.find('.js-pullDown select.options');
	validPullDown.on('focusout change',function(){
		var _elm = $j1111(this);
			_elm.valid();
			errChecker(_elm);
	});
	// group inputのエラークラス再判定
	function errChecker(el,siblings) {
		var errCheck = $form.validate().invalid;
		var currentElements = $form.validate().currentElements;
		var target;
		if(siblings) {
			target = el.closest('li').siblings().find('.customInput');
		}else{
			target = el.closest('li').find('.customInput');
		}
		currentElements.each(function(index, el) {
			var self = $j1111(el);
			var selfName = $j1111(el).attr("name");
			for(key in errCheck) {
				if(selfName == key && errCheck[key] == false) {
					self.removeClass('is-error').addClass('is-valid');
				} else if(selfName == key && errCheck[key] == true){
					self.removeClass('is-valid').addClass('is-error');
				}
			}
		});
	}
	// group inputの状態チェック
	var groupInputs = $form.find('.comboItems .customInput');
	groupInputs.on('blur focusout change keyup',function(){
		$j1111.each($form.validate().currentElements, function(index, val) {
			$j1111(this).valid();
			errChecker($j1111(this));
		});
	});
	// group inputの電話番号の文字数チェック
	groupInputs.on('blur focusout',function(){
		var errCheck = $form.validate().invalid;
		var self = $j1111(this);
		var selfVal = self.val();
		var selfParent = self.closest('.comboItems');
		var selfName = self.attr("name");
		var listNum = $form.validate().currentElements.length;
		var errNum = Object.keys(errCheck).length;


		$j1111.each($form.validate().currentElements, function(index, val) {

			if(listNum >= 3){
				// 電話番号のチェック
				$j1111(".js-validate_phoneNum1").rules("add", {
					checkPhone: true
				});
				$j1111(".js-validate_phoneNum2").rules("add", {
					checkPhone: true
				});
				$j1111(".js-validate_phoneNum3").rules("add", {
					checkPhone: true
				});
				errChecker($j1111(this));
			}
		});
	});
	//グループアイテムが2個の場合のinputで必須項目が存在した場合の処理
	groupInputs.on('keyup blur',function(){
		var _elm = $j1111(this);
		if(_elm.hasClass('customInput') === true && _elm.closest('.comboItems').children().not(".btnWrap").size() == 2){
			groupInputReq(_elm);
			errChecker(_elm);
		}
	});
	// group inputの必須チェック
	function groupInputReq(self){
		var errList = $form.validate().errorList;
		var viewErr = self.closest('dd').find('label.viewError');
		var errorArr = [];
		var errorMsg = "";
		$j1111.each(errList, function(index, val) {
			if(val.method == "required"){
				errorArr.push(val.method);
				errorMsg = val.message;
			}
			if($j1111.inArray("required",errorArr) >= 0){
				viewErr.show().text(errorMsg);
			}
		});
	}


	var groupPullDown = $form.find('select.options');
	groupPullDown.on('change',function(){
		var _elm = $j1111(this);

		// select groups指定の要素
		if(_elm.is('select.options') === true && _elm.closest('.js-pullDown').children().size() > 1) {
			var errMap = $form.validate().errorMap;
			var viewErr = _elm.closest('dd').find('.viewError');
			if($j1111.isEmptyObject(errMap)) {
				viewErr.empty().hide();
			} else {
				for(key in errMap) {
					viewErr.show().text(errMap[key]);
				}
			}
		}
		errChecker(_elm);
	});

	// 必須項目のチェック
	$j1111(".js-validate_required").each(function(index, el) {
		$j1111(this).rules("add", {
			required: true,
			messages: {
				required: "必須項目です"
			}
		});
	});
	// select要素の必須項目のチェック
	$j1111(".js-validate_selectRequired").each(function(index, el) {
		$j1111(this).rules("add", {
			selectRequired: true,
			messages: {
				required: "必須項目です"
			}
		});
	});

	// カタカナのチェック
	var _kanaElm = ["family_name_kana","given_name_kana"];
	$j1111.each(_kanaElm,function(index, el) {
		$j1111('.customInput[name="'+el+'"]').rules("add", {
			katakana: true
		});
	});
	// 半角数字のチェック
	$j1111(".js-validate_number").each(function(index, el) {
		$j1111(this).rules("add", {
			number: true
		});
	});
	// メールアドレスの形式チェック
	$j1111(".js-validate_mail").each(function() {
		var self = $j1111(this);
		self.rules("add", {
			maxlength: 65,
			required: true
		});
		self.on('blur focusout',function(){
			$j1111(this).rules("add", {
				mail: true,
				messages: {
					mail: "メールアドレスの形式が異なります",
				}
			});
		});
	});
	// メールアドレスの一致チェック
	$j1111(".js-validate_mailCheck").each(function() {
		var self = $j1111(this);
		self.rules("add", {
			required: true
		});
		self.on('blur focusout',function(){
			$j1111(this).rules("add", {
				equalTo: ".js-validate_mail",
				messages: {
					equalTo: "メールアドレスが一致しません"
				}
			});
		});
	});
	// パスワードのチェック
	$j1111(".js-validate_pass").each(function() {
		var self = $j1111(this);
		self.rules("add", {
			required: true
		});
		self.on('blur focusout',function(){
			$j1111(this).rules("add", {
				rangelength: [8,20]
			});
			if($j1111(this).parent().hasClass('passSync') == true){
				$j1111(this).rules("add", {
					passStrength: true,
					messages: {
						rangelength: "弱（パスワードの条件を満たしていません）",
						passStrength: "弱（パスワードの条件を満たしていません）"
					}
				});
				_passCheck = true;
			}
		});
	});
	// パスワードの一致チェック
	$j1111(".js-validate_passCheck").each(function() {
		var self = $j1111(this);
		self.rules("add", {
			required: true
		});
		self.on('blur focusout',function(){
			$j1111(this).rules("add", {
				equalTo: ".js-validate_pass",
				messages: {
					equalTo: "パスワードが一致しません"
				}
			});
		});
	});
	// 誕生日の不正チェック
	$j1111(".js-validate_year, .js-validate_month, .js-validate_day").each(function() {
	//$j1111(".js-validate_birthdayCombination").each(function() {
		var self = $j1111(this);
		self.rules("add", {
			birthdayCombination: true
		});
	});
	// 現在のパスワードと新しいパスワードの変更確認
	function pwCurrentCheck() {
		var currentPass =  $j1111(".js-validate_currentPass");
		var changePass =  $j1111(".js-validate_changePass");
		var currentPassVal =  currentPass.val();
		var changePassVal =  changePass.val();

		if(currentPassVal == changePassVal) {
			changePass.rules("add", {different: ".js-validate_currentPass"});
		} else {
			changePass.rules("remove","different");
		}
	}
	// 旧パスワードのチェック
	$j1111(".js-validate_oldPassword").each(function() {
		var self = $j1111(this);
		self.on('blur focusout',function(){
			self.rules("remove","rangelength");
		});
	});

	// 秘密の質問の答えの必須チェック
	$j1111(".js-validate_question").rules("add", {
		required: true
	});
	// ユーザー名の文字数チェック
	$j1111(".js-validate_userName").rules("add", {
		maxlength: 30
	});

	// 郵便番号のチェック
	$j1111(".js-validate_postalCode1").rules("add", {
		maxlength: 3,
		number: true
	});
	$j1111(".js-validate_postalCode2").rules("add", {
		maxlength: 4,
		number: true
	});

	// 電話番号のチェック
	$j1111(".js-validate_phoneNum1").rules("add", {
		maxlength: 4,
		number: true
	});
	$j1111(".js-validate_phoneNum2").rules("add", {
		maxlength: 4,
		number: true
	});
	$j1111(".js-validate_phoneNum3").rules("add", {
		maxlength: 4,
		number: true
	});

	// 住所のチェック
	$j1111(".js-validate_city").rules("add", {
		maxlength: 50,
		checkAddress: true,
	});
	$j1111(".js-validate_houseNumber").rules("add", {
		maxlength: 40,
		checkAddress: true,
	});
	$j1111(".js-validate_buildingName").rules("add", {
		maxlength: 50,
		checkAddress: true,
	});

	// 退会フォームの必須チェック
	var $quitInputSelect = $j1111('.js-validate_quitSelect');
	$quitInputSelect.on('change', function(){
		var $quitInput = $j1111('.js-validate_quitInput');
		var $quitInputTrigger = $j1111(this).find('.js-validate_quitInputTrigger');
		var $quitInputLabel = $quitInput.closest('dd').prev('dt').find('label[for="quit_input"]');
		if($quitInputTrigger.is(':selected')){
			var htmlNotice = '<sup class="notice"> ＊</sup>';
			$quitInput.rules("add", {"required":true});
			$quitInputLabel.append(htmlNotice);
		}else {
			$quitInput.removeClass('is-error').rules("remove", "required");
			$quitInput.next('.is-error').remove();
			$quitInputLabel.children('.notice').remove();
		}
	});

	// 必須チェックのリセット
	$j1111(".js-validate_noRequired").each(function(index, el) {
		$j1111(this).rules("remove", "required");
	});
	$j1111(".js-validate_noSelectRequired").each(function(index, el) {
		$j1111(this).rules("remove", "selectRequired");
	});
}

	/* 会員情報管理 サブアドレス削除確認ダイアログ */
	$j1111(".js-subMailConfirmDialog-open").on("click", function(e) {
		e.preventDefault();
		$(".js-subMailConfirmDialog").css({ "display" : "block" });
	});
	$j1111(".js-subMailConfirmDialog-close").on("click", function(e) {
		e.preventDefault();
		$(".js-subMailConfirmDialog").css({ "display" : "none" });
	});
	/* 会員情報管理 サブアドレス削除時ダイアログ */
	$j1111(".js-subMailDialog-close").on("click", function(e) {
		e.preventDefault();
		$(".js-subMailDialog").fadeOut();
	});
	
	// カスタマイズラジオボタン
	$j1111(".customRadio").on("change", function() {
		var input = $(this).find('input');
		var name = input.attr('name');

		// 同じnameのclassを1度削除
		$("input[name="+name+"]").parent('label').removeClass('is-checked');
		
		// チェック用class追加
		$(this).addClass('is-checked');
	});
	
	// カスタマイズラジオボタン：初期表示対応
	$j1111(".customRadio").each(function() {
		if($(this).find('input').prop('checked')) {
			$(this).addClass('is-checked');
		}
	});
	//会員情報管理のdt/dd高さ揃え
	var $formTitles = $j1111(".formList dt");
	if($formTitles.length > 0){
		var resizeTimer = false;
		var flattenFormList = function() {
	        $formTitles.each(function(){
	        	var $dtElem = $j1111(this);
	        	var $ddElem = $j1111(this).next("dd"); 
	        	$ddElem.css("height","auto");
	        	if(($j1111("h1 i").css("height").replace("px","")*1 > 35)||!(document.querySelector(".col.itemBoard .formList"))){
		        	var dtHeight = $dtElem.height();
		        	var ddHeight = $ddElem.height();
		        	if(dtHeight > ddHeight){
		        		$ddElem.height(dtHeight);
		        		//console.log(dtHeight+' : '+ddHeight);
		    		}
	        	}
	        });
		};
		$j1111(window).resize(function() {
		    if (resizeTimer !== false) {
		        clearTimeout(resizeTimer);
		    }
		    resizeTimer = setTimeout(function() {
		    	flattenFormList();
		    }, 200);
		});
		flattenFormList();
	}
});

function syncerRecaptchaCallback(code){
	if(code != ""){
		$j1111('.reCaptchaBox + .btns .btnAction').css({ 'pointer-events':'auto' });
	}
}

