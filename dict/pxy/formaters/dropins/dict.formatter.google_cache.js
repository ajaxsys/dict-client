/*************************************************
 * dict.formatter.google_cache.js
 **************************************************/
;(function($){
'use strict';
var D= $.dict_extend();
// A plugin name starts with `auto_` will call `Auto Mode` first.
// Then when prefix match prefix defined in NON `auto` version, NON `auto` version will be fired
// Why do this: search result from google is much better.
var option = D.DICT_PLUGINS.google_cache = {
    'type' : 'google_cache',
    'host' : 'http://www.google.com/search?q=cache', // http://dictionary.goo.ne.jp/leaf/...
    'prefix': [    /^http:\/\/www\.google\.com\/search\?q=cache.*$/   ] ,  // NOTICE key(group no1) is not always a word. 
    'format': formatCommon,
    'removeTags': ['iframe','noscript','script','link','form','style','nobr','img'],
    'isCleanLinks': false,
};

// JSON sample
function formatCommon(src) {
    console.log(D.LC, '[dict.formatter.google_cache.js] format start...');
    return D.preFormat(option, src, customizePage);
}


// Customize for this page
function customizePage($target){
    console.log(D.LC, '[dict.formatter.google_cache.js] Customize format start...');

    //Remove text from google;
    //$('base', $target).next().empty().text('Google Cache');
    $('div:first', $target).remove();
    $('a', $target).attr('target', '_blank');

    // common remove 
    var $headAndFoot = $('#header, #footer, header, footer, .header, .footer', $target);
    console.log(D.LC, '[dict.formatter.google_cache.js] Removed headers or footers:', $headAndFoot.length);
    $headAndFoot.remove();

    var searchWord = $('#__search__').val();
    $target.highlight(searchWord.split(/[ \t　]+/));

    // Set move to point
    $('.highlight:first', $target).attr('id', D.MOVE_POINT_ID);

    return $target;
}





})(jQuery);
