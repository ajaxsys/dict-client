/*************************************************
 * dict.load.gae.js
 *
 * Proxy query with dict jsonp via GAE. If success, call formatter.
 **************************************************/

;(function($){

var D=$.dict_extend();
$.dict_extend({
    'queryDict': queryDict,
});

var ajax, oldword;

function queryDict(word, type){
    // Init
    console.log(D.LC, '[loaders/dict.load.gae.js] Last search:' + oldword);
    oldword = word;// backup

    // Check cache
    var cache=D.getCache('GAE_CACHE', word, type);
    if (cache) {
        console.log(D.LC, '[loaders/dict.load.gae.js] Load from dict jsonp cache', type, word);
        // foramt start
        window.DICT_format(cache, type);
        D.complete(word, type);
        return cache;
    }

    // http://otherhost/dict/t/hello/?callback=DICT_format
    var url = D.lb_host(word)+'dict/'+type+'/'+encodeURIComponent(word)+'/';
    console.log(D.LC, '[loaders/dict.load.gae.js] JSONP load: ', url);
  
    // No cache, get & push to cache.
    if (ajax) {
        ajax.abort();
    }
    ajax=$.jsonp({
      'dict':{
          'word': word,
          'type': type,
      },
      'url': url,
      'success': function(json, textStatus, xOptions) {
  
         // add to cache
         D.setCache('GAE_CACHE', json);
  
         console.log(D.LC, '[loaders/dict.load.gae.js] Dict JSONP load Success! Call formatter.');
         window.DICT_format(json);
  
      },
    });

    // Others:Change debug URL when connect to GAE.
    $('#__debugAjax__').attr('href', url+'?callback=DICT');
}

// END OF AMD
})(jQuery);
