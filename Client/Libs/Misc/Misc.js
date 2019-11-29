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

  getItemURL: function(id) {
    return Config.itemsURL + id;
  },

  getOutfitURL: function(creature) {
    return Config.outfitURL + ([
      creature.Base,
      creature.Head,
      creature.Body,
      creature.Back,
      creature.Hands,
      creature.HeadColor.replace('#', ''),
      creature.PrimaryColor.replace('#', ''),
      creature.SecondaryColor.replace('#', ''),
      creature.DetailColor.replace('#', '')
    ].join(':'));
  },

};