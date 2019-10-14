var Libs_Keyboard = {
  ActiveKeys: [],
  
  init: function() {
    Libs_Keyboard.startWalkingInterval();
    document.addEventListener("keydown", function(e) {

      // toggle console
      if (e.keyCode === 192) {
        e.preventDefault();
        Libs_Console.toggleConsole();
      }

      // disable [tab]
      if (e.keyCode === 9) {
        e.preventDefault();
      }

      // prevent browser zoom
      if (e.ctrlKey === true && (e.keyCode === 61 || e.keyCode === 107 || e.keyCode === 173 || e.keyCode === 109  || e.keyCode === 187  || e.keyCode === 189  ) ) {
        e.preventDefault();
      }

      if(Libs_Console.ActiveConsole) {
        // send console query
        if (e.keyCode === 13) {
          e.preventDefault();
          Libs_Console.sendQuery();
        }
      }

    });
  },

  startWalkingInterval: function() {

    // interval is required for smooth walking
    setInterval(function() {

      if(!Libs_Console.ActiveConsole) {
        Libs_Keyboard.ActiveKeys = KeyboardJS.activeKeys();
        if (Libs_Keyboard.isAnyClicked(['left', 'right', 'up', 'down', 'w', 's', 'a', 'd'])) {
          if (Libs_Keyboard.isClicked("left") || Libs_Keyboard.isClicked("a")) {
            if(App.MyPlayer.movementBlocked) {
              return;
            }
            App.emit('Walk', ['West']);
            return;
          }
          if (Libs_Keyboard.isClicked("down") || Libs_Keyboard.isClicked("s")) {
            if(App.MyPlayer.movementBlocked) {
              return;
            }
            App.emit('Walk', ['South']);
            return;
          }
          if (Libs_Keyboard.isClicked("up") || Libs_Keyboard.isClicked("w")) {
            if(App.MyPlayer.movementBlocked) {
              return;
            }
            App.emit('Walk', ['North']);
            return;
          }
          if (Libs_Keyboard.isClicked("right") || Libs_Keyboard.isClicked("d")) {
            if(App.MyPlayer.movementBlocked) {
              return;
            }
            App.emit('Walk', ['East']);
            return;
          }
        }
      }
    }, 25);
  },

  isClicked: function(key) {
    return Libs_Keyboard.ActiveKeys.includes(key);
  },

  isAnyClicked: function(keys) {
    for(var i=0;i<keys.length;i++) {
      if(Libs_Keyboard.ActiveKeys.includes(keys[i])) {
        return true;
      }
    }
    return false;
  }

}; 