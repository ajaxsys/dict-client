/*************************************************
 * dict.formatter.google_cache.js
 **************************************************/
;(function($){
'use strict';
// A plugin name starts with `auto_` will call `Auto Mode` first.
// Then when prefix match prefix defined in NON `auto` version, NON `auto` version will be fired
// Why do this: search result from google is much better.
var option = DICT_PLUGINS.google_cache = {
    'type' : 'google_cache',
    'host' : 'http://www.google.com/search?q=cache', // http://dictionary.goo.ne.jp/leaf/...
    'prefix': [    /^http:\/\/www\.google\.com\/search\?q=cache.*$/   ] ,  // NOTICE key(group no1) is not always a word. 
    'format': formatCommon,
    'removeTags': ['iframe','noscript','script','link','form','style','nobr','img'],
    'isCleanLinks': false,
};

// JSON sample
function formatCommon(src) {
    console.log($.dict_extend().LC, '[dict.formatter.google_cache.js] format start...');
    return $.dict_extend().preFormat(option, src, customizePage);
}


// Customize for this page
function customizePage($target){
    console.log($.dict_extend().LC, '[dict.formatter.google_cache.js] Customize format start...');

    //Remove text from google;
    //$('base', $target).next().empty().text('Google Cache');
    $('div:first', $target).remove();
    $('a', $target).attr('target', '_blank');

    // common remove 
    var $headAndFoot = $('#header, #footer, header, footer, .header, .footer', $target);
    console.log($.dict_extend().LC, '[dict.formatter.google_cache.js] Removed headers or footers:', $headAndFoot.length);
    $headAndFoot.remove();

    var searchWord = $('#__search__').val();
    $target.highlight(searchWord);
    return $target;
}





})(jQuery);
