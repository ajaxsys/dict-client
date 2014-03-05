/*************************************************
 * dict.formatter.auto.js
 *
 * Formatter of auto mode. 
 * First check google, then check if existed plugin on result list.
 * If not exist, show google result.
 **************************************************/

;(function($){

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
    for (i in json.results) {
        plugin = detectExistedPluginByPrefix( json.results[i] );// Need unescapedUrl

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
    }
    // No valid plugin, show google by default.
    return DICT_PLUGINS.google.format(json);
}



function detectExistedPluginByPrefix(aResult){
    for (var pluginType in window.DICT_PLUGINS) {
        var thisPrefix = window.DICT_PLUGINS[pluginType].prefix;
        if (!thisPrefix)
            continue;
        var prefixes = [].concat(thisPrefix);// Support multi prefix. string --> []
        // Engine Priority is defined in Gruntfile.js

        var url = aResult.unescapedUrl;
        if (url) {
            for (var j in prefixes) {
                var prefixRegexp = prefixes[j];
                var matcher = url.match(  prefixRegexp  );
                // Expect length=2. If key is "undefined" (length == 1), failed
                if ( matcher && matcher.index===0){ //  && matcher[1] : NOT all url contains word!! *1
                    // Regist last type
                    return {
                              'type': pluginType,
                              'wordFromURL': matcher[1], // undefined if UN-match. *1
                              'unescapedUrl' : url
                           };
                }
            }
        }

    }
    return null;
}


})(jQuery);
