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
    'cleanLinks': cleanLinks,
    // Create common link format for Dict-client
    'createLinkForLoader': createOrEnhanceLinkForLoader,
});

// 1.Remove tags defined in plugin.removeTags
// 2.Call customized page callback which pass from params
// 3.Clean links which match plugin.prefix
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
        
        cleanLinks($target, src, pluginInfo);
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

function cleanLinks($$, src, pluginInfo) { //
    var host = gressHostIfRegexp(src, pluginInfo.host),
        prefixes = pluginInfo.prefix, 
        type = pluginInfo.type, 
        isCleanLinkByText = pluginInfo.isCleanLinkByText;

    var selfLink = '#'; //window.location.pathname + '#key'

    prefixes=[].concat(prefixes);
    console.log(D.LC, '[formatter/common.js] Prefix is: ' + prefixes);
    console.log(D.LC, '[formatter/common.js] Clean link by ', isCleanLinkByText ? 'link text. ': 'guess url. ');

    $('a', $$).each(function(){
        var href = $(this).attr('href');
        if (!href){
            return;
        }

        // Skip anchor 
        if (href.startsWith('#')){
            if (href.startsWith('#__')){
                // Already enhanced
                return;
            }
            // __tells proxy.html to ignore this when url changed.
            $(this).attr('href', href.replace('#', '#__'));

            // target anchor change to match above new __ id
            try{
                var $anchorId = $(href, $$); // #someText
                var anchorId = $anchorId.attr('id');
                // Recheck
                if ('#'+anchorId === href){
                    $anchorId.attr('id', '__' + anchorId);
                }
            }catch(e){}
            
            return; 
        }

        // Clean links match prefix
        var URL = D.getHrefWithHost(host,href);
        $(this).attr('href', URL).attr('target','_blank');
        for (var i in prefixes) {
            var prefixRegexp = prefixes[i];
            var m = URL.match(prefixRegexp);
            if (m && m.index===0 ) {// && m[1] : m[1] is not always searchKey
                var word = $(this).text();
                
                if ( isCleanLinkByText!==true && m[1] ) {
                    //Default: Guess text from URL
                    word = m[1]; 
                }
                //$(this).attr('href', selfLink + m[1] + '?type='+type+'&url=' + D.getHrefWithHost(host,href) )
                createOrEnhanceLinkForLoader(word, type, $(this));
                $(this).attr('o-href', href);
                return;
            }
        }
    });
}


function createOrEnhanceLinkForLoader(word, type, $lnk){
    if (!$lnk || !($lnk instanceof jQuery) ){
        $lnk = $('<a>');
    }
    $lnk.attr('__dict_word__', word)
        .attr('__dict_type__', type)
        .attr('target', '_self');
    return $lnk;
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
