;(function($){

/////////// Main Entry. /////////////
var option=DICT_PLUGINS.weblios = {
	'prefix': 'http://ejje.weblio.jp/small/content/',
	'format': formatWeblioForSmartPhoneLayout,
    'removeTags': ['iframe','noscript','script','img']
};

/////////// Weblio for Smart Phone.(Another sample) /////////////
function formatWeblioForSmartPhoneLayout(src) {
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
