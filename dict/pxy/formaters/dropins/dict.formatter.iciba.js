/*************************************************
 * dict.formatter.iciba.js
 **************************************************/
;(function($){
'use strict';
var D= $.dict_extend();
// A plugin name starts with `auto_` will call `Auto Mode` first.
// Then when prefix match prefix defined in NON `auto` version, NON `auto` version will be fired
// Why do this: search result from google is much better.
D.DICT_PLUGINS.auto_iciba = {
    'autoKey'   : 'site:www.iciba.com', // a key will append to search result when `Auto Mode`
    'nextLoader': 'iciba',  // same as defined bellow.
}
var option = D.DICT_PLUGINS.iciba = {
    'type' : 'iciba',
    'host' : '//www.iciba.com/',
    'mobile_host' : '//wap.iciba.com/cword/', // http://www.iciba.com/default/ --> http://wap.iciba.com/cword/default/
    'prefix': [ /^http:\/\/www\.iciba\.com\/([^\/]+)/  ] ,  // key is not always a word. e.g: E8A898E686B6E5AA92E4BD93.html
    'format': formatIciba,
    'removeTags': ['iframe','noscript','script','link','form','style','nobr','img'],
    'isCleanLinks': true,
};

function formatIciba(src) {
    console.log(D.LC, '[dict.formatter.iciba.js] format start...');
    return D.preFormat(option, src, customizePage);
}


// Customize for this page
function customizePage($t){
    $("div.h2",$t).prevAll().remove();
    $("div.box>div",$t).remove();
    $('div.top', $t).nextAll().andSelf().remove();
}







})(jQuery);
