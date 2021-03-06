/*************************************************
 * dict.formatter.goo.js
 **************************************************/
;(function($){
'use strict';
// A plugin name starts with `auto_` will call `Auto Mode` first.
// Then when prefix match prefix defined in NON `auto` version, NON `auto` version will be fired
// Why do this: search result from google is much better.
var D= $.dict_extend();
D.DICT_PLUGINS.auto_goo = {
    'autoKey'   : 'site:dictionary.goo.ne.jp', // a key will append to search result when `Auto Mode`
    'nextLoader': 'goo',  // same as defined bellow.
}
var option = D.DICT_PLUGINS.goo = {
    'type' : 'goo',
    'host' : 'http://dictionary.goo.ne.jp', // http://dictionary.goo.ne.jp/leaf/...
    'prefix': [    /^http:\/\/dictionary\.goo\.ne\.jp\/leaf\/.*$/  ,  /^\/leaf\/.*$/   ] ,  // NOTICE key(group no1) is not always a word. 
    'format': formatGoo,
    'removeTags': ['title','meta','iframe','noscript','script','link','form','style','nobr','img'],
    'isCleanLinks': true,
};

// JSON sample
function formatGoo(src) {
    console.log(D.LC, '[dict.formatter.goo.js] format start...');
    return D.preFormat(option, src, customizePage);
}


// Customize for this page
function customizePage($target){
    var $tmp = $('.contents-wrap-b' ,$target); 
    
    return $tmp;// Keep id = main only. If no return , $target will be content.
}







})(jQuery);
