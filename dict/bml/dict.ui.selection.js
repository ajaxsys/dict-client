/*************************************************
 * dict.ui.selection.js
 *
 * Dict UI:
 * - Bind selection event to page
 **************************************************/
(function($){
'use strict';
var D = $.dict_extend();

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
    // Disable dict start when click some clickable elements on page
    if ($target.is('select') || $target.is('button') || $target.is('a') ){
        console.log(D.LC, '[dict.ui.selection.js] Stop selection of tag:', $target.prop('tagName'));
        // return;
    }
    // Selection should escape navi & dict div
    else if ($(D.DICT_JID).add(D.NAVI_JID).find($target).length === 0) {
        // Not element of dict window
        if (D.DICT_SERVICE){
            var text = $target.is(':input')? $target.selection('get',{},win) : $.selection('html',win);
            // Fix bugs: when dblclick tag like `<i>..</i>`, it returns html code. 
            text = $.trim( $($.parseHTML(text)).text() );
            text = text ? text.replace(/\n/g, '') : null; // Support break line: Character `\n` contains in `<p>..\n..</p>`
            if (text && isWord(text) ){  // No ajuse if equals last search word. Always search it (Because don't known if window is open or closed)
                    D.LC++;// For logger
                    D.doQuery(text, $target);
            }
        }
    }
    // WARN: Do not `return false` here. If so, other mouseup be affected.
}



// Without any symbol
// 。、，（）「」￥！ // NG in shift-JIS page
var WORD_REGEX = /^[^!"#$&'\(\)=~\^\\\|@`\{\}\[\];:,\.\/\?\u3002\u3001\uFF0C\uFF08\uFF09\u300C\u300D\uFFE5\uFF01]+$/   ;
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
    // Contain number is simple word '0~9' & '-'
    if (D.disableNumSelection && t.search(/[0-9\-]/)>-1){
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
    return t.split(new RegExp(spliter+'+')).length > D.WORD_MAX_COUNT;
}



})(jQuery);
