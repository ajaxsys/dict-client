(function($){

// for test & hook
var DICT_ID = '__dict_window_id__';
var D = $.dict_extend({
    'DICT_ID' : DICT_ID,
});

var DICT_JID = '#'+DICT_ID,
    DICT_URL = D.DEV_MODE ? '/build/proxy.html##key#?DEV_MODE' : '/dict/proxy.html##key#',
    DICT_ISFIXED = "position_is_fixed";

var _thisIP,
    _lastSearchWord;

console.log('Loading ui resource...');
D.loadResource($, static_host()+'/dict/dict_ui.css', 'css');

registSelectWord();
registLinkToText();

createOrUpdateWindow('body','');

$( window ).resize(function() {
    resetPositionWhenOverflow($(DICT_JID));
});

function getSelection(doc,win, _this){
    doc = doc || document;
    win = win || window;
    _this = _this || this;
    console.log('start it');
    if ($(DICT_JID).find(_this).length === 0) {
        // Not element of dict window
        if (D.DICT_SERVICE){
            var text = $.trim(getSelectionText(doc,win,_this));
            if (text != _lastSearchWord && isWord(text) ){
                    _lastSearchWord = text;
                    createOrUpdateWindow($(_this), text);
            }
        }
    }
    // WARN: Do not `return false` here. If so, other mouseup be affected.
}
function registSelectWord() {
    console.log('Regist text selector');
    //console.log($('body *:not('+DICT_JID+', '+DICT_JID+' *)'));
    $(document).on('mouseup.dict','body, body *:input',getSelection);
    $('iframe').each(function(){
        var child_doc = this.contentDocument,
            child_win = this.contentWindow;
        $(child_doc).on('mouseup.dict','body',function(){
            getSelection(child_doc, child_win, this);
        });
    });
}

function registLinkToText() {
    $.plaintext('body a, body img, body select, body :button');
}

function createOrUpdateWindow($obj, text) {

    /* Window move to selected word.
    var offset = $obj.position(),
        textWidthHeight = getTextWH(text,$obj),
        left = offset.left + textWidthHeight.width,
        top  = offset.top  + textWidthHeight.height;
    */
    var $dict = $(DICT_JID);
    
    if ($dict.length === 0) {
        createNewWindow(text);
        // Fixed this win as default
        $dict = $(DICT_JID);
        $dict.css('position','fixed');
        /* If window move to selected word
         $(DICT_JID).data(DICT_ISFIXED, true);*/
    } else {
        /* If window move to selected word
        console.log($dict.data(DICT_ISFIXED));
        if ($dict.data(DICT_ISFIXED) != true){
            $.moveWindow(DICT_ID, left, top);
        }*/
        // Update
        $.updateWindowTitle(DICT_ID, text);
    }
    var frameURL = static_host() + DICT_URL;
    // Update iframe, need encodeURI for cross encoding of page.
    $.updateWindowContent(DICT_ID, '<iframe src="'+frameURL.replace('#key#',encodeURIComponent(text))+
                '" style="overflow-x: hidden;width: 100%;height:100%;border:0px;"></iframe>');
    if (!text) {
        $dict.hide(); // For preload
    } else {
        $dict.show();
    }
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

function createNewWindow(title){
    var winSize = getWindowSizeFromCookie(),
        left = getBrowserSize().width-winSize.width,
        top = getBrowserSize().height-winSize.height-41;

    console.log("Win width: ", winSize.width, " height: ", winSize.height, " Top: ", top, " left: ", left);

    // Create
    $.newWindow({
        'id': DICT_ID,
        'posx': left>0 ? left:0,
        'posy': top >0 ? top :0,
        'title':title,
        'type':'iframe',
        'width': winSize.width,
        'height': winSize.height,
        'onDragEnd': function(){
            // Fix bugs of window flyaway.
            resetPositionWhenOverflow($(DICT_JID));
        },
        'onResizeEnd': setWindowSizeToCookie,
        'onWindowClose': function(){
            _lastSearchWord='';
        }
    });
}

function resetPositionWhenOverflow($win){
    // Parameter check
    if (!$win || $win.length<=0){
        return;
    }
    var MARGIN=300;
    var W=$win.position().left+MARGIN,
        H=$win.position().top+MARGIN,
        MAX_W=$(window).width(),
        MAX_H=$(window).height(),
        isWOver = (W > MAX_W) ,
        isHOver = (H > MAX_H) ;
    console.log("W:", W," H:",H,'MAX_W:',MAX_W,' MAX_H:',MAX_H,'isWOver:',isWOver,' isHOVer:',isHOver);
    if (isWOver||isHOver) {
        var width = isWOver?(MAX_W-MARGIN):W ,
            height= isHOver?(MAX_H-MARGIN):H ;
        if (width<0) width=0;
        if (height<0) height=0;
            $.moveWindow(DICT_ID,width,height);
    }
}



// Without any symbol
// 。、，（）「」￥！ // NG in shift-JIS page
var WORD_REGEX = /^[^!"#$&'\-\(\)=~\^\\\|@`\{\}\[\];:,\.\/\?\u3002\u3001\uFF0C\uFF08\uFF09\u300C\u300D\uFFE5\uFF01]+$/,
    WORD_MAX_LENGTH = 50;  
function isWord(text){
    // Selected words in one line, 
    return text !== '' && text.indexOf('\n')===-1 
       //&& (/^[a-zA-Z0-9%_\-\+\s]+$/.test(text) || /^[^a-zA-Z]+$/.test(text))
       && text.length < WORD_MAX_LENGTH
       && WORD_REGEX.test(text);
}

/////////////////////////////////////////////////////

function setWindowSizeToCookie(){
    var $win = $(DICT_JID);
    var opt = D.getOptionFromCookie();
    opt.ui.width = $win.width();
    opt.ui.height = $win.height();
    D.setOptionToCookie(opt);
}

function getWindowSizeFromCookie(){
    var opt= D.getOptionFromCookie();
    return opt.ui;
}

function getSelectionText(doc,win,_this) {
    return $(_this).selection() || $.selection('html');
}

// Get static resource like `iframe/css` URL
function static_host(){
    var dev_ip = 'http://127.0.0.1:8443',
        //rls_single = '//dict-admin.appspot.com',
        rls_ip = '//python-ok.appspot.com';

    // Static IP
    // First time only
    if (_thisIP)
        return _thisIP;

    // 1 DEV_MODE/ST_MODE setting in loader.js
    if (D.DEV_MODE || D.ST_MODE){
        // 2 Intranet test(http only): No `.` before first `/` in hostname
        var intrRegxp = /^http(|s):(\/\/[^\/\.]+?)\/.*$/;
        var matcher = intrRegxp.exec(window.location.href);
        if ( matcher ){
            var ip = matcher[2];
            console.log('Use intranet ip:', ip);
            _thisIP = ip;
            return ip;
        }

        // 3 test as a bookmarklet in other sites(http only)
        console.log("Using develop IP. ",dev_ip);
        _thisIP = dev_ip;
        return dev_ip;
    }

    // Product mode
    console.log('Using release host:', rls_ip);
    _thisIP = rls_ip;
    return rls_ip;
}

})(jQuery);
