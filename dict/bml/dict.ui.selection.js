/*************************************************
 * dict.ui.selection.js
 *
 * Dict UI:
 * - Bind selection event to page
 **************************************************/
(function($){
var D = $.dict_extend({
	_lastSearchWord : null
});

registTextSelectionEvent(document, window);

function registTextSelectionEvent(parentDocument, parentWindow) {
    console.log(D.LC, '[dict.ui.selection.js] Regist text selector');
    //console.log(D.LC, '[dict.ui.selection.js] ', $('body *:not('+DICT_JID+', '+DICT_JID+' *)'));
    $(parentDocument).on('mouseup.dict','body', function(e){
        getSelection(e, parentWindow);
    });
    
    // Regist iframe the same events.(Not support iframe in iframe)
    var $iframes = $('iframe, frame', parentDocument).not('.window-content-iframe', parentDocument);
    console.log(D.LC, '[dict.ui.selection.js] Found iframe numbers (registTextSelectionEvent):', $iframes.length);
    
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
            console.log(D.LC, '[dict.ui.selection.js] iframe can not access:', this);
        }
    });
}

function getSelection(e, win){
    win = win || window;
    var $target = $(e.target);

    console.log(D.LC, '[dict.ui.selection.js] start it');
    if ($(D.DICT_JID).find($target).length === 0) {
        // Not element of dict window
        if (D.DICT_SERVICE){
            var text = $target.is(':input')? $target.selection('get',{},win) : $.selection('html',win);
            // Fix bugs: when dblclick tag like `<i>..</i>`, it returns html code.
            text = $.trim($($.parseHTML(text)).text());
            if (text && text != D._lastSearchWord && isWord(text) ){
                    D._lastSearchWord = text;
                    D.LC++;// For logger
                    D.doQuery(text, $target);
            }
        }
    }
    // WARN: Do not `return false` here. If so, other mouseup be affected.
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



})(jQuery);
