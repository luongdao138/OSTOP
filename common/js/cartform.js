/**
 * cartform.js
 * @modified 2016/2/8
 */
 
(function($, window, document, undefined){
	var Setting = {
		selectorDialog: '.js-errordialog',
		selectorDialogClose: '.js-errordialog-close',
		selectorDialogText: '.js-errordialog-text',
		selectorDialogCode: '.js-errordialog-code',
		selectorCartform: '.js-cartform',
		selectorCartformOptSelectbox: '.js-cartform-opt-selectbox-main',
		selectorCartformQtySelectbox: '.js-cartform-instock-qty-selectbox-main',
		selectorCartformSubmit: '.js-cartform-instock-submit',
		selectorCartformTooltips: '.js-cartform-tooltips',
		selectorCartformDisable: '.js-cartform-disable',
		selectorCartformInstock: '.js-cartform-instock',
		selectorCartformPrice: '.js-cartform-price',
		selectorCartformPriceMain: '.js-cartform-pricemain',
		selectorCartformPriceWeight: '.js-cartform-priceweight',
		selectorCartformOutofStock: '.js-cartform-outofstock',
		selectorCartformOutofStockOnline: '.js-cartform-outofstock-online',
		selectorCartformOutofStockAll: '.js-cartform-outofstock-all',
		selectorCartformOutofStockStore: '.js-cartform-outofstock-store',
		errorMessage: {
			'error000': '予期せぬシステムエラーが発生しております。時間をおいて再度お試しいただくか、カスタマーサポートセンターまでご連絡いただけますでしょうか。',
			'error002': 'システムエラーが発生しております。時間をおいて再度お試しいただくか、カスタマーサポートセンターまでご連絡いただけますでしょうか。',
			'error010': 'システムエラーが発生しております。時間をおいて再度お試しいただくか、カスタマーサポートセンターまでご連絡いただけますでしょうか。',
			'error110': '申し訳ございません。ご指定の数量が在庫数を超えています。お手数ですが、数量を減らして再度お試し下さい。',
			'error111': '申し訳ございません。一度にご予約いただける商品数量の上限を超えています、数量を減らして再度お試し下さい。',
			'error114': '申し訳ございません。一度にご購入いただける商品数量の上限を超えています、数量を減らして再度お試し下さい。',
			'error119': '申し訳ございません。配送の都合上、ご購入いただける商品数量の上限を超えています、数量を減らして再度お試し下さい。',
			'error011': 'システムエラーが発生しております。時間をおいて再度お試しいただくか、カスタマーサポートセンターまでご連絡いただけますでしょうか。',
			'error012': 'システムエラーが発生しております。時間をおいて再度お試しいただくか、カスタマーサポートセンターまでご連絡いただけますでしょうか。',
			'error013': 'システムエラーが発生しております。時間をおいて再度お試しいただくか、カスタマーサポートセンターまでご連絡いただけますでしょうか。',
			'error014': 'ご指定の商品がみつからないシステムエラーが発生しております。時間をおいて再度お試しいただくか、カスタマーサポートセンターまでご連絡いただけますでしょうか。',
			'error121': 'システムエラーが発生しております。時間をおいて再度お試しいただくか、カスタマーサポートセンターまでご連絡いただけますでしょうか。',
			'error900': 'システムエラーが発生しております。時間をおいて再度お試しいただくか、カスタマーサポートセンターまでご連絡いただけますでしょうか。'
		},
		cardPopupBaseurl: DOMAIN_API + '/sbcard',
		cardPopupWidth: 610,
		cardPopupHeight: 700
	};

	var Status = function(){
		this._instances = [];
		this._enablesubmit = false;
	};

	Status.prototype = {
		getSubmitStatus: function(){
			return this._enablesubmit;
		},
		setSubmitStatus: function(val){
			this._enablesubmit = val;
		},
		addInstance: function(instance){
			this._instances.push(instance);
		},
		setSelectBoxDisable: function(){
			$.each(this._instances, function(i, instance){
				instance.disableSelectBox();
			});
		},
		setSelectBoxEnable: function(){
			$.each(this._instances, function(i, instance){
				instance.enableSelectBox();
			});
		}
	};

	var Dialog = function(status){
		var s = Setting;
		this._status = status;
		this._$dialog = $(s.selectorDialog);
		this._$dialogclose = $(s.selectorDialogClose);
		this._$dialogtext = $(s.selectorDialogText);
		this._$dialogcode = $(s.selectorDialogCode);
		this._setEvents();
	};

	Dialog.prototype = {
		/**
		 * イベントを紐付け
		 */
		_setEvents: function(){
			this._$dialogclose.bind('click', $.proxy(function(){
				this.hideErrorDialog();
			}, this));
		},
		/**
		 * エラーダイアログを表示
		 */
		showErrorDialog: function(errorCode){
			var codeStr = String(errorCode);
			this._$dialogtext.text(Setting.errorMessage['error' + codeStr]);
			this._$dialogcode.text(codeStr);
			this._$dialog.fadeIn(300);
		},
		/**
		 * エラーダイアログを非表示
		 */
		hideErrorDialog: function(){
			this._$dialog.fadeOut(300, $.proxy(function(){
				this._status.setSubmitStatus(true);
				this._status.setSelectBoxEnable();
				this._$dialogtext.empty();
				this._$dialogcode.empty();
			}, this));
		}
	};
	
	/*
	 * 在庫取得をページ中で一回に制限するためのキャッシュテーブル
	 */
	var InventoryCache = {
		_table: {},
		
		/*
		 * 在庫情報を一括取得する
		 */
		load: function(janCodes, cb) {
			this._table = {};
			var u = [];
			
			$.each(janCodes, function(_, v) {
				if (v && $.inArray(v, u) == -1) u.push(v);
			});
			
			janCodes = u;
			
			if (janCodes.length != 0) {			
				CartInfo.api().getInventories({jan_codes: janCodes}, function(err, res) {
					if (!err) {
						$.each(res, function(_, inv) {
							InventoryCache._table[inv.jan_code] = inv;
						});
					}
					cb(err);
				});
			}
		},
		
		/*
		 * キャッシュから該当の在庫情報を取得
		 */
		lookup: function(janCode) {
			return this._table[janCode];
		}
	};

	var Cartform = function($cartform, $dialog, status){
		// 商品情報
		this._itemsdata = {};
		// カートフォーム
		this._$cartform = $cartform;
		// ダイアログ
		this._$dialog = $dialog;
		// ステータス
		this._status = status;
		// 初期化
		this._initialize();
	};
	var CartformRadioBtn = function($cartform, $dialog){
		// 商品情報
		this._itemsdata = {};
		// カートフォーム
		this._$cartform = $cartform;
		// ダイアログ
		this._$dialog = $dialog;
		// 初期化
		this._setupProps();
		this._$statusSingle = this._$cartform.parent().parent().next().find('.status');
	};

	var cartformPrototype = {
		/**
		 * 初期化
		 */
		_initialize: function(){
			this._setupProps();
			this._setEvents();
			
			// ラジオボタン判定
			var products = this._$selectboxOpt.size();
			
			if(this._itemsdata.jan){
				if(products > 0) {
					$.each(this._$selectboxOpt, $.proxy(function(_, el) {
						var instance = new CartformRadioBtn($(el), this._$dialog);
						var data = instance._itemsdata;
						var inventory = InventoryCache.lookup(data.jan);
						var soldout = parseInt(data.soldout, 10);
						
						if (!inventory) {
							this._$dialog.showErrorDialog('000');
							return false;
						}

						// 在庫あり
						if(inventory.inventory_quantity > 0){
							switch(soldout){
								case 1:
									instance._layoutInStock();
									break;
								case 2:
									instance._layoutOutOfStockOnline();
									instance._$cartform.parents('.selectList > li').addClass('isSoldout').find('.check').remove();
									break;
								case 3:
									instance._layoutOutOfStockStore();
									break;
								case 4:
									instance._layoutOutOfStock();
									instance._$cartform.parents('.selectList > li').addClass('isSoldout').find('.check').remove();
									break;
								default:
									this._$price.removeClass('hide');
									this._$disable.addClass('hide');
									this._$instock.removeClass('hide');
									this._$outofstock.addClass('hide');
									break;
							};
						// 在庫なし
						}else{
							instance._$cartform.parents('.selectList > li').addClass('isSoldout').find('.check').remove();
							switch(soldout){
								case 1:
									instance._layoutOutOfStockOnline();
									break;
								case 2:
									instance._layoutOutOfStockOnline();
									break;
								case 3:
									instance._layoutOutOfStock();
									break;
								case 4:
									instance._layoutOutOfStock();
									break;
								default:
									this._$price.addClass('hide');
									this._$disable.addClass('hide');
									this._$instock.addClass('hide');
									this._$outofstock.removeClass('hide');
									break;
							};
						};
					}, this));
				}
				
				this._reqDetailProduct();
			}			
		},
		/**
		 * 各種プロパティをセット
		 */
		_setupProps: function(){
			var s = Setting;
			this._$selectboxOpt = this._$cartform.find(s.selectorCartformOptSelectbox);
			this._$selectboxQty = this._$cartform.find(s.selectorCartformQtySelectbox);
			this._$submit = this._$cartform.find(s.selectorCartformSubmit);
			// ツールチップはボタン毎ではなく、ページに一つにした
			//this._$tooltips = this._$cartform.find(s.selectorCartformTooltips);
			this._$tooltips = $(s.selectorCartformTooltips);
			this._$disable = this._$cartform.find(s.selectorCartformDisable);
			this._$instock = this._$cartform.find(s.selectorCartformInstock);
			this._$price = this._$cartform.find(s.selectorCartformPrice);
			this._$pricemain = this._$price.find(s.selectorCartformPriceMain);
			this._$priceweight = this._$price.find(s.selectorCartformPriceWeight);
			this._$outofstock = this._$cartform.find(s.selectorCartformOutofStock);
			this._$outofstockOnline = this._$cartform.find(s.selectorCartformOutofStockOnline);
			this._$outofstockAll = this._$cartform.find(s.selectorCartformOutofStockAll);
			this._$outofstockStore = this._$cartform.find(s.selectorCartformOutofStockStore);
			this._$statusSingle = this._$cartform.parent('.cartForm').prev('.status');// シングル商品用
			this._itemsdata.jan = this._$cartform.attr('data-jan');
			this._itemsdata.sc = this._$cartform.attr('data-sc');
			this._itemsdata.soldout = this._$cartform.attr('data-soldout');
			if (!this._itemsdata.soldout) this._itemsdata.soldout = 0; 
			this._itemsdata.text = this._$selectboxOpt ? this._$selectboxOpt.find('option:selected').text() : '';
			this._kind = this._$cartform.attr('data-kind');
		},
		/**
		 * イベントを紐付け
		 */
		_setEvents: function(){
			var that = this;
			// サイズ
			this._$selectboxOpt.bind('change', function(){
				var $elem = $(this).filter('input:checked'),
					jan = $elem.attr('data-jan'),
					soldout = $elem.attr('data-soldout');
				
				if (!soldout) soldout = 0;
				
				// サイズ
				if(jan){
					that._$cartform.attr('data-jan', jan);
					that._itemsdata.jan = jan;
					that._itemsdata.text = $elem.text();
					that._itemsdata.soldout = soldout;
					that._reqDetailProduct();
				// デフォルト
				}else{
					that._$disable.removeClass('hide');
					that._$instock.addClass('hide');
					that._$outofstock.addClass('hide');
					that._$price.addClass('hide');
					that._itemsdata.text = '';
					that._itemsdata.soldout = soldout;
				};
			});
			// 数量
			this._$selectboxQty.bind('change', function(){
				that._itemsdata.qty = parseInt($(this).val(), 10);
			});
			// カートに入れる
			this._$submit.bind('click', function(){
				if(!that._status.getSubmitStatus()) return;
				that._status.setSubmitStatus(false);
				
				if (that._kind == 'card') {
					that._openCardPopup();
				} else {
					that._reqAddItem();
				}
			});
		},
		/**
		 * 商品詳細APIに
		 * JANコード、ショップコードを投げると
		 * 在庫に関する各種情報が返ってくる
		 */
		_reqDetailProduct: function(){
			var data = this._itemsdata;
			
			var inv = InventoryCache.lookup(data.jan);
			if (!inv) return this._$dialog.showErrorDialog('000');
			
			this._status.setSubmitStatus(false);
			this._status.setSelectBoxDisable();
			
			if (data.soldout != 0) this._createOptionTag(inv.cart_limit);
			this._render(inv);
		},
		/**
		 * カート追加APIに
		 * JANコード、ショップコード、modeを投げると
		 * 価格に関する各種情報が返ってくる
		 */

		_reqAddItem: function(){
			var data = this._itemsdata;
			this._status.setSelectBoxDisable();
			
			CartInfo.ready($.proxy(function(err) {
				if (err) {
					return this._$dialog.showErrorDialog(err.type == 'APIError' ? err.code : '000');
				}
				
				var api = CartInfo.session();
				var params = {jan_code: data.jan, quantity: data.qty};
				
				api.addProduct(params, $.proxy(function(err, res) {
					if (err) {
						return this._$dialog.showErrorDialog(err.type == 'APIError' ? err.code : '000');
					}
					
					CartInfo.save({totalQuantity: res.total_quantity});
					
					this._showSuccessTooltips();
					
					//商品点数を更新
					setCartQtyPrice(CartInfo.get().totalQuantity);
				}, this));
			}, this));
		},
		
		/**
		 * 商品がSBカードの場合はポップアップを開く
		 */
		_openCardPopup: function() {
			CartInfo.ready($.proxy(function(err) {
				if (err) {
					return this._$dialog.showErrorDialog(err.type == 'APIError' ? err.code : '000');
				}
				
				var prefix = Setting.cardPopupBaseurl;
				var width = Setting.cardPopupWidth;
				var height = Setting.cardPopupHeight;
				var jan = this._itemsdata.jan;
				var qty = CartInfo.get().totalQuantity;
			
				this._status.setSelectBoxDisable();
			
				var $window = $(window);
				var popup = window.open(prefix + '/' + jan, '', 'scrollbars=yes,width=' +	 width + ',height=' + height);
				
				var timer = setInterval($.proxy(function() {
					// ポップアップがクローズしているかチェック
					if (!popup.closed) return;

					// クッキーを再読み込み
					var cart = CartInfo.reload();
					
					if (cart) {
						if (cart.totalQuantity > qty) {
							this._showSuccessTooltips();
						}
						
						setCartQtyPrice(cart.totalQuantity);
					}
					
					clearTimeout(timer);
				
					this._status.setSelectBoxEnable();
					this._status.setSubmitStatus(true);
					
				}, this), 250);
			}, this));
		},
		
		/**
		 * レンダリング
		 */
		_render: function(inventory){
			var soldout = parseInt(this._itemsdata.soldout, 10);
			// サイズ切り替えの場合
			if(this._$selectboxOpt.length){
				this._$price.removeClass('hide');
				//this._$pricemain.text('￥' + this._returnPriceWithComma(res.productVariationList.productVariation.productOrderPrice));
				this._$priceweight.text('(' + this._itemsdata.text + ')');
			};
			
			// 在庫あり
			if(inventory.inventory_quantity > 0){
				switch(soldout){
					case 1:
						this._layoutInStock();
						break;
					case 2:
						this._layoutOutOfStockOnline();
						break;
					case 3:
						this._layoutOutOfStockStore();
						break;
					case 4:
						this._layoutOutOfStock();
						break;
					default:
						// APIから返ってきた数ではなく10個固定でoptionタグを生成
						this._createOptionTag(10);
						this._$price.removeClass('hide');
						this._$disable.addClass('hide');
						this._$instock.removeClass('hide');
						this._$outofstock.addClass('hide');
						break;
				};
			// 在庫なし
			}else{
				switch(soldout){
					case 1:
						this._layoutOutOfStockOnline();
						break;
					case 2:
						this._layoutOutOfStockOnline();
						break;
					case 3:
						this._layoutOutOfStock();
						break;
					case 4:
						this._layoutOutOfStock();
						break;
					default:
						this._$price.addClass('hide');
						this._$disable.addClass('hide');
						this._$instock.addClass('hide');
						this._$outofstock.removeClass('hide');
						break;
				};
			};
			this._status.setSubmitStatus(true);
			this._status.setSelectBoxEnable();
		},
		/**
		 * 販売中
		 */
		_layoutInStock: function(){
			//console.log('販売中');
//			this._createOptionTag(parseInt(5, 10));
			this._$disable.addClass('hide');
			this._$instock.removeClass('hide');
			this._$outofstock.addClass('hide');
			this._$outofstockOnline.addClass('hide');
			this._$outofstockStore.addClass('hide');
			this._$outofstockAll.addClass('hide');
		},
		/**
		 * オンライン売り切れ
		 */
		_layoutOutOfStockOnline: function(){
			//console.log('オンライン売り切れ');
			this._$disable.addClass('hide');
			this._$instock.addClass('hide');
			this._$outofstockOnline.removeClass('hide');
			this._$outofstockStore.addClass('hide');
			this._$outofstockAll.addClass('hide');

			// 141121
			this._$statusSingle.find('.online span').html('×');
		},
		/**
		 * 店舗売り切れ
		 */
		_layoutOutOfStockStore: function(){
			//console.log('店舗売り切れ');
//			this._createOptionTag(parseInt(5, 10));
			this._$disable.addClass('hide');
			this._$instock.removeClass('hide');
			this._$outofstock.addClass('hide');
			this._$outofstockOnline.addClass('hide');
			this._$outofstockStore.removeClass('hide');
			this._$outofstockAll.addClass('hide');

			// 141121
			this._$statusSingle.find('.online span').html('○');
		},
		/**
		 * 店舗、オンライン売り切れ
		 */
		_layoutOutOfStock: function(){
			//console.log('店舗、オンライン売り切れ');
			this._$disable.addClass('hide');
			this._$instock.addClass('hide');
			this._$outofstockOnline.addClass('hide');
			this._$outofstockStore.addClass('hide');
			this._$outofstockAll.removeClass('hide');
			
			// 141121
			this._$statusSingle.find('.online span').html('×');
		},
		/**
		 * オプションタグを生成
		 */
		_createOptionTag: function(len){
//			if(len > 10) len = 10;

			var $options = [];
			for(var i = 1; i <= len; i++){
				$options.push('<option value="' + i + '" ' + ((i === 1) ? 'selected="selected"' : '') + '>' + i + '</option>');
			};
			this._itemsdata.qty = 1;
			this._$selectboxQty.prev().text('1');
			this._$selectboxQty.html($options.join(''));
		},
		/**
		 * ツールチップを表示
		 */
		_showSuccessTooltips: function(){
			// ツールチップ位置調整 2014/9/1
			var btnOffset = this._$submit.offset(),
				btnWidth = this._$submit.width(),
				tooltipsHeight = this._$tooltips.outerHeight(),
				tooltipsWidth = this._$tooltips.outerWidth(),
				tooltipsTop = btnOffset.top-tooltipsHeight-10,
				tooltipsLeft = btnOffset.left-(tooltipsWidth-btnWidth)/2;
				
				//console.log(btnOffset,btnWidth,tooltipsHeight,tooltipsWidth,tooltipsTop,tooltipsLeft);
				
			this._$tooltips.css({"top":tooltipsTop,"left":tooltipsLeft});
			this._$tooltips.fadeIn(300, $.proxy(function(){
				var timer = setTimeout($.proxy(function(){
					clearTimeout(timer);
					this._hideSuccessTooltips();
				}, this), 2000);
			}, this));
		},
		/**
		 * ツールチップを非表示
		 */
		_hideSuccessTooltips: function(){
			this._$tooltips.fadeOut(300, $.proxy(function(){
				this._reqDetailProduct();
			}, this));
		},
		/**
		 * セレクトボックスを無効化
		 */
		disableSelectBox: function(){
			this._$selectboxOpt.attr('disabled', 'disabled');
			this._$selectboxQty.attr('disabled', 'disabled');
		},
		/**
		 * セレクトボックスを有効化
		 */
		enableSelectBox: function(){
			this._$selectboxOpt.removeAttr('disabled');
			this._$selectboxQty.removeAttr('disabled');
		},
		/**
		 * カンマ区切りの金額を返す
		 * http://stackoverflow.com/questions/2901102/
		 * how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
		 */
		_returnPriceWithComma: function(num){
			return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		}
	};
	
	//ラジオボタン用のprototypeを作成し、必要なメソッドをcartformPrototypeからコピー
	var radioBtnPrototype = {};
	radioBtnPrototype._setupProps = cartformPrototype._setupProps;
	radioBtnPrototype._layoutInStock = cartformPrototype._layoutInStock;
	radioBtnPrototype._layoutOutOfStock = cartformPrototype._layoutOutOfStock;
	radioBtnPrototype._layoutOutOfStockOnline = cartformPrototype._layoutOutOfStockOnline;
	radioBtnPrototype._layoutOutOfStockStore = cartformPrototype._layoutOutOfStockStore;
	//radioBtnPrototype._render = cartformPrototype._render;
	//radioBtnPrototype. = cartformPrototype.;
	
	//Cartform,CartformRadioBtnにプロトタイプを設定
	Cartform.prototype = cartformPrototype;
	CartformRadioBtn.prototype = radioBtnPrototype;

	window.Cartform = window.Cartform || Cartform;

	$(function(){
		var status = new Status();
		var $dialog = new Dialog(status);
		var janCodes = $('*[data-jan]').map(function(i, e) { return $(e).data('jan'); });
		
		InventoryCache.load(janCodes, function(err) {
			if (err) {
				$dialog.showErrorDialog(err.type == 'APIError' ? err.code : '000');
				return;
			}

			$(Setting.selectorCartform).each(function(){
				// バックボタン対策
				// サイズ選択がある場合はis-defaultCheckedを選択するようにする
				//$(this).find('.js-cartform-opt-selectbox input').removeProp('checked');
				//$(this).find('.js-cartform-opt-selectbox .is-defaultChecked input').prop('checked', 'checked');
			
				var instance = new Cartform($(this), $dialog, status);
				status.addInstance(instance);
			});
		});
	});

	// カートボタンのクリックイベント取得
	$(function(){
		$('.js-cartform-instock-submit').click(function(){
			var index = $('.js-cartform-instock-submit').index(this);
			var category = $('body').attr('data-category');
			
			var cartForm = $(this).closest('.js-cartform');
			
			// ラジオボタン判定
			if(cartForm.find('.js-cartform-opt-selectbox').size() > 0){
				// ラジオボタンあり
				var label = cartForm.find('.js-cartform-opt-selectbox input:checked').attr('data-jan');
			}else{
				// ラジオボタンなし
				var label = cartForm.attr('data-jan');
			}
			
			var ua = window.navigator.userAgent.toLowerCase();
			if(!ua.match(/starbucksjapan/)){
				trackingWrapper('send', 'event', category, 'click', label);
			}
		});
	});

}($j1111, window, this.document));