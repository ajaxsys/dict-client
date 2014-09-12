/*************************************************
 * dict.formatter.xiaod.js
 **************************************************/
;(function($){
'use strict';
// A plugin name starts with `auto_` will call `Auto Mode` first.
// Then when prefix match prefix defined in NON `auto` version, NON `auto` version will be fired
// Why do this: search result from xiaodgle is much better.
var D= $.dict_extend();
var option = D.DICT_PLUGINS.xiaod = {
    'type' : 'xiaod',
    // 'host' : 'http://dictionary.xiaod.ne.jp', // http://dictionary.xiaod.ne.jp/leaf/...
    // 'prefix': [    /^http:\/\/dictionary\.xiaod\.ne\.jp\/leaf\/.*$/  ,  /^\/leaf\/.*$/   ] ,  // NOTICE key(group no1) is not always a word. 
    'format': formatIt,
    'removeTags': ['title','meta','iframe','noscript','script','link','form','style','nobr','img'],
    'isCleanLinks': true,
};

function formatIt(src) {
    console.log(D.LC, '[dict.formatter.xiaod.js] format start...');
    return D.preFormat(option, src, customizePage);
}


// Customize for this page
function customizePage($target){
    return $target;
}







})(jQuery);
