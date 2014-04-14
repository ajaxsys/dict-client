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

var $navi = $('<div style="position:fixed;top:0;left:0;z-index:2147483647;" class="__navi_div__"></div>');
initNavi(); 

function initNavi(){
    console.log(D.LC, '[dict.ui.navi.js] Initialize navi.');
    //var on='\u2602',off='\u2604',
    //var on='☂',off='☄',
    var ttlOn='ON',ttlOff='OFF',
        classOn='__navi_on__',classOff='__navi_off__',
        $imgOn = $('<div>').addClass(classOn).attr('title',ttlOn),
        $imgOff = $('<div>').addClass(classOff).attr('title',ttlOff).hide();

    $navi.append($imgOn).append($imgOff).appendTo('body');// Prepend: lost to other max z-index.

    // Waiting dom compute css , see SO: get-actual-value-specified-in-css-using-jquery
    setTimeout(function(){
        $navi.click(function(){
            $imgOn.add($imgOff).toggle();
            D.DICT_SERVICE=$imgOn.is(':visible'); 
            if (!D.DICT_SERVICE){
                $.closeWindow(D.DICT_ID);
            }
        }).hoverIntent({
            over: showSearchPanel,
            interval: 500,
            out: hideSearchPanel,
            timeout: 1000,
        });
    },500);
}

var $quickSearch = $('<input type="text">');
$quickSearch.hide().appendTo($navi).click(function(){
    $(this).select();
    return false;// Stop event propagation
});

function showSearchPanel(){
    console.log('show it');
    $quickSearch.val('').show().focus();
    $quickSearch.keydown(function(e){
        if (e.keyCode == 13){
            // enter, call DICT search
            var key = $quickSearch.val();
            if (key) D.doQuery(key);
        } else if (e.keyCode == 27){
            // Escape, hide it
            hideSearchPanel();
        }
    });
}

function hideSearchPanel(){
    $quickSearch.hide();
}


})(jQuery);
