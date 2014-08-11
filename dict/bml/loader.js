/**
 * loader.js (Depend on dict.util.share.js)
 */
void((function(w,d){
    'use strict';
    var D=w.__DICT__;
    D.PROD_MODE=true;
    if (!D.loaded) {
        var ui=d.createElement('script');
        ui.setAttribute('src','https://dict-admin.appspot.com/dict/dict_ui.js?_'+new Date().getTime());
        ui.setAttribute("type","text/javascript");
        ui.setAttribute("charset","UTF-8");
        setTimeout(function(){
            D.appendTag(ui);
        }, 1000);
    }
})(window,document));
