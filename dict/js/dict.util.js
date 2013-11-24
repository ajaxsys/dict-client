(function($){

// for test & hook
window.__DICT__ = window.__DICT__ || {};
$.extend(__DICT__ , {
    'getOptionFromCookie' : getOptionFromCookie,
    'setOptionToCookie' : setOptionToCookie,
    'loadResource' : loadResource,
});

////////////////////////// COMMONS ////////////////////
var COOKIE_NAME='__DICT_OPTIONS__';
function getOptionFromCookie(){
    $.cookie.json = true;
    var target = $.cookie(COOKIE_NAME) || {};
    var default_opt={'dict':{'dict_type':'weblios'},'ui':{'width':400,'height':300}};
    $.extend(default_opt, target);// Merge target to options
    console.log("Cookie read:" + JSON.stringify(default_opt) );
    return default_opt;
}

function setOptionToCookie(opt) {
    $.cookie.json = true;
    $.cookie(COOKIE_NAME, opt , { expires: 365, path: '/' });
    console.log("Cookie saved:" + JSON.stringify($.cookie(COOKIE_NAME)) );
}


// Load resource and append to DOM
function loadResource($, rscURL, rscType, callback, tag, done, readystate){
    if (!__DICT__.appendTag) {
        alert('Need dict.util.sharebml.js');
        return;
    }
    console.log('Loading:',rscURL);
    if (rscType=="js") {
        // Create a script element.
        tag = document.createElement( 'script' );
        tag.type = 'text/javascript';
        tag.src = rscURL;
    } else if (rscType=="css") {
        // Create a css link element.
        tag = document.createElement( 'link' );
        tag.type = 'text/css';
        tag.type = 'text/css';
        tag.rel = 'stylesheet';
        tag.href = rscURL;
    } else {
        return;
    }
    
    tag.onload = tag.onreadystatechange = function() {
      if ( !done && ( !( readystate = this.readyState )
        || readystate == 'loaded' || readystate == 'complete' ) ) {

        if (typeof callback == "function"){
                callback($);
        }
        //$( tag ).remove();
      }
    };
    
    __DICT__.appendTag(tag);
}



})(jQuery);
