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
    var altOn='ON',altOff='OFF',
        classOn='__navi_on__',classOff='__navi_off__',
        $navi = $('<div style="position:fixed;top:0;left:0;z-index:2147483647;" class="__navi_div__"></div>'),
        $img = $('<img src="http://www.w3schools.com/css/img_trans.gif">').addClass(classOn).prop('alt',altOn),
        $calOff = $('<div>').addClass(classOff).hide();

    $navi.append($img);

    $navi.appendTo('body');// Prepend lose to other max z-index.
    $calOff.appendTo('body');

    // Waiting dom compute css , see SO: get-actual-value-specified-in-css-using-jquery
    setTimeout(function(){
        var positionOn = $img.css('background-position'),
            positionOff= $calOff.css('background-position');

        $navi.click(function(){
            $img = $('img',$navi);
            console.log(positionOn,positionOff,$img.prop('alt')===altOn);
            if ($img.prop('alt')===altOn){
                $img.prop('alt',altOff).css('background-position',positionOff);
                
                // For next start up
                DICT.DICT_SERVICE=false; 
                $.closeWindow(DICT.DICT_ID);
                //$(document).off('mouseenter.plaintext').off('mouseleave.plaintext');
            } else {
                $img.prop('alt',altOn).css('background-position',positionOn);
                DICT.DICT_SERVICE=true;
                //$(document).on('mouseenter.plaintext').on('mouseleave.plaintext');
            }
            return false;
        });

    },500);

}



})(jQuery);
