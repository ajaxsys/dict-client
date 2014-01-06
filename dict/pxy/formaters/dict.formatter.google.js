/*************************************************
 * dict.formatter.google.js
 *
 * Google formatter. 
 **************************************************/
;(function($){

/////////// Main Entry. /////////////
var D=$.dict_extend();
var option = DICT_PLUGINS.google = {
	'format': formatGoogle,
};

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
    console.log(D.LC, '[dict.formatter.google.js] format first start...');
    // If no existed formatter, show google result.
    var $resultDiv=$('<div id="__google_result__" style="margin-left:5px;" >');

    if (!json || !json.results || json.results.length===0){
        return $resultDiv.append('<h4>No search result!</h4>');
    }

    var header = '<div style="text-align:center;margin-top:-10px;"><img src="/dict/default/google.png" alt="Power By Google "><br></div>';
    $resultDiv.append(header)

    $resultDiv.append(getContent(json.results));

    registOnceOnScrollBottomForNextPage();

    return $resultDiv;
}

function nextMode(json) {
    console.log(D.LC, '[dict.formatter.google.js] format next start...');
    // If no existed formatter, show google result.

    $('#__google_result__').append(getContent(json.results));

    registOnceOnScrollBottomForNextPage();

    //Return nothing, then formatter caller will not clear dict.
    return;
}

function getContent(google_results){
    var $resultList = $('<div>');
    for (var i in google_results) {
        var r = google_results[i];
        // 1) title link
        var $lnk = $('<a target="_blank">');
        $lnk.attr('href',r.unescapedUrl).text(r.titleNoFormatting).css('color','blue');
        // 2) content text
        var $content = $('<div>');
        $content.html(r.content.replace(/<script|script>/g,''));
        // 3) url
        var $url = $('<div>').css('color','#006621')
                   .html(    (r.url.length>40)? (r.url.substring(0,40)+'...'):r.url    );
        // Combine all above
        $resultList.append(  $('<div>').append($lnk).append($content).append($url).append('<hr />')  );
    }
    return $resultList;
}

function registOnceOnScrollBottomForNextPage(){
    console.log(D.LC, '[dict.formatter.google.js] Regist event on scroll to bottom page.');
    // callback func called in dict.proxy.js
    D.triggerOnceOnScrollBottom = function(){
        console.log(D.LC, '[dict.formatter.google.js] Regist event on scroll to bottom page fired.');
        // Use key word in search box
        D.queryGoogleMore();
    }
}


})(jQuery);
