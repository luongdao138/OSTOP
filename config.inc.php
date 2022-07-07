<?php

define('_SB_DIR_DOCROOT_',$_SERVER['DOCUMENT_ROOT']);
define('_SB_DIR_INCLUDE_',_SB_DIR_DOCROOT_."/sb-include");
define('_SB_INCLUDE_DIR_',$_SERVER['DOCUMENT_ROOT']."/sb_include");
define('_BASE_META_KEYWORD_', "スターバックス,スタバ,コーヒー,starbucks,coffee");

// 環境変数取得用コンフィグ
// 動的ページでは別途読み込んでいる
include_once($_SERVER['DOCUMENT_ROOT']."/ln_config.inc.php");

// 各環境で疎通出来るように環境によってドメインを切り替えます（test|stg|honban|local）【重要】 ※Mobile配下は、/mobile/common/inc/judge.php に記載
if(DEFINE_LN_ENVIRONMENT == "test" || DEFINE_LN_ENVIRONMENT == "stg" || DEFINE_LN_ENVIRONMENT == 'local'){
	//検証・ステージング
	if(DEFINE_IS_DEVELOP){// dev2/st2
		define('_SB_DOMAIN_WWW_','dev2.starbucks.co.jp');
	}else{// dev/st
		define('_SB_DOMAIN_WWW_','dev.starbucks.co.jp');
	}
	define('_SB_DOMAIN_STORE_','store2.starbucks.co.jp');
	//define('_SB_DOMAIN_PRODUCT_','product2.starbucks.co.jp');
	define('_SB_DOMAIN_PRODUCT_', _SB_DOMAIN_WWW_);
	define('_SB_DOMAIN_CARD_','card2.starbucks.co.jp');
	define('_SB_DOMAIN_CART_','cart2.starbucks.co.jp');
	define('_SB_DOMAIN_GIFT_','gift-test.starbucks.co.jp');
	define('_SB_DOMAIN_API_','api2.starbucks.co.jp');
	define('_SB_DOMAIN_LOGIN_','login2.starbucks.co.jp');
	define('_SB_DOMAIN_ENQ_','enq2.starbucks.co.jp');
	define('_SB_DOMAIN_SBGC_','sbgc2.starbucks.co.jp');
}else{
	// 本番
	if(DEFINE_IS_DEVELOP){// www2
		define('_SB_DOMAIN_WWW_','www2.starbucks.co.jp');
		define('_SB_DOMAIN_STORE_','store2.starbucks.co.jp');
		define('_SB_DOMAIN_PRODUCT_','product2.starbucks.co.jp');
		define('_SB_DOMAIN_CARD_','card2.starbucks.co.jp');
		define('_SB_DOMAIN_CART_','cart2.starbucks.co.jp');
		define('_SB_DOMAIN_GIFT_','gift-test.starbucks.co.jp');
		define('_SB_DOMAIN_API_','api2.starbucks.co.jp');
		define('_SB_DOMAIN_LOGIN_','login2.starbucks.co.jp');
		define('_SB_DOMAIN_ENQ_','enq2.starbucks.co.jp');
		define('_SB_DOMAIN_SBGC_','sbgc2.starbucks.co.jp');
	}else{// www
		define('_SB_DOMAIN_WWW_','www.starbucks.co.jp');
		define('_SB_DOMAIN_STORE_','store.starbucks.co.jp');
		define('_SB_DOMAIN_PRODUCT_','product.starbucks.co.jp');
		define('_SB_DOMAIN_CARD_','card.starbucks.co.jp');
		define('_SB_DOMAIN_CART_','cart.starbucks.co.jp');
		define('_SB_DOMAIN_GIFT_','gift.starbucks.co.jp');
		define('_SB_DOMAIN_API_','api.starbucks.co.jp');
		define('_SB_DOMAIN_LOGIN_','login.starbucks.co.jp');
		define('_SB_DOMAIN_ENQ_','enq.starbucks.co.jp');
		define('_SB_DOMAIN_SBGC_','sbgc.starbucks.co.jp');
	}
}

if(DEFINE_LN_ENVIRONMENT == "test" || DEFINE_LN_ENVIRONMENT == "stg"){
	//検証・ステージング
	if(DEFINE_IS_DEVELOP){// dev2/st2
		define('_AWS_DOMAIN_S3_','//sbj-brs-stg2.s3.amazonaws.com');
		define('_AWS_DOMAIN_CF_','//d2fzkgg97cd93o.cloudfront.net');
	}else{// dev/st
		define('_AWS_DOMAIN_S3_','//sbcj2.s3.amazonaws.com');
		define('_AWS_DOMAIN_CF_','//dqpw8dh9f7d3f.cloudfront.net');
	}
}elseif(DEFINE_LN_ENVIRONMENT == 'local'){
	// ベンダー開発環境
	define('_AWS_DOMAIN_S3_','');
	define('_AWS_DOMAIN_CF_','');
}else{
	// 本番
	if(DEFINE_IS_DEVELOP){// www2
		define('_AWS_DOMAIN_S3_','//sbj-brs-stg1.s3.amazonaws.com');
		define('_AWS_DOMAIN_CF_','//d3hjbu6zcoe45r.cloudfront.net');
	}else{// www
		define('_AWS_DOMAIN_S3_','//sbcj.s3.amazonaws.com');
		define('_AWS_DOMAIN_CF_','//d3vgbguy0yofad.cloudfront.net');
	}
}

// 2016/10/20 ISSUE-977 発行済みCookie「Apache」の消込対応
// ローカルIPがCOOKIEに保存されてしまっているため、COOKIEを削除する
// 保持期間3年なので、2019/10/21 以降であればこの処理は削除してよい
setcookie('Apache', '', time() - 1800, '/');

// 特定のURL ※Mobile配下は、/mobile/common/inc/judge.php に記載
define('_SB_URL_LOGIN_','/mystarbucks/login/');

// 関数読込
	include_once($_SERVER['DOCUMENT_ROOT']."/common/php/function.inc.php");


if(!defined('WARNING_STAR_EXPIRE')) define('WARNING_STAR_EXPIRE', 7); //{n} days
if(!defined('WARNING_TYPE_EXPIRE')) define('WARNING_TYPE_EXPIRE', 30); //{n} days

//セミナー関連
define('_SEMINAR_CONTENTS_AMU_', 9);


//LWA
if(DEFINE_LN_ENVIRONMENT == "test" || DEFINE_LN_ENVIRONMENT == "stg"){
	//検証・ステージング
	if(DEFINE_IS_DEVELOP){// dev2/st2
		define('_SB_DOMAIN_LWA_','https://webapp-itg.starbucks.co.jp');
	}else{// dev/st
		define('_SB_DOMAIN_LWA_','https://webapp.starbucks.co.jp');
	}
}elseif(DEFINE_LN_ENVIRONMENT == 'local'){
	// ベンダー開発環境
	define('_SB_DOMAIN_LWA_','https://webapp-itg.starbucks.co.jp');
}else{
	// 本番
	if(DEFINE_IS_DEVELOP){// www2
		define('_SB_DOMAIN_LWA_','https://webapp-itg.starbucks.co.jp');
	}else{// www
		define('_SB_DOMAIN_LWA_','https://webapp.starbucks.co.jp');
	}
}
