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
        PXY_DEV_MODE : ( url.indexOf('DEV_MODE') > -1 ), // UI `DEV_MODE` is set in loader.js
        getSelectedLang: getSelectedLang,
        getSelectedType: getSelectedType,
    });

var $types,$langs,$searchBox,$menuBtn;
var WAIT_DEBUG=2000;

// onload
console.log(D.LC, '[dict.proxy.js] iframe URL: ',window.location.href);
$(function(){
    // init outter var here for loaded context
    $types = $('#__dict_type__');
    $langs = $('#__dict_lang__');
    $searchBox = $('#__search__');
    $menuBtn=$('#__dict_collapse_btn__');

    updateOptionMenu(D.getOptionFromCookie().dict.dict_lang, $langs);
    updateOptionMenu(D.getOptionFromCookie().dict.dict_type, $types);
    reloadWhenDictOptionChanged($langs);
    reloadWhenDictOptionChanged($types);

    $(window).on('hashchange', function(e){
        var origEvent = e.originalEvent;
        console.log(D.LC+1, '[dict.proxy.js] Hash:', origEvent.newURL);
        console.log(D.LC+1, '[dict.proxy.js] From:', origEvent.oldURL);

        // URL first, do NOT use this when links in iframe is clicked.
        var url = D.getParamFromURL('url');
        var type = D.getParamFromURL('type');
        D.loadQueryWithHistory(null, type, url); //D.lastDictType

    });
    D.loadQueryWithHistory();

    // Enhance page event
    registSearchKeyEvent();
    registRetry();
    registScrollBottomEvent();
    registClearBtn();
    registPageLinkCliecked();
    registDebug();
    registAbout();
});



function registClearBtn() {
 
  function tog(v){return v?'addClass':'removeClass';} 
  
  $(document).on('input click', 'input.__clearable__', function(){
    $(this)[tog(this.value)]('__clearable_x__');
  }).on('mousemove', 'input.__clearable_x__', function( e ){
    $(this)[tog(this.offsetWidth-18 < e.clientX-this.getBoundingClientRect().left)]('__clearable_onX__');
  }).on('click', 'input.__clearable_onX__', function(){
    $(this).removeClass('__clearable_x__ __clearable_onX__').val('');
  });
  
}

function registPageLinkCliecked(){
    $('#__explain_wrapper__').on('click', 'a[__dict_type__]', function(){
        var $lnk = $(this);
        D.loadQueryWithHistory($lnk.attr('__dict_word__'), $lnk.attr('__dict_type__'), $lnk.attr('href'));
        return false;
    });
}

function registDebug(){
    var timer;
    $('#__go_top__').mouseover(function(){
        timer = setTimeout(function(){
            $('#__debug__').removeClass('hidden'); // show() not work when !important
            $('#__debugSelf__').attr('href', window.location.href);
        },WAIT_DEBUG);
    }).mouseleave(function(){
        clearTimeout(timer);
    });
}

function registSearchKeyEvent(){
    var $searchForm = $('#__search_form__');
    $searchForm.submit(function(){
        D.loadQueryWithHistory($searchBox.val());
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
    D.delayWindowEvent(window, 'scroll', function() {
        // Fix some site scrollTop need more 1 px: http://goo.gl/6Do3rn
        if($(window).scrollTop() + 10 >= $(document).height() - $(window).height()) {
            // ajax call get data from server and append to the div
            if (typeof D.triggerOnceOnScrollBottom === 'function'){
                D.triggerOnceOnScrollBottom();
                D.triggerOnceOnScrollBottom = null;
            }
        }
    });
}


function reloadWhenDictOptionChanged($dropdown){
    var $opt_lnks = $('a',$dropdown);
    $opt_lnks.click(function(e){
        var $this_opt = $(this).parent();
        if ($this_opt.hasClass('active') || $this_opt.hasClass('disabled')) {
            // No changed
        } else {
            // Option changed
            var new_opt=$(this).attr('value');
            // reset menu
            updateOptionMenu(new_opt, $dropdown);

            // Get Cookie Key: 
            //   __dict_type__ --> dict_type
            //   __dict_lang__ --> dict_lang
            var name = $dropdown.attr('id').replace(/__/g,''); 
            if (!name){
                console.log(D.LC, '[dict.proxy.js] [Error] Unexpected cookie name', name);
            }else{
                // Save to cookie
                saveDictValToCookies(name, new_opt);
            }

            // Reload dict
            D.lang = D.getSelectedLang();
            D.loadQueryWithHistory($searchBox.val(), D.getSelectedType());
        }
        // Hide menu
        if ($menuBtn.is(':visible'))// [Fix, add check hidden] Bugs that can NOT go back to smartphone menu in FF
            $menuBtn.click(); // Hide all 
        else
            $dropdown.parent().removeClass('open');

        return false;// Return false will stop event.
    });
}

function updateOptionMenu(val, $dropdown) {

    console.log(D.LC, '[dict.proxy.js] Select menu option:', val);
    // default 1st option
    val = val || $('li:first > a',$dropdown).attr('value'); 

    $('li',$dropdown).each(function(){
        var $lnk = $('a', this);
        if (val == $lnk.attr('value')){
            $(this).addClass('active');
            // Update header text
            $(this).closest('.dropdown').find('.dropdown-toggle > span').text($lnk.text());
        } else {
            $(this).removeClass('active');
        }
    });

}

function saveDictValToCookies(key, val){
    var opt = D.getOptionFromCookie();
    opt.dict[key] = val;
    D.setOptionToCookie(opt);
}

function getSelectedLang(){
    return getSelectedMenu('lang') ||  D.lang;
}
function getSelectedType(){
    return getSelectedMenu('type');
}


function getSelectedMenu(key){
    /*var value = D.getParamFromURL(key);
    if (value) {
        console.log(D.LC, '[dict.loader.js] Use direct search : ',key, value);
        return value;
    }*/
    return $('#__dict_' + key + '__ li.active>a').attr('value');
}

function registAbout(){
    $('#__dict_about__').click(function(){
        D.MODAL_DIALOG.title('About Mini-Browser!').body($('#__dict_about_content__')).show();
        return false;
    });
}

// END OF AMD
})(jQuery);
