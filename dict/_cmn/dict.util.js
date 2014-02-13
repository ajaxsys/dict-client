/*************************************************
 * _cmn/dict.util.js
 *
 * Common utility functions for both bml(BookmarkLet) & pxy(Proxy) page
 *
 * Utils of dict. Regist to global `__DICT__` variable
 * depend: dict.util.sharebml.js
 **************************************************/
(function($){

// for test & hook
window.__DICT__ = window.__DICT__ || {};
var D=$.dict_extend({
    'getOptionFromCookie' : getOptionFromCookie,
    'setOptionToCookie' : setOptionToCookie,
    'loadResource' : loadResource,
    'getParamFromURL' : getParamFromURL,
    'Queue': Queue,
    'Stack': Stack,
});

////////////////////////// COMMONS ////////////////////
var COOKIE_NAME='__DICT_OPTIONS__';
function getOptionFromCookie(){
    $.cookie.json = true;
    var target = $.cookie(COOKIE_NAME) || {};
    var default_opt={'dict':{'dict_type':'auto','dict_lang':'jp'},'ui':{'width':400,'height':300}};
    $.extend(default_opt, target);// Merge target to options
    console.log(D.LC, '[_cmn/dict.util.js] Cookie read:' + JSON.stringify(default_opt) );
    return default_opt;
}

function setOptionToCookie(opt) {
    $.cookie.json = true;
    $.cookie(COOKIE_NAME, opt , { expires: 365, path: '/' });
    console.log(D.LC, '[_cmn/dict.util.js] Cookie saved:' + JSON.stringify($.cookie(COOKIE_NAME)) );
}


// Load resource and append to DOM
function loadResource($, rscURL, rscType, callback, tag, done, readystate){
    if (!__DICT__.appendTag) {
        alert('Need dict.util.sharebml.js');
        return;
    }
    console.log(D.LC, '[_cmn/dict.util.js] Loading:',rscURL);
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


function getParamFromURL(param){
    console.log(D.LC, '[_cmn/dict.util.js] Get params from URL.');
    var urlPatern = new RegExp(param + "=([^&?]+)");
    var m = urlPatern.exec(window.location.href);
    return m? m[1] : null;
}



//////////// Data Type /////////////

//
// Stack (LIFO)
//

function Stack() {
	this.__a = [];
}

Stack.prototype.push = function(o) {
	this.__a.push(o);
}

Stack.prototype.pop = function() {
	if( this.__a.length > 0 ) {
		return this.__a.pop();
	}
	return null;
}

Stack.prototype.size = function() {
	return this.__a.length;
}

Stack.prototype.toString = function() {
	return '[' + this.__a.join(',') + ']';
}

//
// Queue (FIFO)
//

function Queue() {
	this.__a = [];
}

Queue.prototype.enqueue = function(o) {
	this.__a.push(o);
}

Queue.prototype.dequeue = function() {
	if( this.__a.length > 0 ) {
		return this.__a.shift();
	}
	return null;
}

Queue.prototype.size = function() {
	return this.__a.length;
}

Queue.prototype.get = function(i) {
	if( this.__a.length < i ) {
		return null;
	}
	return this.__a[i];
} 

Queue.prototype.toString = function() {
	return '[' + this.__a.join(',') + ']';
}


})(jQuery);
