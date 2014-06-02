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
var optionWikipedia = DICT_PLUGINS.wiki = {
    'type' : 'wiki',
    'host': /(\/\/[a-z]+)(\.wikipedia\.org)/,
    'mobile_host': "$1.m$2",                //  `//jp.wiki`...--> `//jp.m.wiki`...
    'prefix': [   /^[htps:]*\/\/[a-z]+\.wikipedia\.org\/wiki\/([^:\/]+)$/  ], // ([^:\/]+) keeps strick for wikipedia
    'format': formatWiki,
    'removeTags': ['iframe','noscript','script'],
    'isCleanLinks': false, // Some link from wikipedia to wiki books.
};






DICT_PLUGINS.auto_wiktionary = {
    'autoKey'   : 'site:wiktionary.org',    // a key will append to search key when `Auto Mode`
    'nextLoader': 'wiktionary', // same as defined bellow.
}
var optionWiktionary = DICT_PLUGINS.wiktionary = {
    'type' : 'wiktionary',
    'host': /(\/\/[a-z]+)(\.wiktionary\.org)/,
    'mobile_host': "$1.m$2",                //  `//jp.wiki`...--> `//jp.m.wiki`...
    'prefix': [   /^[htps:]*\/\/[a-z]+\.wiktionary\.org\/wiki\/.*$/  ], // URL Displayed in google search result  & self page
    'format': formatWiktionary,
    'removeTags': ['iframe','noscript','script'],
    'isCleanLinks': false, // cause there is MIX links(wikipedia/wiktionary/wikibooks...) on same page
};

function formatWiktionary(src){
    return formatWiki(src, optionWiktionary);
}





DICT_PLUGINS.auto_wikibooks = {
    'autoKey'   : 'site:wikibooks.org',    // a key will append to search key when `Auto Mode`
    'nextLoader': 'wikibooks', // same as defined bellow.
}
var optionWikibooks = DICT_PLUGINS.wikibooks = {
    'type' : 'wikibooks',
    'host': /(\/\/[a-z]+)(\.wikibooks\.org)/,
    'mobile_host': "$1.m$2",                //  `//jp.wiki`...--> `//jp.m.wiki`...
    'prefix': [   /^[htps:]*\/\/[a-z]+\.wikibooks\.org\/wiki\/.*$/   ], // URL Displayed in google search result  & self page
    'format': formatWikibooks,
    'removeTags': ['iframe','noscript','script'],
    'isCleanLinks': false,
};

function formatWikibooks(src){
    return formatWiki(src, optionWikibooks);
}




// JSON sample
function formatWiki(src, opt) {
    opt = opt || optionWikipedia;
    console.log($.dict_extend().LC, '[dict.formatter.wiki.js] format start...');
    var $preFormatedTarget = $.dict_extend().preFormat(opt, src, customizePageBef);
    // Because 'isCleanLinks': false, need clean links manually
    if (opt.isCleanLinks === false){
        customizeMultiLinks(src, $preFormatedTarget, opt);
    }
    // NOTICT: customizeWikiLanguageLink must be after customize links
    // cause it must change `/wiki/...` to `http://en.wikipeidia.org/wiki/...`
    customizeWikiLanguageLink($preFormatedTarget, opt);

    return $preFormatedTarget;
}

function customizeMultiLinks(src, $target, opt){
    // Move this process after page show
    var clone = jQuery.extend(true, {}, opt);
    clone.prefix = [].concat(optionWikipedia.prefix)
                     .concat(optionWiktionary.prefix)
                     .concat(optionWikibooks.prefix);

    $.dict_extend().cleanLinks($target, src, clone);
}






// Customize for this page
function customizePageBef($target){//,#left-navigation
    $("#footer,#disambigbox,#page-actions,#mw-mf-page-left,#jump-to-nav,#search,[id$='navigation'],"+ // id
        ".header,.edit-page,.printfooter,.mw-search-pager-bottom", // class
        $target).remove();
    $("#section_0", $target).prepend("<span style='display:inline-block;' class='icon_wiki'>");
}


// Customize language seletors
var FLG_LOADED = 'lang-loaded',$MODAL;

function customizeWikiLanguageLink($target, option){//,#left-navigation
    var $lang = $("#page-secondary-actions >a", $target);
    if ($lang.length === 0){
        return; // No language seletion
    }

    //var href = $lang.attr('href').replace(option.host, option.mobile_host);
    var href = D.changeToMobileUrl($lang.attr('href'), option);
    //if (!href.startsWith('http:')){
    //    href = 'http:' + href;
    //}

    $MODAL = $("#__title_only_modal__");
    
    //$lang.attr("data-toggle","modal").attr("data-target","#myModal");
    $lang
        .attr("href",href)
        .mouseover(function(){
            var $thisLnk = $(this);
            if ($thisLnk.data(FLG_LOADED)){
                console.log($.dict_extend().LC, '[dict.formatter.wiki.js] Lang loaded already.');
                return;
            }
            loadLanguageLinkByAjax($thisLnk, false);
            
        })
        .click(function(){
            var $thisLnk = $(this);
            if (!$thisLnk.data(FLG_LOADED)){
                console.log($.dict_extend().LC, '[dict.formatter.wiki.js] Lang is loading, try load again.');
                loadLanguageLinkByAjax($thisLnk, true);
            } else {
                $MODAL.modal("show");
            }
            return false;
        });

}


function loadLanguageLinkByAjax($thisLnk, isShowDefault){
    $thisLnk.data(FLG_LOADED, 'loading');
    $.dict_extend().queryByYQL($thisLnk.attr('href'), function(json){
        $thisLnk.data(FLG_LOADED, 'loaded');

        var $langHtml = $(json.src);
        // set modal title
        $('.modal-title', $MODAL).text( $('#content p:first', $langHtml).text() );

        // set modal content
        var $langList =  $('#mw-mf-language-selection', $langHtml);
        moveFavorateLangLinkToHead($langList);
        $('.modal-body', $MODAL).empty().append( $langList );

        // Active link in DICT by append '__dict_type__'
        $('a', $MODAL).attr('__dict_type__','wiki').click(function(){
            $MODAL.modal('hide');
        });
        if (isShowDefault) {
            $MODAL.modal('show');
        }
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
