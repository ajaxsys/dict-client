/*************************************************
 * dict.formatter.wiki_jp.js
 **************************************************/
;(function($){
'use strict';
var D = $.dict_extend();

// A plugin name starts with `auto_` will call `Auto Mode` first.
// Then when prefix match prefix defined in NON `auto` version, NON `auto` version will be fired
// Why do this: search result from wiki is SoSlow&NotGood -vs- from google.
D.DICT_PLUGINS.auto_wiki = {
    'autoKey'   : 'site:wikipedia.org',    // a key will append to search key when `Auto Mode`
    'nextLoader': 'wiki', // same as defined bellow.
}
var optionWikipedia = D.DICT_PLUGINS.wiki = {
    'type' : 'wiki',
    'host': /(\/\/[a-z]+)(\.wikipedia\.org)/,
    'mobile_host': /(\/\/[a-z]+)(\.m\.wikipedia\.org)/,                //  `//jp.wiki`...--> `//jp.m.wiki`...
    'changeToMobileUrl' : function(url) {return url.replace(this.host, "$1.m$2")},
    'prefix': [   /^[htps:]*\/\/[a-z]+\.(|m\.)wikipedia\.org\/wiki\/([^:\/]+)$/  ], // URL from google ([^:\/]+) keeps strick for wikipedia
    'format': formatWiki,
    'removeTags': ['title','meta','iframe','noscript','script'],
    'isCleanLinks': true, // Some link from wikipedia to wiki books.
};






D.DICT_PLUGINS.auto_wiktionary = {
    'autoKey'   : 'site:wiktionary.org',    // a key will append to search key when `Auto Mode`
    'nextLoader': 'wiktionary', // same as defined bellow.
}
var optionWiktionary = D.DICT_PLUGINS.wiktionary = {
    'type' : 'wiktionary',
    'host': /(\/\/[a-z]+)(\.wiktionary\.org)/,
    'mobile_host': /(\/\/[a-z]+)(\.m\.wiktionary\.org)/,                //  `//jp.wiki`...--> `//jp.m.wiki`...
    'changeToMobileUrl' : function(url) {return url.replace(this.host, "$1.m$2")},
    'prefix': [   /^[htps:]*\/\/[a-z]+\.(|m\.)wiktionary\.org\/wiki\/.*$/  ], // URL Displayed in google search result  & self page
    'format': formatWiktionary,
    'removeTags': ['iframe','noscript','script'],
    'isCleanLinks': true, // cause there is MIX links(wikipedia/wiktionary/wikibooks...) on same page
};

function formatWiktionary(src){
    return formatWiki(src, optionWiktionary);
}





D.DICT_PLUGINS.auto_wikibooks = {
    'autoKey'   : 'site:wikibooks.org',    // a key will append to search key when `Auto Mode`
    'nextLoader': 'wikibooks', // same as defined bellow.
}
var optionWikibooks = D.DICT_PLUGINS.wikibooks = {
    'type' : 'wikibooks',
    'host': /(\/\/[a-z]+)(\.wikibooks\.org)/,
    'mobile_host': /(\/\/[a-z]+)(\.m\.wikibooks\.org)/,                //  `//jp.wiki`...--> `//jp.m.wiki`...
    'changeToMobileUrl' : function(url) {return url.replace(this.host, "$1.m$2")},
    'prefix': [   /^[htps:]*\/\/[a-z]+\.(|m\.)wikibooks\.org\/wiki\/.*$/   ], // URL Displayed in google search result  & self page
    'format': formatWikibooks,
    'removeTags': ['iframe','noscript','script'],
    'isCleanLinks': true,
};

function formatWikibooks(src){
    return formatWiki(src, optionWikibooks);
}




// JSON sample
function formatWiki(src, opt) {
    opt = opt || optionWikipedia;
    console.log(D.LC, '[dict.formatter.wiki.js] format start...');
    var $preFormatedTarget = D.preFormat(opt, src, customizePageBef);

    // NOTICT: customizeWikiLanguageLink must be after customize links
    // cause it must change `/wiki/...` to `http://en.wikipeidia.org/wiki/...`
    customizeWikiLanguageLink($preFormatedTarget, opt);

    return $preFormatedTarget;
}




// Customize for this page
function customizePageBef($target){//,#left-navigation
    $("#footer,#disambigbox,#page-actions,#mw-mf-page-left,#jump-to-nav,#search,[id$='navigation'],"+ // id
        ".header,.edit-page,.printfooter,.mw-search-pager-bottom", // class
        $target).remove();
    $("#section_0", $target).prepend("<span style='display:inline-block;' class='icon_wiki'>");
}


// Customize language seletors
var FLG_LOAD = 'lang-load', isShowDefault;

function customizeWikiLanguageLink($target, option){//,#left-navigation
    isShowDefault = false;
    var $lang = $("#page-secondary-actions >a", $target);
    if ($lang.length === 0){
        return; // No language seletion
    }

    //var href = $lang.attr('href').replace(option.host, option.mobile_host);
    var href = D.changeToMobileUrl($lang.attr('href'), option);
    //if (!href.startsWith('http:')){
    //    href = 'http:' + href;
    //}

    
    //$lang.attr("data-toggle","modal").attr("data-target","#myModal");
    $lang
        .attr("href",href)
        .attr("origin-text", $lang.text())
        .mouseover(function(){
            loadLanguageLinkByAjax($(this), option);
            
        })
        .click(function(){
            var $thisLnk = $(this);
            if ($thisLnk.attr(FLG_LOAD) == FLG_LOAD){
                D.MODAL_DIALOG.show();
            } else {
                // First load or next load
                $thisLnk.text("Loading..."); 
                console.log(D.LC, '[dict.formatter.wiki.js] Lang is first load');
                loadLanguageLinkByAjax($thisLnk, option); // Tab device no mouseover.
                isShowDefault = true;
            } 
            return false;
        });

}


function loadLanguageLinkByAjax($thisLnk, option){
    if ($thisLnk.attr(FLG_LOAD)){
        // loading
        return;
    }
    $thisLnk.attr(FLG_LOAD, FLG_LOAD + "ing");
    D.queryByYQL($thisLnk.attr('href'), function(json){
        $thisLnk.attr(FLG_LOAD, FLG_LOAD);

        var $langHtml = $(json.src);
        // set modal title
        D.MODAL_DIALOG.title( $('#content p:first', $langHtml).text() );

        // set modal content
        var $langList =  $('#mw-mf-language-selection', $langHtml);
        moveFavorateLangLinkToHead($langList);
        D.MODAL_DIALOG.body( $langList );

        // Active link in DICT by append '__dict_type__'
        $('a', D.MODAL_DIALOG.$body).attr('__dict_type__', option.type).click(function(){
            D.MODAL_DIALOG.hide();
        });
        if (isShowDefault) {
            D.MODAL_DIALOG.show();
        }

        $thisLnk.text($thisLnk.attr("origin-text"));
    });
}

var LIST_TO_SHOW = ['zh','ja','en'];
// Move favorate Link to ahead.
// A sample link of language of wiki is:
// <li>
//     <a lang="ja" ...
// </li>
function moveFavorateLangLinkToHead($langList){
    $('li', $langList).each(function() {
        var $li = $(this),
            liLang = $('a:first', $li).attr('lang');

        if ( LIST_TO_SHOW.indexOf(liLang) > -1 ){
            $li.prependTo($langList);
        }
    });
}

})(jQuery);
