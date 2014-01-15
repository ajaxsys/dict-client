/*************************************************
 * dict.load.google.js
 *
 * Load google result using jsonp. Support auto mode(google as ajuster)
 **************************************************/

(function($){

var D=$.dict_extend({
    'queryGoogle': queryGoogle,
    'queryGoogleMore': queryGoogleMoreResults,
});

var ajax, oldword;
// contry code: http://en.wikipedia.org/wiki/ISO_3166-1
var GOOGLE_SEARCH_API = "https://ajax.googleapis.com/ajax/services/search/web?v=1.0&gl=jp";
var SEARCH_SIZE = 8, DEFALUT_NEXT_LOADER='weblio';

/*
 * Loading more search result
 */
function queryGoogleMoreResults(searchStartPosition){
    var word = oldword; // always use first search key
    var type = 'google';

    ajax=$.jsonp({
        'data': {'q':word,'rsz':SEARCH_SIZE,'start':searchStartPosition},
        'url': GOOGLE_SEARCH_API,
        'success': function(r){
            var json=r.responseData;
            json.isNextMode=true;// google next mode.
            var data = {};
            data.src = json;
            data.word=word;
            data.type=type; // always google

            console.log(D.LC, '[loaders/dict.load.google.js] Google JSONP load more success! Call formatter. searchStartPosition=', searchStartPosition);
            var result = window.DICT_format(data);
        },
        'beforeSend': doNothing,
        'complete': doNothing,
        'error': doNothing,
    });

}
function doNothing(){}

/*
 * Loading 1st search result
 */
function queryGoogle(word, type, opt){
    // Init
    console.log(D.LC, '[loaders/dict.load.google.js] Last search:' + oldword);
    oldword = word;// backup

    // Option
    var defaultOpt = {
      'autoKey': null,
      'nextLoader': null,
    };
    var option = $.extend({},defaultOpt, opt);

    var searchKey = word;
    if (option.autoKey) {
      searchKey += ' '+ option.autoKey;
      console.log(D.LC, '[loaders/dict.load.google.js] Redirect search key : ',word, '--->', searchKey);
    }

    console.log(D.LC, '[loaders/dict.load.google.js] JSONP load: ', GOOGLE_SEARCH_API);
    console.log(D.LC, '[loaders/dict.load.google.js] Search key: ', searchKey, '.searchStartPosition:',0);

    // [1] Check cache
    var cache = D.getCache('GOOGLE_CACHE', searchKey);
    if (cache){
        console.log(D.LC, '[loaders/dict.load.google.js] Load from google jsonp cache', type, searchKey);
        // foramt start
        window.DICT_format(cache, type);
        D.complete(word, type); // load complte. Can NOT use common complete defined in ajax setup.
        return cache;
    }

    // No cache, get & push to cache.
    if (ajax) {
        ajax.abort();
    }
    ajax=$.jsonp({
      'dict': {
          'word':word,
          'type':type,
      },
      'data': {'q':searchKey,'rsz':SEARCH_SIZE,'start':0},
      'url': GOOGLE_SEARCH_API,
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
          data.src = googleResultJsonArray;
          data.word = searchKey;
          data.type=type; // "auto/google". Regist type used in format plugin

          // add to cache
          D.setCache('GOOGLE_CACHE',data);
  
          console.log(D.LC, '[loaders/dict.load.google.js] Google JSONP load success! Call formatter.');
          var result = window.DICT_format(data);
      },
      'complete': function(e,t,x){
          if (D.isSearchRedirect) {
              console.log(D.LC, '[loaders/dict.load.google.js] Disable google complete action.');
              D.isSearchRedirect = false;
          }else{
              this._complete(e,t,x)
          }
      },
      'error': function(e,t,x) {
        if (type==='auto') {
            console.log(D.LC, '[loaders/dict.load.google.js] Google load error, try other loader...');
            // foramt start
            queryNextLoader(word, option.nextLoader);
        } else { // google only
            this._error(e,t,x)
        }
      },
    });

}


function queryNextLoader(word, loader){
    loader = loader || DEFALUT_NEXT_LOADER;
    console.log(D.LC, '[loaders/dict.load.google.js] Next loader:' ,loader);
    D.queryDict(word, loader); // Google failed, use another... D.DEFAULT_FORMATTER
}


// END OF AMD
})(jQuery);
