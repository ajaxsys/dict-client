/*************************************************
 * dict.ui.js
 *
 * Dict UI main:
 * - Initailize Dict UI on page
 * - Bind selection event to page
 * - Bind get text event to page
 **************************************************/
(function($){

// for test & hook
var DICT_ID = '__dict_window_id__',
    DICT_ADD_HIGHT = 41; // height not correct when $win.height()
var D = $.dict_extend({
    'DICT_ID' : DICT_ID,
    'doQuery' : createOrUpdateWindow,
});

var DICT_JID = '#'+DICT_ID,
    PROXY_DEV_URI = '/build/proxy.html##key#?IFRAME&DEV_MODE',
    PROXY_RLS_URI =  '/dict/proxy.html##key#?IFRAME',
    // D.DEV_MODE defined in loader.js
    DICT_URL = D.DEV_MODE ? PROXY_DEV_URI : PROXY_RLS_URI,
    DICT_ISFIXED = "position_is_fixed";

var _thisIP,
    _lastSearchWord;

console.log(D.LC+=10000, '[dict.ui.js] Loading ui resource...');

//loadCSSwithAllFrames(document, window);// TODO support tooltip in iframe 1-1(load css in all frames)
D.loadResource($, static_host()+'/dict/dict_ui.css', 'css');

// Fix page that dont contains body tags! [@issue 20140425]
// like: http://help.eclipse.org/
if ($('body').length === 0) {
    var $body=$("<body>"); 
    $body.css("padding","0px").css("margin","0px");
    $("html>*").not( "head" ).wrap($body);
    //alert("Please wait page reload");
    console.log(D.LC+=10000, '[dict.ui.js] [ERROR] Missing `body` tag. Please reload DICT again later...');
    D.loaded = false;  // Stop All other script

    var $frames = $('iframe, frame'), countFrameLoaded=0;

    $frames.load(function(){
        countFrameLoaded++;
        if ($frames.length === countFrameLoaded) {
            console.log('Reloaded!!!!!!!!!!!!');
        }
    });
    return;            // Stop this script
}


registTextSelectionEvent(document, window);
registWebElementToTextEvent(document);

createOrUpdateWindow();

registWindowResizeEvent(window);

///////////////////// private func //////////////////////
/* TODO support tooltip in iframe 1-2 (load css in all frames)
function loadCSSwithAllFrames(parentDocument, parentWindow) {
    D.loadResource($, static_host()+'/dict/dict_ui.css', 'css', null ,parentDocument, parentWindow);

    // Regist iframe the same events.(Not support iframe in iframe)
    var $iframes = $('iframe, frame', parentDocument);
    console.log(D.LC, '[dict.ui.js] Found iframe numbers (loadCSSwithAllFrames):', $iframes.length);
    $iframes.each(function(){
        try{
            var childWindow = this.contentWindow;
            var childDocument = childWindow.document;
            // Recuive
            loadCSSwithAllFrames(childDocument, childWindow);
        }catch(e){
            console.log(D.LC, '[dict.ui.js] iframe can not access:', this);
        }
    });

}
*/

function getSelection(e, win){
    win = win || window;
    $target = $(e.target);

    console.log(D.LC, '[dict.ui.js] start it');
    if ($(DICT_JID).find($target).length === 0) {
        // Not element of dict window
        if (D.DICT_SERVICE){
            var text = $target.is(':input')? $target.selection('get',{},win) : $.selection('html',win);
            // Fix bugs: when dblclick tag like `<i>..</i>`, it returns html code.
            text = $.trim($($.parseHTML(text)).text());
            if (text && text != _lastSearchWord && isWord(text) ){
                    _lastSearchWord = text;
                    D.LC++;// For logger
                    createOrUpdateWindow(text, $target);
            }
        }
    }
    // WARN: Do not `return false` here. If so, other mouseup be affected.
}
function registTextSelectionEvent(parentDocument, parentWindow) {
    console.log(D.LC, '[dict.ui.js] Regist text selector');
    //console.log(D.LC, '[dict.ui.js] ', $('body *:not('+DICT_JID+', '+DICT_JID+' *)'));
    $(parentDocument).on('mouseup.dict','body', function(e){
        getSelection(e, parentWindow);
    });
    
    // Regist iframe the same events.(Not support iframe in iframe)
    var $iframes = $('iframe, frame', parentDocument);
    console.log(D.LC, '[dict.ui.js] Found iframe numbers (registTextSelectionEvent):', $iframes.length);
    
    $iframes.each(function(i){
        
        try{
            var childWindow = this.contentWindow;
            var childDocument = childWindow.document;
            // Fix browser freeze in safari. Recuive, but delay event registion.
            if (childWindow && childDocument){
                setTimeout(function(){
            registTextSelectionEvent(childDocument, childWindow);
                }, i * 1000 + 1000 );
            }

        }catch(e){
            console.log(D.LC, '[dict.ui.js] iframe can not access:', this);
        }
    });
}

function registWebElementToTextEvent(parentDocument) {
    var option = {
            'checkService': function(){
                return D.DICT_SERVICE;
            },
            'document' : parentDocument || document,
        };

    $.plaintext('body a, body img, body select, body :button', option);

    /* TODO support tooltip in iframe 2 (regist event to all frames)
    // Regist iframe the same events.(Not support iframe in iframe)
    var $iframes = $('iframe, frame', parentDocument);
    console.log(D.LC, '[dict.ui.js] Found iframe numbers (registWebElementToTextEvent):', $iframes.length);
    $iframes.each(function(){
        try{
            var childWindow = this.contentWindow;
            var childDocument = childWindow.document;
            // Recuive
            registWebElementToTextEvent(childDocument);
        }catch(e){
            console.log(D.LC, '[dict.ui.js] iframe can not access:', this);
        }
    });
    */
}

function registWindowResizeEvent(win) {
    D.delayWindowEvent(win, 'resize', function() {
        resetPositionWhenOverflow($(DICT_JID));
    });
}

function createOrUpdateWindow(text, $obj) {
    if (!text) {
        text = "";
    }
    // Get From local storage
    var mode = D.winMode;

    if (mode === 'inner')
        createOrUpdateInnerWindow(text, $obj);
    if (mode === 'popup')
        createOrUpdatePopupWindow(text, $obj);
    if (mode === 'iframe')
        createOrUpdateIFrameWindow(text, $obj);
}

function createOrUpdatePopupWindow(text, $obj) {
    if (!text) {
        return;
    }

    var winSize = getWindowSizeFromCookie(),
        frameURL = static_host() + DICT_URL;

    frameURL = frameURL.replace('#key#',encodeURIComponent(text));

    // Default : 400 * 600
    open_win(frameURL, 'Dict!', winSize.width, winSize.height < 600 ? 600 : winSize.height);
}

//Open windows to center of screen
var win;
function open_win(url,windowname,width,height) {
	console.log(url,windowname,width,height);
    if (win && win.location) {
        console.log(D.LC, '[dict.ui.js] open in existing popup windows: ', url);
        win.location.href = url;
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
    // Regist events
    $(window).on('unload', function() { win.close(); });
    // TODO: Disabled because security on CROSS site
    $(win).resize(function(){ setWindowSizeToCookie( $(win) ); });
}


function createOrUpdateIFrameWindow(text, $obj) {

}

function createOrUpdateInnerWindow(text, $obj) {

    /* Window move to selected word.
    var offset = $obj.position(),
        textWidthHeight = getTextWH(text,$obj),
        left = offset.left + textWidthHeight.width,
        top  = offset.top  + textWidthHeight.height;
    */
    var $dict = $(DICT_JID);
    
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

    var frameURL = static_host() + DICT_URL;
    // Update iframe, need encodeURI for cross encoding of page.
    $.updateWindowContent(DICT_ID, '<iframe src="'+frameURL.replace('#key#',encodeURIComponent(text))+
                '" style="overflow-x: hidden;width: 100%;height:100%;border:0px;"></iframe>');
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
            _lastSearchWord='';
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



// Without any symbol
// 。、，（）「」￥！ // NG in shift-JIS page
var WORD_REGEX = /^[^!"#$&'\-\(\)=~\^\\\|@`\{\}\[\];:,\.\/\?\u3002\u3001\uFF0C\uFF08\uFF09\u300C\u300D\uFFE5\uFF01]+$/   ;
function isWord(text){
    // Selected words in one line
    if (!text) return false;
    return text.indexOf('\n')===-1 
       //&& (/^[a-zA-Z0-9%_\-\+\s]+$/.test(text) || /^[^a-zA-Z]+$/.test(text))
       && text.length < D.WORD_MAX_LENGTH
       && !isSimpleWord(text)
       && !isLongSentence(text)
       && WORD_REGEX.test(text);
}

function isSimpleWord(t){
    // only one char and ascii from 0~255
    if (t.length===1 && t.charCodeAt(0)<256){
        return true;
    }
    // Contain number is simple word
    if (t.search(/[0-9]/)>-1){
        return true;
    }
    // More...
    return false;
}

function isLongSentence(t){
    var spliter=null, 
        spliters=[' ','\u3000','\t']; // space, zenkaku space, tab
    for (var i in spliters){
        if (t.indexOf(spliters[i])>-1){
            spliter = spliters[i];
            break;
        }
    }

    if (spliter===null){
        return false;
    }

    // max support: `w1 w2 w3`
    return t.split(spliter).length > D.WORD_MAX_COUNT;
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

// Get static resource like `iframe/css` URL
function static_host(){
    var dev_ip = 'http://127.0.0.1:8443',
        rls_ip = D.PROTOCAL + '//dict-admin.appspot.com';

    // Static IP
    // First time only
    if (_thisIP)
        return _thisIP;

    // 1 DEV_MODE/ST_MODE setting in loader.js
    if (D.DEV_MODE || D.ST_MODE){
        // 2 Intranet test(http only, e.g: http://fc-pc/  ): No `.` before first `/` in hostname
        var intrRegxp = /^http(|s):(\/\/[^\/\.]+?)\/.*$/;
        var matcher = intrRegxp.exec(window.location.href);
        if ( matcher ){
            var ip = matcher[2];
            console.log(D.LC, '[dict.ui.js] Use intranet ip:', ip);
            _thisIP = ip;
            // Run a ajax connection test, if NOT work, use dev_ip
            // host + /dict/dict_ui.css
            $.ajax({url: 'http:'+ip+'/dict/dict_ui.css', type:'HEAD', async:false, error:function(){
                _thisIP = ip = dev_ip;
            }});
            return ip;
        }

        // 3 test as a bookmarklet in other sites(http only)
        console.log(D.LC, '[dict.ui.js] Using develop IP. ',dev_ip);
        _thisIP = dev_ip;
        return dev_ip;
    }

    // Product mode
    console.log(D.LC, '[dict.ui.js] Using release host:', rls_ip);
    _thisIP = rls_ip;
    return rls_ip;
}

})(jQuery);
