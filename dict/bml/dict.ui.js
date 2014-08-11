/*************************************************
 * dict.ui.js
 *
 * Dict UI main:
 * - Initailize Dict UI on page
 * - Bind selection event to page
 * - Bind get text event to page
 **************************************************/
(function($){
'use strict';
// for test & hook
var DICT_ID = '__dict_window_id__',
    DICT_JID = '#'+DICT_ID,
    DICT_ADD_HIGHT = 41; // height not correct when $win.height()
var D = $.dict_extend({
    'DICT_ID' : DICT_ID,
    'DICT_JID' : DICT_JID,
    'doQuery' : createOrUpdateWindow,
    'doLastQuery' : doLastQuery,
});

// If load failed on some pages. [issue 20140425]
if (!D.loaded){
    return;
}

var PROXY_DEV_URI = '/build/proxy.html##key#?DEV_MODE',
    PROXY_RLS_URI =  '/dict/proxy.html##key#?',
    // DICT_ISFIXED = "position_is_fixed",
    // D.DEV_MODE defined in loader.js
    DICT_URL = D.DEV_MODE ? PROXY_DEV_URI : PROXY_RLS_URI;

createOrUpdateWindow();
registWindowResizeEvent(window);

///////////////////// private func //////////////////////
var _lastSearchWord, lastInnerWord, lastPopupWord, lastIframeWord;

function createOrUpdateWindow(text, $obj) {
    // TODO:Get From local storage
    var mode = D.winMode;

    if (mode === 'inner'){
        text = text || lastInnerWord || "";
        createOrUpdateInnerWindow(text, $obj);
        lastInnerWord = text;
    }
    else if (mode === 'popup'){
        text = text || lastPopupWord || "";
        createOrUpdatePopupWindow(text);
        lastPopupWord = text;
    }
    else if (mode === 'iframe'){
        text = text || lastIframeWord || "";
        createOrUpdateIFrameWindow(text, $obj);
        lastIframeWord = text;
    }

    _lastSearchWord = text;
}

function createOrUpdateInnerWindow(text, $obj) {
    if ($obj){
        /* TODO: Window move to selected word.
        var offset = $obj.position(),
            textWidthHeight = getTextWH(text,$obj),
            left = offset.left + textWidthHeight.width,
            top  = offset.top  + textWidthHeight.height;
        */
    }
    var $dict = $(DICT_JID);
    // Check last search
    if (text && text == lastInnerWord){
        $dict.show();
        return;
    }
    
    if ($dict.length === 0) {
        $dict = createNewWindow(text);
        // Fixed & Hide this win when first created
        if ($dict){
            $dict.css('position','fixed');
        }
        /* If window move to selected word
         $(DICT_JID).data(DICT_ISFIXED, true);*/
    } else {
        /* If window move to selected word
        console.log(D.LC, '[dict.ui.js] ', $dict.data(DICT_ISFIXED));
        if ($dict.data(DICT_ISFIXED) != true){
            $.moveWindow(DICT_ID, left, top);
        }*/
        // Update
        $.updateWindowTitle(DICT_ID, text);
    }
    // Toggle it
    if (text && !$dict.is(':visible') ) {
        $dict.fadeIn(function(){
            resetPositionWhenOverflow($dict);
        });// Show it when window reopen or first search
    }else if (!text){
        $dict.hide(); // Hide it when init(pre-load)
    }

    var frameURL = D.static_host() + DICT_URL;
    // Update iframe, need encodeURI for cross encoding of page.
    $.updateWindowContent(DICT_ID, '<iframe src="'+frameURL.replace('#key#',encodeURIComponent(text))+
                '" style="overflow-x: hidden;width: 100%;height:100%;border:0px;" class="window-content-iframe"></iframe>');
}


function createOrUpdatePopupWindow(text) {
    if (!text) {
        return;
    }
    // Check last search
    var win = D.popupWin
    if (text == lastPopupWord && win && win.closed===false){
        win.focus();
        return;
    }

    var winSize = getWindowSizeFromCookie(),
        frameURL = D.static_host() + DICT_URL;

    frameURL = frameURL.replace('#key#',encodeURIComponent(text));

    // Default : 400 * 600
    open_win(frameURL, 'Dict!', winSize.width, winSize.height < 600 ? 600 : winSize.height);
}

function createOrUpdateIFrameWindow(text, $obj) {
    var $wrapper = $('<div/>'),
        $dict = $(DICT_JID);
    $wrapper.css('margin-right', $dict.width());
    // Check last search
    if (text == lastIframeWord){
        $dict.show();
        return;
    }

    $('body').children().not(".__navi_div__, " + DICT_JID).wrapAll($wrapper);
    console.log(D.LC, '[dict.ui.js] Wrap all elements.');
    createOrUpdateInnerWindow(text, $obj);
}

//Open windows to center of screen
function open_win(url,windowname,width,height) {
    var win = D.popupWin;
    if (win && win.closed===false) {
        console.log(D.LC, '[dict.ui.js] open in existing popup windows: ', url);
        win.location.href = url;
        win.focus();
        return;
    }

    console.log(D.LC, '[dict.ui.js] Create new popup windows: ', url);
    var features="menubar=no, status=no, scrollbars=yes, resizable=yes, toolbar=no";
    if (width) {
        //width: right
        if (window.screen.width > width){
            features+=", left="+((window.screen.width-width));
        }
        else{
            width=window.screen.width;
            features+=", left=0";
        }
        features+=", width="+width;
    }
    if (height) {
        //height: bottom
        if (window.screen.height > height){
            features+=", top="+((window.screen.height-height));
        }
        else{
            height=window.screen.height;
            features+=", top=0";
        }
        features+=", height="+height;
    }
    win = window.open(url,windowname,features);
    D.popupWin = win;
    // Regist events
    $(window).on('unload', function() { win.close(); });
    // TODO: Disabled because security on CROSS site
    $(win).resize(function(){ setWindowSizeToCookie( $(win) ); });
}

function createNewWindow(title){
    var winSize = getWindowSizeFromCookie(),
        brsSize = getBrowserSize(),
        left = brsSize.width-winSize.width,
        top = brsSize.height-winSize.height-DICT_ADD_HIGHT;

    console.log(D.LC, '[dict.ui.js] Win width: ', winSize.width, ' height: ', winSize.height, ' Top: ', top, ' left: ', left);

    // Create
    return $.newWindow({
        'id': DICT_ID,
        'posx': left>0 ? left:0,
        'posy': top >0 ? top :0,
        'title':title,
        'type':'iframe',
        'width': winSize.width,
        'height': winSize.height,
        'onDragBegin': function(){
            console.log(D.LC, '[dict.ui.js] Dragging begin');
            $(DICT_JID).animate({opacity: "0.5"},500);
        },
        'onDragEnd': function(){
            console.log(D.LC, '[dict.ui.js] Dragging End');
            var $dictWin=$(DICT_JID);
            $dictWin.stop().css({opacity: "1.0"});// Must stop animate
            // Fix bugs of window flyaway.
            resetPositionWhenOverflow($dictWin);
        },
        'onResizeEnd': setWindowSizeToCookie,
        'onWindowClose': function(){
            //_lastSearchWord='';
        },
        'closeWithHide': true, // Better performace
        //minimizeButton: false,// TO Fix
    });
}

function resetPositionWhenOverflow($win){
    // Parameter check
    if (!$win || $win.length<=0){
        return;
    }
    var MARGIN_LEFT=$win.width(),
        MARGIN_TOP =$win.height()+DICT_ADD_HIGHT;
    var W=$win.position().left+MARGIN_LEFT,
        H=$win.position().top+MARGIN_TOP,
        brsSize = getBrowserSize(),
        MAX_W=brsSize.width,
        MAX_H=brsSize.height,
        isWOver = (W > MAX_W) ,
        isHOver = (H > MAX_H) ;
    console.log(D.LC, '[dict.ui.js] W:', W,' H:',H,'MAX_W:',MAX_W,' MAX_H:',MAX_H,'isWOver:',isWOver,' isHOVer:',isHOver);
    if (isWOver||isHOver) {
        var width = isWOver?(MAX_W-MARGIN_LEFT):W-MARGIN_LEFT ,
            height= isHOver?(MAX_H-MARGIN_TOP):H-MARGIN_TOP ;
        if (width<0) width=0;
        if (height<0) height=0;
            $.moveWindow(DICT_ID,width,height);
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

function setWindowSizeToCookie($win){
    $win = $win || $(DICT_JID);
    var opt = D.getOptionFromCookie();
    opt.ui.width = $win.width();
    opt.ui.height = $win.height();
    D.setOptionToCookie(opt);
    console.log(D.LC, '[dict.ui.js] Set win size to width: ',opt.ui.width, 'height: ', opt.ui.height);
}

function getWindowSizeFromCookie(){
    var opt= D.getOptionFromCookie();
    return opt.ui;
}


function doLastQuery() {
    console.log(D.LC, '[dict.ui.js] Do last search by text:', _lastSearchWord);
    createOrUpdateWindow(_lastSearchWord);
}

function registWindowResizeEvent(win) {
    D.delayWindowEvent(win, 'resize', function() {
        resetPositionWhenOverflow($(DICT_JID));
    });
}


})(jQuery);
