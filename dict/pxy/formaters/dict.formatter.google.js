/*
 * Google formatter. should not append any thing to DOM in formatter.
 */
;(function($){

/////////// Main Entry. /////////////
var D=$.dict_extend();
var option = DICT_PLUGINS.google = {
	'format': formatGoogle,
};

// JSON sample
// {"results":[{"GsearchResultClass":"GwebSearch","unescapedUrl":"http://www.world.co.jp/","url":"http://www.world.co.jp/","visibleUrl":"www.world.co.jp","cacheUrl":"http://www.google.com/search?q=cache:bSVTDZN7KhoJ:www.world.co.jp","title":"Corp <b>World</b>","titleNoFormatting":"Corp (WORLD)","content":"Hello <b>World</b>"},{},...]}
function formatGoogle(json) {
    console.log('format google start...');
    // If no existed formatter, show google result.
    var i,r,$resultDiv=$('<div>');
    var header = '<div style="text-align:center;margin-top:-10px;"><img src="/dict/default/google.png" alt="Power By Google "><br></div>';
    $resultDiv.append(header)
    for (i in json.results) {
       r = json.results[i];
       var $lnk = $('<a target="_blank">');
       $lnk.attr('href',r.unescapedUrl).text(r.titleNoFormatting).css('color','blue');
       var $content = $('<div>');
       $content.html(r.content.replace(/<script|script>/g,''));
       var $url = $('<div>').css('color','#006621')
                  .html(    (r.url.length>40)? (r.url.substring(0,40)+'...'):r.url    );
       $resultDiv.append($lnk).append($content).append($url).append('<hr />');
    }
    return $resultDiv;
}





})(jQuery);
