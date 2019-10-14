var Libs_Console = {
  $: null,
  $_Content: null,
  $_Input: null,

  ActiveConsole: false,

  init: function () {
    var html = [];
    html.push('<div id="console">');
    html.push('<div class="console-content"></div>');
    html.push('<input class="console-input" type="text"/>');
    html.push('</div>');
    Libs_Console.$ = $(html.join(''));
    Libs_Console.$_Content = Libs_Console.$.find('.console-content');
    Libs_Console.$_Input = Libs_Console.$.find('.console-input');
    $('body').prepend(Libs_Console.$);
  },

  /** msg, level */
  addLog: function(params) {
    var date = new Date();
    var time = (date.getHours()<10?'0':'') + date.getHours() +":"+ (date.getMinutes()<10?'0':'') + date.getMinutes() + ":" +(date.getSeconds()<10?'0':'') + date.getSeconds();
    var log = "<div class='log-" +params.level+ "'><B>[" +time+ "]</B> " +params.msg+ "</div>\n";
    Libs_Console.$_Content.append(log);

    if(Libs_Console.$_Content.html().split("\n").length > 50) {
      Libs_Console.$_Content.html(Libs_Console.$_Content.html().split("\n").slice(1).join("\n"));
    }

    if(Libs_Console.$.is(":visible")) {
      Libs_Console.$_Content.scrollTop(Libs_Console.$_Content.prop("scrollHeight"));
    }

    if(params.level === 'critical') {
      Libs_Console.showConsole();
    }
  },

  showConsole: function() {
    Libs_Console.ActiveConsole = true;
    Libs_Console.$.slideDown(200);
    Libs_Console.$_Content.scrollTop(Libs_Console.$_Content.prop("scrollHeight"));
    Libs_Console.$_Input.focus().val('');
  },

  hideConsole: function() {
    Libs_Console.ActiveConsole = false;
    var $console = $('#console');
    $console.slideUp(200);
  },

  toggleConsole: function() {
    if(Libs_Console.$.is(":visible")) {
      Libs_Console.hideConsole();
    }
    else {
      Libs_Console.showConsole();
    }
  },

  sendQuery: function() {
    var user = 'anonymous';
    var msg = Libs_Misc.stripHtml(Libs_Console.$_Input.val());
    var query = msg.split(" ", 1)[0];
    var params = msg.split(" ", -1);
    params.shift();

    if(Libs_Console.$_Input.val().length > 0) {
      App.IO.send(JSON.stringify([query, params]));
      Libs_Console.addLog({level: 'default', msg: user +'@' +Config.domain+ ' > ' + msg});
      Libs_Console.$_Input.val('');
    }
  }

};