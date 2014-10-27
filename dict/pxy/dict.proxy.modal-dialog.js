/*************************************************
 * dict.proxy.navi.js
 **************************************************/
;(function($){
'use strict';
var MD = function(){
    this._dialog = $("#__title_only_modal__");
    this.$title = $('.modal-title', this._dialog);
    this.$body = $('.modal-body', this._dialog);
    this.show = function(){
        this._dialog.modal('show');
        return this;
    };
    this.hide = function(){
        this._dialog.modal('hide');
        return this;
    };
    this.title = function(txt){
        this.$title.text(txt);
        return this;
    };
    this.body = function(obj){
        if (obj && obj.jquery){ // `instanceof jQuery` Not work while other jQuery object exists(e.g: userscript import another jQuery)
            this.$body.empty().append(obj);
        } else {
            this.$body.text(obj);
        }
        return this;
    }
}

// Regist to other js for calling
$(function(){
    $.dict_extend({
        'MODAL_DIALOG' : new MD(),
    });
});



})(jQuery);
