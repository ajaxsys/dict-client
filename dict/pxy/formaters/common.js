/*************************************************
 * formatter/common.js
 *
 * Common format of a page sources.
 * Called from all formatters. 
 *
 * Diff common vs util
 * util is only called from some formatters, not all.
 **************************************************/

;(function($){
// Regist common methods
var D=$.dict_extend({
    preFormat: preformatCommonPage,
});


function preformatCommonPage(pluginInfo, src, callback) {
    console.log(D.LC, '[formatter/common.js] Common Preformat Start...');
    var $target = jQueryStripTags(src, pluginInfo.removeTags);
    if (pluginInfo.isCleanLinks !== false)
        cleanLinks($target, pluginInfo.prefix, pluginInfo.host);
    if (typeof callback === 'function') {
        callback($target);
    }
    return $target;
}

/*
// Prevent browser preload image
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
*/

function cleanLinks($$, prefixes, host) {
    var selfLink = '#'; //window.location.pathname + '#key'

    prefixes=[].concat(prefixes);
    console.log(D.LC, '[formatter/common.js] Prefix is: ' + prefixes);
    $('a', $$).each(function(){
        var href = $(this).attr('href');
        if (!href){
            return;
        }

        for (var i in prefixes) {
            var prefixRegexp = prefixes[i];
            var m = href.match(prefixRegexp);
            if (m && m.index===0 && m[1] ) {// m[1] is searchKey
                $(this).attr('href', selfLink + m[1])
                       .attr('target', '_self');
                return;
            } else {
                $(this).attr('target','_blank');
                // http://otherhost/... or //otherhost
                if (href.indexOf('//')<7){ // <7 skip https://
                    $(this).attr('href', host+href);
                }
            }
        }
    });
}

function jQueryStripTags(src, removeTags){
    for (var i in removeTags){
        src = stripTags(src, removeTags[i]);
    }
    return $('<div>').append(src);
}
function stripTags(src, tag) {
    var div = document.createElement('div');
    div.innerHTML = src;
    var tags = div.getElementsByTagName(tag);
    var i = tags.length;
    while (i--) {
        tags[i].parentNode.removeChild(tags[i]);
    }
    return div.innerHTML;
}


})(jQuery);
