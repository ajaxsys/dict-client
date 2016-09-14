/*
 * dict.util.share.js
 * Share with bookmarklet. No jQuery
 */
void((function(w,d){
'use strict';
function get1stTag() {
    var result;
    for (var i = 0; i < arguments.length; i++) {
        var tag=arguments[i],
            tags=d.getElementsByTagName(tag);
        if (tags.length>0) {
            result = tags[0];
            break;
        }
    }
    return result || d.documentElement.childNodes[0];
}

// for test & hook
w.__DICT__ = w.__DICT__ || {};
w.__DICT__.appendTag = function (node) {
    var tag = get1stTag('head','body');
    if (tag){
        tag.appendChild(node);
    } else {
        var url = 'https://ajaxsys.github.io/dict-client/';
        alert('Sorry, Not support for your browser. More details, visit: '+url);
        window.open(url);
    }
};

})(window,document));
