/*
 * Replace with self text Plugin v0.1
 * Use jquery.tipsy.js as default callback.
 * https://github.com/ajaxsys/jquery-plain-text
 *
 * Copyright 2013 Fang Dehui
 * Released under the MIT license
 */
(function (factory) {
//    if (typeof define === 'function' && define.amd) {
//        // AMD. Register as anonymous module.
//        define(['jquery'], factory);
//    } else {
        // Browser globals.
        factory(jQuery);
//    }
})(function ($) {

$.plaintext = function(selector, option) {
    option = option || {};
    // Usage: options defined here
    var defaultOption = {
        'on' : 'mouseenter.plaintext',
        'off': 'mouseleave.plaintext',
        'callback' : null, // NOT tipsy
        'delayIn' : 2000, // for tipsy
        'delayOut' : 3000, // for tipsy
        'color' : '#EF0FFF', // for tipsy
        'bgcolor' : '#FFF', // for tipsy
    }
    // Merge to default option
    $.extend(defaultOption, option);
    // main
    obj2Text(selector, defaultOption);
}


var TIMER = "__link_timmer__";

function obj2Text(selector, option) {
    // Link to Text
    //$obj.on('mouseover', function(e){
    $(document).on(option.on, selector, function(e){
        var $tag2Txt = $(this);
        //console.log("Active Link 2 Text:", $tag2Txt.prop('tagName'));

        // Already mouse overed
        if ($tag2Txt.data(TIMER)) {
            // Clear the timer before
            clearTimeout($tag2Txt.data(TIMER));
            $tag2Txt.data(TIMER, null);
        }
        var timer = setTimeout(function(){
            if ($tag2Txt.data(TIMER)) {
                // Support img/a tag
                var tagName = $tag2Txt.prop('tagName').toLowerCase(),
                    text;
                switch (tagName) {
                    case 'a' : 
                        text = $tag2Txt.text(); break;
                    case 'select' : 
                        text = $('option:selected',$tag2Txt).text();break;
                    case 'img' : 
                        text = $tag2Txt.prop('alt') || $tag2Txt.prop('title');break;
                    case 'input':
                    case 'button':
                        text = $tag2Txt.val();break;
                }
                
                console.log("Text changed to:", text);
                if (!text) {
                    // No text, do nothing.
                    return;
                }

                if (typeof option.callback === 'function') {
                    callback(text, $tag2Txt, option);
                } else {
                    callTipsyByDefaut(text, $tag2Txt, option);
                }
                
            }
        }, option.delayIn);
        $tag2Txt.data(TIMER, timer);
        // For img in a link: <a...><img...></a>
        e.stopPropagation();
        return false;
    //}).on('mouseout', function(){
    }).on(option.off, selector, function(){
        //console.log("DisActive Link 2 Text:",$(this).prop('tagName'));
        $(this).data(TIMER,null);
    });
}

function callTipsyByDefaut(text, $tag2Txt, option) {
    if (!$tag2Txt.attr('title-plaintext')){
        // Init only once
        $tag2Txt.tipsy({
            'trigger': 'hover',
            'fallback': text,
            'delayIn': option.delayIn,
            'opacity': 1,
            'gravity': $.fn.tipsy.autoNS,
            'delayOut': option.delayOut,
            'title': 'title-plaintext',
        });
    }

    $tag2Txt.attr('title-plaintext',text);
    $tag2Txt.tipsy("show");
}

});

