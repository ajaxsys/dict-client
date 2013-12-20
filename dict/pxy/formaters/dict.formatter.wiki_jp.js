/////////// Wiki JP /////////////
;(function($){

/////////// Main Entry. /////////////
var option = DICT_PLUGINS.wiki_jp = {
	'prefix': ['http://ja.wikipedia.org/wiki/','/wiki/'],
	'format': formatWikiJP,
    'removeTags': ['iframe','noscript','script'],
};

// JSON sample
// {"results":[{"GsearchResultClass":"GwebSearch","unescapedUrl":"http://www.world.co.jp/","url":"http://www.world.co.jp/","visibleUrl":"www.world.co.jp","cacheUrl":"http://www.google.com/search?q=cache:bSVTDZN7KhoJ:www.world.co.jp","title":"Corp <b>World</b>","titleNoFormatting":"Corp (WORLD)","content":"Hello <b>World</b>"},{},...]}
function formatWikiJP(src) {
    console.log('format wiki jp start...');
    return $.dict_extend().preFormat(option, src, customizePage);
}


// Customize for this page
function customizePage($target){
    $(".header, #page-actions",$target).remove();
}







})(jQuery);
