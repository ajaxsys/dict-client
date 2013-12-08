/**
 * proxy main
 */
;(function($){

// All common util is regist at __DICT__
var DICT = $.dict_extend();

// AMD
var $types,$searchBox,
    $result,$loading;

// onload
console.log("iframe URL",window.location.href);
$(function(){
    // init outter var here for loaded context
    $types = $('#__dict_types__');
    $searchBox = $('#__search__');
    $result = $('#__explain_wrapper__');
    $loading = $('#__loading__');

    updateOptionMenu(DICT.getOptionFromCookie().dict.dict_type);
    reloadWhenDictOptionChanged();

    $(window).on('hashchange', function(e){
        var origEvent = e.originalEvent;
        console.log('Hash Changed to:', origEvent.newURL);
        console.log('<----------from:', origEvent.oldURL);
        doQuery();
    });
    doQuery();
    registSearchKey();
});

function registSearchKey(){
    var $searchForm = $('#__search_form__');
    $searchForm.submit(function(){
        doQuery($searchBox.val());
        return false;
    });
    $searchBox.mouseover(function(){
        $(this).select();
    });
}

function getSelectedDict(){
    return $('li.active>a',$types).attr('value');
}

var requestCount = 0, ajax, oldword, DICT_jsonp;
function doQuery(query, type){
    // Get from caller
    query = query || getUrlHashValue();
    if (!query) {
        console.log('[WARN] No Search Key.');
        return;
    }

    type = type || getSelectedDict();
    var word = decodeURIComponent(query);
    console.log("Do search :", query, ' -> ', word, '|', type);

    if (query && type && isNotKey(word)) {
        // http://otherhost/dict/t/hello/?callback=DICT_format
        var url = DICT.lb_host(word)+'dict/'+type+'/'+query+'/',
            startTime = new Date().getTime();

        console.log('Ajax load: ', url);
/* //// DO NOT USE jQuery version. because:
   //// 1. Bugs: jsonp not work after timeout occurred
   //// 2. CAN NOT use abort with jsonp
   //// 2. CAN NOT use local function with callback.
        ajax=$.ajax({
            url: url,
            dataType: 'jsonp',
            jsonpCallback: 'DICT_format', 
            crossDomain: true,
            beforeSend: function(){
                $searchBox.val(word + ' is loading...');$result.hide();
                $('html,body').animate({scrollTop: 0},'fast');
            },
            complete: function(){
                if (requestCount !== this.requestCount) {
                    console.log('Not latest jsonp,cancel it');
                    return;
                }
                console.log('this is the latest request');
                // wait css init
                setTimeout(function(){
                    $result.show();
                    $('html,body').animate({scrollTop: $result.offset().top},'fast');
                },300);
                $searchBox.val(word);
            },
            requestCount: ++requestCount,// closure
            success: function(data,code) {
                if (requestCount !== this.requestCount) {
                    console.log('Not latest jsonp,cancel it');
                    return;
                }
                console.log('this is the latest request');
                // Automatic call DICT_format defined in dict.formatter.js
            },
            timeout: 10000,
            error: function(jqXHR, textStatus, errorThrown) { 
                console.log(errorThrown,textStatus);
                var retry=$("<button>").text("retry").click(function(){
                    $("#__search_form__").submit();
                    return false;
                })
                $result.html(' Loading timeout. Please ').append(retry);
            }
        });
*/
        if (ajax) {
            console.log('Cancel ajax:' + oldword);
            ajax.abort();
        }
        ajax=$.jsonp({
            url: url,
            dataType: 'jsonp',
            //jsonpCallback: 'DICT_format', // NO need in jsonp plugin
            callbackParameter: 'callback',// append: callback=?
            // NOTICE: jsonp plugin will override window.DICT_format function.
            // SEE: https://github.com/jaubourg/jquery-jsonp/blob/master/doc/API.md#callback---string-_jqjsp
            callback: 'DICT_jsonp', // callback=DICT_jsonp // Not exist in global win// will auto created in global
            //crossDomain: true, // NO need in jsonp plugin
            beforeSend: function(){
                $searchBox.val(word + ' is loading...');$result.hide();
                $('html,body').animate({scrollTop: 0},'fast');
            },
            complete: function(){
                console.log('Complete, expend time:' + (new Date().getTime()-startTime) );
                /*// NO need with jsonp.abort()
                if (requestCount !== this.requestCount) {
                    console.log('Ajax complete. Not latest jsonp,cancel it');
                    return;
                }
                console.log('Ajax complete. this is the latest request');
                */
                // wait css init
                setTimeout(function(){
                    $searchBox.val(word);
                    $result.show();
                    $('html,body').animate({scrollTop: $result.offset().top},'fast');
                },300);
            },
            // requestCount: ++requestCount,// defined in closure. 
            success: function(json, textStatus, xOptions) {
                console.log('Success! Call formatter.');
                window.DICT_format(json);
            },
            timeout: 10000,
            error: function(jqXHR, textStatus, errorThrown) { 
                console.log(errorThrown,textStatus);
                var retry=$("<button>").text("Retry").click(function(){
                    $("#__search_form__").submit();
                    return false;
                })

                if (textStatus==='error'){
                    $result.html(' Some ERROR occurred while loading. Please ').append(retry);
                } 
                if (textStatus==='timeout'){
                    $result.html(' Loading TIMEOUT. Please ').append(retry);
                } 
            }
        });

        // others
        $('#__debugSelf__').attr('href', window.location.href);
        $('#__debugAjax__').attr('href', url);
    } else {
        console.log("Invalid search:", query, type, word);
    }
    oldword = word;// backup
}

function reloadWhenDictOptionChanged(){
    var $opt_lnks = $('a',$types);
    $opt_lnks.click(function(){
        var $this_opt = $(this).parent();
        if ($this_opt.hasClass('active')) {
            return; // No changed
        }
        var new_dict=$(this).attr('value');
        // reset menu
        updateOptionMenu(new_dict);
        // Save to cookie
        saveDictValToCookies(new_dict);
        // Reload dict
        doQuery($searchBox.val(), new_dict);
    });
}

function updateOptionMenu(val) {
    if (!val) return;
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
    var opt = DICT.getOptionFromCookie();
    opt.dict.dict_type = val;
    DICT.setOptionToCookie(opt);
}



/////////////////// Utils ///////////////////////////

function isNotKey(word){
    return word.indexOf('__') !== 0;
}

function getUrlHashValue() {
    var vals = window.location.href.split('#');
    if (vals.length > 1)
        return vals[1].split('?')[0];
    else
        return '';
}

function searchToObject() {
  var pairs = window.location.search.substring(1).split("&"),
    obj = {},
    pair,
    i;

  for ( i in pairs ) {
    if ( pairs[i] === "" ) continue;

    pair = pairs[i].split("=");
    obj[ decodeURIComponent( pair[0] ) ] = decodeURIComponent( pair[1] );
  }

  return obj;
}

// END OF AMD
})(jQuery);
