var App = {

  IO: null,
  IO_STATUS: 'offline',
  MyPlayer: null,

  run: function () {
    Libs_Console.init();
    Libs_Ping.init();
    App.IO = new WebSocket(Config.protocol + '://' +Config.domain+ ':' +Config.port);
    App.IO.onopen = function (e) {
      App.IO_STATUS = 'online';
    };
    App.IO.onmessage = function (e) {
      Libs_Console.addLog({msg: '<' + e.data, level: 'default'});
      var args = JSON.parse(e.data)[1];
      var fn = App.getFunctionFromString(JSON.parse(e.data)[0]);
      fn.apply(this, args);
    };
    App.IO.onclose = function (e) {
      var text = App.IO_STATUS == 'online' ? 'Disconnected' : 'Server is offline';
      Libs_Console.addLog({ msg: text, level: 'critical' });
    }
  },

  authorization: function(state, params) {
    if(state == 'pass') {
      App.initialize(params.player, params.area);
      return;
    }
    console.log('Authorization failed');
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
        html.push('<div class="sqm" data-x="' +x+ '" data-y="' +y+ '" style="background-image: url(' +url+ ');">');
        for(var id in sqm.Items) if (sqm.Items.hasOwnProperty(id)) {
          var item = sqm.Items[id];
          url = App.getItemURL(item.Id);
          html.push('<div class="item" data-item-id="' +item.Id+ '" data-item-size="' +item.Size+ '" style="z-index: ' +y+ '' +x+ '; background-image: url(' +url+ ');"></div>');
        }
        html.push('</div>');
      }
      html.push('</div>');
    }
    $('#map').append(html.join(''));
    App.MyPlayer = new Player(player);
    App.MyPlayer.$selector = $('<div id="Hero" style="z-index: ' +player.Y+ '' +player.X+ '"><div class="nickname">' +player.Name+ '</div></div>');
    $('.sqm[data-x="' +App.MyPlayer.X+ '"][data-y="' +App.MyPlayer.Y+ '"]').append(App.MyPlayer.$selector);


    document.addEventListener("keydown", function(e) {
      // toggle console
      if (e.keyCode === 192) {
        e.preventDefault();
        Libs_Console.toggleConsole();
      }

      if (e.keyCode === 38) {
        e.preventDefault();
        if(App.MyPlayer.movementBlocked) {
          return;
        }
        App.emit('Walk', ['North']);
      }
      if (e.keyCode === 40) {
        e.preventDefault();
        if(App.MyPlayer.movementBlocked) {
          return;
        }
        App.emit('Walk', ['South']);
      }
      if (e.keyCode === 39) {
        e.preventDefault();
        if(App.MyPlayer.movementBlocked) {
          return;
        }
        App.emit('Walk', ['East']);
      }
      if (e.keyCode === 37) {
        e.preventDefault();
        if(App.MyPlayer.movementBlocked) {
          return;
        }
        App.emit('Walk', ['West']);
      }
    });

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
    Libs_Console.addLog({msg: '>' + JSON.stringify([method, args]), level: 'default'});
  },

  getItemURL: function(id) {
    return Config.itemsURL + id + '.png';
  },

};