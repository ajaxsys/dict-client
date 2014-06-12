/*************************************************
 * dict.formatter.kotobank.js
 **************************************************/
;(function($){

// A plugin name starts with `auto_` will call `Auto Mode` first.
// Then when prefix match prefix defined in NON `auto` version, NON `auto` version will be fired
// Why do this: search result from google is much better.
DICT_PLUGINS.auto_kotobank = {
    'autoKey'   : 'site:kotobank.jp', // a key will append to search result when `Auto Mode`
    'nextLoader': 'kotobank',  // same as defined bellow.
}
var option = DICT_PLUGINS.kotobank = {
    'type' : 'kotobank',
    'host' : '//kotobank.jp',
    'mobile_host' : '//m.kotobank.jp',
    'prefix': [ /^http:\/\/kotobank\.jp\/word\/([^\/]+)$/   ,  /^\/word\/([^\/]+)$/  ] ,  // key is not always a word. e.g: E8A898E686B6E5AA92E4BD93.html
    'format': formatKotobank,
    'removeTags': ['iframe','noscript','script','link','form','style','nobr','img'],
    'isCleanLinks': true,
};

// JSON sample
function formatKotobank(src) {
    console.log($.dict_extend().LC, '[dict.formatter.kotobank.js] format start...');
    return $.dict_extend().preFormat(option, src, customizePage);
}


// Customize for this page
function customizePage($t){
    $("#footer_link, #get_app, #bookmark, #contents>div:first", $t).remove();
    $("#relatedKeyword",$t).nextAll().remove();
    $(".word_copy",$t).prev().andSelf().remove();
    $('#logo', $t).replaceWith('<span>kotobank</span>');
}







})(jQuery);
