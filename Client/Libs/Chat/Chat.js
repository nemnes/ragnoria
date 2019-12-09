var Libs_Chat = {
  $: null,
  $_Input: null,
  Messages: {},

  init: function() {
    var html = [];
    html.push('<div class="chat">');
    html.push('  <input class="chat-input" maxlength="255"/>');
    html.push('</div>');
    Libs_Chat.$ = $(html.join(''));
    Libs_Chat.$_Input = $('input.chat-input', Libs_Chat.$);
    $('body').append(Libs_Chat.$);
    Libs_Chat.$_Input.focusout(function(){
      Libs_Chat.hide();
    });
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
    let msg = Libs_Misc.stripHtml(Libs_Chat.$_Input.val()).substring(0,255).trim();
    if(msg.length > 0) {
      App.emit('Say', [msg]);
    }
  },

  prepareMessage: function(message, author, x, y) {
    var msgTime = 2000+(message.length * 25);
    var splitted = Libs_Chat.splitMessage(message);
    for(let line in splitted) if(splitted.hasOwnProperty(line)) {
      Libs_Chat.appendMessage(splitted[line], author, x, y, msgTime);
    }
  },

  splitMessage: function(message) {
    let r = [];
    while (message.length > 37) {
      var line = message.substring(0,37);
      if(message.substring(0,37).lastIndexOf(" ") > 0) {
        r.push(message.substring(0,line.lastIndexOf(" ")));
        message = message.substring(line.lastIndexOf(" "));
      }
      else {
        r.push(message.substring(0,37));
        message = message.substring(37);
      }
    }
    if(message.length > 0) {
      r.push(message);
    }
    return r;
  },

  appendMessage: function(message, author, x, y, msgTime) {
    var msgId = Libs_Misc.generateUniqueId();
    if(typeof Libs_Chat.Messages[author+'_'+x+'_'+y] == 'undefined') {
      Libs_Chat.Messages[author+'_'+x+'_'+y] = {};
    }
    Libs_Chat.Messages[author+'_'+x+'_'+y][msgId] = {
      Author: author,
      Message: message,
      X: x,
      Y: y
    };
    setTimeout(function(){
      delete Libs_Chat.Messages[author+'_'+x+'_'+y][msgId];
      if(Object.entries(Libs_Chat.Messages[author+'_'+x+'_'+y]).length === 0) {
        delete Libs_Chat.Messages[author+'_'+x+'_'+y];
      }
    }, msgTime);
  }

};