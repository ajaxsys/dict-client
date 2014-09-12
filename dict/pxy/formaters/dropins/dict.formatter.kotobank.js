/*************************************************
 * dict.formatter.kotobank.js
 **************************************************/
;(function($){
'use strict';
var D= $.dict_extend();
// A plugin name starts with `auto_` will call `Auto Mode` first.
// Then when prefix match prefix defined in NON `auto` version, NON `auto` version will be fired
// Why do this: search result from google is much better.
D.DICT_PLUGINS.auto_kotobank = {
    'autoKey'   : 'site:kotobank.jp', // a key will append to search result when `Auto Mode`
    'nextLoader': 'kotobank',  // same as defined bellow.
}
var option = D.DICT_PLUGINS.kotobank = {
    'type' : 'kotobank',
    'host' : '//kotobank.jp',
    'mobile_host' : '//m.kotobank.jp',
    'prefix': [ /^http:\/\/kotobank\.jp\/word\/([^\/]+)$/   ,  /^\/word\/([^\/]+)$/  ] ,  // key is not always a word. e.g: E8A898E686B6E5AA92E4BD93.html
    'format': formatKotobank,
    'removeTags': ['title','meta','iframe','noscript','script','link','form','style','nobr','img'],
    'isCleanLinks': true,
};

// JSON sample
function formatKotobank(src) {
    console.log(D.LC, '[dict.formatter.kotobank.js] format start...');
    return D.preFormat(option, src, customizePage);
}


// Customize for this page
function customizePage($t){
    $("#footer_link, #get_app, #bookmark, #contents>div:first, .ad_source_c", $t).remove();
    $("#relatedKeyword",$t).nextAll().remove();
    $(".word_copy",$t).prev().andSelf().remove();
    $('#logo', $t).replaceWith('<span>KotoBank</span>');
}







})(jQuery);
