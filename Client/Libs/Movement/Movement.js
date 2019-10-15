var Libs_Movement = {

  init: function() {

  },

  walk: function(direction) {
    if(App.MyPlayer.movementBlocked) {
      return;
    }
    var $targetSQM = null;
    switch(direction) {
      case 'North':
        $targetSQM = Libs_Board.getSQM(App.MyPlayer.X, App.MyPlayer.Y-1);
        break;
      case 'East':
        $targetSQM = Libs_Board.getSQM(App.MyPlayer.X+1, App.MyPlayer.Y);
        break;
      case 'South':
        $targetSQM = Libs_Board.getSQM(App.MyPlayer.X, App.MyPlayer.Y+1);
        break;
      case 'West':
        $targetSQM = Libs_Board.getSQM(App.MyPlayer.X-1, App.MyPlayer.Y);
        break;
    }
    if(!$targetSQM) {
      return;
    }
    if($targetSQM.isWalkable()) {
      App.emit('Walk', [direction]);
    }
  }

}; 