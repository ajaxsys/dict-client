/**
 * Depend dict.util.share.js
 */
void((function(w){
    var D=w.__DICT__;
    D.DEV_MODE=true;
    if (!D.loaded) {
        var ui=document.createElement('script');
        ui.setAttribute('src','http://localhost:8443/build/dict_ui.js?_'+new Date().getTime());
        ui.setAttribute("type","text/javascript");
        ui.setAttribute("charset","UTF-8");
        D.appendTag(ui);
    }
})(window));
