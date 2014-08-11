/*************************************************
 * dict.ui.start.js
 *
 * Dict UI start check
 **************************************************/
(function($){
'use strict';
var D = $.dict_extend({
    'static_host' : static_host
});

// Fix page that dont contains body tags! [@issue 20140425]
// like: http://help.eclipse.org/
if ($('body').length === 0) {
    D.loaded = false;  // Stop All other script
    appendBodyTagToPage();
    return;            // Stop this script
}

console.log(D.LC+=10000, '[dict.ui.start.js] Loading ui resource... from:', static_host());

//loadCSSwithAllFrames(document, window);// TODO support tooltip in iframe 1-1(load css in all frames)
D.loadResource($, static_host()+'/dict/dict_ui.css', 'css');


///////////////////// private func //////////////////////

function appendBodyTagToPage(){
    var $body=$("<body>"); 
    $body.css("padding","0px").css("margin","0px");
    $("html>*").not( "head" ).wrap($body);
    //alert("Please wait page reload");
    console.log(D.LC+=10000, '[dict.ui.start.js] [ERROR] Missing `body` tag. Please reload DICT again later...');

    var $frames = $('iframe, frame'), countFrameLoaded=0;

    $frames.load(function(){
        countFrameLoaded++;
        if ($frames.length === countFrameLoaded) {
            console.log('Reloaded!!!!!!!!!!!!');
        }
    });
}


// Get static resource like `iframe/css` URL
var _thisIP;
function static_host(){
    var dev_ip = 'http://127.0.0.1:8443',
        rls_ip = D.PROTOCAL + '//dict-admin.appspot.com';

    // Static IP
    // First time only
    if (_thisIP)
        return _thisIP;

    // 1 DEV_MODE/ST_MODE setting in loader.js
    if (D.DEV_MODE || D.ST_MODE){
        // 2 Intranet test(http only, e.g: http://fc-pc/  ): No `.` before first `/` in hostname
        var intrRegxp = /^http(|s):(\/\/[^\/\.]+?)\/.*$/;
        var matcher = intrRegxp.exec(window.location.href);
        if ( matcher ){
            var ip = matcher[2];
            console.log(D.LC, '[dict.ui.start.js] Use intranet ip:', ip);
            _thisIP = ip;
            // Run a ajax connection test, if NOT work, use dev_ip
            // host + /dict/dict_ui.css
            $.ajax({
                url: 'http:'+ip+'/dict/dict_ui.css', 
                type:'HEAD',
                cache : false,
                async:false, 
                error:function(){
                    _thisIP = ip = dev_ip;
                }
            });
            return ip;
        }

        // 3 test as a bookmarklet in other sites(http only)
        console.log(D.LC, '[dict.ui.start.js] Using develop IP. ',dev_ip);
        _thisIP = dev_ip;
        return dev_ip;
    }

    // Product mode
    console.log(D.LC, '[dict.ui.start.js] Using release host:', rls_ip);
    _thisIP = rls_ip;
    return rls_ip;
}

})(jQuery);
