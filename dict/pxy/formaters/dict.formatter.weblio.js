;(function($){

/////////// Main Entry. /////////////
var option = DICT_PLUGINS.weblio = {
	'prefix': 'http://ejje.weblio.jp/content/',
	'format': formatWeblioSmallPage,
    'removeTags': ['iframe','noscript','script','img']
};

// Call util
function formatWeblioSmallPage(src) {
    // Preformat by common util, then callback the customize function.
    return $.dict_extend().preFormat(option, src, customizeWeblioSmallPage);
}

// Customize for this page
function customizeWeblioSmallPage($target){
    // Customize page
    // .wejtyInfoSmp: info of robot
    // .division3: info of auth
    $('.tngWdAdBtn,.ad,header,footer,aside,.wejtyInfoSmp,.division3,p.btn,.noRstTngBtn,.wejtyInfoSmp',$target).remove();
    $('.close', $target).removeClass('close').addClass('open');
    // Too big title
    $('.ttl1',$target).css('fontSize','22px');
}




})(jQuery);
