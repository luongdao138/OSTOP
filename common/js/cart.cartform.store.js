/**
 * cartform.js
 * @modified 2016/6/14
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
		// selectorCartformOutofStockOnline: '.js-cartform-outofstock-online',
		// selectorCartformOutofStockAll: '.js-cartform-outofstock-all',
		// selectorCartformOutofStockStore: '.js-cartform-outofstock-store',
		selectorCartformRestockInfo: '.js-cartform-restock-info',
		errorMessage: {
			'error000': 'システムエラーが発生しております。カスタマーサポートセンターまでご連絡いただけますでしょうか。',
			'error002': 'システムエラーが発生しております。カスタマーサポートセンターまでご連絡いただけますでしょうか。',
			'error010': 'システムエラーが発生しております。カスタマーサポートセンターまでご連絡いただけますでしょうか。',
			'error013': 'システムエラーが発生しております。カスタマーサポートセンターまでご連絡いただけますでしょうか。',
			'error014': 'システムエラーが発生しております。',
			'error110': '申し訳ございません。現在、カートに入れられる在庫がありません。お手数ですが、お時間を空けてお試しいただくか、2点以上の場合は数量を減らして再度お試し下さい。',
			'error111': '申し訳ございません。一度にご予約いただける商品数量の上限を超えています、数量を減らして再度お試し下さい。',
			'error114': '申し訳ございません。一度にご購入いただける商品数量の上限を超えています。',
			'error119': '申し訳ございません。配送の都合上、ご購入いただける商品数量の上限を超えています、数量を減らして再度お試し下さい。',
			'error121': 'システムエラーが発生しております。カスタマーサポートセンターまでご連絡いただけますでしょうか。',
			'error130': '申し訳ございません。カートに入れられません。こちらの商品と同時に購入することのできない商品がカートに入っています。',
			'error900': 'システムエラーが発生しております。時間をおいて再度お試しいただくか、カスタマーサポートセンターまでご連絡いただけますでしょうか。',
			'error408': 'オンラインストアへのアクセスが集中しております。しばらくしてからご利用ください。'
		},
		cardPopupBaseurl: DOMAIN_API + '/sbcard',
		cardPopupWidth: 610,
		cardPopupHeight: 700
	};

	var Status = function(){
		this._instances = [];
		this._enablesubmit = false;
	};
	
	Status.get = function() {
		if (!this._me) {
			this._me = new Status();
		}
		return this._me;
	}

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
		this._status = status || Status.get();
		this._$dialog = $(s.selectorDialog);
		this._$dialogclose = $(s.selectorDialogClose);
		this._$dialogtext = $(s.selectorDialogText);
		this._$dialogcode = $(s.selectorDialogCode);
		this._setEvents();
	};
	
	Dialog.get = function() {
		if (!this._me) {
			this._me = new Dialog();
		}
		
		return this._me;
	}

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
			// var codeStr = String(errorCode);
			var codeStr = '130';
			this._$dialogtext.text(Setting.errorMessage['error' + codeStr]);
			this._$dialogcode.text(codeStr);
			this._$dialogcode.parent().css({display: errorCode == '408' ? 'none': 'block'});
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
		onReady: null,
		
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
					//APIエラーテスト用　URLに ?errorTest を付けることで強制的にエラー状態にする
					if(location.search==="?errorTest"){
						err = { type: 'test', code: 999 };
					}
					cb(err);
				});
			} else {
				var noJanError = { type: 'noJan', code: 0 };
				setTimeout(function() { cb(noJanError); }, 0);
			}
		},
		
		/**
		 * 在庫情報を追加
		 */
		append: function(inv) {
			for (var i = 0, l = inv.length; i != l; i++) {
				this._table[inv[i].jan_code] = inv[i];
			}
		},
		
		/*
		 * キャッシュから該当の在庫情報を取得
		 */
		lookup: function(janCode) {
			return this._table[janCode];
		},
		
		ready: function(cb) {
			this.onReady = cb;
		}
	};

	var Cartform = function($cartform, $dialog, status){
		// 商品情報
		this._itemsdata = {};
		// カートフォーム
		this._$cartform = $cartform;
				// ステータス
		this._status = status || Status.get();
		// ダイアログ
		this._$dialog = $dialog || Dialog.get();
		this._status.addInstance(this);
		
		// 初期化
		this._initialize();
	};
	
	Cartform.INSTOCK = 'instock';
	Cartform.OUTSTOCK = 'outstock';
	Cartform.OUTSTOCK_ONLINE = 'outstock_online';
	Cartform.OUTSTOCK_STORE = 'outstock_store';
	
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

	var CartformMultiBtn = function($cartform, $dialog){
		// 商品情報
		this._itemsdata = {};
		// カートフォーム
		this._$cartform = $cartform;
		// ダイアログ
		this._$dialog = $dialog;
		// 初期化
		this._setupProps();
		this._$statusSingle = this._$cartform.parent().parent().parent().prev().find('.status');
	};

	var SelectSelectorMixin = {
		selectorText: function() {
			return this._$selectboxOpt.find('option:selected').text();
		},
		
		selectorOption: function() {
			return this._$selectboxOpt.find('option:selected');
		}
	};
	
	var RadioSelectorMixin = {
		selectorText: function() {
			return this._$selectboxOpt.filter(':checked').next().text();
		},
		
		selectorOption: function() {
			return this._$selectboxOpt.filter(':checked');
		}
	};
	
	var NoneSelectorMixin = {
		selectorText: function() {
			return '';
		},
		
		selectorOption: function() {
			return $();
		}
	};

	var cartformPrototype = {
		invenroryStatus: function() {
				return this._inventoryStatus;
		},
		
		soldout: function() {
			return this._inventoryStatus == Cartform.OUTSTOCK || this._inventoryStatus == Cartform.OUTSTOCK_ONLINE;
		},
		
		/**
		 * 初期化
		 */
		_initialize: function(){
			this._setupProps();
			this._setEvents();
			
			if(this._itemsdata.jan){
			
				// radioの場合、各バリエーションに対して在庫状況の変更をする				
				if(this.selectorType == 'radio') {
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
								case 3:
									instance._layoutInStock(inventory);
									break;
								case 2:
								case 4:
									instance._layoutOutOfStock(inventory);
									instance._$cartform.parents('.selectList > li').addClass('isSoldout').find('.check').remove();
									break;
								default:
									break;
							};
						// 在庫なし
						}else{
							instance._$cartform.parents('.selectList > li').addClass('isSoldout').find('.check').remove();
							switch(soldout){
								case 1:
								case 2:
								case 3:
								case 4:
									instance._layoutOutOfStock(inventory);
									break;
								default:
									break;
							};
						};

						// 在庫状況によりラジオボタンが減っているケースがあるためキャッシュを更新
						this._$selectboxOpt = this._$cartform.find(Setting.selectorCartformOptSelectbox);
					}, this));
				}

				// 複数ボタンの場合、各バリエーションに対して在庫状況の変更をする
				if(this.selectorType == 'multi') {
					$.each(this._$selectboxOpt, $.proxy(function(_, el) {
						var instance = new CartformMultiBtn($(el), this._$dialog);
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
								case 3:
									instance._layoutInStockMulti(inventory);
									break;
								case 2:
								case 4:
									instance._layoutOutOfStockMulti(inventory);
									break;
								default:
									break;
							};
						// 在庫なし
						}else{
							switch(soldout){
								case 1:
								case 3:
									if (inventory.restock_notice_flg && (document.domain).indexOf('www') !== 0) {
										instance._layoutRestockMulti(inventory);
									} else {
										instance._layoutOutOfStockMulti(inventory);
									}
									break;
								case 2:
								case 4:
									instance._layoutOutOfStockMulti(inventory);
									break;
								default:
									break;
							};
						};

						// 在庫状況によりラジオボタンが減っているケースがあるためキャッシュを更新
						this._$selectboxOpt = this._$cartform.find(Setting.selectorCartformOptSelectbox);
					}, this));
				}


				this._reqDetailProduct();
				
				this._$cartform.data('cartform', this);

				// ボタン出し分けをした後にwebviewの処理をする必要があるのでここに記述する
				if (navigator.userAgent.indexOf('starbucksjapan/') !== -1) {
					if ( $('.js-cartform-instock').length > 0 ) {
						$('.js-cartform-instock').children().addClass('hide');
						$('.js-cartform-instock').append('<p class="webviewButton"><a href="' + location.pathname + '?webview_esc=1">オンラインストアで購入する</a></p>');
					}
					if ( $('.js-cartform-outofstock').length > 0 ) {
						$('.js-cartform-outofstock').children().addClass('hide');
						$('.js-cartform-outofstock').append('<p class="webviewButton disable"><span>オンラインストアで購入する</span></p>');
					}
					if ( $('.js-cartform-restock-info').length > 0 ) {
						$('.js-cartform-restock-info').find('input').addClass('hide');
						$('.js-cartform-restock-info').find('.webviewButton').removeClass('hide');
					}
				}
			}
		},
		/**
		 * 各種プロパティをセット
		 */
		_setupProps: function(){
			var s = Setting;
			this._$selectboxOpt = this._$cartform.find(s.selectorCartformOptSelectbox);
			if (this._$selectboxOpt.length != 0 && this._$selectboxOpt.prop('tagName').toLowerCase() == 'select') {
				this.selectorType = 'select';
				this.selectorMixin = SelectSelectorMixin;
			} else if (this._$selectboxOpt.length != 0 && this._$selectboxOpt.prop('type').toLowerCase() == 'radio') {
				this.selectorType = 'radio';
				this.selectorMixin = RadioSelectorMixin;
			} else if (this._$selectboxOpt.length != 0 && this._$selectboxOpt.prop('type').toLowerCase() == 'button') {
				this.selectorType = 'multi';
				this.selectorMixin = RadioSelectorMixin;
			} else {
				this.selectorType = 'none';
				this.selectorMixin = NoneSelectorMixin;
			}
			
			for (var k in this.selectorMixin) this[k] = this.selectorMixin[k];
			
			this._$selectboxQty = this._$cartform.find(s.selectorCartformQtySelectbox);
			this._$submit = this._$cartform.find(s.selectorCartformSubmit);
			this._$tooltips = $(s.selectorCartformTooltips);
			this._$disable = this._$cartform.find(s.selectorCartformDisable);
			this._$instock = this._$cartform.find(s.selectorCartformInstock);
			this._$price = this._$cartform.find(s.selectorCartformPrice);
			this._$pricemain = this._$price.find(s.selectorCartformPriceMain);
			this._$priceweight = this._$price.find(s.selectorCartformPriceWeight);
			this._$outofstock = this._$cartform.find(s.selectorCartformOutofStock);
			// this._$outofstockOnline = this._$cartform.find(s.selectorCartformOutofStockOnline);
			// this._$outofstockAll = this._$cartform.find(s.selectorCartformOutofStockAll);
			// this._$outofstockStore = this._$cartform.find(s.selectorCartformOutofStockStore);
			this._$restockInfo = this._$cartform.find(s.selectorCartformRestockInfo);
			this._$statusSingle = this._$cartform.parent('.cartForm').prev('.status');// シングル商品用
			this._itemsdata.jan = this._$cartform.attr('data-jan');
			this._itemsdata.sc = this._$cartform.attr('data-sc');
			this._itemsdata.soldout = this._$cartform.attr('data-soldout');
			if (!this._itemsdata.soldout) this._itemsdata.soldout = 0; 
			this._itemsdata.text = this.selectorText();
			this._kind = this._$cartform.attr('data-kind');
			this._tooltipType = this._$cartform.attr('data-tooltip') || 'sku';
		},
		/**
		 * イベントを紐付け
		 */
		_setEvents: function(){
			var that = this;
			// サイズ
			this._$selectboxOpt.bind('change', $.proxy(function(){
				var $elem = this.selectorOption(),
					jan = $elem.attr('data-jan'),
					soldout = $elem.attr('data-soldout');

				if (!soldout) soldout = 0;
				
				// サイズ
				if(jan){
					that._$cartform.attr('data-jan', jan);
					that._itemsdata.jan = jan;
					that._itemsdata.text = this.selectorText();
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
			}, this));
			// 数量
			this._$selectboxQty.bind('change', function(){
				that._itemsdata.qty = parseInt($(this).val(), 10);
			});
			// カートに入れる
			this._$submit.bind('click', function(){
				if(!that._status.getSubmitStatus()) return;
				that._status.setSubmitStatus(false);

				// 送信ボタン自体にjanが指定されている場合、フォーム送信値として指定
				if ($(this).children('input').attr('data-jan')) {
					// $('form.js-cartform').attr('data-jan',$(this).children('input').attr('data-jan'));
					that._itemsdata.jan = $(this).children('input').attr('data-jan');
				}

				if (that._kind == 'card') {
					that._openCardPopup();
				} else {
					that._reqAddItem();
				}
			});
			//再入荷通知
			this._$restockInfo.find('input').bind('click', function(){
				location.href = $(this).closest('.js-cartform-restock-info').find('.webviewButton a').attr('href');
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

			// janがフォームのjanとずれてたら補正（複数ボタン対応）
			// if ($('form.js-cartform').attr('data-jan') && data.jan != $('form.js-cartform').attr('data-jan')) {
			// 	data.jan = $('form.js-cartform').attr('data-jan');
			// }

			function start(retry) {
				
				var attached = CartInfo.attached();
			
				if (!attached) {
					var unlocked = CartInfo.load($.proxy(function(err, cart) {
						if (err) {
							return this._$dialog.showErrorDialog(err.type == 'APIError' ? err.code : '408');
						}
						ready.call(this, retry);
					}, this));
					
					if (!unlocked) {
						this._status.setSelectBoxEnable();
					}
				} else {
					ready.call(this, retry);
				}
			}
			
			function ready(retry) {
				
				var params = {jan_code: data.jan, quantity: data.qty};
				
				CartInfo.session().addProduct(params, $.proxy(function(err, res) {
					if (err) {
						if (retry && err.type == 'APIError' && err.code == 900) {
							CartInfo.destroy();
							setCartQtyPrice(0);
							return start.call(this, false);
						} else {
							return this._$dialog.showErrorDialog(err.type == 'APIError' ? err.code : '408');
						}
					}
					
					added.call(this, res);					
				}, this));
			}
			
			function added(res) {
				CartInfo.save({
					totalQuantity: res.total_quantity,
					expires: new Date(res.token_expire_at)
				});
				this._showSuccessTooltips();
				//商品点数を更新
				setCartQtyPrice(res.total_quantity);
			}
			
			start.call(this, true);
		},
		
		/**
		 * 商品がSBカードの場合はポップアップを開く
		 */
		_openCardPopup: function() {
			var prefix = Setting.cardPopupBaseurl;
			var width = Setting.cardPopupWidth;
			var height = Setting.cardPopupHeight;
			var jan = this._itemsdata.jan;
			var qty = CartInfo.attached() ? CartInfo.get().totalQuantity : 0;
		
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
			if (this.selectorType == 'multi') {
				// 複数ボタン
				if(inventory.inventory_quantity > 0){
					switch(soldout){
						case 1:
						case 3:
							this._layoutInStockMulti(inventory);
							break;
						case 2:
						case 4:
							this._layoutOutOfStockMulti(inventory);
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
				}else{
					switch(soldout){
						case 1:
						case 2:
						case 3:
						case 4:
							if (inventory.restock_notice_flg && (document.domain).indexOf('www') !== 0) {
								this._layoutRestockMulti(inventory);
							} else {
								this._layoutOutOfStockMulti(inventory);
							}
							break;
						default:
							this._$price.addClass('hide');
							this._$disable.addClass('hide');
							this._$instock.addClass('hide');
							this._$outofstock.removeClass('hide');
							break;
					}
				}

			} else {
				// radio,その他
				if(inventory.inventory_quantity > 0){
					switch(soldout){
						case 1:
						case 3:
							this._layoutInStock(inventory);
							break;
						case 2:
						case 4:
							this._layoutOutOfStock(inventory);
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
				}else{
					switch(soldout){
						case 1:
						case 2:
						case 3:
						case 4:
							if (inventory.restock_notice_flg) {
								this._layoutRestock(inventory);
							} else {
								this._layoutOutOfStock(inventory);
							}
							break;
						default:
							this._$price.addClass('hide');
							this._$disable.addClass('hide');
							this._$instock.addClass('hide');
							this._$outofstock.removeClass('hide');
							break;
					}
				}
			}
			
			this._status.setSubmitStatus(true);
			this._status.setSelectBoxEnable();
		},
		
		_inventoryStatusGlyph: function(s) {
			switch(s) {
			case 0: return '<span class="soldoutGlyph">×</span>';
			case 1: return '△';
			case 2: return '○';
			default: return '';
			}
		},
		
		/**
		 * 販売中
		 */
		_layoutInStock: function(inventory){
//			this._createOptionTag(parseInt(5, 10));
			this._$disable.addClass('hide');
			this._$instock.removeClass('hide');
			this._$outofstock.addClass('hide');
			// this._$outofstockOnline.addClass('hide');
			// this._$outofstockStore.addClass('hide');
			// this._$outofstockAll.addClass('hide');
			this._$statusSingle.find('.online span').html(this._inventoryStatusGlyph(inventory.inventory_status));
			this._inventoryStatus = Cartform.INSTOCK;
		},
		/**
		 * 販売中（複数ボタン）
		 */
		_layoutInStockMulti: function(inventory){
			var label = $('form.js-cartform').find('label').has('* input[data-jan=' + inventory.jan_code + ']');
			label.children('.js-cartform-instock').removeClass('hide');
			label.children('.js-cartform-outofstock').addClass('hide');
			label.children('.js-cartform-restock-info').addClass('hide');
			this._$statusSingle.find('.online span').html(this._inventoryStatusGlyph(inventory.inventory_status));
		},
		/**
		 * 売り切れ
		 */
		_layoutOutOfStock: function(inventory){
			this._$disable.addClass('hide');
			this._$instock.addClass('hide');
			this._$outofstock.removeClass('hide');
			// this._$outofstockOnline.addClass('hide');
			// this._$outofstockStore.addClass('hide');
			// this._$outofstockAll.removeClass('hide');
			// 141121
			this._$statusSingle.find('.online span').html(this._inventoryStatusGlyph(inventory.inventory_status));
			this._inventoryStatus = Cartform.OUTSTOCK;
		},
		/**
		 * 売り切れ（複数ボタン）
		 */
		_layoutOutOfStockMulti: function(inventory){
			var label = $('form.js-cartform').find('label').has('* input[data-jan=' + inventory.jan_code + ']');

			label.children('.js-cartform-instock').addClass('hide');
			label.children('.js-cartform-outofstock').removeClass('hide');
			label.children('.js-cartform-restock-info').addClass('hide');
			this._$statusSingle.find('.online span').html(this._inventoryStatusGlyph(inventory.inventory_status));
		},
		/**
		 * 再入荷
		 */
		_layoutRestock: function(inventory){
			var restock_url = location.origin.replace('product', 'www') + '/mystarbucks/restock-info/input/?webview_esc=1';
			restock_url += '&product_url=' + encodeURIComponent(location.href);
			restock_url += '&category1_list_path='+ encodeURIComponent(location.pathname.split('/')[1]);
			restock_url += '&jan_code=' + inventory.jan_code;
			restock_url += '&register=on';

			this._$instock.addClass('hide');
			this._$outofstock.addClass('hide');
			this._$restockInfo.removeClass('hide');
			this._$restockInfo.append('<p class="webviewButton hide"><a href="'+ restock_url +'">再入荷お知らせ</a></p>');
			this._$statusSingle.find('.online span').html(this._inventoryStatusGlyph(inventory.inventory_status));
		},
		/**
		 * 再入荷（複数ボタン）
		 */
		_layoutRestockMulti: function(inventory){
			var label = $('form.js-cartform').find('label').has('* input[data-jan=' + inventory.jan_code + ']');
			var restock_url = location.origin.replace('product', 'www') + '/mystarbucks/restock-info/input/?webview_esc=1';
			restock_url += '&product_url=' + encodeURIComponent(location.href);
			restock_url += '&category1_list_path='+ encodeURIComponent(location.pathname.split('/')[1]);
			restock_url += '&jan_code=' + inventory.jan_code;
			restock_url += '&register=on';

			label.children('.js-cartform-instock').addClass('hide');
			label.children('.js-cartform-outofstock').addClass('hide');
			label.children('.js-cartform-restock-info').removeClass('hide');
			if (label.children('.js-cartform-restock-info').find('.webviewButton').length == 0) {
				label.children('.js-cartform-restock-info').append('<p class="webviewButton hide"><a href="'+ restock_url +'">再入荷お知らせ</a></p>');
			}
			this._$statusSingle.find('.online span').html(this._inventoryStatusGlyph(inventory.inventory_status));
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
			var btnOffset = this._$submit.offset();
			var btnWidth = this._$submit.width();
			var tooltipsHeight = this._$tooltips.outerHeight();
			var tooltipsWidth = this._$tooltips.outerWidth();
			var tooltipsTop = btnOffset.top-tooltipsHeight-10;
			var tooltipsLeft = btnOffset.left-(tooltipsWidth-btnWidth)/2;
						
			if (this._tooltipType == 'overview') {
				$wrap = $('.js-cartformWrap').has(this._$cartform);
				var wrapWidth = $wrap.outerWidth();
				var wrapHeight = $wrap.outerHeight();
				
				tooltipsWidth = wrapWidth;
				tooltipsLeft = $wrap.offset().left;
					
				if (checkDevice() == 'pc') {
					tooltipsWidth += 14;
					tooltipsLeft -= 7;
				}
				
				this._$tooltips.css({top: tooltipsTop, left: tooltipsLeft, width: tooltipsWidth});
			} else {
				this._$tooltips.css({top: tooltipsTop, left: tooltipsLeft, width: ''});
			}
			
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
	
	$.fn.cartform = function() {
		var instance = null;
		
		this.each(function() {
			var $this = $(this);
			var data = $this.data('cartform');
			if (!data) data = new Cartform($this);
			if (!instance) instance = data;
		}); 
		
		return instance;
	}
	
	//ラジオボタン用のprototypeを作成し、必要なメソッドをcartformPrototypeからコピー
	var radioBtnPrototype = {};
	radioBtnPrototype._setupProps = cartformPrototype._setupProps;
	radioBtnPrototype._layoutInStock = cartformPrototype._layoutInStock;
	radioBtnPrototype._layoutOutOfStock = cartformPrototype._layoutOutOfStock;
	// radioBtnPrototype._layoutOutOfStockOnline = cartformPrototype._layoutOutOfStockOnline;
	// radioBtnPrototype._layoutOutOfStockStore = cartformPrototype._layoutOutOfStockStore;
	radioBtnPrototype._inventoryStatusGlyph = cartformPrototype._inventoryStatusGlyph;
	//radioBtnPrototype._render = cartformPrototype._render;
	//radioBtnPrototype. = cartformPrototype.;

	//マルチボタン用のprototypeを作成し、必要なメソッドをcartformPrototypeからコピー
	var multiBtnPrototype = {};
	multiBtnPrototype._setupProps = cartformPrototype._setupProps;
	multiBtnPrototype._layoutInStockMulti = cartformPrototype._layoutInStockMulti;
	multiBtnPrototype._layoutOutOfStockMulti = cartformPrototype._layoutOutOfStockMulti;
	multiBtnPrototype._layoutRestockMulti = cartformPrototype._layoutRestockMulti;
	// multiBtnPrototype._layoutOutOfStockOnline = cartformPrototype._layoutOutOfStockOnline;
	// multiBtnPrototype._layoutOutOfStockStore = cartformPrototype._layoutOutOfStockStore;
	multiBtnPrototype._inventoryStatusGlyph = cartformPrototype._inventoryStatusGlyph;
	//multiBtnPrototype._render = cartformPrototype._render;
	//multiBtnPrototype. = cartformPrototype.;

	//Cartform,CartformRadioBtnにプロトタイプを設定
	Cartform.prototype = cartformPrototype;
	CartformRadioBtn.prototype = radioBtnPrototype;
	CartformMultiBtn.prototype = multiBtnPrototype;

	$(function(){
		var allJanCodes = $('*[data-jan]').map(function(i, e) {
			return {
				jan: $(e).data('jan'),
				soldout: parseInt($(e).data('soldout'), 10)
			};
		});
		
		var uJanCodes = {};
		
		for (var i = 0, l = allJanCodes.length; i != l; i++) {
			var j = allJanCodes[i];
			if (uJanCodes[j.jan] === undefined) uJanCodes[j.jan] = false;
			if (j.soldout != 2 && j.soldout != 4) uJanCodes[j.jan] = true;
		}
		
		var dummyInventories = [];
		var janCodes = [];
		
		for (j in uJanCodes) {
			if (uJanCodes[j] === true) {
				janCodes.push(j);
			} else {
				dummyInventories.push({
					jan_code: j,
					inventory_quantity: 0,
					inventory_status: 0,
					cart_limit: 0
				})
			}
		}
		InventoryCache.load(janCodes, function(err) {
			if (err && (err.type !== 'noJan')) {
				Dialog.get().showErrorDialog(err.type == 'APIError' ? err.code : '408');
				//2017.4.25追記 エラー時は在庫表示を"-"にする
				$('.status .online span').html(' - ');
				//商品詳細ページは .js-cartform-outofstock の非活性ボタンを表示
				//商品詳細以外のページに設置されたカートボタンはデフォルトのクラス設定のままでOK
				$(Setting.selectorCartform + ' ' + Setting.selectorCartformInstock).addClass('hide');
				return;
			}
			
			InventoryCache.append(dummyInventories);

			// ready イベントが無い場合は自動でCartformをinstance化
			if (!InventoryCache.onReady) {
				$(Setting.selectorCartform).each(function(){
					new Cartform($(this));
				});
			} else {
				InventoryCache.onReady();
			}
		});
	});

	// カートボタンのクリックイベント取得
	$(function(){
		$('.js-cartform-instock-submit').click(function(){
			var index = $('.js-cartform-instock-submit').index(this);
			var category = $('body').attr('data-category');
			
			var cartForm = $(this).closest('.js-cartform');
			var dataKind = cartForm.data('kind');
			
			// ラジオボタン判定
			if(cartForm.find('.js-cartform-opt-selectbox').size() > 0) {
				if ($('.js-cartform-opt-selectbox').has('input')) {
					// ラジオボタンあり
					var label = cartForm.find('.js-cartform-opt-selectbox input:checked').attr('data-jan');
				} else {
					var label = cartForm.find('.js-cartform-opt-selectbox option:selected').attr('data-jan');
				}
			}else{
				// ラジオボタンなし
				var label = cartForm.attr('data-jan');
			}
			if(location.search.match(/(\?|&)nid=/)) {
				var params = location.search.slice(1).split("&");
				for(i=0; i<params.length; i++){
					if(params[i].match(/^nid=/)){
						label += "_" + params[i].slice(4);
					}
				}
			}
			
			var ua = window.navigator.userAgent.toLowerCase();
			if((!ua.match(/starbucksjapan/))&&(dataKind!='card')){
				trackingWrapper('send', 'event', category, 'click', label);
			}
		});
	});
	
	window.cartform = {};
	window.cartform.Dialog = Dialog;
	window.cartform.InventoryCache = InventoryCache;
	window.cartform.CartForm = Cartform;
}($j1111, window, this.document));
