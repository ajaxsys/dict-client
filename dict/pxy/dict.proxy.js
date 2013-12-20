/**
 * proxy main entry. get value from iframe url. then search it.
 */
;(function($){

// All common util is regist at __DICT__
var D = $.dict_extend();

// AMD
var $types,$searchBox;

// onload
console.log("iframe URL",window.location.href);
$(function(){
    // init outter var here for loaded context
    $types = $('#__dict_types__');
    $searchBox = $('#__search__');

    updateOptionMenu(D.getOptionFromCookie().dict.dict_type);
    reloadWhenDictOptionChanged();

    $(window).on('hashchange', function(e){
        var origEvent = e.originalEvent;
        console.log('Hash Changed to:', origEvent.newURL);
        console.log('<----------from:', origEvent.oldURL);
        doQuery();
    });
    doQuery();
    registSearchKeyEvent();
    registRetry();
});

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
        $searchBox.val(word);
        mainQuery(word, type)
        // others
        $('#__debugSelf__').attr('href', window.location.href);
    } else {
        console.log("Invalid search:", query, type, word);
    }
}

function mainQuery(word, type){

  // ajuster mode: `type` must be auto
  if (type && (type.indexOf('auto')>=0 ||  type.indexOf('google')>=0) ) {
    D.queryGoogle(word, type);// Only can use callback in JSONP 
  } else {
    D.queryDict(word, type);
  }
}


function registSearchKeyEvent(){
    var $searchForm = $('#__search_form__');
    $searchForm.submit(function(){
        doQuery($searchBox.val());
        return false;
    });
    $searchBox.mouseover(function(){
        $(this).select();
    });
}

function registRetry(){
    $("button.retry").click(function(){
        $("#__search_form__").submit();
        return false;
    });
}

function getSelectedDict(){
    return $('li.active>a',$types).attr('value');
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
    var opt = D.getOptionFromCookie();
    opt.dict.dict_type = val;
    D.setOptionToCookie(opt);
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
