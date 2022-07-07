<?php
/*
 * ランチェスター関連設定
 */

// エラー出力の設定
//error_reporting(E_ALL & ~E_NOTICE);
error_reporting(E_ERROR & ~E_NOTICE & ~E_DEPRECATED & ~E_STRICT); 


// 現在のサーバ環境が、何にあたるか。（test|stg|honban）【重要】
if(!defined('DEFINE_LN_ENVIRONMENT'))
{
    if (getenv('DEFINE_LN_ENVIRONMENT'))
    {
        define('DEFINE_LN_ENVIRONMENT', getenv('DEFINE_LN_ENVIRONMENT'));
    }
    else
    {
        define('DEFINE_LN_ENVIRONMENT', 'test');
    }
}
if(!defined('DEFINE_IS_DEVELOP'))
{
    if (getenv('DEFINE_IS_DEVELOP') == 'true')
    {
        define('DEFINE_IS_DEVELOP', TRUE);
    }
    else
    {
        define('DEFINE_IS_DEVELOP', FALSE);
    }
}

// ライブラリのパス
if(!defined('DEFINE_LN_COMMON_PATH')) define('DEFINE_LN_COMMON_PATH', '/home/lanches/common')  ;

// dev,st用 Basic認証アカウント
define('BASIC_AUTH_ID', 'staruser0001');
//define('BASIC_AUTH_PW', '20frap14!');
define('BASIC_AUTH_PW', 'sbjQ4cfs20sec!');
?>