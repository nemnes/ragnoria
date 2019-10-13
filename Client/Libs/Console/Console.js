var Libs_Console = {
  $Console: null,
  $Console_Content: null,
  $Console_Input: null,

  ActiveConsole: false,

  init: function () {
    var html = [];
    html.push('<div id="console">');
    html.push('<div class="console-content"></div>');
    html.push('<input class="console-input" type="text"/>');
    html.push('</div>');
    Libs_Console.$Console = $(html.join(''));
    Libs_Console.$Console_Content = Libs_Console.$Console.find('.console-content');
    Libs_Console.$Console_Input = Libs_Console.$Console.find('.console-input');
    $('body').prepend(Libs_Console.$Console);
  },

  /** msg, level */
  addLog: function(params) {
    var date = new Date();
    var time = (date.getHours()<10?'0':'') + date.getHours() +":"+ (date.getMinutes()<10?'0':'') + date.getMinutes() + ":" +(date.getSeconds()<10?'0':'') + date.getSeconds();
    var log = "<div class='log-" +params.level+ "'><B>[" +time+ "]</B> " +params.msg+ "</div>\n";
    var $console = $('#console');
    var $consoleContent = $('#console .console-content');
    $consoleContent.append(log);

    if($consoleContent.html().split("\n").length > 50) {
      $consoleContent.html($consoleContent.html().split("\n").slice(1).join("\n"));
    }

    if($console.is(":visible")) {
      $consoleContent.scrollTop($consoleContent.prop("scrollHeight"));
    }

    if(params.level === 'critical') {
      Libs_Console.showConsole();
    }
  },

  showConsole: function() {
    Libs_Console.ActiveConsole = true;
    Libs_Console.$Console.slideDown(200);
    Libs_Console.$Console_Content.scrollTop(Libs_Console.$Console_Content.prop("scrollHeight"));
    Libs_Console.$Console_Input.focus().val('');
  },

  hideConsole: function() {
    Libs_Console.ActiveConsole = false;
    var $console = $('#console');
    $console.slideUp(200);
  },

  toggleConsole: function() {
    var $console = $('#console');
    if($console.is(":visible")) {
      Libs_Console.hideConsole();
    }
    else {
      Libs_Console.showConsole();
    }
  },

  sendQuery: function() {
    var $consoleInput = $('#console .console-input');
    var query = $consoleInput.val().split(" ", 1)[0];
    var params = $consoleInput.val().split(" ", -1);
    params.shift();

    if($consoleInput.val().length > 0) {
      App.IO.send(JSON.stringify([query, params]));
      $consoleInput.val('');
    }
  }

};