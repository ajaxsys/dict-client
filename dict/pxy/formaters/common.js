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
    'preFormat': preformatCommonPage,
    'createLinkForIframeClick': createOrEnhanceLinkForIframeClick,
});


function preformatCommonPage(pluginInfo, src, customizePageFnc) {
    console.log(D.LC, '[formatter/common.js] Common Preformat Start...');
    var $target = jQueryStripTags(src, pluginInfo.removeTags);

    if (typeof customizePageFnc === 'function') {
        var result = customizePageFnc($target);
        // Callback can customize a return object
        if (result && result instanceof jQuery){
            $target = result;
        }
    }

    if (pluginInfo.isCleanLinks !== false){
        // Like wiki, with I18 support, host will change when lang change
        var host = gressHostIfRegexp(src, pluginInfo.host); 
        cleanLinks($target, pluginInfo.prefix, host, pluginInfo.type, pluginInfo.isCleanLinkByText);
    }

    return $target;
}

function gressHostIfRegexp(src, hostStrOrRegexp){
    if (hostStrOrRegexp instanceof RegExp) {
        var host=src.match(hostStrOrRegexp);
        //return host ? host[0] : hostStrOrRegexp;
        if (host){
            console.log(D.LC, '[formatter/common.js] Host guessed by regexp:', host[0]);
            return host[0];
        }
    }
    return hostStrOrRegexp;
}

function cleanLinks($$, prefixes, host, type, isCleanLinkByText) {
    var selfLink = '#'; //window.location.pathname + '#key'

    prefixes=[].concat(prefixes);
    console.log(D.LC, '[formatter/common.js] Prefix is: ' + prefixes);
    console.log(D.LC, '[formatter/common.js] Clean link by ', isCleanLinkByText ? 'link text. ': 'guess url. ');

    $('a', $$).each(function(){
        var href = $(this).attr('href');
        if (!href){
            return;
        }

        $(this).attr('href', getHrefWithHost(host,href) );
        for (var i in prefixes) {
            var prefixRegexp = prefixes[i];
            var m = href.match(prefixRegexp);
            if (m && m.index===0 ) {// && m[1] : m[1] is not always searchKey
                var word;
                
                if (!isCleanLinkByText && m[1]) {
                    word = m[1]; // default: Guess text from URL
                } else {
                    word = $(this).text(); // Use text of link
                }
                //$(this).attr('href', selfLink + m[1] + '?type='+type+'&url=' + getHrefWithHost(host,href) )
                createOrEnhanceLinkForIframeClick(word, type, $(this));
                $(this).attr('o-href', href);
                return;
            } else {
                $(this).attr('target','_blank');
            }
        }
    });
}

function createOrEnhanceLinkForIframeClick(word, type, $lnk){
    if (!$lnk || !($lnk instanceof jQuery) ){
        $lnk = $('<a>');
    }
    $lnk.attr('__dict_word__', word)
        .attr('__dict_type__', type)
        .attr('target', '_self');
    return $lnk;
}

function getHrefWithHost(host, href){
    return D.isRelativeURL(href) ? (host+href) : href;
}

function jQueryStripTags(src, removeTags){
    // `src` attribute of img tag is special
    // Images start loading image files (either live or from cache) once their src is set, whether or not they are attached to anything in the DOM.
    src = src.replace(/src[ ]*=/g, 'src-disabled=');
    src = stripTags(src, removeTags);
    src = src.replace(/src-disabled=/g, 'src=');
    return $('<div>').append(src);
}

function stripTags(src, removeTags) {
    var div = document.createElement('div');
    div.innerHTML = src;
    for (var i in removeTags){
        var tag = removeTags[i];
        var tags = div.getElementsByTagName(tag);
        var j = tags.length;
        while (j--) {
            tags[j].parentNode.removeChild(tags[j]);
        }
    }
    
    return div.innerHTML;
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

})(jQuery);
