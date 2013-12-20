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
  MAX_HIST : 10, // Cache of search result
});

// TODO: User settings: From cookie or logined user.
var settings = {};


})(jQuery);