/**
 * formater loader
 */
;(function($){
// Regist plguins
window.DICT_PLUGINS = window.DICT_PLUGINS || {};

// Global method for JSONP (NO need global in jsonp plugin)
window.DICT_format = function(data){
    console.log('format start...')
    var src = data.src;
    // format to proxy page
    //console.log("Source from proxy server:",src);
    var $explain = formatDict(src, data.type);
    if ($explain) {
        var $result = $('#__explain_wrapper__');
        $result.empty().append($explain);
    }
    return data;
}

function formatDict(src, dict_type){
    // Regist formatter before use
    var formatter = DICT_PLUGINS[dict_type];
    if (formatter == null) {
        console.log('[WARN] NOT supported formatter!');
        return "";
    }
    return formatter.format(src);
}


})(jQuery);
