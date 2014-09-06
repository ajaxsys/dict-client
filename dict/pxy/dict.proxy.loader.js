/*************************************************
 * dict.loader.js
 *
 * Search query by provided type and keyword.
 **************************************************/

;(function($){
'use strict';
var D = $.dict_extend({
    'loadQuery': doQuery,
    'loadQueryDirectly': callFetchURLLoader,
    'loadQueryWithHistory' : doQueryWithHistory,
});

function init(){
    D.LC++;// For logger
    D.triggerOnceOnScrollBottom = null;// Reset on scroll bottom callback
    D.isSearchRedirect = false;// Reset redirect flg
}

function doQueryWithHistory(query, type, url){
    doQuery(query, type, url, 'useHistory');    
}

function doQuery(query, type, url, isPushToHistory){
    var $searchBox = $('#__search__');
    init();
    console.log(D.LC, '[dict.loader.js] =========doQuery Start============');
    // Get from caller
    query = query || D.getUrlHashValue() || $searchBox.val();
    if (!query) {
        console.log(D.LC, '[dict.loader.js] [WARN] No Search Key.');
        return;
    }
    type = type || D.getSelectedType() || 'auto';

    var word = decodeURIComponent(query);
    console.log(D.LC, '[dict.loader.js] Decode search key:', query, ' -> ', word, ' | type=', type);

    if (query && type && isNotKey(word)) {
        if (isPushToHistory){
            D.pushNavi([query, type, url]);
        }

        $searchBox.val(word);

        if (doUseNativeJSONP(word, type)){
            // Some site use special api
            return;
        }else if(url){
            console.log(D.LC, '[dict.loader.js] Using directly mode:', url);
            callFetchURLLoader(word, type, url);
        }else{
            callGoogleLoader(word, type);
        }
    } else {
        console.log(D.LC, '[dict.loader.js] NG search:', query, type, word);
    }
}

function doUseNativeJSONP(word, type){
    if ('xiaod'.equals(type)){
        D.queryDictByXiaod(word);
        return true;
    }
    return false;
}

function callFetchURLLoader(word, type, url){
    // Change URL
    url = D.changeToMobileUrl(url, D.DICT_PLUGINS[type]);
    url = D.addHttpProtocal(url);

    D.queryDictByYQL(word, type, url);// Load by URL directly
}

// Loader will auto call formatter.
function callGoogleLoader(word, type){
    if (!type){
        type = 'auto';
    } else if (type.indexOf('auto')!==0 && type!=='google'){
        type = 'auto_' + type;
    }

    // If auto key exist use Auto Mode with addtion key
    var plugin = D.DICT_PLUGINS[type];
    if (plugin && plugin.autoKey){
        console.log(D.LC, '[dict.loader.js] Redirect search type: ',type, '--->auto');
        type = 'auto';
        D.queryGoogle(word, type, plugin);// Using auto mode plugin
    } else {
        D.queryGoogle(word, type);
    }

    // Deprecated
    // D.queryDict(word, type);
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
