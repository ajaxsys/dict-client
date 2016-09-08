/*************************************************
 * dict.ui.plaintext.js
 *
 * Dict UI main:
 * - Bind get text event to page
 **************************************************/
(function($){
'use strict';
var D = $.dict_extend();

registWebElementToTextEvent(document);


/* TODO support tooltip in iframe 1-2 (load css in all frames)
function loadCSSwithAllFrames(parentDocument, parentWindow) {
    D.loadResource($, static_host()+'/target/dict/dict_ui.css', 'css', null ,parentDocument, parentWindow);

    // Regist iframe the same events.(Not support iframe in iframe)
    var $iframes = $('iframe, frame', parentDocument);
    console.log(D.LC, '[dict.ui.js] Found iframe numbers (loadCSSwithAllFrames):', $iframes.length);
    $iframes.each(function(){
        try{
            var childWindow = this.contentWindow;
            var childDocument = childWindow.document;
            // Recuive
            loadCSSwithAllFrames(childDocument, childWindow);
        }catch(e){
            console.log(D.LC, '[dict.ui.js] iframe can not access:', this);
        }
    });

}
*/

function registWebElementToTextEvent(parentDocument) {
    var option = {
            'checkService': function(){
                return D.DICT_SERVICE;
            },
            'document' : parentDocument || document,
        };

    $.plaintext('body a, body img, body select, body :button', option);

    /* TODO support tooltip in iframe 2 (regist event to all frames)
    // Regist iframe the same events.(Not support iframe in iframe)
    var $iframes = $('iframe, frame', parentDocument);
    console.log(D.LC, '[dict.ui.js] Found iframe numbers (registWebElementToTextEvent):', $iframes.length);
    $iframes.each(function(){
        try{
            var childWindow = this.contentWindow;
            var childDocument = childWindow.document;
            // Recuive
            registWebElementToTextEvent(childDocument);
        }catch(e){
            console.log(D.LC, '[dict.ui.js] iframe can not access:', this);
        }
    });
    */
}


})(jQuery);
