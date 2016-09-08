/*************************************************
 * dict.load.xiaod.js
 *
 * Direct query with xiaod api
 **************************************************/

;(function($){
'use strict';
var D=$.dict_extend();
$.dict_extend({
    'queryDictByXiaod': queryDict, // will override dict.load.gae.js
});

var ajax,
    XD_URL = "http://dict.hjenglish.com/services/huaci/jp_web_ajax.ashx?type=cj&w=",
    YQL_URL = "https://query.yahooapis.com/v1/public/yql?q=use 'http://ajaxsys.github.io/dict-client/target/lib/y.xml' as html.src;select * from html.src where url='#URL#'&format=json";

function queryDict(word, type){

    if (ajax) {
        ajax.abort();
    }

    var url = XD_URL + word;

    // Check cache, YQL use url as the key
    var cache=D.getCache('YQL_CACHE', url);
    if (cache) {
        console.log(D.LC, '[loaders/dict.load.xiaod.js] Load from dict jsonp cache(url/type/word/lang)', url, type, word, D.lang);
        // foramt start
        window.DICT_format(cache, type);
        D.complete(word, type);
        return cache;
    }

    //use "http://goo.gl/tUzHPI" as html.src;select * from html.src where url="http://ja.wikipedia.org/wiki/Yahoo!"
    //-->
    //http://query.yahooapis.com/v1/public/yql?q=use%20%22http%3A%2F%2Fgoo.gl%2FtUzHPI%22%20as%20html.src%3B%0A%20%20%20%20%20%20select%20*%20from%20html.src%20where%20%0A%20%20%20%20%20%20%20%20url%3D%22http%3A%2F%2Fja.wikipedia.org%2Fwiki%2FYahoo!%E2%80%8E%22%20&format=json&callback=
    function  isHttpsProtocal(){

    }
    // TODO isHttpsProtocal
    var isHttps = isHttpsProtocal()
    if (isHttps){
      // Use YQL proxy for https support
      console.log(D.LC, '[loaders/dict.load.xiaod.js] Using https mode proxy by YQL', url, type, word, D.lang);
      url = YQL_URL.replace('#URL#', encodeURIComponent(url));
    }

    console.log(D.LC, '[loaders/dict.load.xiaod.js] JSONP load(via YQL): ', url);
    var params = {
    };

    // No cache, get & push to cache.
    ajax=$.jsonp({
      'dict':{
          'word': word,
          'type': type,
      },
      'url': url,
      'callback': isHttps ? 'DICT_jsonp' : 'HJ.fun.jsonCallBack',
      'data': params,
      'success': function(json) {

        var htmlContent;

        if (isHttps){
          // HJ.fun.jsonCallBack({content:"<div>...</div>"});HJ.fun.changeLanguage('cj');
          var content = json.query.results.resources.content;
          // keep --> <div>...</div>
          htmlContent = content.replace(/^.*?{content:|"}.*?$/, '');
        } else {
          htmlContent = json.content;
        }

        var data = {};
        data.key = url; // YQL only need url as the key
        // Fro formatter
        data.word = word;
        data.type = type;
        data.src = '<!--' + url + '-->' + htmlContent;

        // add to cache
        D.setCache('YQL_CACHE', data);

        console.log(D.LC, '[loaders/dict.load.xiaod.js] Dict JSONP load Success! Call formatter.');
        window.DICT_format(data);

      },
    });

    // Others:Change debug URL when connect to YQL.
    $('#__debugAjax__').attr('href', url);
}

//function DO_NOTHING(){}

// END OF AMD
})(jQuery);
