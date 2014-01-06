/*************************************************
 * dict.proxy.js
 *
 * Proxy main entry. Get value from iframe url, then search it.
 **************************************************/

;(function($){

// All common util is regist at __DICT__
var url=window.location.href,
    D = $.dict_extend({
        // Check mode only once
        PXY_IFRAME_MODE: ( url.indexOf('IFRAME') > -1 ),
        PXY_DEV_MODE : ( url.indexOf('DEV_MODE') > -1 ), // UI_DEV_MODE is set in loader.js
    });

var $types,$searchBox;
var WAIT_DEBUG=2000;

// onload
console.log(D.LC, '[dict.proxy.js] iframe URL: ',window.location.href);
$(function(){
    // init outter var here for loaded context
    $types = $('#__dict_types__');
    $searchBox = $('#__search__');

    updateOptionMenu(D.getOptionFromCookie().dict.dict_type);
    reloadWhenDictOptionChanged();

    $(window).on('hashchange', function(e){
        var origEvent = e.originalEvent;
        console.log(D.LC+1, '[dict.proxy.js] Hash:', origEvent.newURL);
        console.log(D.LC+1, '[dict.proxy.js] From:', origEvent.oldURL);
        D.loadQuery();
    });
    D.loadQuery();

    // Enhance page event
    registSearchKeyEvent();
    registRetry();
    registScrollBottomEvent();
    registDebug();
});

function registDebug(){
    var timer;
    $('#__go_top__').mouseover(function(){
        timer = setTimeout(function(){
            $('#__debug__').removeClass('hidden');
        },WAIT_DEBUG);
    }).mouseleave(function(){
        clearTimeout(timer);
    });
}

function registSearchKeyEvent(){
    var $searchForm = $('#__search_form__');
    $searchForm.submit(function(){
        D.loadQuery($searchBox.val());
        return false;
    });
    $searchBox.mouseover(function(){
        $(this).select();
    });
}

function registRetry(){
    $(".retry").click(function(){
        $("#__search_form__").submit();
        return false;
    });
}

function registScrollBottomEvent(){
    $(window).scroll(function() {
        if($(window).scrollTop() == $(document).height() - $(window).height()) {
            // ajax call get data from server and append to the div
            if (typeof D.triggerOnceOnScrollBottom === 'function'){
                D.triggerOnceOnScrollBottom();
                D.triggerOnceOnScrollBottom = null;
            }
        }
    });
}


function reloadWhenDictOptionChanged(){
    var $opt_lnks = $('a',$types);
    $opt_lnks.click(function(e){
        var $this_opt = $(this).parent();
        if ($this_opt.hasClass('active') || $this_opt.hasClass('disabled')) {
            // No changed
        } else {
            var new_dict=$(this).attr('value');
            // reset menu
            updateOptionMenu(new_dict);
            // Save to cookie
            saveDictValToCookies(new_dict);
            // Reload dict
            D.loadQuery($searchBox.val(), new_dict);
        }
        e.preventDefault();
        return;// NG: return false. It will stop menu hide.
    });
}

function updateOptionMenu(val) {
    val = val || 'auto';
    // if ($('a[value="'+val+'"]',$types).length===0){
    //     return;
    // }
    $('li',$types).each(function(){
        var $lnk = $('a', this);
        if (val == $lnk.attr('value')){
            $(this).addClass('active');
            // Update header text
            $('#__dict_selected__ > span').text($lnk.text());
        } else {
            $(this).removeClass('active');
        }
    });
}

function saveDictValToCookies(val){
    var opt = D.getOptionFromCookie();
    opt.dict.dict_type = val;
    D.setOptionToCookie(opt);
}

// END OF AMD
})(jQuery);
