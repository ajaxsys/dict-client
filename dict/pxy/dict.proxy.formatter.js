/*************************************************
 * dict.formatter.js
 *
 * formater main entry.
 * Depend on plugins in formatters/*.js
 **************************************************/
;(function($){
// Regist plguins

window.DICT_PLUGINS = window.DICT_PLUGINS || {};

// Global method for JSONP (NO need global in jsonp plugin)
// Expect json format of data: {"type":"__", "word","__", "explain","__", refer,"__"}
window.DICT_format = function(data, type){
    type = type || data.type; // 
    console.log($.dict_extend().LC, '[dict.formatter.js] Format start by type: ',type);
    // contain `.src` means it's an html page
    // no `.src` means it's a json format
    var src = data.src || data;
    var $explain = formatDict(src, type);
    if ($explain) {
        var $result = $('#__explain_wrapper__');
        $result.empty().append($explain);
    }
    return data;
}

function formatDict(src, dict_type){
    // Regist formatter before use
    var formatter = DICT_PLUGINS[dict_type];
    if (!formatter) {
        console.log($.dict_extend().LC, '[dict.formatter.js] [WARN] NOT supported formatter!');
        return "";
    }
    return formatter.format(src);
}


})(jQuery);
