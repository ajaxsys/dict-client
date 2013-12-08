/*jshint -W061, scripturl:true */
/*W061: eval can be harmful*/


$(function(){


function getSelection(doc,win){
      console.log(  "selected: " , $(this).selection() || $.selection('html')  );
}
function registSelectWord() {
    console.log('Regist text selector');
    //console.log($('body *:not('+DICT_JID+', '+DICT_JID+' *)'));
    $(document).on('mouseup.dict','*',getSelection);
    $('iframe').each(function(){
        var child_doc = this.contentDocument,
            child_win = this.contentWindow;
        $(child_doc).on('mouseup.dict','body',function(){
            getSelection(child_doc, child_win);
        });
    });
}
registSelectWord();
console.log( "start" );

});


