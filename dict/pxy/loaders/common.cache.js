/*************************************************
 * loaders/common.cache.js
 *
 * Common setup for jsonp loader
 **************************************************/

;(function($){
var D = $.dict_extend();
$.dict_extend({
    'getCache': getCache,
    'setCache': setCache,
    'MAX_HIST': 10, // Cache of search result
    // Add cache here
    _cache: {
        'GAE_CACHE': new D.Queue(), // Datatype defined in _cmn/dict.util.js
        'GOOGLE_CACHE': new D.Queue(),
        'YQL_CACHE': new D.Queue(),
    }
});

function getCache(cacheName, word, type){
    var cache=D._cache[cacheName];
    // next page mode not load cache
    if (word && cache.size()>0) {
      for (var i=0;i<cache.size();i++){
        var json = cache.get(i);
        if (word.toLowerCase()===json.word.toLowerCase()) {
            // If no type , only ajust by word
            if (type){
                if (type.toLowerCase()===json.type.toLowerCase()) {
                    return json;
                }
            }else{
                return json;
            }
        }
      }
    }
    return null;
}

function setCache(cacheName, json){
      // next page mode not save cache
      // add to cache
      if (D._cache[cacheName].size() >= D.MAX_HIST){
          console.log(D.LC, '[loaders/common.cache.js] Dequeue cache:', json.word);
          D._cache[cacheName].dequeue();
      }
      console.log(D.LC, '[loaders/common.cache.js] Put into cache:', json.word);
      D._cache[cacheName].enqueue(json);
}

// END OF AMD
})(jQuery);
