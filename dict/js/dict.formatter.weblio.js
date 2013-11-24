;(function($){

/////////// Main Entry. /////////////
DICT.weblio = 
{
	'prefix': 'http://ejje.weblio.jp/content/',
	'format': formatWeblio,
    'removeTags' : ['iframe','noscript','script','img']
};

var thisPrefix = null;

/////////// Weblio. /////////////
function formatWeblio(src) {
    thisPrefix = this.prefix;
    var $target = initFromSrc(src, this.removeTags);
    customizePage($target);
    return $target;
}

function customizePage($target){
    // Customize page
    // .wejtyInfoSmp: info of robot
    // .division3: info of auth
    $('.tngWdAdBtn,.ad,header,footer,aside,.wejtyInfoSmp,.division3,p.btn',$target).remove();
    $('.close', $target).removeClass('close').addClass('open');
    // Too big title
    $('.ttl1',$target).css('fontSize','22px');
}


function initFromSrc(src, rmTags){

    var $target = jQueryWithoutTags(src, rmTags);

    cleanLinks($target);

	return $target;
}

function jQueryWithoutTags(src, tags) {
    //var tags = Array.prototype.slice.call(arguments, 1);
    // img,a,span --> <(img|a|span)
    var tags_left = '<('+tags.join('|')+')',
        tags_right=  '('+tags.join('|')+')>';

	// Prevent resource load when `$(html)`: rename img/iframe/script/lnk/base... tags
    src=src.replace(new RegExp(tags_left, 'ig'), '<xxx class="__disabled_tag__" original="$1" style="display:none;" ');
    src=src.replace(new RegExp(tags_right,'ig'), 'xxx>');

	var $src = $('<div>').append(src);

	// Remove tags
    $('xxx', $src).remove();

    return $src;
}

function cleanLinks($$) {
    var selfLink = '#'; //window.location.pathname + '?q='
    console.log('Prefix is: ' + thisPrefix);
    $('a', $$).each(function(){
        var href = $(this).attr('href');
        if (href && href.indexOf(thisPrefix) === 0 ) {
            $(this).attr('href', selfLink + href.replace(thisPrefix,''))
                   .attr('target', '_self');
        } else {
            $(this).attr('target','_blank')
        }
    });
}


})(jQuery);
