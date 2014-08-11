/*************************************************
 * dict.formatter.google.js
 *
 * Google formatter. 
 **************************************************/
;(function($){
'use strict';
/////////// Main Entry. /////////////
var D=$.dict_extend();
D.DICT_PLUGINS.google = {
	'format': formatGoogle,
};

var SEARCH_SIZE = 8, searchStartPosition = 0, MAX_POSITION=40;


// JSON sample
// {"results":[{"GsearchResultClass":"GwebSearch","unescapedUrl":"http://www.world.co.jp/","url":"http://www.world.co.jp/","visibleUrl":"www.world.co.jp","cacheUrl":"http://www.google.com/search?q=cache:bSVTDZN7KhoJ:www.world.co.jp","title":"Corp <b>World</b>","titleNoFormatting":"Corp (WORLD)","content":"Hello <b>World</b>"},{},...]}
function formatGoogle(json) {
    // reset
    if (json.isNextMode){
        return nextMode(json);
    }else{
        return firstMode(json);
    }
}

function firstMode(json) {
    searchStartPosition = 0;

    console.log(D.LC, '[dict.formatter.google.js] format first start...');
    // If no existed formatter, show google result.
    var $resultDiv=$('<div id="__google_result__" style="margin-left:5px;" >');

    if (!json || !json.results || json.results.length===0){
        return $resultDiv.append('<h4>No search result!</h4>');
    }

    var header = '<div style="margin:-10px auto 0 auto;" class="icon_google"></div>';
    $resultDiv.append(header)

    $resultDiv.append(getContent(json));

    registOnceOnScrollBottomForNextPage();

    return $resultDiv;
}

function nextMode(json) {

    console.log(D.LC, '[dict.formatter.google.js] format next start...');
    // If no existed formatter, show google result.

    $('#__google_result__').append(getContent(json));

    registOnceOnScrollBottomForNextPage();

    //Return nothing, then formatter caller will not clear dict.
    return;
}

function getContent(json){
    var google_results = json.results,
        word = json.word,
        $resultList = $('<div>'),
        $lnk_ext = $('<a target="_blank" class="external">');
    for (var i in google_results) {
        // 0) plugin detect
        var r = google_results[i],
            plugin = D.detectExistedPluginByPrefix(r.unescapedUrl),
            $lnk;

        // NG: ?type=xxx#word  : it will redirect the page to blank
        if (plugin){
            $lnk = D.createLinkForLoader( word, plugin.type );
        } else {
            $lnk = $lnk_ext.clone();
        }

        var textOnly = "&strip=1";
        var $cacheLink = '';
        if (r.cacheUrl) {
            // var lnkType = $lnk.attr('__dict_type__');
            // $cacheLink.attr('__dict_type__', lnkType ? lnkType : 'google_cache');
            $cacheLink = D.createLinkForLoader( word, 'google_cache' );
            $cacheLink.html('Text')
                      .attr('href',r.cacheUrl + textOnly)
                      .attr('title', 'Text only version');
        }

        // 1) title link
        $lnk.attr('href',r.unescapedUrl).html(r.title)
            .css('color','blue').css('fontSize','medium');

        // 2) content text
        var $content = $('<div>');
        $content.html(r.content.replace(/<script|script>/g,''));

        // 3) url
        var url = (r.url.length>40)? (r.url.substring(0,40)+'...')  :  r.url,
            $url = $('<div>').css('color','#006621')
                   .append(    url   )
                   .append( plugin ?  $lnk_ext.clone().attr('href',url).html(' ')  : '' ); // Add External mark

        // Combine all above
        $resultList.append(  $('<div>').append($lnk).append(' ').append($cacheLink).append($content).append($url).append('<hr />')  );
    }

    if (searchStartPosition<MAX_POSITION && google_results.length == SEARCH_SIZE){
        var nextFlg = '<div class="__toBeReplace__" style="text-align:center">loading...</div>';
        $('.__toBeReplace__').replaceWith('<hr />');
        $('hr:last', $resultList).replaceWith(nextFlg);
    }
    return $resultList;
}

function registOnceOnScrollBottomForNextPage(){
    console.log(D.LC, '[dict.formatter.google.js] Regist event on scroll to bottom page.');
    // Next search index
    searchStartPosition+=SEARCH_SIZE;
    if (searchStartPosition>=MAX_POSITION){
        console.log(D.LC, '[loaders/formatter.google.js] Reach MAX search results. SearchStartPosition:',searchStartPosition);
        $('.__toBeReplace__').replaceWith('<hr />');
        return; // Stop Regist! Google seams return only max ~60.
    }
    console.log(D.LC, '[loaders/formatter.google.js] Next SearchStartPosition on page bottom:',searchStartPosition);

    // callback func called in dict.proxy.js
    D.triggerOnceOnScrollBottom = function(){
        console.log(D.LC, '[dict.formatter.google.js] Event on registed on scroll to bottom page is fired.');
        // Use key word in search box
        D.queryGoogleMore(searchStartPosition);
    }
}


})(jQuery);
