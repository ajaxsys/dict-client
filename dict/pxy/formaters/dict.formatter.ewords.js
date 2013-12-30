/*************************************************
 * dict.formatter.ewords.js
 **************************************************/
;(function($){

// A plugin name starts with `auto_` will call `Auto Mode` first.
// Then when prefix match prefix defined in NON `auto` version, NON `auto` version will be fired
// Why do this: search result from google is much better.
DICT_PLUGINS.auto_ewords = {
    'autoKey'   : 'site:e-words.jp', // a key will append to search result when `Auto Mode`
    'nextLoader': 'ewords',  // same as defined bellow.
}
var option = DICT_PLUGINS.ewords = {
	'prefix': /^http:\/\/e\-words\.jp\/w\/([^\/]+)/,  // key is not always a word. e.g: E8A898E686B6E5AA92E4BD93.html
	'format': formatEWords,
    'removeTags': ['iframe','noscript','script'],
};

// JSON sample
function formatEWords(src) {
    console.log($.dict_extend().LC, '[dict.formatter.ewords.js] format start...');
    return $.dict_extend().preFormat(option, src, customizePage);
}


// Customize for this page
function customizePage($target){//,#left-navigation
    $(".header,#footer,.printfooter,#page-actions,.mw-search-pager-bottom,#mw-mf-page-left,[id$='navigation'],#jump-to-nav,#search",$target).remove();
}







})(jQuery);
