/*************************************************
 * dict.ui.navi.js
 *
 * Init ui navi icon on page
 **************************************************/
(function($){
'use strict';
// NOTICE: As a bookmarklet, Dict always load when dom ready!!
// $(function(){
//     initNavi(); 
// });
// for test
var NAVI_ID = '__navi_div__',
    NAVI_JID = '#' + NAVI_ID;
var D = $.dict_extend({
    'initNavi' : initNavi,
    'DICT_SERVICE': true, // ON/OFF switch
    'NAVI_JID' : NAVI_JID,
});

// If load failed on some pages. [issue 20140425]
if (!D.loaded){
    return;
}

var $naviWrapper = $('<div style="position:fixed;top:0;left:0;z-index:2147483647;" class="'+NAVI_ID+'" id="'+NAVI_ID+'">');

var $navi = $('<div>');
//var $navi = $('<div style="position:fixed;top:0;left:0;z-index:2147483647;" class="__navi_div__"></div>');
initNavi(); 

function initNavi(){
    console.log(D.LC, '[dict.ui.navi.js] Initialize navi.');
    //var on='\u2602',off='\u2604',
    //var on='☂',off='☄',
    var ttlOn='ON',ttlOff='OFF',
        classOn='__navi_on__',classOff='__navi_off__',
        $imgOn = $('<div>').addClass(classOn).attr('title',ttlOn),
        $imgOff = $('<div>').addClass(classOff).attr('title',ttlOff).hide();

        $navi.append($imgOn).append($imgOff).appendTo($naviWrapper);// Prepend: lost to other max z-index.
    // Waiting dom compute css , see SO: get-actual-value-specified-in-css-using-jquery
    setTimeout(function(){
    //$('#'+D.DICT_ID).load(function() {
        $navi.click(function(){
            $imgOn.add($imgOff).toggle();
            D.DICT_SERVICE=$imgOn.is(':visible'); 
            if (!D.DICT_SERVICE){
                $.closeWindow(D.DICT_ID);
            }
        }).hoverIntent({
            over: showSearchPanel,
            interval: 500,
            out: function(){}, //hideSearchPanel,
            // timeout: 1000,
        });
    //});
    },500);

}



$naviWrapper.appendTo('body');




var $naviInnerWrapper = $('<div class="__navi_inner_wrapper__">');
$naviInnerWrapper.hide().appendTo($naviWrapper);
$naviInnerWrapper.keydown(function(e){
    if (e.keyCode == 27){
        // Escape, hide it
        hideSearchPanel();
    }
}).mouseleave(hideSearchPanel);


/////////////////////////////////////////////////
// Quick Search
/////////////////////////////////////////////////
var $quickSearch = $('<input type="text" placeholder="Quick Search" style="border:1px; padding:4px; width:95%;">');
$quickSearch.appendTo($naviInnerWrapper)
.click(function(){
    $(this).select();
    return false;// Stop event propagation
})
.keydown(function(e){
    if (e.keyCode == 13){
        // enter, call DICT search
        var key = $quickSearch.val();
        if (key) D.doQuery(key);
    }
});








/////////////////////////////////////////////////
// Pop-IN or Pop-UP
/////////////////////////////////////////////////
var $changeMode = $('<div style="color:gray;">' 
                // Popup
                + '<label style="display:inline;" for="__navi_inner__"><input type="radio" name="dictmode" mode="inner" id="__navi_inner__" checked> POP IN </label>'
                + '<label style="display:inline;" for="__navi_left__" ><input type="radio" name="dictmode" mode="inner" id="__navi_left__" > GO LEFT </label> <br />'
                // Inner
                + '<label style="display:inline;" for="__navi_popup__"><input type="radio" name="dictmode" mode="popup" id="__navi_popup__"> POP UP </label>'
                + '<label style="display:inline;" for="__navi_right__"><input type="radio" name="dictmode" mode="inner" id="__navi_right__"> GO RIGHT </label>'
                + '</div>');
$changeMode.appendTo($naviInnerWrapper);

var prevMode='inner'; //Default mode
$('input', $changeMode).change(function(){
    D.winMode = $(this).attr('mode');
    console.log(D.LC, '[dict.ui.navi.js] Dict mode changed to ', D.winMode);
    resetWinMode();

    // Todo: close other mode status
    if (D.winMode === 'inner') {
        if (D.popupWin) {
            try{
                D.popupWin.close();
            }catch(e){
                console.log(e);
            }
        }

        var subInnerMode = $(this).attr('id');
        setSubWindMode(subInnerMode);

    } else if (D.winMode === 'popup'){
        $.closeWindow(D.DICT_ID);
    }
    // Redo last search
    if (prevMode!==D.winMode){
        prevMode = D.winMode;
        D.doLastQuery();
    }
    
})

var $targetPage = $('body');
var originMarginLeft = parseInt($targetPage.css('margin-left'),10);
var originMarginRight = parseInt($targetPage.css('margin-right'),10);
console.log(D.LC, '[dict.ui.navi.js] originMarginLeft:', originMarginLeft, ' originMarginRight:', originMarginRight);
function resetWinMode(){
    // Reset by default(inner mode)
    $targetPage.css('margin-left', originMarginLeft).css('margin-right', originMarginRight);
}
function setSubWindMode(subMode){
    var $dictWin=$(D.DICT_JID),
        dictWidth = $dictWin.width(),
        browserSize = D.getBrowserSize();
    
    if (subMode==='__navi_left__'){
        $targetPage.css('margin-left', originMarginLeft + dictWidth);
        // Move to left
        $.moveWindow(D.DICT_ID, 0, 22);
        $.resizeWindow(D.DICT_ID, dictWidth, browserSize.height-62);
    } else if (subMode==='__navi_right__'){
        $targetPage.css('margin-right', originMarginRight + dictWidth);
        // Move to right
        $.moveWindow(D.DICT_ID, browserSize.width - dictWidth, 0);
        $.resizeWindow(D.DICT_ID, dictWidth, browserSize.height-40);
    }
}





// TODO enable/disable while selected word contains "-" and numbers
var $flgEnableNumSelection = $('<label style="display:inline;" for="__navi_flg_num_sel__"><input type="checkbox" id="__navi_flg_num_sel__" checked> Disable number search </label>');

$flgEnableNumSelection.appendTo($naviInnerWrapper);
$('input', $flgEnableNumSelection).change(function(){
    D.disableNumSelection = this.checked;
});







function showSearchPanel(){
    if (!D.DICT_SERVICE){
        return;
    }
    $naviInnerWrapper.show();
    $quickSearch.val('').focus();
}

function hideSearchPanel(){
    $naviInnerWrapper.hide();
}



})(jQuery);
