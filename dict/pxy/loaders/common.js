/**
 * proxy query with dict jsonp. If success, call formatter.
 */
;(function($){

// Dom ready
$(function(){
var $result = $('#__explain_wrapper__'),
    $searchBox = $('#__search__');

var options = {
      //// Share request options to setup ////
      'dict':{
          '_startTime': null,// Reset start time each request
          'word': null,
      },
      'timeout': 10000,
      'beforeSend': function(){
          this.dict._startTime = new Date().getTime();
          $searchBox.val(this.dict.word + ' is loading...');
          $('html,body').animate({scrollTop: 0},'fast');
          $result.hide();
      },
      'complete': function(){
          console.log('Complete, expend time:' + (new Date().getTime()-this.dict._startTime) );
          var word = this.dict.word;
          // wait css init
          setTimeout(function(){
              $searchBox.val(word).select();
              $result.show();
              $('html,body').animate({scrollTop: $result.offset().top-10},'fast');
          },300);
      },
      'error': errorDefine,
      'errorOrigin': errorDefine,
      'dataType': 'jsonp',
      'callbackParameter': 'callback',// append: callback=?
      // NOTICE: jsonp plugin will override window.DICT_format function.
      // SEE: https://github.com/jaubourg/jquery-jsonp/blob/master/doc/API.md#callback---string-_jqjsp
      'callback': 'DICT_jsonp', // callback=DICT_jsonp // Not exist in global win// will auto created in global
}

function errorDefine(jqXHR, textStatus, errorThrown) {
    console.log("Error result: ",errorThrown,textStatus);
    if (textStatus==='error'){
        $result.empty().append($("#__error_msg__").clone(true).removeClass('hide'));
    }else{ // As timeout
        $result.empty().append($("#__timeout_msg__").clone(true).removeClass('hide'));
    }
}

$.jsonp.setup( options )

});

// END OF AMD
})(jQuery);
