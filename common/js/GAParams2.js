var GAParams = {
	"DownloadOptions" : {
		"PutMethod": ["pageview","event"],
		"IncludeCondition": ["\\.pdf$","\\.zip$","\\.jpg$"],
		"ExcludeCondition": [],
		"EventCondition": {
			"Default":{
				"category":  "download",
				"action":    "other",
				"opt_value":     null
			},
			"ConditionList":[
				{
					"condition": ".*\\.pdf$",
					"category":  "download",
					"action":    "pdf",
					"opt_value": null
				},
				{
					"condition": "/fun/scs/normal/.*\\.zip$",
					"category":  "download",
					"action":    "zip",
					"opt_value": null
				},

				{
					"condition": "/fun/wallpaper/.*\\.jpg$",
					"category":  "download",
					"action":    "jpg",
					"opt_value": null
				}
			]
		}
	},
	"CustomVarOptions" : {

		"ConditionList": [
		
			{
				"condition": "co\\.jp/($|\\?|index\\.html)",
				"index":  1,
				"name":   "dirDepth",
				"value":  "top",
				"opt_scope": 3
			},

			{
				"condition": "co\\.jp/coffee/($|\\?|index\\.html)",
				"index":  1,
				"name":   "dirDepth",
				"value":  "coffee-top",
				"opt_scope": 3
			},

			{
				"condition": "co\\.jp/products/($|\\?|index\\.html)",
				"index":  1,
				"name":   "dirDepth",
				"value":  "products-top",
				"opt_scope": 3
			},

			{
				"condition": "co\\.jp/store/($|\\?|index\\.html)",
				"index":  1,
				"name":   "dirDepth",
				"value":  "store-top",
				"opt_scope": 3
			},


			{
				"condition": "co\\.jp/about_us/($|\\?|index\\.html)",
				"index":  1,
				"name":   "dirDepth",
				"value":  "company-top",
				"opt_scope": 3
			},


			{
				"condition": "co\\.jp/brewing/.*",
				"index":  1,
				"name":   "dirDepth",
				"value":  "none",
				"opt_scope": 3
			},

			{
				"condition": "co\\.jp/reserve/.*",
				"index":  1,
				"name":   "dirDepth",
				"value":  "none",
				"opt_scope": 3
			},

			{
				"condition": "co\\.jp/oos/.*",
				"index":  1,
				"name":   "dirDepth",
				"value":  "none",
				"opt_scope": 3
			},

			{
				"condition": "co\\.jp/pairing/.*",
				"index":  1,
				"name":   "dirDepth",
				"value":  "pairing-coffee",
				"opt_scope": 3
			},

			{
				"condition": "co\\.jp/card/.*",
				"index":  1,
				"name":   "dirDepth",
				"value":  "none",
				"opt_scope": 3
			},

			{
				"condition": "co\\.jp/aboutus/start/($|\\?|index\\.html)",
				"index":  1,
				"name":   "dirDepth",
				"value":  "company",
				"opt_scope": 3
			},

			{
				"condition": "co\\.jp/search/map/support_center.html",
				"index":  1,
				"name":   "dirDepth",
				"value":  "company",
				"opt_scope": 3
			},


			{
				"condition": "co\\.jp/about_us/policy/.*",
				"index":  1,
				"name":   "dirDepth",
				"value":  "none",
				"opt_scope": 3
			},

			{
				"condition": "co\\.jp/sitemap.html",
				"index":  1,
				"name":   "dirDepth",
				"value":  "sitemap",
				"opt_scope": 3
			},


			{
				"condition": "co\\.jp/search/map/result.php",
				"index":  1,
				"name":   "dirDepth",
				"value":  "en",
				"opt_scope": 3
			},

			{
				"condition": "co\\.jp/store/search/result_store.php\\?.*(?!pref_code).*",
				"index":  1,
				"name":   "dirDepth",
				"value":  "store",
				"opt_scope": 3
			},

			{
				"condition": "co\\.jp/store/search/result_store.php\\?.*pref_code.*",
				"index":  1,
				"name":   "dirDepth",
				"value":  "store",
				"opt_scope": 3
			},


			{
				"condition": "co\\.jp/files-not-found.html",
				"index":  1,
				"name":   "dirDepth",
				"value":  "error",
				"opt_scope": 3
			},

			{
				"condition": "co\\.jp/coffee/beans/.*",
				"index":  2,
				"name":   "dirDepth",
				"value":  "coffee-beans",
				"opt_scope": 3
			
			},

			{
				"condition": "co\\.jp/coffee/lineup/.*",
				"index":  2,
				"name":   "dirDepth",
				"value":  "coffee-beans",
				"opt_scope": 3
			
			},


			{
				"condition": "co\\.jp/brewing/.*",
				"index":  2,
				"name":   "dirDepth",
				"value":  "brewing",
				"opt_scope": 3
			
			},

			{
				"condition": "co\\.jp/coffee/brewing/.*",
				"index":  2,
				"name":   "dirDepth",
				"value":  "brewing",
				"opt_scope": 3
			
			},

			{
				"condition": "co\\.jp/coffee/reserve/.*",
				"index":  2,
				"name":   "dirDepth",
				"value":  "reserve",
				"opt_scope": 3
			
			},

			{
				"condition": "co\\.jp/beverage/reserve/.*",
				"index":  2,
				"name":   "dirDepth",
				"value":  "reserve",
				"opt_scope": 3
			
			},

			{
				"condition": "co\\.jp/reserve/.*",
				"index":  2,
				"name":   "dirDepth",
				"value":  "reserve",
				"opt_scope": 3
			
			},

			{
				"condition": "co\\.jp/beverage/discoveries/.*",
				"index":  2,
				"name":   "dirDepth",
				"value":  "discoveries",
				"opt_scope": 3
			
			},

			{
				"condition": "co\\.jp/discoveries/.*",
				"index":  1,
				"name":   "dirDepth",
				"value":  "none",
				"opt_scope": 3
			
			},

			{
				"condition": "co\\.jp/discoveries/.*",
				"index":  2,
				"name":   "dirDepth",
				"value":  "discoveries",
				"opt_scope": 3
			
			},

			{
				"condition": "co\\.jp/coffee/oos/.*",
				"index":  2,
				"name":   "dirDepth",
				"value":  "oos",
				"opt_scope": 3
			
			},

			{
				"condition": "co\\.jp/oos/.*",
				"index":  2,
				"name":   "dirDepth",
				"value":  "oos",
				"opt_scope": 3
			
			},

			{
				"condition": "co\\.jp/food/($|\\?|index\\.html)",
				"index":  2,
				"name":   "dirDepth",
				"value":  "none",
				"opt_scope": 3
			
			},

			{
				"condition": "co\\.jp/food/new/.*",
				"index":  2,
				"name":   "dirDepth",
				"value":  "none",
				"opt_scope": 3
			
			},

			{
				"condition": "co\\.jp/goods/($|\\?|index\\.html)",
				"index":  2,
				"name":   "dirDepth",
				"value":  "none",
				"opt_scope": 3
			
			},

			{
				"condition": "co\\.jp/goods/new/.*",
				"index":  2,
				"name":   "dirDepth",
				"value":  "none",
				"opt_scope": 3
			
			},

			{
				"condition": "co\\.jp/goods/sbcard/.*",
				"index":  2,
				"name":   "dirDepth",
				"value":  "card",
				"opt_scope": 3
			
			},

			{
				"condition": "co\\.jp/goods/bevcard/.*",
				"index":  2,
				"name":   "dirDepth",
				"value":  "card",
				"opt_scope": 3
			
			},

			{
				"condition": "co\\.jp/products/new/.*",
				"index":  2,
				"name":   "dirDepth",
				"value":  "none",
				"opt_scope": 3
			
			},

			{
				"condition": "co\\.jp/products/lineup/.*",
				"index":  2,
				"name":   "dirDepth",
				"value":  "none",
				"opt_scope": 3
			
			},

			{
				"condition": "co\\.jp/products/lineupB/.*",
				"index":  2,
				"name":   "dirDepth",
				"value":  "none",
				"opt_scope": 3
			
			},

			{
				"condition": "co\\.jp/card/.*",
				"index":  2,
				"name":   "dirDepth",
				"value":  "card",
				"opt_scope": 3
			
			},

			{
				"condition": "co\\.jp/howto/($|\\?|index\\.html)",
				"index":  2,
				"name":   "dirDepth",
				"value":  "none",
				"opt_scope": 3
			
			},

			{
				"condition": "co\\.jp/aboutus/start/($|\\?|index\\.html)",
				"index":  2,
				"name":   "dirDepth",
				"value":  "none",
				"opt_scope": 3
			
			},
			{
				"condition": "co\\.jp/search/map/support_center.html",
				"index":  2,
				"name":   "dirDepth",
				"value":  "none",
				"opt_scope": 3
			
			},

			{
				"condition": "co\\.jp/csr/.*",
				"index":  2,
				"name":   "dirDepth",
				"value":  "none",
				"opt_scope": 3
			
			},

			{
				"condition": "co\\.jp/about_us/policy/.*",
				"index":  2,
				"name":   "dirDepth",
				"value":  "policy",
				"opt_scope": 3
			
			},

			{
				"condition": "co\\.jp/search/map/result.php($|\\?)",
				"index":  2,
				"name":   "dirDepth",
				"value":  "none",
				"opt_scope": 3
			
			},


			{
				"condition": "co\\.jp/mystarbucks-entry/CstbaseRegComp",
				"index":  3,
				"name":   "member",
				"value":  "member",
				"opt_scope": 1
			},
	
			{
				"condition": "co\\.jp/mystarbucks-entry/CstBaseRegComp",
				"index":  2,
				"name":   "dirDepth",
				"value":  "form_sirens_join",
				"opt_scope": 3
			},


			{
				"condition": "co\\.jp/CstBaseModMailComp",
				"index":  2,
				"name":   "dirDepth",
				"value":  "form_sirens_change",
				"opt_scope": 3
			},

			{
				"condition": "co\\.jp/mystarbucks/CstPassResetSave",
				"index":  2,
				"name":   "dirDepth",
				"value":  "form_sirens_pass",
				"opt_scope": 3
			},

			{
				"condition": "co\\.jp/mystarbucks/CstBaseModComp",
				"index":  2,
				"name":   "dirDepth",
				"value":  "form_sirens_resign",
				"opt_scope": 3
			},

			{
				"condition": "co\\.jp/mystarbucks/CstMagModInputComp",
				"index":  2,
				"name":   "dirDepth",
				"value":  "form_mail_news_delivery",
				"opt_scope": 3
			},

			{
				"condition": "co\\.jp/mystarbucks/MonitorRegFinish",
				"index":  2,
				"name":   "dirDepth",
				"value":  "form_monitor_reg",
				"opt_scope": 3
			},

			{
				"condition": "co\\.jp/mystarbucks/MonitorModFinish",
				"index":  2,
				"name":   "dirDepth",
				"value":  "form_monitor_mod",
				"opt_scope": 3
			},

			{
				"condition": "co\\.jp/mystarbucks/MonitorQuitFinish",
				"index":  2,
				"name":   "dirDepth",
				"value":  "form_complete_monitor_quit",
				"opt_scope": 3
			},

			{
				"condition": "co\\.jp/mystarbucks/qst/starbucksenq\\.action",
				"index":  2,
				"name":   "dirDepth",
				"value":  "form_enq_action",
				"opt_scope": 3
			},

			{
				"condition": "co\\.jp/mystarbucks/qst/starbucksqst\\.action",
				"index":  2,
				"name":   "dirDepth",
				"value":  "form_campaign_action",
				"opt_scope": 3
			},

			{
				"condition": "co\\.jp/card/vlbc\\.cgi",
				"index":  1,
				"name":   "dirDepth",
				"value":  "form_card_balance",
				"opt_scope": 3
			},


			{
				"condition": "co\\.jp/store/search/result_store.php\\?.*(?!pref_code).*",
				"index":  2,
				"name":   "dirDepth",
				"value":  "form_store_search_free",
				"opt_scope": 3
			},

			{
				"condition": "co\\.jp/store/search/result_store.php\\?.*pref_code.*",
				"index":  2,
				"name":   "dirDepth",
				"value":  "form_store_search_city",
				"opt_scope": 3
			},

			{
				"condition": "co\\.jp/store/search/result_landmark\\.php",
				"index":  2,
				"name":   "dirDepth",
				"value":  "form_store_station",
				"opt_scope": 3
			},

			{
				"condition": "co\\.jp/store/search/detail_landmark\\.php",
				"index":  2,
				"name":   "dirDepth",
				"value":  "form_store_station_result",
				"opt_scope": 3
			},

			{
				"condition": "co\\.jp/event/result_all\\.php",
				"index":  2,
				"name":   "dirDepth",
				"value":  "form_event",
				"opt_scope": 3
			},

			{
				"condition": "co\\.jp/recruit/career/complete\\.html",
				"index":  2,
				"name":   "dirDepth",
				"value":  "form_career",
				"opt_scope": 3
			},

			{
				"condition": "co\\.jp/mystarbucks/",
				"index":  3,
				"name":   "member",
				"value":  "member",
				"opt_scope": 1
			},

			{
				"condition": "smm=1",
				"index":  3,
				"name":   "member",
				"value":  "member",
				"opt_scope": 1
			}
		]
	},
	"MultiDomainOptions": {
		"IncludeCondition": [],
		"ExcludeCondition": []
	},	
	"DirectoryCustomVarOptions": {
		"active": true,
		"depth":2,
		"name": "dirDepth",
		"replaceChar": "-",
		"LevelIndex":[
 		     {
 			    "level": 2,
 			    "index": 1
 			 },
 			 
 		     {
 			    "level": 3,
 			    "index": 2
 			 }
		             ]

	},
	"waitingCount": 100


};
