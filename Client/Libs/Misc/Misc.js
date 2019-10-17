var Libs_Misc = {

  stripHtml: function (html) {
    return $($.parseHTML(html)).text();
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

  refresh: function() {
    location = location.href;
  },

};