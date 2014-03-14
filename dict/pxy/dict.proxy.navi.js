/*************************************************
 * dict.proxy.navi.js
 **************************************************/
;(function($){

// Regist to other js for calling
var D = $.dict_extend();

D = $.dict_extend({
    'pushNavi' : pushNaviCallbackParamters, // Push the parameter of 'naviCallback' function here
    'naviCallback' : D.loadQuery, // Should regist from other js files
});

var $goBack,$goForward;

// Regist to Navi bar
$(function(){
    $goBack = $('#__go_back__');
    $goForward = $('#__go_forward__');

    registHistoryNavi();
});

function registHistoryNavi(){
    $('#__inner_navi__').hover(function(){
        $(this).css('opacity', '1');
    }, function(){
        $(this).css('opacity', '0.25');
    });

    $goBack.click(naviQBack);
    $goForward.click(naviQForword);
    disableBtn($goBack);
    disableBtn($goForward);
}

// NaviQ plugin
var naviQ = new D.Stack(),
    naviQPointor = 0,
    ENABLE_COLOR='#fff',
    DISABLE_COLOR='#aaa';

function pushNaviCallbackParamters(key){
    if (!key || key === naviQ.get(naviQPointor)) {
        console.log(D.LC, '[dict.proxy.navi.js] NG. key is invalid:', key);
        return;
    }

    console.log(D.LC, '[dict.proxy.navi.js] push key to navi:', key);
    var i=naviQPointor;
    while (i<naviQ.size()){
        naviQ.pop();
        i++;
    }
    naviQ.push(key);
    naviQPointor = naviQ.size();

    if (naviQPointor > 1){
        enableBtn($goBack);
    }
    disableBtn($goForward);
}

function naviQBack(){
    console.log(D.LC, '[dict.proxy.navi.js] navi backword.');
    naviQPointor--;
    // Check & Skip
    if (naviQPointor<1) {
        naviQPointor = 1;
        return false;
    }

    var args = naviQ.get(naviQPointor-1);
    if (args)
        D.naviCallback.apply(this||window, args);

    enableBtn($goForward);
    if (naviQPointor === 1){
        disableBtn($goBack);
    }

    return false;
}

function naviQForword(){
    console.log(D.LC, '[dict.proxy.navi.js] navi forward');
    naviQPointor++;
    // Check & Skip
    if (naviQPointor>naviQ.size()) {
        naviQPointor = naviQ.size();
        return false;
    }

    var args = naviQ.get(naviQPointor-1);
    if (args)
        D.naviCallback.apply(this||window, args);

    enableBtn($goBack);
    if (naviQPointor === naviQ.size()){
        disableBtn($goForward);
    }

    return false;
}

function enableBtn($btn){
    $btn.css('color', ENABLE_COLOR)
        .css('fontWeight', 'bold')
        .css('cursor', 'pointer');
}

function disableBtn($btn){
    $btn.css('color', DISABLE_COLOR)
        .css('fontWeight', 'normal')
        .css('cursor', 'default');
}

})(jQuery);
