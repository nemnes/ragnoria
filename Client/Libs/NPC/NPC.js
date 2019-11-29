var Libs_NPC = {

  Player: [],

  create: function(npc) {
    if(Libs_Board.$.find('.npc[data-id="' +npc.Id+ '"]').length > 0) {
      return;
    }
    var url = Libs_Misc.getOutfitURL(npc);
    let $npc = $('<div class="npc" data-id="' +npc.Id+ '" data-nickname="' +npc.Name+ '" style="z-index: ' +npc.Y+ '' +npc.X+ '; background-image: url(' +url+ ');"><div class="nickname">' +npc.Name+ '</div></div>');
    Libs_Board.$.find('.sqm[data-x="' +npc.X+ '"][data-y="' +npc.Y+ '"]').append($npc);
  },


};