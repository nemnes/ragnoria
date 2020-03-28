var Libs_Keyboard = {
  F1: null,
  F2: null,
  F3: null,
  F4: null,
  ActiveKeys: [],
  
  init: function() {

    // simple bindings
    document.addEventListener("keydown", function(e) {

      // hotkeys
      if (e.keyCode === 112) {
        e.preventDefault();
        App.emit('Say', [Libs_Keyboard.F1]);
      }
      if (e.keyCode === 113) {
        e.preventDefault();
        App.emit('Say', [Libs_Keyboard.F2]);
      }
      if (e.keyCode === 114) {
        e.preventDefault();
        App.emit('Say', [Libs_Keyboard.F3]);
      }
      if (e.keyCode === 115) {
        e.preventDefault();
        App.emit('Say', [Libs_Keyboard.F4]);
      }

      // disable [tab]
      if (e.keyCode === 9) {
        e.preventDefault();
      }

      // prevent browser zoom
      if (e.ctrlKey === true && ([61,107,173,109,187,189].includes(e.keyCode))) {
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
        if ([17,37,38,39,40,97,98,99,100,101,102,103,104,105,33,34,35,36].includes(e.keyCode)) {
          e.preventDefault();
        }
        // prevent default for '/' and backspace
        if([191,8].includes(e.keyCode)) {
          e.preventDefault();
        }
      }

    });

    // interval (required for smooth walking)
    setInterval(function() {
      Libs_Keyboard.ActiveKeys = KeyboardJS.activeKeys();
      if(Libs_Keyboard.ActiveKeys.length === 0) {
        return;
      }
      if(!Libs_Console.isActive() && !Libs_Chat.isActive() && App.Connected) {
        if (Libs_Keyboard.isAnyClicked(['left', 'right', 'up', 'down', 'num1', 'num2', 'num3', 'num4', 'num6', 'num7', 'num8', 'num9', 'end', 'pagedown', 'home', 'pageup'])) {
          if (Libs_Keyboard.isClicked("ctrl") && (Libs_Keyboard.isClicked("left") || Libs_Keyboard.isClicked("num4"))) {
            Libs_Movement.rotate('West');
            return;
          }
          if (Libs_Keyboard.isClicked("ctrl") && (Libs_Keyboard.isClicked("down") || Libs_Keyboard.isClicked("num2"))) {
            Libs_Movement.rotate('South');
            return;
          }
          if (Libs_Keyboard.isClicked("ctrl") && (Libs_Keyboard.isClicked("up") || Libs_Keyboard.isClicked("num8"))) {
            Libs_Movement.rotate('North');
            return;
          }
          if (Libs_Keyboard.isClicked("ctrl") && (Libs_Keyboard.isClicked("right") || Libs_Keyboard.isClicked("num6"))) {
            Libs_Movement.rotate('East');
            return;
          }
          if (Libs_Keyboard.isClicked("ctrl")) {
            return;
          }
          if (Libs_Keyboard.isClicked("left") || Libs_Keyboard.isClicked("num4")) {
            Libs_Movement.walk('West');
            return;
          }
          if (Libs_Keyboard.isClicked("down") || Libs_Keyboard.isClicked("num2")) {
            Libs_Movement.walk('South');
            return;
          }
          if (Libs_Keyboard.isClicked("up") || Libs_Keyboard.isClicked("num8")) {
            Libs_Movement.walk('North');
            return;
          }
          if (Libs_Keyboard.isClicked("right") || Libs_Keyboard.isClicked("num6")) {
            Libs_Movement.walk('East');
            return;
          }
          if (Libs_Keyboard.isClicked("num1") || Libs_Keyboard.isClicked("end")) {
            Libs_Movement.walk('SouthWest');
            return;
          }
          if (Libs_Keyboard.isClicked("num3") || Libs_Keyboard.isClicked("pagedown")) {
            Libs_Movement.walk('SouthEast');
            return;
          }
          if (Libs_Keyboard.isClicked("num7") || Libs_Keyboard.isClicked("home")) {
            Libs_Movement.walk('NorthWest');
            return;
          }
          if (Libs_Keyboard.isClicked("num9") || Libs_Keyboard.isClicked("pageup")) {
            Libs_Movement.walk('NorthEast');
            return;
          }
        }
        return;
      }
    }, 25);

  },

  isClicked: function(key) {
    return Libs_Keyboard.ActiveKeys.includes(key);
  },

  isAnyClicked: function(keys) {
    for(let i=0;i<keys.length;i++) {
      if(Libs_Keyboard.ActiveKeys.includes(keys[i])) {
        return true;
      }
    }
    return false;
  }

}; 