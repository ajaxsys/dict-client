/*jshint -W061, scripturl:true */
/*W061: eval can be harmful*/

// =================== Before DOM ready ===================
(function(){
'use strict';

// Develop Version
loadResourceToGlobalVar('/build/dict_bookmarklet.js','__G_BML__');
// Product Version
loadResourceToGlobalVar('/dict/dict_bookmarklet.js','__G_BML_MIN__');

function loadResourceToGlobalVar(url,varName){
    $.ajax({
        'url': url,
        'dataType' : 'text',
        'success': function(data){
            window[varName]=data;
        }
    });
}

})();


// =================== After DOM ready ===================
$(function(){
    'use strict';
    var BML_PREFIX = 'javascript:',
        PROD_HOST = 'https://dict-admin.appspot.com',
        DEV_HOST = 'http://localhost:8443';

    waitUntil("window.__G_BML__", afterDevelopVersionLoaded);
    waitUntil("window.__G_BML_MIN__", afterProductVersionLoaded);

    // Minimized version and released version
    function afterProductVersionLoaded(){

        var prod = window.BML_PREFIX + window.__G_BML_MIN__;
        // Origin:  loader.js
        // Old url: http://localhost:8443/build/dict_ui.js
        var dev = prod2Dev(prod);

        // Refer to min version.
        $('#bookmarkletRls').attr('href',prod); 
        $('#bookmarklet').attr('href',dev);
    }


    function prod2Dev(prod){
        return prod.replace('PROD_MODE','DEV_MODE')
            .replace('/dict/','/build/') // Minified
            .replace(PROD_HOST, DEV_HOST);
    }

    function afterDevelopVersionLoaded(){
        var $editor = $('#jsEditor');
        var BML_DEV = prod2Dev(window.__G_BML__);
        $editor.val(BML_DEV);
        $editor.change(updateDevelopLink);

        // Enable by default
        updateDevelopLink(toOneLine(BML_DEV));
        console.log("Default enable dict on this page in 3 seconds.");
        setTimeout(function(){
            eval(BML_DEV);
        },3000);
    }

    // Wait until condition var `==` true
    function waitUntil(condition, callback) {
        var result;
        eval(' result = (' + condition +')' );
        //console.log('result = ' + result);
        if (result) {
            callback();
        } else {
            // Waiting
            setTimeout(function(){
                waitUntil(condition, callback);
            },100);
        }
    }

    // Develop link
    function updateDevelopLink(js) {
        // Notice: lowercase
        var isInit = (typeof js == 'string');
        js = isInit ? js : toOneLine($('#jsEditor').val());
        $('#bookmarklet').attr('href', BML_PREFIX + js);
        if (!isInit) {
            // Mark it as edited
            $('#bookmarklet').append("*");
        }
    }

    // Simple compress javascript.
    function toOneLine(jsSrc){
        // Remove javascript comment
        jsSrc = jsSrc.replace(/(?:\/\*(?:[\s\S]*?)\*\/)|(?:([\s;])+\/\/(?:.*)$)/gm, '$1');
        // Remove blank line
        return jsSrc.replace(/(^|\n)\s*/g,'');
    }
});
