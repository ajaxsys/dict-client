/**
 * formater loader
 */
;(function($){
// Common methods
$.dict_extend({
    preFormat: preformatCommonPage
});

/////////// Weblio. /////////////
function preformatCommonPage(pluginInfo, src, callback) {
    console.log('Common preformat start.');
    var $target = jQueryWithoutTags(src, pluginInfo.removeTags);
    cleanLinks($target, pluginInfo.prefix);
    if (typeof callback === 'function') {
        callback($target);
    }
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

function cleanLinks($$, thisPrefix) {
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
