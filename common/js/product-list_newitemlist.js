/**
 * product-list.js
 * @modified 2017/3/7
 */

(function($, window, document, undefined){

/**
 *オンラインストア在庫有り商品のみ表示
 */

	/* 設定値 */
	var config = {
		errorMessage: {
			'error000': 'システムエラーが発生しております。カスタマーサポートセンターまでご連絡いただけますでしょうか。',
			'error002': 'システムエラーが発生しております。カスタマーサポートセンターまでご連絡いただけますでしょうか。',
			'error010': 'システムエラーが発生しております。カスタマーサポートセンターまでご連絡いただけますでしょうか。',
			'error013': 'システムエラーが発生しております。カスタマーサポートセンターまでご連絡いただけますでしょうか。',
			'error014': 'システムエラーが発生しております。',
			'error110': '申し訳ございません。ご指定の数量が在庫数を超えています。お手数ですが、数量を減らして再度お試し下さい。',
			'error111': '申し訳ございません。一度にご予約いただける商品数量の上限を超えています、数量を減らして再度お試し下さい。',
			'error114': '申し訳ございません。一度にご購入いただける商品数量の上限を超えています。',
			'error119': '申し訳ございません。配送の都合上、ご購入いただける商品数量の上限を超えています、数量を減らして再度お試し下さい。',
			'error121': 'システムエラーが発生しております。カスタマーサポートセンターまでご連絡いただけますでしょうか。',
			'error900': 'システムエラーが発生しております。時間をおいて再度お試しいただくか、カスタマーサポートセンターまでご連絡いただけますでしょうか。',
			'error408': 'オンラインストアへのアクセスが集中しております。しばらくしてからご利用ください。'
		}
	};


	/**
	 * クエリ文字列ヘルパ
	 */
	var qs = (function() {
		function parse(s) {
			var p = {};

			$.each(s.split('&'), function() {
				var a = this.split('=');
				var key = decodeURIComponent(a[0]);
				var val = decodeURIComponent(a[1]);
				p[key] = val;
			});

			return p;
		}

		function stringify(q) {
			var pairs = [];

			for (var k in q) {
				pairs.push(encodeURIComponent(k) + '=' + encodeURIComponent(q[k]));
			}

			return pairs.join('&');
		}

		return {
			parse: parse,
			stringify: stringify
		};
	})();


	/*
	 * エラーダイアログ
	 */
	var errorDialog = {
		init: function() {
			this._$dialog = $('.js-errordialog');
			this._$dialogclose = $('.js-errordialog-close');
			this._$dialogtext = $('.js-errordialog-text');
			this._$dialogcode = $('.js-errordialog-code');

			this._setEvents();
		},

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
			this._$dialogtext.text(config.errorMessage['error' + codeStr]);
			this._$dialogcode.text(codeStr);
			this._$dialogcode.parent().css({display: errorCode == '408' ? 'none': 'block'});
			this._$dialog.fadeIn(300);
		},

		/**
		 * エラーダイアログを非表示
		 */
		hideErrorDialog: function(){
			this._$dialog.fadeOut(300, $.proxy(function(){
				this._$dialogtext.empty();
				this._$dialogcode.empty();
			}, this));
		}
	};


	var _qtyMapCache;


	/*
	 * 在庫APIに問い合わせて、JAN -> 在庫数 のマッピングを取得
	 */
	function loadQuantityMap(items) {
		var d = new $.Deferred();

		(function(resolve, reject) {
			if (_qtyMapCache) {
				return resolve(_qtyMapCache);
			}

			// 商品一覧から重複したJANと在庫切れと確定しているものを取り除く
			var queries = [];

			$.each(items, function(i, it) {
				if(it.soldout_status != 2 && it.soldout_status != 4) {
					var found = false;

					$.each(queries, function(j, q) {
						if (q == it.jan) {
							found = true;
							return true;
						}
					});

					if (!found) queries.push(it.jan);
				}
			});

			(function() {
				var d = new $.Deferred();

				if (queries.length == 0) {
					return d.resolve([]);
				}

				CartInfo.api().getInventories({jan_codes: queries}, function(err, res) {
					if (err) d.reject(err);
					else d.resolve(res);
				});

				return d.promise();
			})()
				.done(function(inventories) {
					var qtyMap = {};

					$.each(inventories, function(i, inv) {
						qtyMap[inv.jan_code] = inv.inventory_quantity;
					});

					// キャッシュ
					_qtyMapCache = qtyMap;
					return resolve(qtyMap);
				})
				.fail(reject);
		})(d.resolve, d.reject);

		return d.promise();
	}


	/**
	 * 在庫API経由で商品情報に在庫切れ情報を足す
	 */
	function attachSoldout(items) {
		// console.log('inventoryFilter.attachSoldout - items', items);

		var d = new $.Deferred();

		loadQuantityMap(items)
			.done(function(qtyMap) {
				for (var i = 0, l = items.length; i != l; i++) {
					var it = items[i];
					it.soldout = true;

					if (it.soldout_status != 2 && it.soldout_status != 4) {
						var qty = qtyMap[it.jan] ? qtyMap[it.jan] : 0;
						if (qty < 1) {
							it.soldout = true;
						} else{
							it.soldout = false;
						}
					}
				}

				d.resolve(items);
			})
			.fail(function(err) { d.reject(err); });

		return d.promise();
	}


	/**
	 * DOMから商品一覧を取得
	 */
	function parseItems() {
		var items = $('.col[data-jan]').map(function(i) {
			var $el = $(this);
			return {
				$el: $el,
				jan: $el.data('jan'),
				soldout_status: parseInt($el.data('soldout'), 10)
			};
		});
		return items;
	}


	var _inventoryFilter = false;


	/**
	 * inventory_filterパラメータからフィルタのON, OFFをハンドル
	 */
	function reset() {
	  var d = new $.Deferred();

		var items = parseItems();

		$('.no-items').removeClass('show');
		if (_inventoryFilter) {
			attachSoldout(items)
				.done(function(items) {
					var soldouts = 0;

					for (var i = 0, l = items.length; i != l; i++) {
						var it = items[i];
						if (it.soldout) {
							it.$el.addClass('soldout');
							soldouts++;
						}
					}

					// console.log(items.length, soldouts);

					// 全ての商品が売り切れ
					if (items.length == soldouts) {
						$('.no-items').addClass('show');
					}
					// 各見出しブロックごとの非表示処理
					var seasonalArea = $('.seasonalRecommendations');
					if(seasonalArea.find('li:not(.soldout)').length == 0){
						seasonalArea.remove();
					}
					var standardArea = $('.standardItems');
					standardArea.find("h3, h4").each(function(){
						if($(this).next().find('li:not(.soldout)').length == 0){
							$(this).next().remove();
							$(this).remove();
						}
					});

					resetSearchValue(true);
					d.resolve();
				})
				.fail(function(err) {
					errorDialog.showErrorDialog(err.type == 'APIError' ? err.code : '408');
					d.reject(err);
				});
		} else {
			for (var i = 0, l = items.length; i != l; i++) {
				var it = items[i];
				it.$el.removeClass('soldout');
			}

			resetSearchValue(false);
			d.resolve();
		}

		return d.promise();
	}

	/**
	 * 絞り込み・並び替えの検索フォームのhidden項目に値を書き込む
	 */
	function resetSearchValue(yes) {
		$('input[name=inventory_filter]').val(yes ? 'on' : 'off');
	}

	/**
	 * URLクエリからフラグを取得
	 */
	function currentInventoryFilter() {
		var s = location.search;
		var inventoryFilter = false;

		if (s.length > 1) {
			var query = qs.parse(s.slice(1));
			if (query.inventory_filter == 'on') {
				inventoryFilter = true;
			}
		}
		return inventoryFilter;
	}


	$(function() {
		errorDialog.init();

		_inventoryFilter = currentInventoryFilter();

		if (_inventoryFilter) {
			reset().done(function() { $(window).trigger("resize"); }).fail(function(e) { $(window).trigger("resize"); });
		}

	});

	/*新商品一覧絞り込み */
	$(function(){
		var params = [];
		var pair;
		var productListUtil = $('.productListUtil');
		var hash = window.location.search.slice(1).split('&');
		for(var i = 0; i < hash.length; i++){
			pair = hash[i].split('=');
			params.push(pair[0]);
			params[pair[0]] = pair[1];
		}
		var breakPoint = 600;
		var timer = false;

		/* ユーティリティエリア位置制御 */
		var utilPositionControl = function(){
			//console.log(window.innerWidth);
			if(window.innerWidth < breakPoint){
				//console.log("SP");
				$("header.local").after(productListUtil.detach());
			}else{
				//console.log("PC");
				$("header.local").before(productListUtil.detach());
			}
		}
		/* ユーティリティエリアスクロール制御 */
		var utilScrollControl = function(){
			if(productListUtil.width() < productListUtil.find('ul').width()){
				var activeBtn = productListUtil.find('.is-active');
				//console.log("pageWidth: " + $(window).width() + ", ulWidth: " + productListUtil.width() + ", left: " + activeBtn.position().left + ", btnWidth: " + activeBtn.outerWidth());
				var leftMargin = (productListUtil.width() - activeBtn.outerWidth())/2;
				productListUtil.scrollLeft(activeBtn.position().left - leftMargin);
			}
		}

		utilPositionControl();
		utilScrollControl();
		$(window).on("resize", function(){
			if (timer !== false) {
				clearTimeout(timer);
			}
			timer = setTimeout(function() {
				utilPositionControl();
				utilScrollControl();
			}, 200);
		});
	});
}($j1111, window, this.document));
