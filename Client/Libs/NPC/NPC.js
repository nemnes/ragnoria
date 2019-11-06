var Libs_NPC = {

  Player: [],

  create: function(npc) {
    if(Libs_Board.$.find('.npc[data-id="' +npc.Id+ '"]').length > 0) {
      return;
    }
    var url = App.getOutfitURL(npc);
    let $npc = $('<div class="npc" data-id="' +npc.Id+ '" data-nickname="' +npc.Name+ '" style="z-index: ' +npc.Y+ '' +npc.X+ '; background-image: url(' +url+ ');"><div class="nickname">' +npc.Name+ '</div></div>');
    Libs_Board.$.find('.sqm[data-x="' +npc.X+ '"][data-y="' +npc.Y+ '"]').append($npc);
  },

  remove: function(id) {
    Libs_Board.$.find('.npc[data-id="' +id+ '"]').finish().remove();
  },

  rotate: function(id, direction) {
    let $npc = $('.npc[data-id="' +id+ '"]');
    switch(direction) {
      case 'North':
        $npc.css('background-position-y', -64+'px');
        break;
      case 'South':
        $npc.css('background-position-y', '0px');
        break;
      case 'East':
        $npc.css('background-position-y', -128+'px');
        break;
      case 'West':
        $npc.css('background-position-y', -192+'px');
        break;
    }
  },


};