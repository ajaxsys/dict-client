/**
 * $src     : html source
 * group    : e.g. en2jp
 * dict_from: e.g. local, serverID or internet URL
 */
;(function($){
/*jshint -W020 */

if (typeof DICT == 'undefined') {
	DICT = {}
}

$.formatDict = function(src, dict_type){
	console = window.console || {"log":function(){}};

    // Not exist dict
	var dict = DICT[dict_type];
    if (dict == null) {
        console.log('[WARN] NOT supported dict!');
        return "";
    }
    return dict.format(src);
}

})(jQuery);
