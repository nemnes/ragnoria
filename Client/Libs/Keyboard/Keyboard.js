var Libs_Keyboard = {
  ActiveKeys: [],
  
  init: function() {

    // simple bindings
    document.addEventListener("keydown", function(e) {

      // disable [tab]
      if (e.keyCode === 9) {
        e.preventDefault();
        Libs_Outfiter.toggle();
      }

      if (e.keyCode === 27) {
        e.preventDefault();
        Libs_Outfiter.hide();
      }

      // prevent browser zoom
      if (e.ctrlKey === true && (e.keyCode === 61 || e.keyCode === 107 || e.keyCode === 173 || e.keyCode === 109  || e.keyCode === 187  || e.keyCode === 189  ) ) {
        e.preventDefault();
      }

      if(Libs_Console.isActive()) {
        // send console query
        if (e.keyCode === 13) {
          e.preventDefault();
          Libs_Console.sendQuery();
        }
      }

      if(!Libs_Console.isActive()) {
        // toggle chat
        if (e.keyCode === 13) {
          e.preventDefault();
          Libs_Chat.toggle();
        }
      }

      if(!Libs_Chat.isActive()) {
        // toggle console
        if (e.keyCode === 192) {
          e.preventDefault();
          Libs_Console.toggle();
        }
      }

      if(!Libs_Chat.isActive() && !Libs_Console.isActive()) {
        // prevent default for walking keys
        if (e.keyCode === 40 || e.keyCode === 37|| e.keyCode === 39 || e.keyCode === 17) {
          e.preventDefault();
        }
      }

    });

    // interval (required for smooth walking)
    setInterval(function() {
      Libs_Keyboard.ActiveKeys = KeyboardJS.activeKeys();
      if(!Libs_Console.isActive() && !Libs_Chat.isActive() && App.Connected) {
        if (Libs_Keyboard.isAnyClicked(['left', 'right', 'up', 'down'])) {
          if (Libs_Keyboard.isClicked("ctrl") && (Libs_Keyboard.isClicked("left") || Libs_Keyboard.isClicked("a"))) {
            Libs_Movement.rotate('West');
            return;
          }
          if (Libs_Keyboard.isClicked("ctrl") && (Libs_Keyboard.isClicked("down") || Libs_Keyboard.isClicked("s"))) {
            Libs_Movement.rotate('South');
            return;
          }
          if (Libs_Keyboard.isClicked("ctrl") && (Libs_Keyboard.isClicked("up") || Libs_Keyboard.isClicked("w"))) {
            Libs_Movement.rotate('North');
            return;
          }
          if (Libs_Keyboard.isClicked("ctrl") && (Libs_Keyboard.isClicked("right") || Libs_Keyboard.isClicked("d"))) {
            Libs_Movement.rotate('East');
            return;
          }
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