var Libs_NPC = {

  Player: [],

  create: function(npc) {
    if(typeof Libs_Board.NPCs[npc.Id] !== 'undefined') {
      return;
    }
    npc.Image = new Image;
    npc.Image.src = Libs_Misc.getOutfitURL(npc);
    npc.Animation = {
      Playing: false,
      CurrentFrame: null
    };
    Libs_Board.NPCs[npc.Id] = npc;
  },

  remove: function(id) {
    if(Libs_Board.NPCs[id]) {
      delete Libs_Board.NPCs[id];
    }
  },

  updateFromList: function(NPCs) {
    for(let npcId in Libs_Board.NPCs) if (Libs_Board.NPCs.hasOwnProperty(npcId)) {
      if(typeof NPCs[npcId] === 'undefined') {
        Libs_NPC.remove(npcId);
      }
    }
    for(let npcId in NPCs) if (NPCs.hasOwnProperty(npcId)) {
      if(typeof Libs_Board.NPCs[npcId] === 'undefined') {
        Libs_NPC.create(NPCs[npcId]);
      }
    }
  },


};