/*************************************************
 * (Deprecated)
 * dict.formatter.weblio_small.js 
 *
 * Weblio for Small Version.(Access from PC OK)
 **************************************************/
;(function($){

/////////// Main Entry. /////////////
var option = DICT_PLUGINS.weblio_small = {
	'prefix': /^http:\/\/ejje\.weblio\.jp\/small\/content\/([^\/]+)/,
	'format': formatWeblioSmallPage,
    'removeTags': ['iframe','noscript','script','img']
};

function formatWeblioSmallPage(src) {
    console.log($.dict_extend().LC, '[dict.formatter.weblio_small.js] format start...');

    // Preformat by common util, but not use callback.
    var $target = $.dict_extend().preFormat(option, src);
    return customizePage($target);
}

function customizePage($target){
    // Customize page
    // .wejtyInfoSmp: info of robot
    // .division3: info of auth
    $('.ad,.tab2,.division3,header,footer,aside,p.btn',$target).remove();
    $('.close', $target).removeClass('close').addClass('open');
    // Too big title
    //$('.ttl1',$target).css('fontSize','22px');

    return $target
}


})(jQuery);
