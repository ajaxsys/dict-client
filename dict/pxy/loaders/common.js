/*************************************************
 * loaders/common.js
 *
 * Common setup for jsonp loader
 **************************************************/

;(function($){

// Dom ready
$(function(){

var D=$.dict_extend({
    complete: allCompleteAction,
});


var $result = $('#__explain_wrapper_appender__'),
    $searchBox = $('#__search__');

var options = {
      //// Share request options to setup ////
      'dict':{
          '_startTime': null,// Reset start time each request
          'word': null,
          'type': null,
      },
      'timeout': D.TIME_OUT,
      'beforeSend': function(){
          processStart();
          $result.css({opacity:"0.5"});
          this.dict._startTime = $.now();
          //$searchBox.val(this.dict.word + ' is loading...');
          //$('html,body').animate({scrollTop: 0},'fast');
      },
      'complete': completeDefine,
      '_complete': completeDefine,
      'error': errorDefine,
      '_error': errorDefine,
      'dataType': 'jsonp',
      'callbackParameter': 'callback',// append: callback=?
      // NOTICE: jsonp plugin will override window.DICT_format function.
      // SEE: https://github.com/jaubourg/jquery-jsonp/blob/master/doc/API.md#callback---string-_jqjsp
      'callback': 'DICT_jsonp', // callback=DICT_jsonp // Not exist in global win// will auto created in global
}

function completeDefine(){
    console.log(D.LC, '[loaders/common.js] Expend time:', ($.now()-this.dict._startTime) );
    // wait css init
    allCompleteAction(this.dict.word, this.dict.type)
}

function allCompleteAction(word, type) {
    processComplete();
    setTimeout(function(){
        //$searchBox.val(word);

/*        if (D.PXY_IFRAME_MODE)
          $searchBox.focus().select();
        else
          $('#__go_top__').focus();    // Stop focus becase user can not copy the word       */
        if ($searchBox.is(":focus"))
            $('#__go_top__').focus();

        $result.css({opacity:"1.0"});
        // Keep page 
        //$('html,body').animate({scrollTop: $result.offset().top-10},'fast');
        $('html,body').animate({scrollTop: 0},'fast');
    },300);
    console.log(D.LC, '[loaders/common.js] ============Complete Query. [key=',word,'& type=', type, ']=============' );
}

function errorDefine(jqXHR, textStatus, errorThrown) {
    console.log(D.LC, '[loaders/common.js] Error result: ',errorThrown,textStatus);
    if (textStatus==='error'){
        $result.empty().append($("#__error_msg__").clone(true).removeClass('hidden'));
    }else{ // As timeout
        $result.empty().append($("#__timeout_msg__").clone(true).removeClass('hidden'));
    }
}

var waiting;
function processStart() {
  //only add progress bar if added yet.
  if ($("#__progress__").length === 0) {
    $("body").append($("<div><dt/><dd/></div>").attr("id", "__progress__"));
    var percent = (40 + Math.random() * 20) ; // 40 ~ 70%
    $("#__progress__").width(percent + "%");
    waiting = setInterval(function(){
      percent++;
      $("#__progress__").width(percent + "%");
    },500);
  }
}

function processComplete() {
    //End loading animation
    clearInterval(waiting);
    $("#__progress__").width("101%").delay(200).fadeOut(400, function() {
      $(this).remove();
    });
}

$.jsonp.setup( options )

});

// END OF AMD
})(jQuery);
