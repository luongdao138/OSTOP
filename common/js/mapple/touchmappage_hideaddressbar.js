(function() {
    // デバイス状態管理
    deviceState = {orientation: null, size: null};
    
    var OS;
    var Android4OrOver = false; // Android4以上条件
    if ("undefined" != typeof document.ontouchstart) {
        if (-1 != navigator.userAgent.indexOf("Android")) {
            OS = "Android";
            if (!navigator.userAgent.match(/Android\s+[1-3]\./)) Android4OrOver = true;
        } else if (-1 != navigator.platform.indexOf("iPhone") || -1 != navigator.platform.indexOf("iPod") || -1 != navigator.platform.indexOf("iPad")) {
            OS = "iOS";
        }
    }
    
    // 地図表示範囲の取得
    deviceState.getSize = function() {
        return (OS) ? {width: window.innerWidth, height: window.innerHeight + scrollTarget} : {width: 320, height: 480};
    };
    
    
    
    var timer = null;
    var mapCreate = false;
    var scrollTarget = (OS) ? 1 : 0;
    var tempHeightElement = null;
    var noTouch = null;
    var updating = false;
    var delayScrollCount = 0;
    
    // アドレスバー非表示制御
    var orientationChange = function() {
        if (deviceState.orientation === window.orientation) return;
        
        deviceState.orientation = window.orientation;
        
        if (!updating) {
            document.addEventListener("touchstart", touchCancel, false);
            document.addEventListener("touchmove", touchCancel, false);
            updating = true;
        }
        
        // ページのサイズが画面サイズ以上でないとinnerHeightでブラウザ画面サイズが正常に取れない為、
        // ページ縦幅を強制的に十分な高さ（1280px）に設定
        document.body.style.height = "1280px";
        
        setTimeout(function() {
            // Android3.0で、window.onscrollが正常に発生しない為、timer監視を実装
            // iPhone3Gで、十分な遅延をさせないとscrollToが発生しない場合がある為、timer監視を実装
            if (!timer) timer = setTimeout(delayScroll, 500);
            
            if ("Android" == OS) {
                if (scrollTarget == window.pageYOffset) scrollTo(0, 0);
                setTimeout(function() {scrollTo(0, scrollTarget);}, 100);
            } else {
                scrollTo(0, scrollTarget);
                scrollCheck();
            }
        }, 100);
    }
    
    var delayScroll = function() {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        
        if (Android4OrOver && !mapCreate) {
            // 2012/12/5 GALAXY TAB 7.7 Plus・Nexus7等でscrollTo(0, 1)が機能しない為、
            // Android4以上を対象に複数回トライしてスクロールしない場合は、scrollTargetを"0"に設定（初回のみ）
            if (2 <= delayScrollCount) scrollTarget = 0;
            delayScrollCount++;
        }
        
        if (scrollTarget != window.pageYOffset) {
            // Mediasで、十分な遅延をさせないと再読み込み時にscrollToが機能しない為対応
            scrollTo(0, scrollTarget);
            
            timer = setTimeout(delayScroll, 500);
        } else {
            scrollCheck();
        }
    }
    
    var scrollCheck = function() {
        if (scrollTarget != window.pageYOffset) {
            // XPREIAバグ対策（初期に一旦非表示されたアドレスバーがページ読み込み完了後に再度表示されることがある）
            if (noTouch) {
                noTouch();
                delayScroll();
            }
            return;
        }
        
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        
        var delay = 0;
        if ("Android" == OS) {
            // XPREIAバグ対策（初期にinnerHeightが正常に取得出来ない）
            // ・十分な縦幅を持ったdocumentの子要素を一時的に追加することで回避
            if (!tempHeightElement) {
                tempHeightElement = document.createElement("div");
                tempHeightElement.style.height = "100%";
                document.body.appendChild(tempHeightElement);
            }
            
            // delayは200以上でないと、縦幅の取得が不安定（XPREIA対策）
            // 2012/12/5 delayは500以上でないと、縦幅の取得が不安定（GALAXY Note II SC-02E・GALAXY S III α SC-03E・Xperia VL SOL21等対策）
            delay = (Android4OrOver) ? 500 : 200;
        }
        
        setTimeout(function() {
            if (!mapCreate) {
                deviceState.size = deviceState.getSize();
                
                if ("undefined" != typeof initMap) initMap({width: deviceState.size.width, height: deviceState.size.height});
                
                mapCreate = true;
                
                if ("Android" == OS) {
                    noTouch = function() {
                        document.removeEventListener("touchstart", noTouch, false);
                        noTouch = null;
                    }
                    document.addEventListener("touchstart", noTouch, false);
                }
            } else {
                var _size = deviceState.getSize();
                
                if (deviceState.size.width == _size.width && deviceState.size.height == _size.height) return;
                
                deviceState.size = _size;
                
                if ("undefined" != typeof resizeMap) resizeMap({width: deviceState.size.width, height: deviceState.size.height});
            }
            
            document.body.style.height = deviceState.size.height + "px";
            
            if (tempHeightElement) {
                document.body.removeChild(tempHeightElement);
                tempHeightElement = null;
            }
            
            if (updating) {
                document.removeEventListener("touchstart", touchCancel, false);
                document.removeEventListener("touchmove", touchCancel, false);
                updating = false;
            }
        }, delay);
    };
    
    var touchCancel = function(e) {
        e.preventDefault();
        e.stopPropagation();
    };
    
    
    
    
    
    /* 各種イベント設定 */
    window.addEventListener("load", orientationChange, false);
    
    // 縦横向き制御
    window.addEventListener(("undefined" != typeof window.onorientationchange) ? "orientationchange" : "resize", orientationChange, false);
    
    // 縦横向き制御の状態監視
    window.addEventListener("scroll", scrollCheck, false);
    
    // Safariで、history.back時にページのonloadが発生しない不具合対策
    window.addEventListener("unload", function(e) {}, false);
    
    
    
    deviceState.initScroll = function() {
        deviceState.orientation = null;
        orientationChange();
    };
})()
