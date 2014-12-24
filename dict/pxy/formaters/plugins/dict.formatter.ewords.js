/*************************************************
 * dict.formatter.ewords.js
 **************************************************/
;(function($){
'use strict';
var D= $.dict_extend();
// A plugin name starts with `auto_` will call `Auto Mode` first.
// Then when prefix match prefix defined in NON `auto` version, NON `auto` version will be fired
// Why do this: search result from google is much better.
D.DICT_PLUGINS.auto_ewords = {
    'autoKey'   : 'site:e-words.jp', // a key will append to search result when `Auto Mode`
    'nextLoader': 'ewords',  // same as defined bellow.
}
var option = D.DICT_PLUGINS.ewords = {
    'type' : 'ewords',
    'host' : '//e-words.jp/w',
    //'mobile_host' : '//sp.e-words.jp', // NG cause e-words SP layout not support YQL
    'prefix': [ /^http:\/\/e\-words\.jp\/w\/([^\/]+).html$/   ,  /^http:\/\/sp\.e\-words\.jp\/w\/([^\/]+).html$/  ] ,  // key is not always a word. e.g: E8A898E686B6E5AA92E4BD93.html
    'format': formatEWords,
    'removeTags': ['title','meta','iframe','noscript','script','link','form','nobr'],
    'isCleanLinks': true,
};

// JSON sample
function formatEWords(src) {
    console.log(D.LC, '[dict.formatter.ewords.js] format start...');
    return D.preFormat(option, src, customizePage);
}


// Customize for this page
function customizePage($target){//,#left-navigation

    var $sideBar = $('td#side', $target);
    var $content = $sideBar.parent().parent().parent();

    var $styles = $('style', $target);
    $content.append($styles); // add tooltips
    //$sideBar.prependTo($sideBar.parent()); // Move side bar to left side

    $('[width]', $content).andSelf().removeAttr('width').css("width","auto");
    $('.adsbygoogle', $content).remove();
    //$('#linkunit>div', $content).nextAll().remove();
    
    // Enable tooltips
    $('a', $content).addClass('dict-css-tooltip');
    
    var $delTheGenDate = $("#hr", $target).nextAll();
    if ( /\/\/[0-9.]+生成/.test( $delTheGenDate.text().replace(/\s|\n/g,'') ) ){
        $delTheGenDate.remove();
    }
    // use return for replacing $target with $content
    return $content;
}







})(jQuery);
