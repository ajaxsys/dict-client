/*************************************************
 * util.gae_lb.js
 *
 * Load balance for `dict.query.gae.js`
 **************************************************/

(function($){
// for test & hook
var D = $.dict_extend({
  'lb_host' : getLoadBalanceHost,
});

var DEV_MODE = ( window.location.href.indexOf('DEV_MODE') > -1 ),
    LB_SERVERS = ['a','b','c','d','e','f','g','h','i','j','k','ll','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
    rls_lb = 'https://dict-x.appspot.com/',
    dev_host = "http://127.0.0.1:8000/";

// Dict serverside host(Dynamic IP)
function getLoadBalanceHost(lbKey){
    console.log(D.LC, '[loaders/util.gae_lb.js] Is develop mode:',DEV_MODE,lbKey);
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
        console.log(D.LC, '[loaders/util.gae_lb.js] Using release load balance:', rls_host);
        return rls_host;
    }
    return rls_lb;
}


})(jQuery);