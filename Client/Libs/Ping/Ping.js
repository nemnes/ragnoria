var Libs_Ping = {
  $: null,

  PingRequests: [],
  LastRequestId: 0,

  init: function () {
    Libs_Ping.$ = $('<div id="ping"></div>');
    $('body').prepend(Libs_Ping.$);

    setInterval(function(){
      if(App.Connected) {
        Libs_Ping.LastRequestId++;
        Libs_Ping.push(Libs_Ping.LastRequestId);
      }
      else {
        Libs_Ping.$.text('');
      }
    },1000);
  },

  push: function(requestId) {
    App.emit('Ping', ['R'+requestId]);
    Libs_Ping.PingRequests['R'+requestId] = Date.now();
  },

  pull: function(requestId) {
    Libs_Ping.$.text('Ping: ' + (Date.now() - Libs_Ping.PingRequests[requestId]) + 'ms');
    Libs_Ping.PingRequests = Libs_Ping.PingRequests.splice(requestId);
  },

};