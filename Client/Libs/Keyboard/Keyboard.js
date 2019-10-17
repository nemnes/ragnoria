var Libs_Keyboard = {
  ActiveKeys: [],
  
  init: function() {

    // simple bindings
    document.addEventListener("keydown", function(e) {
      // disable [tab]
      if (e.keyCode === 9) {
        e.preventDefault();
      }
      // prevent browser zoom
      if (e.ctrlKey === true && (e.keyCode === 61 || e.keyCode === 107 || e.keyCode === 173 || e.keyCode === 109  || e.keyCode === 187  || e.keyCode === 189  ) ) {
        e.preventDefault();
      }
      // toggle console
      if (e.keyCode === 192) {
        e.preventDefault();
        Libs_Console.toggleConsole();
      }
      if(Libs_Console.ActiveConsole) {
        // send console query
        if (e.keyCode === 13) {
          e.preventDefault();
          Libs_Console.sendQuery();
        }
      }
    });

    // interval (required for smooth walking)
    setInterval(function() {
      Libs_Keyboard.ActiveKeys = KeyboardJS.activeKeys();
      if(!Libs_Console.ActiveConsole && App.Connected) {
        if (Libs_Keyboard.isAnyClicked(['left', 'right', 'up', 'down', 'w', 's', 'a', 'd'])) {
          if (Libs_Keyboard.isClicked("left") || Libs_Keyboard.isClicked("a")) {
            Libs_Movement.walk('West');
            return;
          }
          if (Libs_Keyboard.isClicked("down") || Libs_Keyboard.isClicked("s")) {
            Libs_Movement.walk('South');
            return;
          }
          if (Libs_Keyboard.isClicked("up") || Libs_Keyboard.isClicked("w")) {
            Libs_Movement.walk('North');
            return;
          }
          if (Libs_Keyboard.isClicked("right") || Libs_Keyboard.isClicked("d")) {
            Libs_Movement.walk('East');
            return;
          }
        }
        return;
      }
    }, 10);

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