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
    'host' : 'http://kotobank.jp',
    //'mobile_host' : 'http://m.kotobank.jp', // now it use responsive design
    'prefix': [ /^http(|s):\/\/kotobank\.jp\/word\/([^\/]+)$/   ,  /^\/word\/([^\/]+)$/  ] , 
    'format': formatKotobank,
    'removeTags': ['title','meta','iframe','noscript','script','link','form','style','nobr','img'],
    'isLoadFromGoogleCache': true, // TODO: (YQL loads https failed? so use google cache )
    'isCleanLinks': true,
};

// JSON sample
function formatKotobank(src) {
    console.log(D.LC, '[dict.formatter.kotobank.js] format start...');
    return D.preFormat(option, src, customizePage);
}


// Customize for this page 
function customizePage($t){
    // $("#footer_link, #get_app, #bookmark, #contents>div:first, .ad_source_c", $t).remove();
    // $("#relatedKeyword",$t).nextAll().remove();
    // $(".word_copy",$t).prev().andSelf().remove();
    // $('#logo', $t).replaceWith('<span>KotoBank</span>');

    //Remove text from google;
    $('div:first', $t).remove();

    $('#toplogo,#hdY,#hdMenu,#searchArea,#topicPath,.anchorwrap', $t).remove();
    $('#hdNav').nextAll().remove();
    return $t;
}







})(jQuery);
