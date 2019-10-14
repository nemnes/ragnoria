var Libs_Mouse = {

  init: function() {
    Libs_Mouse.preventZoom();
  },

  preventZoom: function() {
    document.body.addEventListener("wheel", e=>{
      if(e.ctrlKey)
        event.preventDefault();
    });
  }

}; 