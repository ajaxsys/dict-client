/**
 * Start of dict.
 * depend: jQuery etc. in lib folder
 */
(function($){
/*jshint -W020 */
console = window.console || {'log':function(){}};

window.__DICT__ = window.__DICT__ || {};
$.dict_extend = function(obj){
    if (obj) {
        $.extend(window.__DICT__, obj);
    }
    return window.__DICT__;
}

// Config here
$.dict_extend({
    loaded: true, // Tell bookmarklet, loading start. if failed, it'll reset to false at `end.js`
    LC: 0, // log counter
    TIME_OUT: 30000,
    //DB_MODE: false,// if db readable/writable(false means: fetch url directly)
    WORD_MAX_LENGTH: 50,// For word seletion, max length : "xxxxxxxx".length <= 50
    WORD_MAX_COUNT: 3,  // For word seletion, max support: "w1 w2 w3".split(" ").length<=3
    PROTOCAL : ("https:" === window.location.protocol)? "https:" : "http:",
});

// TODO: User settings: From cookie or logined user.
var settings = {};


})(jQuery);