/*************************************************
 * dict.end.js
 *
 * Check UI status after initialized 
 **************************************************/
(function($){
var D=$.dict_extend();

// Check if loaded
if ($('#'+D.DICT_ID).length===0){
    console.log(D.LC, '[dict.end.js] [ERROR] Dict start fail.');
    D.loaded = false;
}

// No effect to origin page
D.$=$.noConflict(true);


})(jQuery);