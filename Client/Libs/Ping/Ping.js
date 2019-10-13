var Libs_Ping = {
  $Ping: null,
  PingRequests: [],
  LastRequestId: 0,

  init: function () {
    Libs_Ping.$Ping = $('<div id="ping"></div>');
    $('body').prepend(Libs_Ping.$Ping);

    setInterval(function(){
      Libs_Ping.LastRequestId++;
      Libs_Ping.push(Libs_Ping.LastRequestId);
    },1000);
  },

  push: function(requestId) {
    App.emit('Ping', ['R'+requestId]);
    Libs_Ping.PingRequests['R'+requestId] = Date.now();
  },

  pull: function(requestId) {
    Libs_Ping.$Ping.text('Ping: ' + (Date.now() - Libs_Ping.PingRequests[requestId]) + 'ms');
    Libs_Ping.PingRequests = Libs_Ping.PingRequests.splice(requestId);
  },

};