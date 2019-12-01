var Libs_Movement = {

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
        targetSQM = Libs_Board.Area[Libs_Hero.Y-1][Libs_Hero.X];
        targetPOS = {Y: Libs_Hero.Y-1, X: Libs_Hero.X};
        break;
      case 'NorthEast':
        targetSQM = Libs_Board.Area[Libs_Hero.Y-1][Libs_Hero.X+1];
        targetPOS = {Y: Libs_Hero.Y-1, X: Libs_Hero.X+1};
        break;
      case 'East':
        targetSQM = Libs_Board.Area[Libs_Hero.Y][Libs_Hero.X+1];
        targetPOS = {Y: Libs_Hero.Y, X: Libs_Hero.X+1};
        break;
      case 'SouthEast':
        targetSQM = Libs_Board.Area[Libs_Hero.Y+1][Libs_Hero.X+1];
        targetPOS = {Y: Libs_Hero.Y+1, X: Libs_Hero.X+1};
        break;
      case 'South':
        targetSQM = Libs_Board.Area[Libs_Hero.Y+1][Libs_Hero.X];
        targetPOS = {Y: Libs_Hero.Y+1, X: Libs_Hero.X};
        break;
      case 'SouthWest':
        targetSQM = Libs_Board.Area[Libs_Hero.Y+1][Libs_Hero.X-1];
        targetPOS = {Y: Libs_Hero.Y+1, X: Libs_Hero.X-1};
        break;
      case 'West':
        targetSQM = Libs_Board.Area[Libs_Hero.Y][Libs_Hero.X-1];
        targetPOS = {Y: Libs_Hero.Y, X: Libs_Hero.X-1};
        break;
      case 'NorthWest':
        targetSQM = Libs_Board.Area[Libs_Hero.Y-1][Libs_Hero.X-1];
        targetPOS = {Y: Libs_Hero.Y-1, X: Libs_Hero.X-1};
        break;
    }
    if(!targetSQM) {
      return;
    }
    // check sqm item collisions
    for(let stack in targetSQM) if(targetSQM.hasOwnProperty(stack)) {
      if(Libs_Item[targetSQM[stack]].IsBlocking) {
        return;
      }
    }
    // check players collisions
    for(let playerId in Libs_Board.Players) if(Libs_Board.Players.hasOwnProperty(playerId)) {
      if(parseInt(Libs_Board.Players[playerId].X) === parseInt(targetPOS.X) && parseInt(Libs_Board.Players[playerId].Y) === parseInt(targetPOS.Y)) {
        return;
      }
    }
    // check players collisions
    for(let npcId in Libs_Board.NPCs) if(Libs_Board.NPCs.hasOwnProperty(npcId)) {
      if(parseInt(Libs_Board.NPCs[npcId].X) === parseInt(targetPOS.X) && parseInt(Libs_Board.NPCs[npcId].Y) === parseInt(targetPOS.Y)) {
        return;
      }
    }
    Libs_Movement.go(direction);
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

  go: function (direction) {
    Libs_Hero.Direction = direction;
    Libs_Hero.movementBlocked = true;

    let time = Date.now();
    clearInterval(Libs_Hero.Animation.Interval);
    Libs_Hero.Animation.CurrentFrame = 0;
    Libs_Hero.Animation.Playing = true;
    Libs_Hero.Animation.Interval = setInterval(function(){
      Libs_Hero.Animation.CurrentFrame++;
      if(Libs_Hero.Animation.CurrentFrame === 32) {
        clearInterval(Libs_Hero.Animation.Interval);
        Libs_Hero.Animation.Playing = false;
        console.log('Latency: ' + (Date.now() - time - Libs_Hero.getStepTime()) + 'ms');
      }
    }, Libs_Hero.getStepTime()/32);

  },

  confirmStep: function(positive, X, Y, direction, area, players, NPCs) {
    var waitInterval = setInterval(function(){
      if(Libs_Hero.Animation.Playing) {
        return
      }
      clearInterval(waitInterval);
      Libs_Hero.Direction = direction;
      Libs_Hero.X = parseInt(X);
      Libs_Hero.Y = parseInt(Y);
      if(positive) {
        Libs_Board.Area = area;
        Libs_Board.AreaStart.Y = parseInt(Object.keys(area)[0]);
        Libs_Board.AreaStart.X = parseInt(Object.keys(area[Libs_Board.AreaStart.Y])[0]);

        // Update players after step - remove and create new
        Libs_Player.updateFromList(players);

        // Update NPCs after step - remove and create new
        Libs_NPC.updateFromList(NPCs);

      }
      Libs_Hero.movementBlocked = false;
      Libs_Hero.Animation.CurrentFrame = 0;
    }, 25);
  },

}; 