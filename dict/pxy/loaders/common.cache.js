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
    'MAX_HIST': 30, // Cache of search result
    // Add cache here
    _cache: {
        'GAE_CACHE': new D.Queue(), // Datatype defined in _cmn/dict.util.js
        'GOOGLE_CACHE': new D.Queue(),
        'YQL_CACHE': new D.Queue(),
    }
});

// Key priority : key
function getCache(cacheName, key){
    var cache=D._cache[cacheName];
    // next page mode not load cache
    if (key && cache.size()>0) {
      for (var i=0;i<cache.size();i++){
        var json = cache.get(i);

        if (key && json.key && key.toLowerCase()===json.key.toLowerCase())
            return json;

      }
    }
    return null;
}

// json must contain property: key
function setCache(cacheName, json){
      // next page mode not save cache
      // add to cache
      var cache = D._cache[cacheName]
      if (cache.size() >= D.MAX_HIST){
          console.log(D.LC, '[loaders/common.cache.js] Dequeue cache:', json.key);
          cache.dequeue();
      }
      console.log(D.LC, '[loaders/common.cache.js] Put into cache.',cacheName,' cache size:',cache.size() , ' - key:', json.key );
      cache.enqueue(json);
}

// END OF AMD
})(jQuery);
