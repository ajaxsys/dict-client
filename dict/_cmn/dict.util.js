/*************************************************
 * _cmn/dict.util.js
 *
 * Common utility functions for both bml(BookmarkLet) & pxy(Proxy) page
 *
 * Utils of dict. Regist to global `__DICT__` variable
 * depend: dict.util.sharebml.js
 **************************************************/
(function($){
'use strict';
// for test & hook
window.__DICT__ = window.__DICT__ || {};
var D=$.dict_extend({
    'getOptionFromCookie' : getOptionFromCookie,
    'setOptionToCookie' : setOptionToCookie,
    'loadResource' : loadResource,
    'getParamFromURL' : getParamFromURL,
    'getUrlHashValue' : getUrlHashValue,
    'getAbsUrl' : getAbsUrl,
    'getBrowserSize' : getBrowserSize,
    'isRelativeURL' : isRelativeURL,

    'addHttpProtocal' : addHttpProtocal,
    'getHrefWithHost' : getHrefWithHost,
    'changeToMobileUrl' : changeToMobileUrl,

    'delayWindowEvent' : delayWindowEvent,
    'Queue': Queue,
    'Stack': Stack,
});


////////////////////////// COMMONS ////////////////////
var COOKIE_NAME='__DICT_OPTIONS__';
function getOptionFromCookie(){
    $.removeCookie(COOKIE_NAME, { path: '/' }); // TODO:Will be delete for a while
    var target = $.jStorage.get(COOKIE_NAME) || {};
    var default_opt={'dict':{'dict_type':'auto','dict_lang':'jp'},'ui':{'width':400,'height':300}};
    $.extend(default_opt, target);// Merge target to options
    console.log(D.LC, '[_cmn/dict.util.js] Cookie read:' + JSON.stringify(default_opt) );
    return default_opt;
}

function setOptionToCookie(opt) {
    //$.cookie.json = true;
    //$.cookie(COOKIE_NAME, opt , { expires: 365, path: '/' });
    $.jStorage.set(COOKIE_NAME, opt);
    console.log(D.LC, '[_cmn/dict.util.js] Cookie saved:' + JSON.stringify($.jStorage.get(COOKIE_NAME)) );
}


// Load resource and append to DOM
function loadResource($, rscURL, rscType, callback, doc, win, tag, done, readystate){
    if (!window.__DICT__.appendTag) {
        alert('Need dict.util.sharebml.js');
        return;
    }
    doc = doc || document;
    win = win || window;
    console.log(D.LC, '[_cmn/dict.util.js] Loading:',rscURL);
    if (rscType=="js") {
        // Create a script element.
        tag = doc.createElement( 'script' );
        tag.type = 'text/javascript';
        tag.src = rscURL;
    } else if (rscType=="css") {
        // Create a css link element.
        tag = doc.createElement( 'link' );
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

    window.__DICT__.appendTag(tag);
}


function getParamFromURL(param){
    console.log(D.LC+1, '[_cmn/dict.util.js] Get params from URL - ', param);
    var urlPatern = new RegExp(param + "=([^&?]+)");
    var m = urlPatern.exec(window.location.href);
    return m? m[1] : null;
}

function getUrlHashValue() {
    var vals = window.location.href.split('#');
    if (vals.length > 1)
        return vals[1].split('?')[0];
    else
        return '';
}

// Get abstract path from relative path
function getAbsUrl(s){
    var a = document.createElement('a');
    a.href = s
    return a.href;
}

function isRelativeURL(href){
    return href.indexOf('//') === -1 || href.indexOf('//')>7; // <7 skip https://
}

function getHrefWithHost(host, href){
    host = addHttpProtocal(host);
    if ( !href.startsWith('/') && !host.endsWith('/') ){
        host = host + '/';
    }
    return isRelativeURL(href) ? (host+href) : href;
}

function addHttpProtocal(host){
    if (host.startsWith('//')){
        host = D.PROTOCAL + host;
    } else if (!host.startsWith('http')){
        host = D.PROTOCAL + '//' + host;
    }
    return host;
}

// Change to URL for SP if possible
function changeToMobileUrl(url, opt){
    if (opt && opt.host && opt.mobile_host){
        if ( (opt.mobile_host instanceof RegExp && url.match(opt.mobile_host)) || url.contains(opt.mobile_host) ) {
            console.log(D.LC, '[dict.util.js] Already mobile URL , NO need change to mobile url:', url);
            //return url;
        } else {
            var oldUrl = url;

            if (typeof opt.changeToMobileUrl == 'function'){
                url = opt.changeToMobileUrl(url);
            } else {
                url = url.replace(opt.host, opt.mobile_host);
            }

            console.log(D.LC, '[dict.util.js] URL ',oldUrl,' changed to mobile url:', url);
        }
    }
    return url;
}


function delayWindowEvent(win, event, callback, args) {
    var didEvent = false;

    $( win )[event](function() {
        didEvent = true;
    });

    setInterval(function(){
        if (didEvent){
            didEvent = false;
            $( win )[event](function() {
                callback(args);
            });
        }
    }, 250);
}

// quirks mode support. DO NOT use $(window).height()/width()
function getBrowserSize(){
    var w = 0;var h = 0;
    //IE
    if(!window.innerWidth){
        if(document.documentElement.clientWidth !== 0){
            //strict mode
            w = document.documentElement.clientWidth;h = document.documentElement.clientHeight;
        } else{
            //quirks mode
            w = document.body.clientWidth;h = document.body.clientHeight;
        }
    } else {
        //w3c
        w = window.innerWidth;h = window.innerHeight;
    }
    return {width:w,height:h};
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

Stack.prototype.get = function(i) {
    if( this.__a.length < i ) {
        return null;
    }
    return this.__a[i];
}

//
// Queue (FIFO)
//

function Queue(max) {
    this.__a = [];
    this.max_length = max;
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


//
// Prototype enhance
//
String.prototype.contains = function(str) {
    return this.indexOf(str) > -1;
}
String.prototype.startsWith = function(str) {
    return this.indexOf(str) === 0;
}
String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};


})(jQuery);
