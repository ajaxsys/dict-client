/**
 * Start of dict.
 * depend: jQuery etc. in lib folder
 */
(function($){
/*jshint -W020 */
console = window.console || {'log':function(){}};

// Config here
window.__DICT__ = window.__DICT__ || {};
window.__DICT__.loaded=true;

$.dict_extend = function(obj){
    if (obj) {
        $.extend(window.__DICT__, obj);
    }
    return window.__DICT__;
}

// TODO
var options = {};
var settings = {};


})(jQuery);