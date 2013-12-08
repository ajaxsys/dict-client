(function($){
var D=$.dict_extend();

// Check if loaded
if ($('#'+D.DICT_ID).length===0){
    console.log('ERR! Dict start fail.');
    D.loaded = false;
}

// No effect to origin page
D.$=$.noConflict(true);


})(jQuery);