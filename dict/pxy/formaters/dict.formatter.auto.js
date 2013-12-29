/*************************************************
 * dict.formatter.auto.js
 *
 * Formatter of auto mode. 
 * First check google, then check if existed plugin on result list.
 * If not exist, show google result.
 **************************************************/

;(function($){

/////////// Main Entry. /////////////
var D=$.dict_extend();
var option = DICT_PLUGINS.auto = {
	'format': formatFirstGoogleThenUseOtherFormatterIfExisted,
};

// JSON sample
// {"results":[{"GsearchResultClass":"GwebSearch","unescapedUrl":"http://www.world.co.jp/","url":"http://www.world.co.jp/","visibleUrl":"www.world.co.jp","cacheUrl":"http://www.google.com/search?q=cache:bSVTDZN7KhoJ:www.world.co.jp","title":"Corp <b>World</b>","titleNoFormatting":"Corp (WORLD)","content":"Hello <b>World</b>"},{},...]}
function formatFirstGoogleThenUseOtherFormatterIfExisted(json) {
    console.log(D.LC, '[dict.formatter.auto.js] Auto Mode start...');
    var i,r;
    // Use other plugins if matched in google search result
    for (i in json.results) {
        r = json.results[i];
        var plugin = detectExistedPluginByPrefix( decodeURIComponent(r.unescapedUrl) );// Need unescapedUrl
        if (plugin) {
            var word = plugin.word;

            console.log(D.LC, '[dict.formatter.auto.js] Decided using formatter: ',plugin.type );
            console.log(D.LC, '[dict.formatter.auto.js] Redirect search key: ',json.word, '--->', word);

            D.queryDict(word, plugin.type);
            D.isSearchRedirect = true; // tell caller(dict.load.google.js) not stop
            return;
        }
    }

    return DICT_PLUGINS.google.format(json);
}


function detectExistedPluginByPrefix(url){
    for (var pluginType in window.DICT_PLUGINS) {
        var thisPrefix = window.DICT_PLUGINS[pluginType].prefix;
        if (!thisPrefix)
            continue;

        var prefixes = [].concat(thisPrefix);// Support multi prefix. string --> []
        if (prefixes.length>0 && url) {
            for (var i in prefixes) {
                var prefixRegexp = prefixes[i];
                var matcher = url.match(  prefixRegexp  );
                // Expect length=2. If key is "undefined" (length == 1), failed
                if ( matcher && matcher.index===0 && matcher[1]){
                    return {
                              'type': pluginType,
                              'word': matcher[1], 
                           };
                }
            }
        }
    }
    return null;
}


})(jQuery);
