var Libs_UI = {
  $: null,
  init: function () {
    Libs_UI.$ = $('<div id="UI"></div>');
    $('body').append(Libs_UI.$);

    Libs_UI.Ping.init();
  },

  Ping: {
    $: null,

    PingRequests: [],
    PingResponses: [0,0,0,0,0],
    LastRequestId: 0,

    init: function () {
      Libs_UI.Ping.$ = $('<div id="ping"></div>');
      Libs_UI.$.append(Libs_UI.Ping.$);

      setInterval(function(){
        if(App.Connected) {
          Libs_UI.Ping.LastRequestId++;
          Libs_UI.Ping.push(Libs_UI.Ping.LastRequestId);
        }
        else {
          Libs_UI.Ping.$.text('');
        }
      },1000);
    },

    push: function(requestId) {
      App.emit('Ping', ['R'+requestId]);
      Libs_UI.Ping.PingRequests['R'+requestId] = Date.now();
    },

    pull: function(requestId) {
      Libs_UI.Ping.PingResponses.push(Date.now() - Libs_UI.Ping.PingRequests[requestId]);
      Libs_UI.Ping.PingResponses.shift();
      Libs_UI.Ping.PingRequests = Libs_UI.Ping.PingRequests.splice(requestId);

      const sum = Libs_UI.Ping.PingResponses.reduce((a, b) => a + b, 0);
      let ms = parseInt((sum / Libs_UI.Ping.PingResponses.length)) || 0;
      let severity = ms < 60 ? 'low' : (ms < 100 ? 'medium' : 'high');

      Libs_UI.Ping.$.text(ms + 'ms');
      Libs_UI.Ping.$.attr('data-severity', severity);
    },
  }

};