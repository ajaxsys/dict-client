/*************************************************
 * dict.formatter.goo.js
 **************************************************/
;(function($){

// A plugin name starts with `auto_` will call `Auto Mode` first.
// Then when prefix match prefix defined in NON `auto` version, NON `auto` version will be fired
// Why do this: search result from google is much better.
DICT_PLUGINS.auto_goo = {
    'autoKey'   : 'site:dictionary.goo.ne.jp', // a key will append to search result when `Auto Mode`
    'nextLoader': 'goo',  // same as defined bellow.
}
var option = DICT_PLUGINS.goo = {
    'host' : '//dictionary.goo.ne.jp', // http://dictionary.goo.ne.jp/leaf/...
    'prefix': [ /^http:\/\/dictionary\.goo\.ne\.jp\/leaf\/(.*)$/  ] ,  // NOTICE MUST contain a group. key is not always a word. e.g: E8A898E686B6E5AA92E4BD93.html
    'format': formatGoo,
    'removeTags': ['iframe','noscript','script','link','form','style','nobr','img'],
    'isCleanLinks': true,
    'isCleanLinkByText': true, // Cant guess real word from url
};

// JSON sample
function formatGoo(src) {
    console.log($.dict_extend().LC, '[dict.formatter.goo.js] format start...');
    return $.dict_extend().preFormat(option, src, customizePage);
}


// Customize for this page
function customizePage($target){
    var $tmp = $('#main' ,$target); 
    $('.dicSwitcher,.ejdicMode,.sbm' ,$tmp).remove();
    return $tmp;// Keep id = main only. If no return , $target will be content.
}







})(jQuery);
