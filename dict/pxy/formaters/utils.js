/**
 * formater loader
 */
;(function($){
// Common methods
$.dict_extend({
    preFormat: preformatCommonPage,
    getPluginTypeByPrefix: getPluginTypeByPrefix,
});


/////////// Common format of a page sources. /////////////
function getPluginTypeByPrefix(url){
    for (var pluginType in window.DICT_PLUGINS) {
        var prefixes = [].concat(window.DICT_PLUGINS[pluginType].prefix);// string --> []
        if (prefixes.length>0 && url) {
            for (var i in prefixes) {
                if (url.indexOf(prefixes[i])===0)
                    return pluginType;
            }
        }
    }
    return null;
}

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

function cleanLinks($$, prefixes) {
    var selfLink = '#'; //window.location.pathname + '?q='
    console.log('Prefix is: ' + prefixes);
    $('a', $$).each(function(){
        var href = $(this).attr('href');
        for (var i in prefixes) {
            if (href && href.indexOf(prefixes[i]) === 0 ) {
                $(this).attr('href', selfLink + href.replace(prefixes[i],''))
                       .attr('target', '_self');
            } else {
                $(this).attr('target','_blank')
            }
        }
    });
}


})(jQuery);
