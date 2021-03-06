var Libs_Movement = {

  AreaChangesWhileWalking: [],
  QueuedConfirmStep: false,

  init: function() {

  },

  walk: function(direction) {
    if(Libs_Hero.movementBlocked) {
      return;
    }
    var targetSQM = null;
    var targetPOS = null;
    switch(direction) {
      case 'North':
        targetSQM = Libs_Board.Area[Libs_Hero.Z][Libs_Hero.Y-1][Libs_Hero.X];
        targetPOS = {Z: Libs_Hero.Z, Y: Libs_Hero.Y-1, X: Libs_Hero.X};
        break;
      case 'NorthEast':
        targetSQM = Libs_Board.Area[Libs_Hero.Z][Libs_Hero.Y-1][Libs_Hero.X+1];
        targetPOS = {Z: Libs_Hero.Z, Y: Libs_Hero.Y-1, X: Libs_Hero.X+1};
        break;
      case 'East':
        targetSQM = Libs_Board.Area[Libs_Hero.Z][Libs_Hero.Y][Libs_Hero.X+1];
        targetPOS = {Z: Libs_Hero.Z, Y: Libs_Hero.Y, X: Libs_Hero.X+1};
        break;
      case 'SouthEast':
        targetSQM = Libs_Board.Area[Libs_Hero.Z][Libs_Hero.Y+1][Libs_Hero.X+1];
        targetPOS = {Z: Libs_Hero.Z, Y: Libs_Hero.Y+1, X: Libs_Hero.X+1};
        break;
      case 'South':
        targetSQM = Libs_Board.Area[Libs_Hero.Z][Libs_Hero.Y+1][Libs_Hero.X];
        targetPOS = {Z: Libs_Hero.Z, Y: Libs_Hero.Y+1, X: Libs_Hero.X};
        break;
      case 'SouthWest':
        targetSQM = Libs_Board.Area[Libs_Hero.Z][Libs_Hero.Y+1][Libs_Hero.X-1];
        targetPOS = {Z: Libs_Hero.Z, Y: Libs_Hero.Y+1, X: Libs_Hero.X-1};
        break;
      case 'West':
        targetSQM = Libs_Board.Area[Libs_Hero.Z][Libs_Hero.Y][Libs_Hero.X-1];
        targetPOS = {Z: Libs_Hero.Z, Y: Libs_Hero.Y, X: Libs_Hero.X-1};
        break;
      case 'NorthWest':
        targetSQM = Libs_Board.Area[Libs_Hero.Z][Libs_Hero.Y-1][Libs_Hero.X-1];
        targetPOS = {Z: Libs_Hero.Z, Y: Libs_Hero.Y-1, X: Libs_Hero.X-1};
        break;
    }
    if(!targetSQM) {
      return;
    }

    // check sqm has floor
    let floorFound = false;
    for(let stack in targetSQM) if(targetSQM.hasOwnProperty(stack)) {
      if(Libs_Item.Items[targetSQM[stack]['Id']].ItemTypeId === '1') {
        floorFound = true;
      }
    }
    if(!floorFound) {
      return;
    }

    // check item collisions
    for(let stack in targetSQM) if(targetSQM.hasOwnProperty(stack)) {
      if(Libs_Item.Items[targetSQM[stack]['Id']].IsBlocking) {
        return;
      }
    }

    // check players collisions
    for(let playerId in Libs_Board.Players) if(Libs_Board.Players.hasOwnProperty(playerId)) {
      if(parseInt(Libs_Board.Players[playerId].X) === parseInt(targetPOS.X) && parseInt(Libs_Board.Players[playerId].Y) === parseInt(targetPOS.Y) && parseInt(Libs_Board.Players[playerId].Z) === parseInt(targetPOS.Z)) {
        return;
      }
    }

    // check npc collisions
    for(let npcId in Libs_Board.NPCs) if(Libs_Board.NPCs.hasOwnProperty(npcId)) {
      if(parseInt(Libs_Board.NPCs[npcId].X) === parseInt(targetPOS.X) && parseInt(Libs_Board.NPCs[npcId].Y) === parseInt(targetPOS.Y) && parseInt(Libs_Board.NPCs[npcId].Z) === parseInt(targetPOS.Z)) {
        return;
      }
    }
    Libs_Movement.move(direction);
    App.emit('Walk', [direction]);
  },

  rotate: function(direction) {
    if(Libs_Hero.movementBlocked) {
      return;
    }
    Libs_Hero.movementBlocked = true;
    setTimeout(function(){
      Libs_Hero.movementBlocked = false;
    }, 100);
    Libs_Hero.Direction = direction;
    App.emit('Rotate', [direction]);
  },

  move: function (direction) {
    Libs_Hero.Direction = direction;
    Libs_Hero.movementBlocked = true;
    Libs_Hero.Animation.CurrentFrame = 0;
    Libs_Hero.Animation.Playing = true;

    for(let i = 1; i <= 32; i++) {
      App.clearTimeout('Hero_Movement_' + i);
    }
    for(let i = 1; i <= 32; i++) {
      App.addTimeout('Hero_Movement_' + i, function(){
        Libs_Hero.Animation.CurrentFrame++;
        Libs_Hero.X_Virtual = Libs_Hero.X;
        Libs_Hero.Y_Virtual = Libs_Hero.Y;
        if(Libs_Hero.Animation.CurrentFrame > 16) {
          switch(Libs_Hero.Direction) {
            case 'North':
              Libs_Hero.Y_Virtual--;
              break;
            case 'NorthEast':
              Libs_Hero.Y_Virtual--;
              Libs_Hero.X_Virtual++;
              break;
            case 'NorthWest':
              Libs_Hero.Y_Virtual--;
              Libs_Hero.X_Virtual++;
              break;
            case 'West':
              Libs_Hero.X_Virtual--;
              break;
            case 'East':
              Libs_Hero.X_Virtual++;
              break;
            case 'South':
              Libs_Hero.Y_Virtual++;
              break;
            case 'SouthEast':
              Libs_Hero.X_Virtual++;
              Libs_Hero.Y_Virtual++;
              break;
            case 'SouthWest':
              Libs_Hero.X_Virtual--;
              Libs_Hero.Y_Virtual++;
              break;
          }
        }
        if(Libs_Hero.Animation.CurrentFrame === 32) {
          Libs_Hero.Animation.Playing = false;
        }
      }, (Libs_Hero.getStepTime()/32)*i);
    }

  },

  abortStep: function() {
    for(let i = 1; i <= 32; i++) {
      App.clearTimeout('Hero_Movement_' + i);
    }
    Libs_Movement.QueuedConfirmStep = false;
    Libs_Hero.Animation.Playing = 0;
    Libs_Hero.Animation.CurrentFrame = 0;
    Libs_Hero.movementBlocked = true;
    App.addTimeout('movement_blocked_after_aborted_step', function(){
      Libs_Hero.movementBlocked = false;
    }, 200);
  },

  confirmStep: function(status, X, Y, Z, direction, area, players, NPCs) {
    Libs_Movement.QueuedConfirmStep = true;
    let waitInterval = setInterval(function(){
      if(!Libs_Movement.QueuedConfirmStep) {
        clearInterval(waitInterval);
        return;
      }
      if(Libs_Hero.Animation.Playing) {
        return;
      }
      clearInterval(waitInterval);
      Libs_Movement.updatePosition(status, X, Y, Z, direction, area, players, NPCs);
      Libs_Hero.movementBlocked = false;
      Libs_Hero.Animation.CurrentFrame = 0;
    }, 25);
  },

  updatePosition: function(status, X, Y, Z, direction, area, players, NPCs) {
    Libs_Movement.QueuedConfirmStep = false;
    Libs_Hero.Direction = direction;
    Libs_Hero.X = parseInt(X);
    Libs_Hero.Y = parseInt(Y);
    Libs_Hero.Z = parseInt(Z);
    Libs_Hero.X_Virtual = Libs_Hero.X;
    Libs_Hero.Y_Virtual = Libs_Hero.Y;
    if(status === 'success') {
      for(let sqm in Libs_Movement.AreaChangesWhileWalking) if(Libs_Movement.AreaChangesWhileWalking.hasOwnProperty(sqm)) {
        sqm = Libs_Movement.AreaChangesWhileWalking[sqm];
        if(typeof area[sqm.Z] != 'undefined' && typeof area[sqm.Z][sqm.Y] != 'undefined' && typeof area[sqm.Z][sqm.Y][sqm.X] != 'undefined') {
          area[sqm.Z][sqm.Y][sqm.X] = sqm.Stack;
        }
      }
      Libs_Movement.AreaChangesWhileWalking = [];
      Libs_Board.setArea(area);

      // Update players after step - remove and create new
      Libs_Player.updateFromList(players);

      // Update NPCs after step - remove and create new
      Libs_NPC.updateFromList(NPCs);
    }
  },

}; 