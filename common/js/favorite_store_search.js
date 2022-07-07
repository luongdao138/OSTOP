//var storeSearchApiUrl = "/api/getData.php";
//var storeSearchApiUrl = "https://pbip8wtfe6.execute-api.ap-northeast-1.amazonaws.com/v1/storesearch"; // 新API
var storeSearchApiUrl = "https://hn8madehag.execute-api.ap-northeast-1.amazonaws.com/prd-2019-08-21/storesearch"; // 新API
var storeSearchType = ''; // 新API
var storeSearchDataType = 'prd';
var storePrefSearchPrefNameDefault = '都道府県で絞り込む'; // 新API
var storeSearchPrefNameDefault = '都道府県を選択'; // 新API
var optionSearchPref;
var permitInputNum;
var param;
var apiKey;
var nearLandmarkDistance = 10;
var nearLandmarkSearchResult = 0;
var landmarkSearchWord = '';
var functionReturn_ERROR = -1;
var _storeDetailPageUrl = {
//	'head' : 'https://store.sbj.d.netyear.net/detail-',
	'head' : 'https://store.starbucks.co.jp/detail-',
	'foot' : '/'
};
var optionPrefs = {};

$(function()
{
    apiKey = $('#apiKey').val();
    // 初期表示調整
    if ($('#favoriteStore1').val() == '')
    {
        $('#deleteStoreName1').hide();
    }
    else
    {
        $('#selectStoreName1').hide();
    }
    if ($('#favoriteStore2').val() == '')
    {
        $('#deleteStoreName2').hide();
    }
    else
    {
        $('#selectStoreName2').hide();
    }
    if ($('#favoriteStore3').val() == '')
    {
        $('#deleteStoreName3').hide();
    }
    else
    {
        $('#selectStoreName3').hide();
    }

    // 削除ボタン
    $('#deleteStoreName1').on("click", function(){
        deleteFavoriteStore(1);
    });
    $('#deleteStoreName2').on("click", function(){
        deleteFavoriteStore(2);
    });
    $('#deleteStoreName3').on("click", function(){
        deleteFavoriteStore(3);
    });

    // もっと見るボタン
    $('#searchButtonMore').on("click", function(){
        var page = parseInt($("#favoriteStoreSearchPage").val(), 10);
        var nextPage = page + 1;
        var start = page * 10 - 1;
        var end = nextPage * 10 - 1;
        var searchMorePref = $('#searchMorePref').val();

        if (searchMorePref == '')
        {
            start = page * 10 - 1;
            $("#moreButtonContainer").hide();
            for (var i=start; i<=end; i++)
            {
                if ($('#store_num_'+i).attr('id') === undefined)
                {
                    break;
                }
                $('#store_num_'+i).show();
            }

            if ((page+1) * 10 ==  i &&
                $('#store_num_'+i).attr('id') === undefined ) {
                if (storeSearchType == 'landmark') {
                    searchLandmark((page+1)/10, i);
                } else if (storeSearchType == 'keyword') {
                    var searchWord = $("#wordSearch").val();
                    searchFreeText(searchWord, $($(".optionSearchPref").find('option:selected')[0]).attr('value'), $($(".optionSearchPref").find('option:selected')[0]).text(), (page+1)/10, i);
                } else if (storeSearchType == 'pref') {
                    searchFromPref((page+1)/10, i, $("#searchPref option:selected").text().trim());
                }
            }

            if ($('#store_num_'+i).attr('id') !== undefined)
            {
                $("#moreButtonContainer").show();
            }
            $("#favoriteStoreSearchPage").val(nextPage);
        }
        else
        {
            $("#moreButtonContainer").hide();
            var n = 0;
            for (var i=1; n<=end; i++)
            {
                if ($('#store_num_'+i).attr('id') === undefined)
                {
                    break;
                }
                if ($(".optionSearchPref").val() == $('#store_num_'+i).data('prefcode'))
                {
                    if (n > start)
                    {
                        $('#store_num_'+i).show();
                    }
                    n++;
                }
            }
            if ($('#store_num_'+i).attr('id') !== undefined)
            {
                $("#moreButtonContainer").show();
            }
            $("#favoriteStoreSearchPage").val(nextPage);
        }
    });

    // オーバーレイ開始
    $('.js-overlaySotreModalTrigger').on("click", function() {

        nearLandmarkSearchResult = 0;

        // 何個目のお気に入り店舗か保持
        $("#selectFavoriteId").val($(this).attr("id"));
        // あと何個登録できるか表示
        permitInputNum = 3;
        // 絞り込み検索のもっと見る時に使用する
        $('#searchMorePref').val('');
        if ($('#favoriteStore1').val() != '')
        {
            permitInputNum--;
        }
        if ($('#favoriteStore2').val() != '')
        {
            permitInputNum--;
        }
        if ($('#favoriteStore3').val() != '')
        {
            permitInputNum--;
        }
        $('#permitInputNum').html('あと'+permitInputNum+'店舗、登録可能です。');

        // 他でクリック毎にイベントを消されているため表示毎に設定 全件検索は許可する
        // 住所・キーワード検索
        $("#favoriteStoreSrarchText").on("click", function(){
            storeSearchType = 'keyword';
            var searchWord = $("#wordSearch").val();
            searchWord = $.trim(searchWord);
            optionPrefs = {};

            $('.optionSearchPref option').prop('selected', false);
            $('.optionSearchPref option[value=""]').prop('selected', true);

            // 上部、下部セレクトボックスの動作設定
            $(".optionSearchPref").unbind('change');
            $(".optionSearchPref").bind('change', function(){
				var selected_value = $(this).val();
//				var selected_pref_name = $(this).find('option[value="' + selected_value + '"]').text();
                $.each($(".optionSearchPref"), function(k,v){
					$(v).val(selected_value);
				});
	            var searchWord = $("#wordSearch").val();
	            searchWord = $.trim(searchWord);
//                $(".optionSearchPref").prev().remove();
//                $(".optionSearchPref").before('<span class="js-label">' + selected_pref_name + '</span>');
				searchFreeText(searchWord, $(this).val(), $(this).find('option:selected').text(),0 ,0);

            });

            searchFreeText(searchWord, '', '', 0, 0);

        });

        // 都道府県検索
        $("#favoriteStoreSrarchPref").on("click", function(){
            storeSearchType = 'pref';
            var searchPref = $("#searchPref").val();
            var selectedPrefName = storeSearchPrefNameDefault;

            // 上部、下部セレクトボックス作成
            $(".optionSearchPref").each(function(){
                optionSearchPref = $(this);
                optionSearchPref.children().remove();
                if (optionSearchPref.find('option[value=""]').length < 1) {
                    optionSearchPref.append("<option value=''>" + storeSearchPrefNameDefault + "</option>");
                }
                $("#searchPref option").each(function(){
                    if ($(this).val() != '') {
	                    if (searchPref == $(this).val())
	                    {
	                        selectedPrefName = $(this).text();
	                        optionSearchPref.append("<option value='"+$(this).val()+"' selected>"+$(this).text()+"</option>");
	                    }
	                    else if($(this).val())
	                    {
	                        optionSearchPref.append("<option value='"+$(this).val()+"'>"+$(this).text()+"</option>");
	                    }
                    }
                });
                optionSearchPref.prev().remove();
                optionSearchPref.before('<span class="js-label">'+selectedPrefName+'</span>');
            });

            // 上部、下部セレクトボックスの動作設定
            $(".optionSearchPref").unbind('change');
            $(".optionSearchPref").bind('change', function(){
                optionSearchPref = $(this);
                optionSearchPref.children('option').each(function(){
                    if (optionSearchPref.val() == $(this).val())
                    {
                        optionSearchPrefName = $(this).text();
                        return false;
                    }
                });
                $(".optionSearchPref").each(function(){
                    $(this).val(optionSearchPref.val());
                    $(this).prev().remove();
                    $(this).before('<span class="js-label">'+optionSearchPrefName+'</span>');
                });

                $("#resultLists").html('<li class="loading"><p>検索中</p></li>');
                $("#searchRresultText").html('');
                $("#moreButtonContainer").hide();
                searchFromPref(0, 0, optionSearchPrefName);
            });

            searchFromPref(0, 0, $("#searchPref option:selected").text().trim());

        });

        // ランドマーク検索
        $("#favoriteStoreSrarchLandmark").on("click", function(){
            storeSearchType = 'landmark';
            landmarkSearchWord = $("#landmarkSearch").val();
            landmarkSearchWord = $.trim(landmarkSearchWord);
            optionPrefs = {};
            $(".prefRefineArea").hide();
            searchLandmark(0, 0);

            // 上部、下部セレクトボックスの動作設定
            $(".optionSearchPref").unbind('change');
            $(".optionSearchPref").bind('change', function(){
                optionSearchPref = $(this);
                var landmark = $("#landmarkSearch").val();
                landmark = $.trim(landmark);
                $("#favoriteStoreSearchPage").val(1);
                optionSearchPref.children('option').each(function(){
                    if (optionSearchPref.val() == $(this).val())
                    {
                        optionSearchPrefName = $(this).text();
                        return false;
                    }
                });
                $(".optionSearchPref").each(function(){
                    $(this).val(optionSearchPref.val());
                    $(this).prev().remove();
                    $(this).before('<span class="js-label">'+optionSearchPrefName+'</span>');
                });
                // 既に検索は終わっているため、表示の切り分けだけ行う
                $("#moreButtonContainer").hide();
                var i = 0;
                $("#resultLists").children().each(function(){
                    $(this).hide();
                    if (optionSearchPref.val() != '')
                    {
                        if (optionSearchPref.val() == $(this).data('prefcode'))
                        {
                            // 初期表示10件
                            if (i < 10)
                            {
                                $(this).show();
                            }
                            // 11件以上ある場合はもっと見る表示
                            else
                            {
                                $("#moreButtonContainer").show();
                            }
                            i++;
                        }
                    }
                    else
                    {
                        // 初期表示10件
                        if (i < 10)
                        {
                            $(this).show();
                        }
                        // 11件以上ある場合はもっと見る表示
                        else
                        {
                            $("#moreButtonContainer").show();
                        }
                        i++;
                    }
                });
                $('#searchMorePref').val(optionSearchPref.val());
                // 検索結果テキスト表示
                if (searchWord != '')
                {
                    if (optionSearchPref.val() != '')
                    {
                        $("#searchRresultText").text('店舗検索：'+searchWord+' '+optionSearchPrefName+'で検索した結果（'+i+' 件）');
                    }
                    else
                    {
                        $("#searchRresultText").text('店舗検索：'+searchWord+'で検索した結果（'+i+' 件）');
                    }
                }
                else
                {
                     $("#searchRresultText").text('店舗検索：検索した結果（'+i+' 件）');
                }
            });
        });
    });
});

$('html').addClass('modalContainerScroll');

function searchFromPref(num, store_num, search_pref_name) 
{
    if (store_num < 100 && store_num > 0) {return;}
    param = "q=(and ver:10000 record_type:1 " + get_open_date_api_condition() + ")&fq=(and data_type:'" + storeSearchDataType + "' "; // 新API
    if (search_pref_name != storeSearchPrefNameDefault && search_pref_name != storeSearchPrefNameDefault){
        param += "address_1:'" + search_pref_name + "'";
    }
    param += ")&sort=zip_code asc,store_id asc&size=1000&q.parser=structured"; // 新API
	if (num > 0) {
        param += "&start=" + (num * 100); // 新API
    }

	if (num < 1) {
	    $(".prefRefineArea").hide();
	    $("#resultLists").html('<li class="loading"><p>検索中</p></li>');
	    $("#searchRresultText").html('');
	}
    $.getJSON(storeSearchApiUrl+"?"+param, function(stores){
		if (num < 1) {
	        $("#resultLists").html('');
	        $("#favoriteStoreSearchPage").val(1);
	        $(".prefRefineArea").show();
		}
        $("#moreButtonContainer").hide();
        var displayTarget = 0;
        for (var i in stores.hits.hit)
        {
            displayTarget = (parseInt(i) + parseInt(num) * 100);
            if (stores.hits.hit[i].fields === undefined || stores.hits.hit[i].fields.store_id === undefined)
            {
                break;
            }
            
            outputStore(stores.hits.hit[i], displayTarget, searchPref);
            // 初期表示10件
            if (displayTarget < 10)
            {
                $('#store_num_' + displayTarget).show();
            }
            // 11件以上ある場合はもっと見る表示
            else
            {
                $("#moreButtonContainer").show();
            }
            if (displayTarget > 100)
            {
                $("#moreButtonContainer").show();
            }
        }
        // 検索結果テキスト表示
        $("#searchRresultText").text('店舗検索：' + search_pref_name + 'で検索した結果（' + stores.hits.found + ' 件）');
		if (num < 1) {
            $j1111.colorbox.resize();
		}
    });

}

function searchFreeText(searchWord, pref, prefName, num, store_num) 
{

    if (store_num < 100 && store_num > 0) {return;}

    if (pref != '')
    {
        param = "q=(and ";
        param += "pref_code:" + pref + " '";
    } else {
        param = "q=(and '";
    }
    if (searchWord)
    {
        searchWord = searchWord.match(/[^\s　]+/g).join("' '");
        param += encodeURIComponent(searchWord);
    }
    param += "' ver:10000 record_type:1 " + get_open_date_api_condition() + ")&fq=(and data_type:'" + storeSearchDataType + "')&sort=zip_code asc,store_id asc&size=1000&q.parser=structured";

	if (num > 0) {
        param += "&start=" + (num * 100); // 新API
    }

	if (num < 1) {
        $(".prefRefineArea").hide();
        $("#resultLists").html('<li class="loading"><p>検索中</p></li>');
        $("#searchRresultText").html('');
    }

    $.getJSON(storeSearchApiUrl+"?"+param, function(stores){
		if (num < 1) {
	        $("#resultLists").html('');
	        $("#favoriteStoreSearchPage").val(1);
	        $(".prefRefineArea").show();
        }
        $("#moreButtonContainer").hide();
        var displayTarget = 0;
        for (var i in stores.hits.hit)
        {
            displayTarget = (parseInt(i) + parseInt(num) * 100);
            if (stores.hits.hit[i].fields === undefined || stores.hits.hit[i].fields.store_id === undefined)
            {
                break;
            }
            outputStore(stores.hits.hit[i], displayTarget, '');
            // 初期表示10件
            if (displayTarget < 10)
            {
                $('#store_num_'+displayTarget).show();
            }
            // 11件以上ある場合はもっと見る表示
            else
            {
                $("#moreButtonContainer").show();
            }
            if (displayTarget > 100)
            {
                $("#moreButtonContainer").show();
            }
        }

        // 検索結果テキスト表示
        if (pref == '') {
            $("#searchRresultText").text('店舗検索：'+searchWord+'で検索した結果（'+stores.hits.found+' 件）');
        } else {
            $("#searchRresultText").text('店舗検索：'+searchWord+' '+prefName+'で検索した結果（'+stores.hits.found+' 件）');
        }

        param = "/facet?q=(and '";
        if (searchWord)
        {
            param += encodeURIComponent(searchWord);
        }
        param += "' ver:10000 record_type:1 " + get_open_date_api_condition() + ")&fq=(and data_type:'" + storeSearchDataType + "')&sort=zip_code asc,store_id asc&size=100&q.parser=structured";
        $.getJSON(storeSearchApiUrl + param, function(pref){
            $.each(pref.facets.pref_code.buckets, function(k, v){
                optionPrefs[k] = v;
            });
            $(".optionSearchPref").each(function(){
                optionSearchPref = $(this);
                optionSearchPref.children().hide();
                if ($('.optionSearchPref option[value=""]').length < 1) {
                    $(optionSearchPref).prepend('<option class="_option_default" value="" selected="selected">' + storeSearchPrefNameDefault + '</option>');
                }

				var selected_value = $(".optionSearchPref").val();
				var selected_pref_name = $($('.optionSearchPref option[value="' + selected_value + '"]')[0]).text();

                if (selected_value != "") {
                    $(optionSearchPref).prev().remove();
                    $(optionSearchPref).before('<span class="js-label">' + selected_pref_name + '</span>');
                } else {
                    $(optionSearchPref).prev().remove();
                    $(optionSearchPref).before('<span class="js-label">' + storeSearchPrefNameDefault + '</span>');
                }

                $('option._option_default').show();
                $.each(optionPrefs, function(key, val) {
                    optionSearchPref.find('option[value=' + val.value + ']').show();
                });
            });

        });
	        // 上部、下部セレクトボックス作成
	        // 都道府県配列のソート
				//                optionPrefs = objectSort(optionPrefs);

				//        // 検索結果テキスト表示
				//        if (searchWord != '')
				//        {
				//            $("#searchRresultText").text('店舗検索：'+searchWord+'で検索した結果（'+stores.hits.found+' 件）');
				//        }
				//        else
				//        {
				//             $("#searchRresultText").text('店舗検索：検索した結果（'+stores.hits.found+' 件）');
				//        }

		if (num < 1) {
	        $j1111.colorbox.resize();
	    }
    });
}

function searchLandmark(num, store_num) 
{
    if (store_num < 100 && store_num > 0) {return;}

    // APIをコールして結果表示
    param = "q=(and '"; // 新API
    if (landmarkSearchWord)
    {
        param += landmarkSearchWord;
    }
    param += "' ver:10000 record_type:2 (not cz_genre_cd:'533@'))&fq=(and data_type:'default')&sort=landmark_master_id asc,name asc&size=100&q.parser=structured"; // 新API
	if (num > 0) {
        param += "&start=" + (num * 100); // 新API
    }
	if (num < 1) {
	    $("#resultLists").html('<li class="loading"><p>検索中</p></li>');
	    $("#searchRresultText").html('');
	}
    $.getJSON(storeSearchApiUrl+"?"+param, function(landmarks){
        // ランドマーク検索結果が一軒の場合は通常の店舗検索へ
        if (num < 1 && landmarks.hits.found == 1)
        {
            displayShopByLandmark(landmarks.hits.hit[0].fields.location_jp, landmarks.hits.hit[0].fields.name);
        }
        else
        {
			if (num < 1) {
	            $("#resultLists").html('');
	            $("#favoriteStoreSearchPage").val(1);
	            $("#moreButtonContainer").hide();
			}
            for (var i in landmarks.hits.hit)
            {
	            displayTarget = (parseInt(i) + parseInt(num) * 100);

                if (landmarks.hits.hit[i].fields === undefined || landmarks.hits.hit[i].fields.cz_genre_cd === undefined)
                {
                    break;
                }
                outputlandmarks(landmarks.hits.hit[i], (parseInt(i) + parseInt(num) * 100));
				if (num < 1) {
	                // 初期表示10件
	                if (i < 10)
	                {
	                    $('#store_num_'+i).show();
	                }
	                // 11件以上ある場合はもっと見る表示
	                else
	                {
	                    $("#moreButtonContainer").show();
	                }
				} else if (i > 9){
                    $("#moreButtonContainer").show();
				}

	            if (displayTarget > 100)
	            {
	                $("#moreButtonContainer").show();
	            }

            }

			if (num < 1) {
	            // 検索結果テキスト表示
	            $("#searchRresultText").text('店舗検索：'+landmarkSearchWord+'を含む最寄駅／ランドマーク検索結果（'+landmarks.hits.found+' 件）');
	            nearLandmarkSearchResult = landmarks.hits.found;
			}
        }
		if (num < 1) {
	        $j1111.colorbox.resize();
        }
    });
}

function get_open_date_api_condition()
{
  return "";
  var now = new Date();
  var year = now.getUTCFullYear();
  var month = ("0" + (now.getUTCMonth() + 1)).slice(-2);
  var day = ("0" + now.getUTCDate() ).slice(-2);
  var hour = ("0" + now.getUTCHours() ).slice(-2);
  var minute = ("0" + now.getUTCMinutes()).slice(-2);
  return "open_date_utc:['1900-01-01T00:00:00Z','"+year+"-"+month+"-"+day+"T"+hour+":"+minute+":00Z']";
}

function is_near_landmark(location_jp, store)
{
    if(!store || !store["fields"] || !store["fields"]["location_jp"] || !location_jp) return functionReturn_ERROR;

    var landmark_x = Number(location_jp.split(",")[1]);
    var landmark_y = Number(location_jp.split(",")[0]);
    var store_x = Number(store["fields"]["location_jp"].split(",")[1]);
    var store_y = Number(store["fields"]["location_jp"].split(",")[0]);

    if(isNaN(landmark_x) || isNaN(landmark_y) || isNaN(store_x) || isNaN(store_y)) return functionReturn_ERROR;

    landmark_x *= Math.PI / 180;
    landmark_y *= Math.PI / 180;
    store_x *= Math.PI / 180;
    store_y *= Math.PI / 180;
    distance = 6371 * Math.acos(Math.cos(landmark_y) * Math.cos(store_y) * Math.cos(store_x - landmark_x) + Math.sin(landmark_y) * Math.sin(store_y));

    if(distance < nearLandmarkDistance) return true;
    return false;

}

// ランドマークでの店舗検索及び結果表示
function displayShopByLandmark(location_jp, landmarkName)
{

    $("#resultLists").html('');
    $("#favoriteStoreSearchPage").val(1);
    $("#moreButtonContainer").hide();
    var optionPrefs = {};

    // APIをコールして結果表示
    $(".prefRefineArea").hide();
    $("#resultLists").html('<li class="loading"><p>検索中</p></li>');
    $("#searchRresultText").html('');

    param = "fq=(and data_type:'" + storeSearchDataType + "')&q=(and ver:10000 record_type:1)&expr.distance=haversin("; // 新API
    param += location_jp;
    param += ",location_jp.latitude,location_jp.longitude)&sort=distance asc&size=100&q.parser=structured"; // 新API

    $.getJSON(storeSearchApiUrl+"?"+param, function(stores){
        $("#resultLists").html('');
        $("#favoriteStoreSearchPage").val(1);
        $("#moreButtonContainer").hide();
        var hit_store_count = 0;
        for (var i in stores.hits.hit)
        {
            if (stores.hits.hit[i].fields === undefined || stores.hits.hit[i].fields.store_id === undefined)
            {
                break;
            }

            if (!is_near_landmark(location_jp, stores.hits.hit[i]))
            {
                break;
            }

            hit_store_count++;
            outputStore(stores.hits.hit[i], i, '');
            // 初期表示10件
            if (i < 10)
            {
                $('#store_num_'+i).show();
            }
            // 11件以上ある場合はもっと見る表示
            else
            {
                $("#moreButtonContainer").show();
            }
            // 上部、下部セレクトボックス作成用
            optionPrefs[stores.hits.hit[i].fields.pref_code] = stores.hits.hit[i].fields.address_1;
        }

        // 検索結果テキスト表示
        $("#searchRresultText").text('店舗検索：'+landmarkName+'で検索した結果（'+hit_store_count+' 件）');

        // 上部、下部セレクトボックス作成
        // 都道府県配列のソート
        optionPrefs = objectSort(optionPrefs);

        $(".optionSearchPref").each(function(){
            optionSearchPref = $(this);
            optionSearchPref.children().remove();
            if (optionSearchPref.find('option[value=""]').length < 1) {
                optionSearchPref.append("<option value=''>" + storeSearchPrefNameDefault + "</option>");
            }
            $.each(optionPrefs, function(key, val) {
                optionSearchPref.append("<option value='"+key+"'>"+val+"</option>");
            });
            optionSearchPref.prev().remove();
            optionSearchPref.before('<span class="js-label">' + storeSearchPrefNameDefault + '</span>');
        });

        // 検索結果テキスト表示
        if (landmarkName != '')
        {
            $("#searchRresultText").text('店舗検索：'+landmarkName+'で検索した結果（'+hit_store_count+' 件）');
        }
        else
        {
             $("#searchRresultText").text('店舗検索：検索した結果（'+hit_store_count+' 件）');
        }
        $j1111.colorbox.resize();
    });

}
//ランドマークに紐づく店舗を検索


// ランドマークでの店舗検索及び結果表示
function searchShopByLandmark(location_jp, landmarkName)
{
    apiKey = $('#apiKey').val();
    $("#resultLists").html('');
    $("#favoriteStoreSearchPage").val(1);
    $("#moreButtonContainer").hide();
    var optionPrefs = {};

    // APIをコールして結果表示
    param = "api_status=1&key="+apiKey;
    if (landmarkId)
    {
        param += "&landmark_id="+landmarkId;
    }


    $(".prefRefineArea").hide();
    $("#resultLists").html('<li class="loading"><p>検索中</p></li>');
    $("#searchRresultText").html('');
    $.getJSON(storeSearchApiUrl+"?"+param, function(stores){
        $("#resultLists").html('');
        $("#favoriteStoreSearchPage").val(1);
        $("#moreButtonContainer").hide();
        for (var i in stores.data)
        {
            if (stores.data[i].myid === undefined)
            {
                break;
            }
            outputStore(stores.data[i], i);
            // 初期表示10件
            if (i < 10)
            {
                $('#store_num_'+i).show();
            }
            // 11件以上ある場合はもっと見る表示
            else
            {
                $("#moreButtonContainer").show();
            }
            // 上部、下部セレクトボックス作成用
            optionPrefs[stores.data[i].pref_code] = stores.data[i].address_1;
        }

        // 検索結果テキスト表示
        $("#searchRresultText").text('店舗検索：'+landmarkName+'で検索した結果（'+stores.data_num+' 件）');

        // 上部、下部セレクトボックス作成
        // 都道府県配列のソート
        optionPrefs = objectSort(optionPrefs);

        $(".optionSearchPref").each(function(){
            optionSearchPref = $(this);
            optionSearchPref.children().remove();
            if (optionSearchPref.find('option[value=""]').length < 1) {
                optionSearchPref.append("<option value=''>" + storeSearchPrefNameDefault + "</option>");
            }
            $.each(optionPrefs, function(key, val) {
                optionSearchPref.append("<option value='"+key+"'>"+val+"</option>");
            });
            optionSearchPref.prev().remove();
            optionSearchPref.before('<span class="js-label">' + storeSearchPrefNameDefault + '</span>');
        });

        // 検索結果テキスト表示
        if (landmarkName != '')
        {
            $("#searchRresultText").text('店舗検索：'+landmarkName+'で検索した結果（'+stores.data_num+' 件）');
        }
        else
        {
             $("#searchRresultText").text('店舗検索：検索した結果（'+stores.data_num+' 件）');
        }
        $j1111.colorbox.resize();
    });

}

// 検索結果一件出力 デフォルト非表示
function outputStore(data, num, pref_code)
{
    var storeText = '';
    var address_5 = '';
    if (data.fields.address_5)
    {
        address_5 = data.fields.address_5+' ';
    }

    var data_prefcode = pref_code || data.fields.pref_code;

    storeText += '<li class="item" id="store_num_'+num+'" data-prefcode="'+data_prefcode+'" style="display: none">';
    storeText += '<div class="detailContainer">';
    storeText += '<div class="detailInfo">';
    storeText += '<p class="storeName">'+data.fields.name+'</p>';
    storeText += '<p class="storeAddress">'+address_5+'</p>';
    storeText += '</div>';
    storeText += '<ul class="actionButtons">';
    if ($('#favoriteStore1').val() == data.fields.store_id ||
        $('#favoriteStore2').val() == data.fields.store_id ||
        $('#favoriteStore3').val() == data.fields.store_id)
    {
        storeText += '<li>登録済み</li>';
    }
    else
    {
        storeText += '<li><a class="searchButtonRegister button" href="javascript:void(0)" onclick="inputFavoriteStore(\''+data.fields.store_id+'\', \''+data.fields.name+'\');">登録する</a></li>';
    }
    storeText += '<li><span class="searchButtonMap button" onclick="window.open(\'' + _storeDetailPageUrl.head + '' +data.fields.store_id + '' + _storeDetailPageUrl.foot + '\')">MAP</span></li>';
    storeText += '<!-- /.actionButtons --></ul>';
    storeText += '<!-- /.detailContainer --></div>';
    storeText += '</li>';
    $("#resultLists").append(storeText);
}

// ランドマーク検索結果一件出力 デフォルト非表示
function outputlandmarks(data, num)
{
    var landmarkText = '';

    landmarkText += '<li class="item" id="store_num_'+num+'" style="display: none">';
    landmarkText += '<div class="detailContainer">';
    landmarkText += '<div class="detailInfo">';
    landmarkText += '<p class="storeName">'+data.fields.name+'</p>';
    landmarkText += '<p class="storeAddress">'+data.fields.address_1+'</p>';
    landmarkText += '</div>';
    landmarkText += '<ul class="actionButtons">';
    landmarkText += '<li><a class="searchButtonLandMark button" href="Javascript: void(0);" onclick="displayShopByLandmark(\''+data.fields.location_jp+'\', \''+data.fields.name+'\');">周辺の店舗を検索</a></li>';
    landmarkText += '<!-- /.actionButtons --></ul>';
    landmarkText += '<!-- /.detailContainer --></div>';
    landmarkText += '</li>';
    $("#resultLists").append(landmarkText);
}

// 登録ボタン処理
function inputFavoriteStore(storeId, storeName)
{
    var targetId = $("#selectFavoriteId").val();
    var targetNum = targetId.substr(-1);
    var target = $("#"+targetId);
    target.parent().before('<p class="selectItem">'+storeName+'</p>');
    $('#selectStoreName'+targetNum).hide();
    $('#deleteStoreName'+targetNum).show();
    $('#favoriteStore'+targetNum).val(storeId);
    $.colorbox.close();
}

// 削除ボタン処理
function deleteFavoriteStore(num)
{
    var target = $("#selectStoreName"+num);
    target.parent().prev().remove();
    $('#deleteStoreName'+num).hide();
    $('#selectStoreName'+num).show();
    $('#favoriteStore'+num).val('');
}

// 都道府県ソート用
function objectSort(object)
{
    var sorted = {};
    var array = [];
    for (key in object)
    {
        if (object.hasOwnProperty(key))
        {
            array.push(key);
        }
    }
    array.sort();
    for (var i = 0; i < array.length; i++)
    {
        sorted[array[i]] = object[array[i]];
    }

    return sorted;
}
