/**
 * Start of dict.
 * depend: jQuery etc. in lib folder
 */
(function($){
'use strict';
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
    MIN_CHAR_COUNT_PER_PAGE: 30, // After customer formated, page should contains min char numbers(prevent formatter old & return a blank page)
    PROTOCAL : ("https:" === window.location.protocol)? "https:" : "http:",
    lang: 'jp', // Default language
    type: 'google',
    MOVE_POINT_ID : '__move_to_me__',
    winMode: 'inner', // inner, iframe, popup
    disableNumSelection: true,
    GOOGLE_API_NEW_MODE : true,
    CSS_CACHE: {},
    DICT_PLUGINS: {},
});

// TODO: User settings: From cookie or logined user.
//var settings = {};


})(jQuery);