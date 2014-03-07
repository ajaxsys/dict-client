/*************************************************
 * dict.formatter.wiki_jp.js
 **************************************************/
;(function($){

// A plugin name starts with `auto_` will call `Auto Mode` first.
// Then when prefix match prefix defined in NON `auto` version, NON `auto` version will be fired
// Why do this: search result from wiki is SoSlow&NotGood -vs- from google.
DICT_PLUGINS.auto_wiki = {
    'autoKey'   : 'site:wikipedia.org',    // a key will append to search key when `Auto Mode`
    'nextLoader': 'wiki', // same as defined bellow.
}
var option = DICT_PLUGINS.wiki = {
    'type' : 'wiki',
    'host': /(\/\/[a-z]+)(\.wikipedia\.org)/,
    'mobile_host': "$1.m$2",                //  `//jp.wiki`...--> `//jp.m.wiki`...
    'prefix': [   /^[htps:]*\/\/[a-z]+\.wikipedia\.org\/wiki\/([^:\/]+)$/,   /^\/wiki\/([^:\/]+)$/   ], // URL Displayed in google search result  & self page
    'format': formatWiki,
    'removeTags': ['iframe','noscript','script'],
};

// JSON sample
function formatWiki(src) {
    console.log($.dict_extend().LC, '[dict.formatter.wiki_jp.js] format start...');
    return $.dict_extend().preFormat(option, src, customizePage);
}


// Customize for this page
function customizePage($target){//,#left-navigation
    $("#footer,#disambigbox,#page-actions,#mw-mf-page-left,#jump-to-nav,#search,[id$='navigation'],"+ // id
        ".header,.edit-page,.printfooter,.mw-search-pager-bottom", // class
        $target).remove();
    $("#section_0", $target).prepend("<img src='/dict/default/wiki.gif'>");
}







})(jQuery);
