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

initNavi(); 

function initNavi(){
    console.log(D.LC, '[dict.ui.navi.js] Initialize navi.');
    //var on='\u2602',off='\u2604',
    //var on='☂',off='☄',
    var ttlOn='ON',ttlOff='OFF',
        classOn='__navi_on__',classOff='__navi_off__',
        $navi = $('<div style="position:fixed;top:0;left:0;z-index:2147483647;" class="__navi_div__"></div>'),
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
        });
    },500);
}



})(jQuery);
