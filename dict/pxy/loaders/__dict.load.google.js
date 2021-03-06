/*************************************************
 * dict.load.google.js
 *
 * Load google result using jsonp. Support auto mode(google as ajuster)
 **************************************************/

(function($){
'use strict';
var D=$.dict_extend({
    'queryGoogle': queryGoogle,
    'queryGoogleMore': queryGoogleMoreResults,
});

var ajax, oldword;
// contry code: http://en.wikipedia.org/wiki/ISO_3166-1
var GSEAPI = "https://ajax.googleapis.com/ajax/services/search/web?v=1.0&gl=";
var SEARCH_SIZE = 8;

/*
 * Loading more search result
 */
function queryGoogleMoreResults(searchStartPosition){
    var word = oldword; // always use first search key
    var type = 'google';

    ajax=$.jsonp({
        'data': {'q':word,'count':SEARCH_SIZE,'start':searchStartPosition},
        'url': GSEAPI + D.lang,
        'success': function(r){
            var json=r.responseData;
            json.isNextMode=true;// google next mode.
            var data = {};
            data.src = json;
            data.word=word;
            data.type=type; // always google

            console.log(D.LC, '[loaders/dict.load.google.js] Google JSONP load more success! Call formatter. searchStartPosition=', searchStartPosition);
            window.DICT_format(data);
        },
        'beforeSend': doNothing,
        'complete': doNothing,
        'error': doNothing,
    });

}
function doNothing(){}

function getAutoKeyByLang(){
    switch (D.lang) {
        case 'jp' : return ' 意味';
        case 'us' : return ' meaning';
        case 'zh-CN' : return ' 含义';
    }
}

/*
 * Loading 1st search result
 */
function queryGoogle(word, type, opt){
    // Init
    console.log(D.LC, '[loaders/dict.load.google.js] Last search:' + oldword);
    oldword = word;// backup

    var newAutoKey = null;
    if (type.startsWith('google_')){
        // Other google modes: simply by addition keywords
        switch (type) {
            case 'google_dict':
                newAutoKey = getAutoKeyByLang();
                console.log(D.LC, '[dict.load.google.js] Added new auto search key to google search: ', newAutoKey);
                break;
        }
        type = 'google'; // Use same formatter as google
    }

    // Option
    var defaultOpt = {
      'autoKey': newAutoKey,
      'nextLoader': null,
    };
    var option = $.extend({},defaultOpt, opt);

    var searchKey = word;
    if (option.autoKey) {
      searchKey += ' '+ option.autoKey;
      console.log(D.LC, '[loaders/dict.load.google.js] Redirect search key : ',word, '--->', searchKey);
    }

    console.log(D.LC, '[loaders/dict.load.google.js] JSONP load: ', GSEAPI + D.lang);
    console.log(D.LC, '[loaders/dict.load.google.js] Search key: ', searchKey, '.searchStartPosition:',0);

    if (ajax) {
        ajax.abort();
    }

    // [1] Check cache
    var cache = D.getCache('GOOGLE_CACHE', [searchKey,type,D.lang].join('&')  );
    if (cache){
        console.log(D.LC, '[loaders/dict.load.google.js] Load from google jsonp cache', type, searchKey);
        // foramt start
        window.DICT_format(cache, type);
        D.complete(word, type); // load complte. Can NOT use common complete defined in ajax setup.
        return cache;
    }

    // No cache, get & push to cache.
    ajax=$.jsonp({
      'dict': {
          'word':word,
          'type':type,
      },
      'data': {'q':searchKey,'count':SEARCH_SIZE,'start':0},
      'url': GSEAPI + D.lang,
      'success': function(r){
          var googleResultJsonArray=r.responseData;
          if (!googleResultJsonArray){
            // Error
            console.log("Google result NG");
            this.error();
            return;
          }
          // Regist search info.
          googleResultJsonArray.searchKey = searchKey;
          googleResultJsonArray.word = word;

          var data = {};

          // For cache
          data.key = [searchKey,type,D.lang].join('&');

          data.src = googleResultJsonArray;
          data.word = searchKey;
          data.type=type; // "auto/google". Regist type used in format plugin

          // add to cache
          D.setCache('GOOGLE_CACHE',data);

          console.log(D.LC, '[loaders/dict.load.google.js] Google JSONP load success! Call formatter.');
          window.DICT_format(data);
      },
      'complete': function(e,t,x){
          if (D.isSearchRedirect) {
              console.log(D.LC, '[loaders/dict.load.google.js] Disable google complete action.');
              D.isSearchRedirect = false;
          }else{
              this._complete(e,t,x)
          }
      },
    });

}



// END OF AMD
})(jQuery);
