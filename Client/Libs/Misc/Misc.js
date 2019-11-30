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

  hexToRgba: function (hex,opacity = 1) {
    hex = hex.replace('#','');
    let r = parseInt(hex.substring(0,2), 16);
    let g = parseInt(hex.substring(2,4), 16);
    let b = parseInt(hex.substring(4,6), 16);
    return 'rgba('+r+','+g+','+b+','+opacity+')';
  },

};