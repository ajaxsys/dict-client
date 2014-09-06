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
    'removeTags': ['iframe','noscript','script','link','form','style','nobr'],
    'isCleanLinks': true,
};

// JSON sample
function formatEWords(src) {
    console.log(D.LC, '[dict.formatter.ewords.js] format start...');
    return D.preFormat(option, src, customizePage);
}


// Customize for this page
function customizePage($target){//,#left-navigation
    // Customize page
    var $dataTable = $("table:eq(0)",$target);
    // Disable original width
    $('table',$dataTable).addBack().attr('width','100%');
    // Remove navi bar
    $('td[width=120]:last',$dataTable).remove();
    // Remove no use tag
    $('div,form',$dataTable).remove();
    // Remvoe bunya
    $('#side>ul:eq(0)',$dataTable).remove();

    $target.empty().append($dataTable);
    //$(".header,#footer,.printfooter,#page-actions,.mw-search-pager-bottom,#mw-mf-page-left,[id$='navigation'],#jump-to-nav,#search",$target).remove();
}







})(jQuery);
