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
    //'mobile_host' : 'http://m.kotobank.jp', // now it use responsive design
    'prefix': [ /^http(|s):\/\/kotobank\.jp\/word\/([^\/]+)$/   ,  /^\/word\/([^\/]+)$/  ] , 
    'format': formatKotobank,
    'removeTags': ['title','meta','iframe','noscript','script','link','form','style','nobr','img'],
    'isLoadFromGoogleCache': true, // TODO: (Kotobank changed it's url? so use google cache for first load)
    'isCleanLinks': true,
};

var baseProtocal = 'https://';
// JSON sample
function formatKotobank(src) {
    if (!src.contains(baseProtocal+'kotobank.jp/')){
        baseProtocal = 'http://';
    }
    console.log(D.LC, '[dict.formatter.kotobank.js] format start...');
    // Notice: customizePage executed before cleanLink
    var $t = D.preFormat(option, src, customizePage);

    if (option.isLoadFromGoogleCache){
        enhanceLinkWithGoogleWebCache($t);
    }
    return $t;
}


// Customize for this page 
function customizePage($t){
    // $("#footer_link, #get_app, #bookmark, #contents>div:first, .ad_source_c", $t).remove();
    // $("#relatedKeyword",$t).nextAll().remove();
    // $(".word_copy",$t).prev().andSelf().remove();
    // $('#logo', $t).replaceWith('<span>KotoBank</span>');

    //Remove text from google;
    if (option.isLoadFromGoogleCache){
        $('div:first', $t).hide();
    }

    $('#toplogo,#hdY,#hdMenu,#searchArea,#topicPath,.anchorwrap', $t).remove();
    $('#hdNav').nextAll().remove();

    return $t;
}

// Enhance web cache links
// https%3A%2F%2Fwww.java.com%2Fja%2Fdownload%2Fhelp%2F
var GOOGLE_CACHE_URL='http://webcache.googleusercontent.com/search?q=cache:#url#+hightlight&hl=ja&gl=jp&lr=lang_en|lang_zh-CN|lang_ja&prmd=imvns&strip=1'
function enhanceLinkWithGoogleWebCache($t) {
    var $nodes = $('a', $t);
    $nodes.each(function(){
        var href = $(this).attr('href');
        if (href){
            href=href.replace(/^http:\/\/|^https:\/\//, baseProtocal);
            //var hrefWithHost = D.getHrefWithHost(option.host, href);
            $(this).attr('href', GOOGLE_CACHE_URL.replace('#url#', encodeURIComponent(href)))
                   .attr('target','_blank'); // Seams not work in YQL ... TODO

        }
    });
}






})(jQuery);
