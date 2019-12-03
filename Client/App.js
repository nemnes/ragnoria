var App = {

  IO: null,
  Connected: false,
  Hero: null,
  Intervals: {},
  Timeouts: {},

  run: function () {
    Libs_Loader.init();
    Libs_Console.init();
    Libs_Mouse.init();
    Libs_Keyboard.init();
    App.IO = new WebSocket(Config.protocol + '://' +Config.domain+ ':' +Config.port);
    App.IO.onopen = function (e) {
      App.Connected = true;
    };
    App.IO.onmessage = function (e) {
      var args = JSON.parse(e.data)[1];
      var fn = Libs_Misc.getFunctionFromString(JSON.parse(e.data)[0]);
      fn.apply(this, args);
    };
    App.IO.onclose = function (e) {
      var text = App.Connected ? 'Disconnected' : 'Server is offline';
      App.Connected = false;
      Libs_Console.addLog({ msg: text, level: 'critical' });
    }
  },

  authorization: function(state, params) {
    if(state === 'pass') {
      App.initialize(params.hero, params.area, params.players, params.NPCs);
      return;
    }
    Libs_Console.addLog({ msg: 'Authorization failed', level: 'critical' });
  },

  initialize: function(hero, area, players, NPCs) {
    Libs_Ping.init();
    Libs_Movement.init();
    Libs_Board.init(area);
    Libs_Hero.init(hero);
    Libs_Chat.init();
    Libs_Outfiter.init();
    Libs_Player.updateFromList(players);
    Libs_NPC.updateFromList(NPCs);
  },

  emit: function(method, args = []) {
    App.IO.send(JSON.stringify([method, args]));
  },

  addInterval: function(name, fn, time) {
    App.Intervals[name] = setInterval(fn, time);
  },

  clearInterval: function(name) {
    if(typeof App.Intervals[name] === 'undefined') {
      return;
    }
    clearInterval(App.Intervals[name]);
    delete App.Intervals[name];
  },

  addTimeout: function(name, fn, time) {
    App.Timeouts[name] = setTimeout(fn, time);
  },

  clearTimeout: function(name) {
    if(typeof App.Timeouts[name] === 'undefined') {
      return;
    }
    clearTimeout(App.Timeouts[name]);
    delete App.Timeouts[name];
  },

};