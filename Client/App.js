var App = {

  IO: null,
  Connected: false,
  Hero: null,

  run: function () {
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
      App.initialize(params.hero, params.area, params.players);
      return;
    }
    Libs_Console.addLog({ msg: 'Authorization failed', level: 'critical' });
  },

  initialize: function(hero, area, players) {
    Libs_Ping.init();
    Libs_Movement.init();
    Libs_Board.init(area);
    Libs_Hero.init(hero);
    Libs_Chat.init();
    for(let i in players) if (players.hasOwnProperty(i)) {
      Libs_Player.create(players[i]);
    }
    Libs_Effect.run(1,hero.X,hero.Y);
  },

  emit: function(method, args = []) {
    App.IO.send(JSON.stringify([method, args]));
  },

  getItemURL: function(id) {
    return Config.itemsURL + id;
  },

};