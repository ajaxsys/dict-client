/*************************************************
 * dict.load.yql.js
 *
 * Proxy query with jsonp via yql
 **************************************************/

;(function($){
'use strict';
var D=$.dict_extend();
$.dict_extend({
    'queryDictByYQL': queryDict, // will override dict.load.gae.js
    'queryByYQL': queryByYQL,
});

var ajax, ajaxDirect,
    YQL_URL = "https://query.yahooapis.com/v1/public/yql?q=use 'http://dict-admin.appspot.com/lib/y.xml' as html.src;select * from html.src where url='#URL#'&format=json";

function queryDict(word, type, url){
    // URL already get from google
    if (url && !url.startsWith('http://') && !url.startsWith('https://') ){ 
        // NOT support: url.startsWith('//')
        console.log(D.LC, '[loaders/dict.load.yql.js] ERROR, only support auto mode.');
        return;
    }

    if (ajax) {
        ajax.abort();
    }

    // Check cache, YQL use url as the key
    var cache=D.getCache('YQL_CACHE', url); 
    if (cache) {
        console.log(D.LC, '[loaders/dict.load.yql.js] Load from dict jsonp cache(url/type/word/lang)', url, type, word, D.lang);
        // foramt start
        window.DICT_format(cache, type);
        D.complete(word, type);
        return cache;
    }

    //use "http://goo.gl/tUzHPI" as html.src;select * from html.src where url="http://ja.wikipedia.org/wiki/Yahoo!"
    //-->
    //http://query.yahooapis.com/v1/public/yql?q=use%20%22http%3A%2F%2Fgoo.gl%2FtUzHPI%22%20as%20html.src%3B%0A%20%20%20%20%20%20select%20*%20from%20html.src%20where%20%0A%20%20%20%20%20%20%20%20url%3D%22http%3A%2F%2Fja.wikipedia.org%2Fwiki%2FYahoo!%E2%80%8E%22%20&format=json&callback=

    // http://otherhost/dict/t/hello/?callback=DICT_format
    var yql = YQL_URL.replace('#URL#', encodeURIComponent(url));

    console.log(D.LC, '[loaders/dict.load.yql.js] JSONP load(via YQL): ', url);
    var params = {
      //q: encodeURI('use "http://goo.gl/tUzHPI" as html.src; select * from html.src where  url="')+url+encodeURI('"'),
      //format: 'json',
    };

    D.preloadResources(type);

    // No cache, get & push to cache.
    ajax=$.jsonp({
      'dict':{
          'word': word,
          'type': type,
      },
      'url': yql,
      'data': params,
      'success': function(json) {
           var data = {};
           data.key = url; // YQL only need url as the key
           // Fro formatter
           data.word = word;
           data.type = type;

           try {
              data.src = '<!--' + url + '-->'; // Append url/key to src for guest host from it.
              var content = json.query.results.resources.content;
              data.src += content;
              if (!content){
                throw 'YQL return null results';
              }
           } catch(e){
              console.log(D.LC, '[loaders/dict.load.yql.js] YQL load ERRORs. Re-direct to results from search engine', e);
              // Show google again while YQL NG in some case, e.g: https://query.yahooapis.com/v1/public/yql?q=use%20%27http://dict-admin.appspot.com/lib/y.xml%27%20as%20html.src;select%20*%20from%20html.src%20where%20url=%27http%3A%2F%2Fejje.weblio.jp%2Fsmall%2Fcontent%2F%25E5%259C%25A8%25E4%25BD%258F%27&format=json&callback=DICT_jsonp&_1406681440403=
              D.loadQuery(word, 'google');
              // CAN NOT add to cache
              // D.setCache('YQL_CACHE', data);
              return;
           }

           // add to cache
           D.setCache('YQL_CACHE', data);
          
           console.log(D.LC, '[loaders/dict.load.yql.js] Dict JSONP load Success! Call formatter.');
           window.DICT_format(data);
  
      },
    });

    // Others:Change debug URL when connect to YQL.
    $('#__debugAjax__').attr('href', url);
}

function DO_NOTHING(){}
function queryByYQL(url, callback) {
  if (typeof callback !== 'function'){
    console.log(D.LC, '[loaders/dict.load.yql.js] [ERROR] queryByYQL MUST provide a callback function.');
    return;
  }

  // Check cache, YQL use url as the key
  var cache=D.getCache('YQL_CACHE', url); 
  if (cache) {
      console.log(D.LC, '[loaders/dict.load.yql.js] Load from dict jsonp cache(url/type/word/lang)', url);
      callback(cache);
      return;
  }

  var yql = YQL_URL.replace('#URL#', encodeURIComponent(url));
  
  if (ajaxDirect) {
      ajaxDirect.abort();
  }
  ajaxDirect=$.jsonp({
      'url': yql,
      'success': function(json) {
           var data = {};
           try {
               data.src = json.query.results.resources.content;
           } catch(e){
               console.log(D.LC, '[loaders/dict.load.yql.js] YQL load ERRORs.');
               return;
           }
           data.key = url; // YQL only need url as the key

           // add to cache
           D.setCache('YQL_CACHE', data);
          
           console.log(D.LC, '[loaders/dict.load.yql.js] Dict JSONP load Success! Calling callback.');

           callback(data);
  
      },
      beforeSend : DO_NOTHING,
      complete: DO_NOTHING,
      error: DO_NOTHING,
    });

}

// END OF AMD
})(jQuery);
