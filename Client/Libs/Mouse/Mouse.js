var Libs_Mouse = {
  Dragging: false,

  init: function() {
    Libs_Mouse.preventZoom();
    document.oncontextmenu=null;
    $(document).on("mousedown mouseup click focus blur contextmenu mousewheel DOMMouseScroll wheel", function(e) {
      // console.log("{" + e.which + ":" + e.type + "}");
      if (e.which === 2) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (e.which === 3) {
        e.preventDefault();
        e.stopPropagation();
      }
    });
  },

  preventZoom: function() {
    document.body.addEventListener("wheel", e=>{
      if(e.ctrlKey)
        event.preventDefault();
    });
  }

}; 