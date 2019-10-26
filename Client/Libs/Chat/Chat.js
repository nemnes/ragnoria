var Libs_Chat = {
  $: null,
  $_Input: null,

  init: function() {
    var html = [];
    html.push('<div class="chat">');
    html.push('<input class="chat-input"/>');
    html.push('</div>');
    Libs_Chat.$ = $(html.join(''));
    Libs_Chat.$_Input = Libs_Chat.$.find('input.chat-input').first();
    $('body').append(Libs_Chat.$);
  },

  isActive: function() {
    return !!Libs_Chat.$.is(":visible");
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
      Libs_Chat.hide();
    }
    else {
      Libs_Chat.show();
    }
  },



};