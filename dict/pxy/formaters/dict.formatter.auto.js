;(function($){

/////////// Main Entry. /////////////
var D=$.dict_extend();
var option = DICT_PLUGINS.auto = {
	'format': formatFirstGoogleThenUseOtherFormatterIfExisted,
};

// JSON sample
// {"results":[{"GsearchResultClass":"GwebSearch","unescapedUrl":"http://www.world.co.jp/","url":"http://www.world.co.jp/","visibleUrl":"www.world.co.jp","cacheUrl":"http://www.google.com/search?q=cache:bSVTDZN7KhoJ:www.world.co.jp","title":"Corp <b>World</b>","titleNoFormatting":"Corp (WORLD)","content":"Hello <b>World</b>"},{},...]}
function formatFirstGoogleThenUseOtherFormatterIfExisted(json) {
    console.log('format auto mode start...');
    var i,r;
    // Use other plugins if matched in google search result
    for (i in json.results) {
        r = json.results[i];
        var pluginType = D.getPluginTypeByPrefix(r.url);
        if (pluginType) {
           console.log('Decided using formatter: ',pluginType, 'for key: ',json.key );
           D.queryDict(json.key, pluginType);
           return;
        }
    }

    return DICT_PLUGINS.google.format(json);
}





})(jQuery);
