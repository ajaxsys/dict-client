// =================== Before DOM ready ===================
(function(){

// Develop Version
loadResourceToGlobalVar('/target/distribution/dict_bookmarklet.js','__G_BML__');
// Product Version
loadResourceToGlobalVar('/target/distribution/dict_bookmarklet.min.js','__G_BML_MIN__');

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

        var st = BML_PREFIX + __G_BML_MIN__
            .replace('/dict_ui_dev.js','/dict_ui_rls.js');
        var st_min = BML_PREFIX + __G_BML_MIN__
            .replace('/dict_ui_dev.js','/dict_ui.min.js');

        var prod = st_min.replace('http://localhost:8443','//python-ok.appspot.com');

        // Refer to min version.
        $('#bookmarkletST').attr('href',st); 
        $('#bookmarkletSTMin').attr('href',st_min); 
        $('#bookmarkletReleased').attr('href',prod);
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
