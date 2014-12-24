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
    'SEARCH_SIZE' : 10,
    'MAX_POSITION': 20
});

var ajax, oldword;
// contry code: http://en.wikipedia.org/wiki/ISO_3166-1
// var GOOGLE_SEARCH_API = "https://ajax.googleapis.com/ajax/services/search/web?v=1.0&gl="; // Deprecated

// ?key=AIzaSyCVAXiUzRYsML1Pv6RwSG1gunmMikTzQqY
// &rsz=filtered_cse
// &num=10
// &hl=ja
// &prettyPrint=false
// &source=gcsc
// &gss=.jp
// &sig=23952f7483f1bca4119a89c020d13def
// &cx=016502465458590467219:emohpvgyzyw
// &q=%E4%BD%A0%E5%A5%BD
// &sort=
// &googlehost=www.google.com
// &oq=%E4%BD%A0%E5%A5%BD
// &gs_l=partner.12...0.0.1.9218.0.0.0.0.0.0.0.0..0.0.gsnos%2Cn%3D13...0.0jj1..1ac..25.partner..6.0.0.ZDfqFNMyL4M
// &callback=google.search.Search.apiary1045
// &nocache=1418887005296
var GOOGLE_SEARCH_API = "https://www.googleapis.com/customsearch/v1element?key=AIzaSyCVAXiUzRYsML1Pv6RwSG1gunmMikTzQqY&cx=016502465458590467219:emohpvgyzyw&gl=";

/*
 * Loading more search result
 */
function queryGoogleMoreResults(searchStartPosition){
    var word = oldword; // always use first search key
    var type = 'google';

    ajax=$.jsonp({
        'data': {'q':word,'rsz':D.SEARCH_SIZE,'start':searchStartPosition},
        'url': GOOGLE_SEARCH_API + D.lang,
        'success': function(r){
            var json=r;
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

    console.log(D.LC, '[loaders/dict.load.google.js] JSONP load: ', GOOGLE_SEARCH_API + D.lang);
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
      'data': {'q':searchKey,'rsz':D.SEARCH_SIZE,'start':0},
      'url': GOOGLE_SEARCH_API + D.lang,
      'success': function(googleResultJsonArray){
          if (!googleResultJsonArray || !googleResultJsonArray.results){
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
