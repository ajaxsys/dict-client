/*************************************************
 * dict.formatter.weblio.js
 *
 * Weblio for SmartPhone.(Access from SP, mainly hit from google result)
 **************************************************/
;(function($){

/////////// Main Entry. /////////////
DICT_PLUGINS.auto_weblio = {
    'autoKey'   : 'site:ejje.weblio.jp', // a key will append to search result when `Auto Mode`
    'nextLoader': 'weblio',  // same as defined bellow.
}
var option = DICT_PLUGINS.weblio = {
	'prefix': /^http:\/\/ejje\.weblio\.jp\/content\/([^\/]+)/,
	'format': formatWeblioForSmartPhoneLayout,
    'removeTags': ['iframe','noscript','script','img']
};

function formatWeblioForSmartPhoneLayout(src) {
    console.log($.dict_extend().LC, '[dict.formatter.weblio.js] format start...');

    // Preformat by common util, then callback the customize function.
    return $.dict_extend().preFormat(option, src, customizePage);
}

// Customize for this page
function customizePage($target){
    // Customize page
    // .wejtyInfoSmp: info of robot
    // .division3: info of auth
    $('.tngWdAdBtn,.ad,header,footer,aside,.wejtyInfoSmp,.division3,p.btn,.noRstTngBtn,.wejtyInfoSmp',$target).remove();
    $('.close', $target).removeClass('close').addClass('open');
    // Too big title
    $('.ttl1',$target).css('fontSize','22px');
}




})(jQuery);
