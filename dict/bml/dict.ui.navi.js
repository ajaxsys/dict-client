/*************************************************
 * dict.ui.navi.js
 *
 * Init ui navi icon on page
 **************************************************/
(function($){

// NOTICE: As a bookmarklet, Dict always load when dom ready!!
// $(function(){
//     initNavi(); 
// });
// for test
var D = $.dict_extend({
    'initNavi' : initNavi,
    'DICT_SERVICE': true, // ON/OFF switch
});

// If load failed on some pages. [issue 20140425]
if (!D.loaded){
    return;
}

var $naviWrapper = $('<div style="position:fixed;top:0;left:0;z-index:2147483647;" class="__navi_div__">');

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
var $quickSearch = $('<input type="text" placeholder="Quick Search" style="border:1px; padding:4px;">');
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
                + '<input type="radio" name="dictmode" value="inner" id="__navi_inner__" checked><label for="__navi_inner__">POP-IN</label> '
                //+ '<input type="radio" name="dictmode" value="iframe"><label for="iframe">IFrame</label>'
                + '<input type="radio" name="dictmode" value="popup" id="__navi_popup__"><label for="__navi_popup__">POP-UP</label>'
                + '</div>');
$changeMode.appendTo($naviInnerWrapper);
$('input', $changeMode).change(function(){
    D.winMode = $(this).val();
    console.log(D.LC, '[dict.ui.navi.js] Dict mode changed to ', D.winMode);
    // Todo: close other mode status
    if (D.winMode === 'inner') {
        if (D.popupWin) {
            try{
                D.popupWin.close();
            }catch(e){
                console.log(e);
            }
        }
    } else if (D.winMode === 'popup'){
        $.closeWindow(D.DICT_ID);
    }
    // Redo last search
    D.doLastQuery();
})



// TODO enable/disable getTextFromMouse

// TODO enable/disable while selected word contains "-" and numbers





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
