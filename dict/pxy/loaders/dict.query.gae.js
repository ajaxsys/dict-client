/**
 * proxy query with dict jsonp. If success, call formatter.
 */
;(function($){

var D=$.dict_extend();
$.dict_extend({
    'queryDict': queryDict,
    'queryDictQueue': new D.Queue(), // Datatype defined in util.js
});
var MAX_HIST = D.MAX_HIST || 10;

var ajax, oldword;

function queryDict(word, type){
  // Check cache
  var cache=D.queryDictQueue;
  if (word && cache.size()>0) {
    for (var i=0;i<cache.size();i++){
      var json = cache.get(i);
      if (word.toLowerCase()===json.word.toLowerCase() && 
          type === json.type) {
        console.log('Load from dict jsonp cache',type,word);
        // foramt start
        window.DICT_format(json, type);
        return json;
      }
    }
  }

  if (ajax) {
      console.log('Cancel ajax:' + oldword);
      ajax.abort();
  }

  // http://otherhost/dict/t/hello/?callback=DICT_format
  var url = D.lb_host(word)+'dict/'+type+'/'+encodeURIComponent(word)+'/';
  // Change debug URL when connect to GAE.
  $('#__debugAjax__').attr('href', url);
  console.log('JSONP load: ', url);

  // No cache, get & push to cache.
  ajax=$.jsonp({
    'dict':{'word': word,},
    'url': url,
    'success': function(json, textStatus, xOptions) {

       // add to cache
       if (D.queryDictQueue.size() >= MAX_HIST){
            console.log('Dequeue cache:', this.dict.word);
            D.queryDictQueue.dequeue();
       }
       console.log('Put into cache:', this.dict.word);
       D.queryDictQueue.enqueue(json);

       console.log('Dict JSONP Success! Call formatter.');
       window.DICT_format(json);

    },
  });

  oldword = word;// backup
}


// END OF AMD
})(jQuery);
