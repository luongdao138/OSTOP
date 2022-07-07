/*---------------
carouselVt
----------------*/
jQuery(function($){
	$.fn.carouselVt = function(options) {
		if ($(this).size() == 0) return false;
		var self = this;
		var opts = $.extend($.fn.carouselVt.defaults,options);
		var CarouselCore = {
			targetName : self,
			wrapperWidth : 0,
			wrapperHeight : 0,
			itemWidth : 0,
			itemHeight : 0,
			itemNum : 0,
			itemDisplayNum : 0,
			itemDisplayMaxWidth : 0,
			itemDisplayMaxHeight : 0,
			itemCurrentId : 1,
			increment : null,
			init : function() {
				this.itemWidth = $('.carouselItem', this.targetName).outerWidth(true);
				this.wrapperWidth = parseInt($('.carouselContentsWrapper', this.targetName).css('width'));
				this.itemHeight = $('.carouselItem', this.targetName).outerHeight(true);
				this.wrapperHeight = parseInt($('.carouselContentsWrapper', this.targetName).css('height'));
				this.itemNum = $('.carouselItem', this.targetName).size();
				this.itemDisplayMaxWidth = $('.carouselContentsWrapper', this.targetName).offset().left + this.wrapperWidth;
				this.itemDisplayMaxHeight = $('.carouselContentsWrapper', this.targetName).offset().top + this.wrapperHeight;
			},
			slidePrev : function() {
				if (this.itemCurrentId > 1) {
					this.itemCurrentId--;
					this.increment = '+=';
					$('.carouselContents', this.targetName).trigger('navChange');
				}
			},
			slideNext : function() {
				var itemLimitNum = (this.itemNum - this.itemDisplayNum);
				if (this.itemCurrentId <= itemLimitNum) {
					this.itemCurrentId++;
					this.increment = '-=';
					$('.carouselContents', this.targetName).trigger('navChange');
				}
			}
		};
		var Carousel = {
			_CarouselCore : null,
			targetName : null,
			init : function (_CarouselCore) {
				this._CarouselCore = _CarouselCore;
				this.targetName = this._CarouselCore.targetName;
				var contentsWidth = this._CarouselCore.itemWidth + 'px';
				$('.carouselContents', this.targetName).css('width', contentsWidth);
				var contentsHeight = 0;
				$('.carouselItem', this.targetName).each(function(){
					contentsHeight += $(this).outerHeight(true);
				});
				$('.carouselContents', this.targetName).css('height', contentsHeight);
				this._CarouselCore.itemDisplayNum = 5;
				this.viewNav();
				$('.carouselItem img', this.targetName).bind('itemViewEvent', function(e) {
					$(this).trigger('customScrollEvent');
				});
				
				this.viewResize();
				this.viewLazyLoadItem();
			},
			viewLazyLoadItem : function() {
				var displayMinWidth = $(window).scrollLeft();
				var displayMaxWidth = $(window).width() + $(window).scrollLeft();
				var displayMinHeight = $(window).scrollTop();
				var displayMaxHeight = $(window).height() + $(window).scrollTop();
				
				var displayWidth = $(window).width() + $(window).scrollLeft();
				var displayHeight = $(window).height() + $(window).scrollTop();
				var itemDisplayMaxHeight = this._CarouselCore.itemDisplayMaxHeight;
				
				$('.carouselItem img', this._CarouselCore.targetName).each(function(i) {
					if (itemDisplayMaxHeight > $(this).offset().top &&
							(displayMinHeight < Math.round($(this).offset().top + $(this).height()) && displayMaxHeight > Math.round($(this).offset().top)) &&
							(displayMinWidth < Math.round($(this).offset().left + $(this).width()) && displayMaxWidth > Math.round($(this).offset().left))
							) {
						$(this).trigger('itemViewEvent');
					}
				});
			},
			viewNav : function() {
				if (this._CarouselCore.itemNum > this._CarouselCore.itemDisplayNum) {
					var itemLimitNum = (this._CarouselCore.itemNum - this._CarouselCore.itemDisplayNum);
					if (this._CarouselCore.itemCurrentId > 1) {
						this.viewNavEnable($('.carouselNavPrev img', this._CarouselCore.targetName));
						$('.carouselNavPrev img', this._CarouselCore.targetName).css('cursor', 'pointer');
					} else {
						this.viewNavDisable($('.carouselNavPrev img', this._CarouselCore.targetName));
						$('.carouselNavPrev img', this._CarouselCore.targetName).css('cursor', 'default');
					}
					if (this._CarouselCore.itemCurrentId <= itemLimitNum) {
						this.viewNavEnable($('.carouselNavNext img', this._CarouselCore.targetName));
						$('.carouselNavNext img', this._CarouselCore.targetName).css('cursor', 'pointer');
					} else {
						this.viewNavDisable($('.carouselNavNext img', this._CarouselCore.targetName));
						$('.carouselNavNext img', this._CarouselCore.targetName).css('cursor', 'default');
					}
				}
			},
			viewNavEnable : function(elm) {
				var regexp = /-(ovoff|in)*\.(gif|jpe?g|png)$/g;
				var navImg = elm.attr('src').replace(regexp, '-ovoff.$2');
				elm.attr('src', navImg);
			},
			viewNavDisable : function(elm) {
				var regexp = /-(ovon|ovoff|in)*\.(gif|jpe?g|png)$/g;
				var navImg = elm.attr('src').replace(regexp, '-in.$2');
				elm.attr('src', navImg);
			},
			viewNavOver : function(elm) {
				var regexp = /-(ovon|ovoff)*\.(gif|jpe?g|png)$/g;
				var navImg = elm.attr('src').replace(regexp, '-ovon.$2');
				elm.attr('src', navImg);
			},
			viewNavOut : function(elm) {
				var regexp = /-(ovon|ovoff)*\.(gif|jpe?g|png)$/g;
				var navImg = elm.attr('src').replace(regexp, '-ovoff.$2');
				elm.attr('src', navImg);
			},
			viewResize : function() {
				var contentsHeight = 0;
				var self = this;
				$('.carouselItem', this._CarouselCore.targetName).each(function(n){
					if (n >= (self._CarouselCore.itemCurrentId - 1) && n < ((self._CarouselCore.itemCurrentId - 1) + 5)) {
						contentsHeight += $(this).outerHeight(true);
					}
				});
				// 21 = margin-bottom + padding-bottom
				$('.carouselContentsWrapper', self._CarouselCore.targetName).css('height', (contentsHeight - 21) + 'px');
				self._CarouselCore.wrapperHeight = parseInt($('.carouselContentsWrapper', this.targetName).css('height'));
				self._CarouselCore.itemDisplayMaxHeight = $('.carouselContentsWrapper', this.targetName).offset().top + self._CarouselCore.wrapperHeight;
			}
		};
		CarouselCore.init();
		Carousel.init(CarouselCore);

		$('.carouselNavPrev', CarouselCore.targetName).bind('click', function(e) {
			CarouselCore.slidePrev();
		});
		
		$('.carouselNavNext', CarouselCore.targetName).bind('click', function(e) {
			CarouselCore.slideNext();
		});
		
		$('.carouselContents', CarouselCore.targetName).bind('navChange', function(e) {
			Carousel.viewResize();
			
			var itemHeight;
			if (CarouselCore.increment == '-=') {
				itemHeight = $('.carouselItem', CarouselCore.targetName).eq(CarouselCore.itemCurrentId - 2).outerHeight(true);
			} else if (CarouselCore.increment == '+=') {
				itemHeight = $('.carouselItem', CarouselCore.targetName).eq(CarouselCore.itemCurrentId - 1).outerHeight(true);
			}
			var distance = CarouselCore.increment + itemHeight;
			$('.carouselContents', CarouselCore.targetName).animate({'top' : distance + 'px'}, 'fast', function() {
				Carousel.viewLazyLoadItem();
			});
			
			Carousel.viewNav();
		});
		
		$('.carouselNavPrev', CarouselCore.targetName).bind('mouseenter', function(e) {
			Carousel.viewNavOver($('img', this));
		});
		
		$('.carouselNavPrev', CarouselCore.targetName).bind('mouseleave', function(e) {
			Carousel.viewNavOut($('img', this));
		});
		
		$('.carouselNavNext', CarouselCore.targetName).bind('mouseenter', function(e) {
			Carousel.viewNavOver($('img', this));
		});
		
		$('.carouselNavNext', CarouselCore.targetName).bind('mouseleave', function(e) {
			Carousel.viewNavOut($('img', this));
		});
		
		$(window).bind('scroll', function(e) {
			Carousel.viewLazyLoadItem();
		});
		
		$(window).bind('resize', function(e) {
			Carousel.viewLazyLoadItem();
		});
	};
});

jQuery(function($){
	$('.carouselVt .carouselItem img').lazyload({
		placeholder : '/common/images/carousel/hr2-loading.gif',
		effect : 'fadeIn',
		event : 'customScrollEvent'
	});
	
	$('.carouselVt2 .carouselItem img').lazyload({
		placeholder : '/common/images/carousel/vt1-loading.gif',
		effect : 'fadeIn',
		event : 'customScrollEvent'
	});
	
	$('#carouselVt-1').carouselVt();
	/* $('.carouselVt').each(function(i) {
		var targetName = '#carouselVt-' + (i + 1);
		$(targetName).carouselVt();
	}); */
});
