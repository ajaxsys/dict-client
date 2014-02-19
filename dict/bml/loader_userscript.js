/**
 * For http://userscripts.org/scripts/show/293217
 */


// Avoid iframe
//if(window != window.top) return;

// Enable iframe only when size > 300x300
if(isSkipFrame()) return;

function isSkipFrame(){
    try {
        var size = getBrowserSize();
        //console.log("----------",window.top, window.location.href, size.width, size.height);

        // DICT needs at least a 300*300 area
        if (size.height>300 || size.width>300)
            return false;
        
        // Top page, enable
        if (window == window.top)
            return false;
        
        // Disable on DICT self page
        if (window.location.href.indexOf('dict-admin.appspot.com/dict/proxy.html') > 0 ){
            return true;
        }

        // Enable dict on other host iframe. 
        if (window != window.top && window.top && window.top.location   &&   (window.location.host+window.location.port !== window.top.location.host+window.top.location.port) )
            return false; 
    }catch(e){
        // Enable dict on other host iframe. (Only same host iframe can get top location)
        return false; 
    }
    return true;
}


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

/*
 * Share with bookmarklet. No jQuery
 */
void((function(win,doc){

function get1stTag() {
    var result;
    for (var i = 0; i < arguments.length; i++) {
        var tag=arguments[i],
            tags=doc.getElementsByTagName(tag);
        if (tags.length>0) {
            result = tags[0];
            break;
        }
    }
    return result || doc.documentElement.childNodes[0];
}

// for test & hook
win.__DICT__ = win.__DICT__ || {};
__DICT__.appendTag = function (node) {
    var tag = get1stTag('head','body');
    if (tag){
        tag.appendChild(node);
    } else {
        var url = 'http://dict-admin.appspot.com';
        alert('Sorry, Not support for your browser. More details, visit: '+url);
        window.open(url);
    }
};

})(window,document));



setTimeout(function(){
    
/**
 * Depend dict.util.share.js
 */
void((function(w){
    var D=w.__DICT__;
    D.DEV_MODE=true;
    if (!D.loaded) {
        var ui=document.createElement('script');
        ui.setAttribute('src','https://dict-admin.appspot.com/dict/dict_ui.js?_'+new Date().getTime());
        ui.setAttribute("type","text/javascript");
        ui.setAttribute("charset","UTF-8");
        D.appendTag(ui);
    }
})(window));

    

},2000);