/*************************************************
 * dict.formatter.sophia.js
 **************************************************/
;(function($){
'use strict';
var D= $.dict_extend();
// A plugin name starts with `auto_` will call `Auto Mode` first.
// Then when prefix match prefix defined in NON `auto` version, NON `auto` version will be fired
// Why do this: search result from google is much better.
D.DICT_PLUGINS.auto_sophia = {
    'autoKey'   : 'site:sophia-it.com', // a key will append to search result when `Auto Mode`
    'nextLoader': 'sophia',  // same as defined bellow.
}
var option = D.DICT_PLUGINS.sophia = {
    'type' : 'sophia',
    'host' : 'sophia-it.com',
    //'mobile_host' : '//m.sophia.jp', // 20141008 now it use responsive design.
    'prefix': [ /^http:\/\/www\.sophia-it\.com\/content\/([^\/]+)$/   ,  /^\/content\/([^\/]+)$/  ] , 
    'format': formatSophia,
    'removeTags': ['title','meta','iframe','noscript','script','link','form','style','nobr','img'],
    // 'isLoadFromGoogleCache': true,
    'isCleanLinks': true,
};

// JSON sample
function formatSophia(src) {
    console.log(D.LC, '[dict.formatter.sophia.js] format start...');
    return D.preFormat(option, src, customizePage);
}


// Customize for this page
function customizePage($t){
    //Remove text from google;
    //$('base', $target).next().empty().text('Google Cache');
    var $content = $('table:eq(4)' ,$t).find('table:eq(2)');
    // del PR
    $('td:last', $content).remove();
    $('td:last', $content).remove();
    return $content;
    
}







})(jQuery);
