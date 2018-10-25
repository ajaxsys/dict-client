/*************************************************
 * dict.load.google.js
 *
 * Load google result using jsonp. Support auto mode(google as ajuster)
 **************************************************/

(function($){
'use strict';
var D=$.dict_extend();
D=$.dict_extend({
    'queryGoogle': queryGoogle,
    'queryGoogleMore': queryGoogleMoreResults,
    'SEARCH_SIZE' : 10,
    'MAX_POSITION': 20,
});

var ajax, oldword;
// contry code: http://en.wikipedia.org/wiki/ISO_3166-1

// doc:developers.google.com/custom-search/v1/cse/list
var GSEAPI = 'https://www.googl'
+ 'eapis.com/custom'
+ 'search/v1?ke'
+ 'y=AIzaSyCjBxov5ft0mEXoY019aiudWYImnDwEWQc&c'
+ 'x=016502465458590467219:emohpvgyzyw&gl=';

/*
 * Loading more search result
 */
function queryGoogleMoreResults(searchStartPosition){
    var word = oldword; // always use first search key
    var type = 'google';

    ajax=$.jsonp({
        'data': {'q':word,'count':D.SEARCH_SIZE,'start':searchStartPosition},
        'url': GSEAPI + D.lang,
        'success': function(r){
            var json= r;
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
        case 'cn' :
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
      'data': {'q':searchKey,'count':D.SEARCH_SIZE,'start':1},
      'url': GSEAPI + D.lang,
      'success': function(googleResultJsonObj){
          if (!googleResultJsonObj || !googleResultJsonObj.items) {
              // Error
              console.log("Google result NG");
              this.error();
              return;
          }

          // Regist search info.
          googleResultJsonObj.searchKey = searchKey;
          googleResultJsonObj.word = word;

          var data = {};

          // For cache
          data.key = [searchKey,type,D.lang].join('&');

          data.src = googleResultJsonObj;
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
