(function() {
    // デバイス状態管理
    deviceState = {orientation: null, size: null};
    
    var OS;
    var Android4OrOver = false; // Android4以上条件
    var iOS7OrOver = false; // iOS7以上条件
    if ("undefined" != typeof document.ontouchstart) {
        if (-1 != navigator.userAgent.indexOf("Android")) {
            OS = "Android";
            if (!navigator.userAgent.match(/Android\s+[1-3]\./)) Android4OrOver = true;
        } else if (-1 != navigator.platform.indexOf("iPhone") || -1 != navigator.platform.indexOf("iPod") || -1 != navigator.platform.indexOf("iPad")) {
            OS = "iOS";
            if (!navigator.userAgent.match(/\s+OS\s+[1-6]_/)) iOS7OrOver = true;
        }
    }
    
    // 地図表示範囲の取得
    deviceState.getSize = function() {
        return (OS) ? {width: window.innerWidth, height: window.innerHeight} : {width: 320, height: 480};
    };
    
    
    
    var timer = null;
    var timerCounter = 0;
    var mapCreate = false;
    
    // デバイス画面サイズ制御
    var orientationChange = function() {
        if (deviceState.orientation === window.orientation) return;
        
        deviceState.orientation = window.orientation;
        
        // htc[Android2.2]端末対策
        // ブラウザズーム（viewportが利かない）を行った際サイズがおかしくなる為、遅延対応（200ms以上が必要）
        // 2012/12/5 delayは500以上でないと、縦幅の取得が不安定（GALAXY Note II SC-02E・GALAXY S III α SC-03E・Xperia VL SOL21等対策）
        if (!timer) timer = setTimeout(delayOrientationChange, (Android4OrOver) ? 500 : 200);
        timerCounter = 0;
    };
    
    var delayOrientationChange = function() {
        timer = null;
        
        var _size = deviceState.getSize();
        
        // 2013/12/9 端末回転時にブラウザがスクロールした状態になってしまう為、強制的に原点位置を(0, 0)に戻す（iOS7対策）
        if (iOS7OrOver) scrollTo(0, 0);
        
        if (!mapCreate) {
            deviceState.size = _size;
            
            if ("undefined" != typeof initMap) initMap({width: deviceState.size.width, height: deviceState.size.height});
            
            mapCreate = true;
        } else {
            // Garaxy Tab/L-04C/MEDIAS対策
            // window.onresizeが、元のサイズの状態で発生することがある為、ループ確認
            if (deviceState.size.width == _size.width && deviceState.size.height == _size.height) {
                timerCounter++;
                
                // 無限ループを避ける為、確認は5回まで
                if (5 >= timerCounter) timer = setTimeout(delayOrientationChange, 500);
            } else {
                deviceState.size = _size;
                
                if ("undefined" != typeof resizeMap) resizeMap({width: deviceState.size.width, height: deviceState.size.height});
            }
        }
    };
    
    
    
    
    
    /* 各種イベント設定 */
    window.addEventListener("load", orientationChange, false);
    
    // 縦横向き制御
    window.addEventListener(("undefined" != typeof window.onorientationchange) ? "orientationchange" : "resize", orientationChange, false);
    
    // Safariで、history.back時にページのonloadが発生しない不具合対策
    window.addEventListener("unload", function(e) {}, false);
})()
