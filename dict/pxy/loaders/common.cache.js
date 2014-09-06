/*************************************************
 * loaders/common.cache.js
 *
 * Common setup for jsonp loader
 **************************************************/

;(function($){
'use strict';
var D = $.dict_extend();
$.dict_extend({
    'getCache': getCache,
    'setCache': setCache,
    // Add cache here, Datatype defined in _cmn/dict.util.js
    _cache: {
        'GAE_CACHE': new D.Queue(10), 
        'GOOGLE_CACHE': new D.Queue(99),
        'YQL_CACHE': new D.Queue(50),
    }
});

// Key priority : key
function getCache(cacheName, key){
    var cache=D._cache[cacheName];
    // next page mode not load cache
    if (key && cache.size()>0) {
      for (var i = cache.size() - 1; i >= 0; i--) {
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
      if (cache.size() >= cache.max_length){
          console.log(D.LC, '[loaders/common.cache.js] Dequeue cache:', json.key);
          cache.dequeue();
      }
      console.log(D.LC, '[loaders/common.cache.js] Put into cache.',cacheName,' cache size:',cache.size() , ' - key:', json.key );
      cache.enqueue(json);
}

// END OF AMD
})(jQuery);
