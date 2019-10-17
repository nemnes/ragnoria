var Libs_Movement = {

  init: function() {

  },

  walk: function(direction) {
    if(Libs_Hero.movementBlocked) {
      return;
    }
    var $targetSQM = null;
    switch(direction) {
      case 'North':
        $targetSQM = Libs_Board.getSQM(Libs_Hero.X, Libs_Hero.Y-1);
        break;
      case 'East':
        $targetSQM = Libs_Board.getSQM(Libs_Hero.X+1, Libs_Hero.Y);
        break;
      case 'South':
        $targetSQM = Libs_Board.getSQM(Libs_Hero.X, Libs_Hero.Y+1);
        break;
      case 'West':
        $targetSQM = Libs_Board.getSQM(Libs_Hero.X-1, Libs_Hero.Y);
        break;
    }
    if(!$targetSQM) {
      return;
    }
    if($targetSQM.isWalkable()) {
      Libs_Hero.go(direction);
      App.emit('Walk', [direction]);
    }
  }

}; 