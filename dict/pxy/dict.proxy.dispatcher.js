/*************************************************
 * dict.formatter.auto.js
 *
 * Formatter of auto mode. 
 * First check google, then check if existed plugin on result list.
 * If not exist, show google result.
 **************************************************/

;(function($){
'use strict';
/////////// Main Entry. /////////////
var D=$.dict_extend({
    'detectExistedPluginByPrefix':detectExistedPluginByPrefix,
});
var option = DICT_PLUGINS.auto = {
    'format': formatFirstGoogleThenUseOtherFormatterIfExisted,
};

// JSON sample
// {"results":[{"GsearchResultClass":"GwebSearch","unescapedUrl":"http://www.world.co.jp/","url":"http://www.world.co.jp/","visibleUrl":"www.world.co.jp","cacheUrl":"http://www.google.com/search?q=cache:bSVTDZN7KhoJ:www.world.co.jp","title":"Corp <b>World</b>","titleNoFormatting":"Corp (WORLD)","content":"Hello <b>World</b>"},{},...]}
function formatFirstGoogleThenUseOtherFormatterIfExisted(json) {
    console.log(D.LC, '[dict.formatter.auto.js] Auto Mode start...');
    var i,plugin;
    // Use other plugins if matched in google search result
    plugin = detectExistedPluginByPrefixWithPluginOrder( json.results );// Need unescapedUrl

    if (plugin) {
        var word = json.word,
            newWord = plugin.wordFromURL,// Get new word from url. But not all url contains word!! *1
            type = plugin.type,
            url  = plugin.unescapedUrl;// used by YQL 
        // Check if use new word, only new word contains word, then use it. *1
        if (  newWord && newWord.toLowerCase().indexOf(word.toLowerCase())>=0   ){
            word = newWord;
        }

        console.log(D.LC, '[dict.formatter.auto.js] Decided using formatter: ', type, ' And key: ', word);

        // Recall loader/dict.load.xxx.js
        D.loadQueryDirectly(word, type, url);
        D.isSearchRedirect = true; // tell caller(dict.load.google.js) not stop
        return;
    }
    // No valid plugin, show google by default.
    return DICT_PLUGINS.google.format(json);
}

function detectExistedPluginByPrefixWithPluginOrder(results){
    for (var pluginType in window.DICT_PLUGINS) {
        var thisPrefix = window.DICT_PLUGINS[pluginType].prefix;
        if (!thisPrefix)
            continue;
        var prefixes = [].concat(thisPrefix);// Support multi prefix. string --> []

        // Engine Priority is defined in Gruntfile.js
        for (var j in prefixes) {
           for (var k in results) {
                var url = results[k].unescapedUrl;   //  URL inside *2
                if (url) {
                    var prefixRegexp = prefixes[j];
                    var matcher = url.match(  prefixRegexp  );
                    if ( matcher && matcher.index===0){ //  && matcher[1] : NOT all url contains word!! *1
                        return {
                                  'type': pluginType,
                                  'wordFromURL': matcher[1], // undefined if UN-match. *1
                                  'unescapedUrl' : url
                               };
                    }
                }
            }
        }

    }
    return null; 
}

function detectExistedPluginByPrefix(url){ 
    //var url = aResult.unescapedUrl;                  //  URL outside *2
    if (url) {
        for (var pluginType in window.DICT_PLUGINS) {
            var thisPrefix = window.DICT_PLUGINS[pluginType].prefix;
            if (!thisPrefix)
                continue;
            var prefixes = [].concat(thisPrefix);// Support multi prefix. string --> []

            for (var j in prefixes) {
                var prefixRegexp = prefixes[j];
                var matcher = url.match(  prefixRegexp  );
                if ( matcher && matcher.index===0){ //  && matcher[1] : NOT all url contains word!! *1
                    return {
                              'type': pluginType,
                              'wordFromURL': matcher[1], // undefined if UN-match. *1
                              'url' : url
                           };
                }
            }
        }
    }
    return null; 
}


})(jQuery);
