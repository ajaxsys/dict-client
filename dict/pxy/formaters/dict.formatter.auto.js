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
    var i;
    // Use other plugins if matched in google search result
    var plugin = detectExistedPluginByPrefix( json.results );// Need unescapedUrl
    if (plugin) {
        var word = json.word,
            newWord = plugin.word,// Get new word from url. But not all url contains word!!
            type = plugin.type,
            url  = plugin.unescapedUrl;// used by YQL 
        // Check if use new word
        if (  newWord && newWord.toLowerCase().indexOf(word.toLowerCase())>=0   ){
            word = newWord;
        }

        console.log(D.LC, '[dict.formatter.auto.js] Decided using formatter: ', type, ' And key: ', word);

        // If possible, change to URL for SP
        url = changeToMobileUrl(url, type);
        // Recall loader/dict.load.xxx.js
        D.queryDict(word, type, url);
        D.isSearchRedirect = true; // tell caller(dict.load.google.js) not stop
        return;
    }

    return DICT_PLUGINS.google.format(json);
}

// Change to URL for SP if possible
function changeToMobileUrl(url,type){
    var opt = DICT_PLUGINS[type];
    if (opt && opt.host && opt.mobile_host){
        var newUrl = url.replace(opt.host, opt.mobile_host);
        console.log(D.LC, '[dict.formatter.auto.js] URL ',url,' changed to mobile url:', newUrl);
        return newUrl;
    }else{
        return url;
    }
}

function detectExistedPluginByPrefix(googleResults){
    for (var pluginType in window.DICT_PLUGINS) {
        var thisPrefix = window.DICT_PLUGINS[pluginType].prefix;
        if (!thisPrefix)
            continue;
        var prefixes = [].concat(thisPrefix);// Support multi prefix. string --> []
        // Engine Priority is defined in Gruntfile.js
        for (var i in googleResults) {
            var r = googleResults[i],
                url = r.unescapedUrl;
            if (url) {
                for (var j in prefixes) {
                    var prefixRegexp = prefixes[j];
                    var matcher = url.match(  prefixRegexp  );
                    // Expect length=2. If key is "undefined" (length == 1), failed
                    if ( matcher && matcher.index===0 && matcher[1]){
                        // Regist last type
                        D.lastDictType = 'auto_' + pluginType;
                        return {
                                  'type': pluginType,
                                  'word': matcher[1],
                                  'unescapedUrl' : url
                               };
                    }
                }
            }
        }
    }
    return null;
}


})(jQuery);
