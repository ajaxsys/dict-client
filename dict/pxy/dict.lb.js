(function($){
// for test & hook
var DICT = $.dict_extend({
  'lb_host' : getLoadBalanceHost,
});

var DEV_MODE = ( window.location.href.indexOf('DEV_MODE') > -1 ),
    LB_SERVERS = ['a','b','c','d','e','f','g','h','i','j','k','ll','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
    rls_lb = '//dict-x.appspot.com/dict',
    dev_host = "//127.0.0.1:8000/";

// Dict serverside host(Dynamic IP)
function getLoadBalanceHost(lbKey){
    console.log('Is develop mode:',DEV_MODE,lbKey);
    if (DEV_MODE) {
        return dev_host;
        //return "http://localhost:8443/mock/";
    }
    // ST/Product Mode
    if (lbKey) {
    // Load Balance
        var code = lbKey.charCodeAt(0),
            key = LB_SERVERS[ code % LB_SERVERS.length ];
        var rls_host = rls_lb.replace('x',key);
        console.log('Using release load balance:', rls_host);
        return rls_host;
    }
    return rls_lb;
}


})(jQuery);