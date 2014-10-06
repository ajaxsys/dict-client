/*************************************************
 * dict.formatter.js
 *
 * formater main entry.
 * Depend on plugins in formatters/*.js
 **************************************************/
;(function($){
// Regist plguins
'use strict';
var D= $.dict_extend();
D.DICT_PLUGINS = D.DICT_PLUGINS || {};

// Global method for JSONP (NO need global in jsonp plugin)
// Expect json format of data: {"type":"__", "word","__", "src","__"}
window.DICT_format = function(data, type){
    type = type || data.type;
    console.log(D.LC, '[dict.formatter.js] Format start by type: ',type);
    var $explain = formatDict(data.src, type);
    if ($explain) {
        var $result = $('#__explain_wrapper_appender__');
        D.applyPreloadResources(type);
        //$result.empty().append($explain);
        setTimeout(function(){
            $result.empty().append($explain);
        },0);
    }
    return data;
}

function formatDict(src, dict_type){
    // Regist formatter before use
    var formatter = D.DICT_PLUGINS[dict_type];
    if (!formatter) {
        console.log(D.LC, '[dict.formatter.js] [WARN] NOT supported formatter!');
        return "";
    }
    return formatter.format(src);
}


})(jQuery);
