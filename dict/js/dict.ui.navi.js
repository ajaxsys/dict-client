(function($){

// NOTICE: As a bookmarklet, Dict always load when dom ready!!
// $(function(){
//     initNavi(); 
// });

initNavi(); 

// for test
$.extend(window.__DICT__ ,  {
    'initNavi' : initNavi,
    'DICT_SERVICE': true, // ON/OFF switch
});
var DICT = window.__DICT__;

function initNavi(){
    console.log("Initialize navi.");
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
            DICT.DICT_SERVICE=$imgOn.is(':visible'); 
            if (!DICT.DICT_SERVICE){
                $.closeWindow(DICT.DICT_ID);
            }
        });
    },500);

}



})(jQuery);
