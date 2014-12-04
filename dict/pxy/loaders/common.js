/*************************************************
 * loaders/common.js
 *
 * Common setup for jsonp loader
 **************************************************/

;(function($){
'use strict';
// Dom ready
$(function(){

var D=$.dict_extend({
    complete: allCompleteAction,
    applyPreloadResources: applyPreloadResources,
});


var $result = $('#__explain_wrapper_appender__'),
    $appliedResourceDIV = $('#__explain_resource_appender__'),
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

// Load resources from preload.html, then apply it.
var lastType;
function applyPreloadResources(type){
  if (type.contains('auto_')){
    type = type.replace('auto_','');
  }
  if (lastType===type){
    return;
  }
  $appliedResourceDIV.empty(); // Clear all resouces

  var pluginInfo = D.DICT_PLUGINS[type];
  if (pluginInfo && pluginInfo.inject_resources){
    var rscs = [].concat(pluginInfo.inject_resources);
    for (var i=0; i<rscs.length;i++){
      var rscId = rscs[i],
          $rsc = $(rscId, getPreload());
      if ($rsc.length>0){
        $appliedResourceDIV.append($rsc.clone());
      } else {
        console.log(D.LC, '[loaders/common.js] Apply Preload Resources Failed:', type, rscId );
      }
    }
  }
}

var $preload;
function getPreload(){
  if ($preload){
    return $preload;
  }
  var ifrm = document.getElementById('preload'),
      ifrmDoc = (ifrm.contentWindow) ? ifrm.contentWindow : 
                (ifrm.contentDocument.document) ? ifrm.contentDocument.document : ifrm.contentDocument;
  var $ifrm = $(ifrmDoc.document);
  if ($ifrm.find('body').html().length > 100) {
    $preload = $ifrm; // Makesure iframe is loaded.
  }
  return $ifrm;
}

function completeDefine(){
    console.log(D.LC, '[loaders/common.js] Expend time:', ($.now()-this.dict._startTime) );
    // wait css init
    allCompleteAction(this.dict.word, this.dict.type)
}

function allCompleteAction(word, type) {
    processComplete();
    setTimeout(function(){
        if ($searchBox.is(":focus"))
            $('#__go_top__').focus();

        $result.css({opacity:"1.0"});
        // Keep page 
        //$('html,body').animate({scrollTop: $result.offset().top-10},'fast');
        var $mvPoint = $('#' + D.MOVE_POINT_ID), mvPxTop = 0;

        if ($mvPoint.length > 0)
          mvPxTop = $mvPoint.offset().top

        $('html,body').animate({scrollTop: mvPxTop},'fast');

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
  var $progress = $("#__progress__");
  //only add progress bar if added yet.
  if ($progress.length === 0) {
    $("body").prepend($("<div><dt/><dd/></div>").attr("id", "__progress__"));
  }
  var percent = (40 + Math.random() * 20) ; // 40 ~ 70%
  $progress.show().width(percent + "%");
  waiting = setInterval(function(){
    percent++;
    $progress.width(percent + "%");
  },500);

}

function processComplete() {
  var $progress = $("#__progress__");
  //End loading animation
  clearInterval(waiting);
  $progress.width("100%").delay(200).fadeOut(400, function() {
    setTimeout(function(){
      $progress.width("0");
    }, 100);
  });
}

$.jsonp.setup( options )

});

// END OF AMD
})(jQuery);
