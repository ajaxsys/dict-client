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
    preloadResources: preloadResources,
    applyPreloadResources: applyPreloadResources,
});


var $result = $('#__explain_wrapper_appender__'),
    $resourceDIV = $('#__explain_resource_appender__'),
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

var lastType, $targetResources = $('<div>'), resourcesCache = {};
function preloadResources(type){
  if (lastType===type){
    return;
  }

  // init
  lastType = type;
  $targetResources = $('<div>');

  // Load from cache if existed before
  if (resourcesCache[type]){
    $targetResources.append(resourcesCache[type]);
    return;
  }
  
  // preload resources
  var pluginInfo = D.DICT_PLUGINS[type];
  if (pluginInfo && pluginInfo.inject_resources){
    var rscs = [].concat(pluginInfo.inject_resources);
    for (var i=0; i<rscs.length;i++){
      var rscUrl = rscs[i];
      // CSS
      if (rscUrl.endsWith('.css')) {
        console.log(D.LC, "[loaders/common.js] Preload Resources :" + rscUrl);
        new Image().src = rscUrl;

        var $targetCss = $('<link rel="stylesheet" type="text/css">').attr('href', rscUrl);
        $targetResources.append($targetCss);
      }
      // Other resources, TODO
    }
    resourcesCache[type] = $targetResources;
  }
}

// Split preload & apply: Because apply CSS will change layout of other pages
function applyPreloadResources(){
  if ($resourceDIV.html()===$targetResources.html()){
    return;
  }
  console.log(D.LC, '[loaders/common.js] Apply Preload Resources:', $targetResources.html() );
  $resourceDIV.html($targetResources.html());
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
