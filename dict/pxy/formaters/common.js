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
    'createLinkForLoader': createLinkForLoader,
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

function gressHostIfRegexp(src, opt){
    var hosts = [opt.host, opt.mobile_host];
    for (var i = hosts.length - 1; i >= 0; i--) {
        var hostStrOrRegexp = hosts[i];

        if (hostStrOrRegexp && hostStrOrRegexp instanceof RegExp) {
            var host=src.match(hostStrOrRegexp);
            //return host ? host[0] : hostStrOrRegexp;
            if (host){
                console.log(D.LC, '[formatter/common.js] Host guessed by regexp:', host[0]);
                return host[0];
            }
        }
    }
    return opt.host;
}

function cleanLinks($$, src, pluginInfo) { //
    var host = gressHostIfRegexp(src, pluginInfo);

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
        var newURL = D.getHrefWithHost(host, href);
        
        $(this).attr('href', newURL)
               .attr('o-href', href)
               .attr('target','_blank');

        var pluginInfoFromURL = D.detectExistedPluginByPrefix(newURL);
        if ( pluginInfoFromURL ){
            // Detect text from URL
            createLinkForLoader($(this).text(), pluginInfoFromURL.type, $(this));
            return;
        }
    });
}


function createLinkForLoader(word, type, $lnk){
    if (!$lnk || !($lnk instanceof jQuery) ){
        $lnk = $('<a>');
    }
    $lnk.attr('__dict_word__', word)
        .attr('__dict_type__', type)
        .attr('target', '_self')
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


// getLocation from given URL. Support IE & relative URL
// Input Sample URL: "http://example.com:3000/pathname/?search=test#hash"
// Output: protocol => "http:"|host => "example.com:3000"|hostname => "example.com"|port => "3000"|pathname => "/pathname/"|hash => "#hash"|search => "?search=test"
function getLocation(href) {
    var location = document.createElement("a");
    location.href = href;
    // IE doesn't populate all link properties when setting .href with a relative URL,
    // however .href will return an absolute URL which then can be used on itself
    // to populate these additional fields.
    if (location.host === "") {
      location.href = location.href;
    }
    return location;
}

*/

})(jQuery);
