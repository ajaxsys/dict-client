/*jshint -W061, scripturl:true */
/*W061: eval can be harmful*/

// =================== Before DOM ready ===================
(function(){

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
    var BML_PREFIX = 'javascript:';
    waitUntil("window.__G_BML__", afterDevelopVersionLoaded);
    waitUntil("window.__G_BML_MIN__", afterProductVersionLoaded);

    // Minimized version and released version
    function afterProductVersionLoaded(){
        // default: /build/dict_ui_dev.js
        var dev = BML_PREFIX + __G_BML_MIN__;
        var st   = dev.replace('DEV_MODE','ST_MODE')
                      .replace('/build/','/dict/');
        var prod = dev.replace('DEV_MODE','RLS_MODE')
                      .replace('/build/','/dict/') // Minified
                      .replace('http://localhost:8443','https://python-ok.appspot.com');

        // Refer to min version.
        $('#bookmarkletST').attr('href',st); 
        $('#bookmarkletRls').attr('href',prod);
    }

    function afterDevelopVersionLoaded(){
        var $editor = $('#jsEditor');
        $editor.val(__G_BML__);
        $editor.change(updateDevelopLink);

        // Enable by default
        updateDevelopLink(toOneLine(__G_BML__));
        console.log("Default enable dict on this page in 3 seconds.");
        setTimeout(function(){
            eval(__G_BML__);
        },3000);
    }

    // Wait until condition var `==` true
    function waitUntil(condition, callback) {
        eval(' var result = (' + condition +')' );
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
