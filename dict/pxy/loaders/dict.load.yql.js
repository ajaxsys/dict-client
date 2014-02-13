/*************************************************
 * dict.load.yql.js
 *
 * Proxy query with jsonp via yql
 **************************************************/

;(function($){

var D=$.dict_extend();
$.dict_extend({
    'queryDict': queryDict, // will override dict.load.gae.js
});

var ajax;

function queryDict(word, type, url){
    // URL already get from google
    if (url && url.indexOf('http://')===-1 && url.indexOf('https://')===-1){
        // 
        console.log(D.LC, '[loaders/dict.load.yql.js] ERROR, only support auto mode.');
        return;
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
    var yql = "https://query.yahooapis.com/v1/public/yql?q=use 'http://dict-admin.appspot.com/lib/y.xml' as html.src;select * from html.src where url='"
              +encodeURIComponent(url)+"'&format=json";

    console.log(D.LC, '[loaders/dict.load.yql.js] JSONP load(via YQL): ', url);
    var params = {
      //q: encodeURI('use "http://goo.gl/tUzHPI" as html.src; select * from html.src where  url="')+url+encodeURI('"'),
      //format: 'json',
    };

    // No cache, get & push to cache.
    if (ajax) {
        ajax.abort();
    }
    ajax=$.jsonp({
      'dict':{
          'word': word,
          'type': type,
      },
      'url': yql,
      'data': params,
      'success': function(json, textStatus, xOptions) {
           data = {};
           try {
               data.src = json.query.results.resources.content;
           } catch(e){
               console.log(D.LC, '[loaders/dict.load.yql.js] YQL load ERRORs.');
               return;
           }
           data.key = url; // YQL only need url as the key

           // Fro formatter
           data.word = word;
           data.type = type;

           // add to cache
           D.setCache('YQL_CACHE', data);
          
           console.log(D.LC, '[loaders/dict.load.yql.js] Dict JSONP load Success! Call formatter.');
           window.DICT_format(data);
  
      },
    });

    // Others:Change debug URL when connect to YQL.
    $('#__debugAjax__').attr('href', url);
}

// END OF AMD
})(jQuery);
