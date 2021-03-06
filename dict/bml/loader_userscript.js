// ==UserScript==
// @name       SecondScreen
// @namespace  https://ajaxsys.github.io/dict-client
// @version    0.4.4
// @description  DICT： a second screen for your browser.
// @match      http://*/*
// @match      https://*/*
// @require    https://ajaxsys.github.io/dict-client/target/dict/dict_userscript.js?v=0.4.4
// @copyright  2014+, fcr403@gmail.com
// ==/UserScript==

/**
 * For http://userscripts.org/scripts/show/293217
 */


// Avoid iframe
/*
if(window != window.top) {
    return;
}*/

// Enable iframe only when size > 300x300
if(isSkipFrame()) return;

function getBrowserSize(){
    'use strict';
    var w = 0, h = 0;
    try{
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
    }catch(e){
        w = 0;
        h = 0;
    }

    return {
        'width':w?w:0 ,
        'height':h?h:0
    };
}

function isSkipFrame(){
    'use strict';
    try {
        var size = getBrowserSize();

        console.log("0----------",window.top, window.location.href, size.width, size.height);
        // Top page, not skip == enable
        if (window == window.top && window.location.href.indexOf('ajaxsys.github.io/dict-client/target/dict/proxy.html') < 0 ){
            console.log("1----------Top page",window.top, window.location.href, size.width, size.height);
            return false;
        }

        // skip DICT self page == disable
        if (window.location.href.indexOf('ajaxsys.github.io/dict-client/target/dict/proxy.html') > 0 ){
            console.log("2----------self page",window.top, window.location.href, size.width, size.height);
            return true;
        }


        // skip iframe size less than 300 - DICT needs at least a 300*300 area
        if (size.height < 300 && size.width<300) {
            console.log("3----------small than 300*300", window.location, window.top.location);
            return true;
            /*
            if ((window != window.top) &&  window.top && window.top.location
                (window.location.host+window.location.port !== window.top.location.host+window.top.location.port)
                ){
                console.log("3---------", window.location, window.top.location);
                return false;
            }*/
        }

    }catch(e){
        console.log("err---------" + e);
        // Error, skip it
        return true;
    }
    console.log("4-----------ok show it.");
    // not skip
    return false;
}








// Append: dict.util.share.js
// Append: loader.js

