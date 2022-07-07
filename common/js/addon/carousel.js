/*---------------
carousel
----------------*/
jQuery(function($){
	$.fn.carousel = function(options) {
		if ($(this).size() == 0) return false;
		var self = this;
		var opts = $.extend($.fn.carousel.defaults,options);
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
				var contentsWidth = (this._CarouselCore.itemWidth * this._CarouselCore.itemNum) + 'px';
				$('.carouselContents', this.targetName).css('width', contentsWidth);
				this._CarouselCore.itemDisplayNum = Math.round(this._CarouselCore.wrapperWidth / this._CarouselCore.itemWidth);
				this.viewNav();
				$('.carouselItem img', this.targetName).bind('itemViewEvent', function(e) {
					$(this).trigger('customScrollEvent');
				});
				
				this.viewLazyLoadItem();
			},
			viewLazyLoadItem : function() {
				var displayMinWidth = $(window).scrollLeft();
				var displayMaxWidth = $(window).width() + $(window).scrollLeft();
				var displayMinHeight = $(window).scrollTop();
				var displayMaxHeight = $(window).height() + $(window).scrollTop();
				var itemDisplayMaxWidth = this._CarouselCore.itemDisplayMaxWidth;
				
				$('.carouselItem img', this._CarouselCore.targetName).each(function(i) {
					if (itemDisplayMaxWidth > $(this).offset().left &&
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
			}
		};
		CarouselCore.init();
		Carousel.init(CarouselCore);

		$('.carouselNavPrev', CarouselCore.targetName).bind('click', function(e) {
			CarouselCore.init();
			Carousel.init(CarouselCore);
			CarouselCore.slidePrev();
		});
		
		$('.carouselNavNext', CarouselCore.targetName).bind('click', function(e) {
			CarouselCore.init();
			Carousel.init(CarouselCore);
			CarouselCore.slideNext();
		});
		
		$('.carouselContents', CarouselCore.targetName).bind('navChange', function(e) {
			var distance = CarouselCore.increment + CarouselCore.itemWidth;
			$('.carouselContents', CarouselCore.targetName).animate({'left' : distance + 'px'}, 'fast', function() {
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
	$('.carouselHr1 .carouselItem img').lazyload({
		placeholder : '/common/images/carousel/hr1-loading.gif',
		effect : 'fadeIn',
		event : 'customScrollEvent'
	});
	
	$('.carouselHr2 .carouselItem img').lazyload({
		placeholder : '/common/images/carousel/hr2-loading.gif',
		effect : 'fadeIn',
		event : 'customScrollEvent'
	});
	
	$('.carouselHr1').each(function(i) {
		var carouselId = 'carouselHr1-' + (i + 1);
		$(this).attr('id', carouselId);
		var targetName = '#' + carouselId;
		$(targetName).carousel();
	});
	/* $('.carouselHr1').each(function(i) {
		var targetName = '#carouselHr1-' + (i + 1);
		$(targetName).carousel();
	}); */
	
	$('.carouselHr2').each(function(i) {
		var carouselId = 'carouselHr2-' + (i + 1);
		$(this).attr('id', carouselId);
		var targetName = '#' + carouselId;
		$(targetName).carousel();
	});
	/* $('.carouselHr2').each(function(i) {
		var targetName = '#carouselHr2-' + (i + 1);
		$(targetName).carousel();
	}); */
});
