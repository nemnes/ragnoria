var App = {

  IO: null,
  IO_STATUS: 'offline',
  MyPlayer: null,

  run: function () {
    Libs_Console.init();
    Libs_Ping.init();
    Libs_Mouse.init();
    Libs_Keyboard.init();
    Libs_Movement.init();
    App.IO = new WebSocket(Config.protocol + '://' +Config.domain+ ':' +Config.port);
    App.IO.onopen = function (e) {
      App.IO_STATUS = 'online';
    };
    App.IO.onmessage = function (e) {
      var args = JSON.parse(e.data)[1];
      var fn = App.getFunctionFromString(JSON.parse(e.data)[0]);
      fn.apply(this, args);
    };
    App.IO.onclose = function (e) {
      var text = App.IO_STATUS === 'online' ? 'Disconnected' : 'Server is offline';
      App.IO_STATUS = 'offline';
      Libs_Console.addLog({ msg: text, level: 'critical' });
    }
  },

  authorization: function(state, params) {
    if(state === 'pass') {
      App.initialize(params.player, params.area);
      return;
    }
    Libs_Console.addLog({ msg: 'Authorization failed', level: 'critical' });
  },

  refresh: function() {
    location = location.href;
  },

  initialize: function(player, area) {
    var html = [];
    var url;

    for (var y in area) if (area.hasOwnProperty(y)) {
      var row = area[y];
      html.push('<div class="map-row" data-y="' +y+ '">');
      for (var x in row) if (row.hasOwnProperty(x)) {
        var sqm = row[x];
        if(!sqm) {
          continue;
        }
        url = App.getItemURL(sqm.Ground.Id);
        html.push('<div class="sqm" data-x="' +x+ '" data-y="' +y+ '" data-blocking="' +sqm.Ground.IsBlocking+ '" style="background-image: url(' +url+ ');">');
        for(var id in sqm.Items) if (sqm.Items.hasOwnProperty(id)) {
          var item = sqm.Items[id];
          var zindex = parseInt(y+ '' +x);
          if(item.IsAlwaysTop > 0) {
            zindex = zindex+1;
          }
          if(item.IsAlwaysUnder > 0) {
            zindex = 0;
          }
          url = App.getItemURL(item.Id);
          html.push('<div class="item" data-item-id="' +item.Id+ '" data-item-size="' +item.Size+ '" data-blocking="' +item.IsBlocking+ '" style="z-index: ' +zindex+ '; background-image: url(' +url+ ');"></div>');
        }
        html.push('</div>');
      }
      html.push('</div>');
    }
    $('#map').append(html.join(''));
    App.MyPlayer = new Player(player);
    App.MyPlayer.$selector = $('<div id="Hero" style="z-index: ' +player.Y+ '' +player.X+ '"><div class="nickname">' +player.Name+ '</div></div>');
    $('.sqm[data-x="' +App.MyPlayer.X+ '"][data-y="' +App.MyPlayer.Y+ '"]').append(App.MyPlayer.$selector);
  },

  getFunctionFromString: function(string) {
    var scope = window;
    var scopeSplit = string.split('.');
    for (var i = 0; i < scopeSplit.length - 1; i++) {
      scope = scope[scopeSplit[i]];
      if (scope == undefined) return;
    }
    return scope[scopeSplit[scopeSplit.length - 1]];
  },

  emit: function(method, args = []) {
    App.IO.send(JSON.stringify([method, args]));
  },

  getItemURL: function(id) {
    return Config.itemsURL + id;
  },

};