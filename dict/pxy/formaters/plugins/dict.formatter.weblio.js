/*************************************************
 * dict.formatter.weblio.js
 *
 * Weblio for SmartPhone.(Access from SP, mainly hit from google result)
 **************************************************/
;(function($){
'use strict';
var D= $.dict_extend();
/////////// Main Entry. /////////////
D.DICT_PLUGINS.auto_weblio = {
    'autoKey'   : 'site:ejje.weblio.jp', // a key will append to search result when `Auto Mode`
    'nextLoader': 'weblio',  // same as defined bellow.
}
var option = D.DICT_PLUGINS.weblio = {
    'type' : 'weblio',
    'host' : '//ejje.weblio.jp',
    'mobile_host' : '//ejje.weblio.jp/small',
    'prefix': [   /^http:\/\/ejje\.weblio\.jp\/content\/([^\/]+)/ ,  /^http:\/\/ejje\.weblio\.jp\/small\/content\/([^\/]+)/  ], // URL Displayed in google search result 
    'format': formatWeblioForSmartPhoneLayout,
    'removeTags': ['title','meta','iframe','noscript','script','img', 'link'],
    'inject_resources': ['#weblio_css'], // Defined in preload.html
};

function formatWeblioForSmartPhoneLayout(src) {
    console.log(D.LC, '[dict.formatter.weblio.js] format start...');

    // Preformat by common util, then callback the customize function.
    return D.preFormat(option, src, customizePage);
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

    return customizePageSmall($target);
}

function customizePageSmall($target){
    // Customize page
    // .wejtyInfoSmp: info of robot
    // .division3: info of auth
    $('.ad,.tab2,.division3,header,footer,aside,p.btn',$target).remove();
    $('.close', $target).removeClass('close').addClass('open');
    $('ul', $target).removeClass('listArrow');
    // Too big title
    //$('.ttl1',$target).css('fontSize','22px');

    return $target
}


})(jQuery);
