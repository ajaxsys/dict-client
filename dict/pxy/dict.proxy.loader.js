/*************************************************
 * dict.loader.js
 *
 * Search query by provided type and keyword.
 **************************************************/

;(function($){

var D = $.dict_extend({
    'loadQuery': doQuery,
});

function init(){
    D.LC++;// For logger
    D.triggerOnceOnScrollBottom = null;// Reset on scroll bottom callback
    D.isSearchRedirect = false;// Reset redirect flg
}

function doQuery(query, type){
    init();
    console.log(D.LC, '[dict.loader.js] =========doQuery Start============');
    // Get from caller
    query = query || getUrlHashValue();
    if (!query) {
        console.log(D.LC, '[dict.loader.js] [WARN] No Search Key.');
        return;
    }
    type = type || getSelectedDict() || 'auto';

    var word = decodeURIComponent(query);
    console.log(D.LC, '[dict.loader.js] Decode search key:', query, ' -> ', word, ' | type=', type);

    if (query && type && isNotKey(word)) {
        $('#__search__').val(word);
        callLoader(word, type);
        // others
        $('#__debugSelf__').attr('href', window.location.href);
    } else {
        console.log(D.LC, '[dict.loader.js] NG search:', query, type, word);
    }
}

// Loader will auto call formatter.
function callLoader(word, type){

  // ajuster mode: `type` must be auto
  if (type && (type.indexOf('auto')>=0 || type.indexOf('google')>=0) ) {
    // If auto key exist use Auto Mode with addtion key
    var plugin = window.DICT_PLUGINS[type];
    if (plugin && plugin.autoKey){
        console.log(D.LC, '[dict.loader.js] Redirect search type: ',type, '--->auto');
        type = 'auto';
        D.queryGoogle(word, type, plugin);// Using auto mode plugin
    } else {
        D.queryGoogle(word, type);
    }

  } else {
    // Deprecated
    D.queryDict(word, type);
  }
}

function getUrlHashValue() {
    var vals = window.location.href.split('#');
    if (vals.length > 1)
        return vals[1].split('?')[0];
    else
        return '';
}

function getSelectedDict(){
    var type = D.getParamFromURL('type');
    if (type) {
        console.log(D.LC, '[dict.loader.js] Use direct search type: ',type);
        return type;
    }
    return $('#__dict_type__ li.active>a').attr('value');
}


function isNotKey(word){
    return word.indexOf('__') !== 0;
}

/* // NO USE: because search will redirect page to blank
function searchToObject() {
  var pairs = window.location.search.substring(1).split("&"),
    obj = {},
    pair,
    i;

  for ( i in pairs ) {
    if ( pairs[i] === "" ) continue;

    pair = pairs[i].split("=");
    obj[ decodeURIComponent( pair[0] ) ] = decodeURIComponent( pair[1] );
  }

  return obj;
}
*/


// END OF AMD
})(jQuery);
