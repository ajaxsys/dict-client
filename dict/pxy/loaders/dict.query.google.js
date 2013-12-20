/**
 * Load google result using jsonp. Support auto mode(google as ajuster)
 */
(function($){
var D=$.dict_extend();
D=$.dict_extend({
    'queryGoogle': queryGoogle,
    'queryGoogleQueue': new D.Queue(), // Datatype defined in util.js
});

var MAX_HIST = D.MAX_HIST || 10;

var ajax, oldword;

function queryGoogle(word, type){
  // Check cache
  var cache=D.queryGoogleQueue;
  if (word && cache.size()>0) {
    for (var i=0;i<cache.size();i++){
      var json = cache.get(i);
      if (word.toLowerCase()===json.word.toLowerCase()) {
        console.log('Load from google jsonp cache',type,word);
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


  var url = "http://ajax.googleapis.com/ajax/services/search/web?v=1.0";
  // Change debug URL when connect to GAE.
  $('#__debugAjax__').attr('href', url);
  console.log('JSONP load: ', url);

  // No cache, get & push to cache.
  ajax=$.jsonp({
    'dict': {'word':word},
    'data': {'q':word,'rsz':8,'start':0},
    'url': url,
    'success': function(r){
      var json=r.responseData;
      json.word=word;
      json.type=type; // regist type used in format plugin

      // add to cache
      if (D.queryGoogleQueue.size() >= MAX_HIST){
          D.queryGoogleQueue.dequeue();
      }
      D.queryGoogleQueue.enqueue(json);

      console.log('Google load successful.Call formatter');
      window.DICT_format(json);
    },
    'error': function(e,t,x) {
      if (type==='auto') {
          console.log('Google load error, try other loader...');
          // foramt start
          D.queryDict(word,'weblios'); // Google failed, use another...
      } else { // google only
          this.errorOrigin(e,t,x)
      }
    },
  });

  oldword = word;// backup
}


// END OF AMD
})(jQuery);
