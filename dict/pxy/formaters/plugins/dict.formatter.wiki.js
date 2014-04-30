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
    var $preFormatedTarget = $.dict_extend().preFormat(option, src, customizePageBef);
    customizeWikiLanguageLink($preFormatedTarget);
    return $preFormatedTarget;
}


// Customize for this page
function customizePageBef($target){//,#left-navigation
    $("#footer,#disambigbox,#page-actions,#mw-mf-page-left,#jump-to-nav,#search,[id$='navigation'],"+ // id
        ".header,.edit-page,.printfooter,.mw-search-pager-bottom", // class
        $target).remove();
    $("#section_0", $target).prepend("<img src='/dict/default/wiki.gif'>");
}


// Customize language seletors
var FLG_LOADED = 'lang-loaded',$MODAL;

function customizeWikiLanguageLink($target){//,#left-navigation
    $MODAL = $("#__title_only_modal__");

    var $lang = $("#page-secondary-actions >a", $target);
    var href = 'http:'+$lang.attr("href").replace(option.host, option.mobile_host);
    
    //$lang.attr("data-toggle","modal").attr("data-target","#myModal");
    $lang
        .attr("href",href)
        .mouseover(function(){
            var $thisLnk = $(this);
            if ($thisLnk.data(FLG_LOADED)){
                console.log($.dict_extend().LC, '[dict.formatter.wiki_jp.js] Lang loaded already.');
                return;
            }
            loadLanguageLinkByAjax($thisLnk, false);
            
        })
        .click(function(){
            var $thisLnk = $(this);
            if (!$thisLnk.data(FLG_LOADED)){
                console.log($.dict_extend().LC, '[dict.formatter.wiki_jp.js] Lang is loading, try load again.');
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
