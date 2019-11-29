var Libs_Chat = {
  $: null,
  $_Input: null,

  init: function() {
    var html = [];
    html.push('<div class="chat">');
    html.push('<input class="chat-input" maxlength="135"/>');
    html.push('</div>');
    Libs_Chat.$ = $(html.join(''));
    Libs_Chat.$_Input = Libs_Chat.$.find('input.chat-input').first();
    $('body').append(Libs_Chat.$);
  },

  isActive: function() {
    return Libs_Chat.$ ? !!Libs_Chat.$.is(":visible") : false;
  },

  show: function() {
    Libs_Chat.$_Input.val('');
    Libs_Chat.$.addClass('active');
    Libs_Chat.$_Input.focus();
  },

  hide: function() {
    Libs_Chat.$.removeClass('active');
  },

  toggle: function() {
    if(Libs_Chat.$.is(":visible")) {
      Libs_Chat.send();
      Libs_Chat.hide();
    }
    else {
      Libs_Chat.show();
    }
  },

  send: function() {
    var msg = Libs_Misc.stripHtml(Libs_Chat.$_Input.val()).substring(0,135);
    if(msg.length > 0) {
      App.emit('Say', [msg]);
    }
  },

  appendMessage: function(message, author, x, y) {
    // message = Libs_Misc.stripHtml(message).substring(0,135);
    // var $sqm = Libs_Board.getSQM(x,y);
    // var $msg = $('<span>' + message + '</span>');
    //
    // if($sqm.find('.message[data-author="' +author+ '"]').length === 0) {
    //   $sqm.append('<div class="message" data-author="' +author+ '">' +author+ ':</div>');
    // }
    //
    // $sqm.find('.message[data-author="' +author+ '"]').append($msg);
    // setTimeout(function() {
    //   $msg.remove();
    //   if($sqm.find('.message[data-author="' +author+ '"] span').length === 0) {
    //     $sqm.find('.message[data-author="' +author+ '"]').remove();
    //   }
    // }, 2000+(message.length * 25));
  }

};