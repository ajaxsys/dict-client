/*
 * Get plain text Plugin v0.1
 * Use jquery.tipsy.js as default callback.(Show this text as a tooltip)
 * https://github.com/ajaxsys/jquery-plain-text
 *
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
        'onCallback' : null, // Default using tipsy if not privide
        'offCallback' : null, // Default using tipsy if not privide
        'checkService': function(){return true}, // a callback function to check if plaintext plugin is on/off
        'delayIn' : 2000, // for tipsy
        'delayOut' : 500, // for tipsy
        'color' : '#EF0FFF', // for tipsy
        'bgcolor' : '#FFF', // for tipsy
    }
    // Merge to default option
    $.extend(defaultOption, option);
    // main
    getPlainText(selector, defaultOption);
}


var TIMER = '__link_timmer__',
    PLAIN_TEXT_DEFAULT_ATTR='title-plaintext';

function getPlainText(selector, option) {
    // Link to Text
    //$obj.on('mouseover', function(e){
    $(document).on(option.on, selector, function(e){
        if (typeof option.checkService === 'function' && !option.checkService()){
            console.log('Get plain text stopped!');
            return;
        }
        // Already mouse overed
        cancelTimer(this);

        var $tag2Txt = $(this);

        //console.log("Active Link 2 Text:", $tag2Txt.prop('tagName'));
        var timer = setTimeout(function(){
            if ($tag2Txt.data(TIMER)) {

                text=$.trim( getPlainTextMain($tag2Txt) );

                console.log("Got plaintext:", text);
                if (!text) {
                    // No text, do nothing.
                    return;
                }

                if (typeof option.onCallback === 'function') {
                    option.onCallback(text, $tag2Txt, option);
                } else {
                    showTipsyByDefaut(text, $tag2Txt, option);
                }
                
            }
        }, option.delayIn);

        $tag2Txt.data(TIMER, timer);
        return false;
    //}).on('mouseout', function(){
    }).on(option.off, selector, function(e){
        cancelTimer(this);
        if (typeof option.offCallback === 'function') {
            option.offCallback($(this), option);
        } else {
            hideTipsyByDefaut($(this), option);
        }
    });
}

function getPlainTextMain($tag2Txt){
    // Support img/a tag
    var text,tagName = $tag2Txt.prop('tagName').toLowerCase();

    switch (tagName) {
        case 'a' : 
            text = $tag2Txt.text(); break;
        case 'select' : 
            text = $('option:selected',$tag2Txt).text();break;
        case 'img' : 
            text = $tag2Txt.prop('alt');break;
        case 'input':
            text = $tag2Txt.val();break;
        case 'button':
            text = $tag2Txt.text();break;
    }
    // Common: find title attribute
    text=$.trim(text);
    if (!text) {
        text = $tag2Txt.prop('title') || $tag2Txt.attr('title');
    }

    // Try last text
    text=$.trim(text);
    if (!text) {
        text = $tag2Txt.attr(PLAIN_TEXT_DEFAULT_ATTR);
    }

    return text;
}

function cancelTimer(obj){
    var $tag2Txt = $(obj);
    // Already mouse overed
    if ($tag2Txt.data(TIMER)) {
        // Clear the timer before
        clearTimeout($tag2Txt.data(TIMER));
        $tag2Txt.data(TIMER, null);
    }
}

function hideTipsyByDefaut($tag2Txt,option){
    setTimeout(function(){
        $tag2Txt.tipsy('hide');
    },option.delayOut);
}

function showTipsyByDefaut(text, $tag2Txt, option) {
    if (!$tag2Txt.attr(PLAIN_TEXT_DEFAULT_ATTR)){
        // Init only once
        $tag2Txt.tipsy({
            'trigger': 'manual',// Customize my show/hide
            'fallback': text,
            'delayIn': option.delayIn,
            'opacity': 1,
            'gravity': $.fn.tipsy.autoNS,
            'delayOut': option.delayOut,
            'title': PLAIN_TEXT_DEFAULT_ATTR,
            'mousehold': true, // Keep tooltip showing whil mouse on the tooltip
        });
    }

    $tag2Txt.attr(PLAIN_TEXT_DEFAULT_ATTR,text);
    $tag2Txt.tipsy("show");
}

});

