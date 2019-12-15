var Libs_Loader = {
  $: null,

  Milestones: 5,
  MilestonesReached: 0,

  init: function() {
    Libs_Loader.$ = $('<div id="loader" style="position: absolute; left: 0; top: 0; right: 0; bottom: 0; text-align: center; background-color: #000000; color: #ffffff; z-index: 2; font-family: \'Tahoma\' "><h1>Loading...</h1><h2 style="opacity: 0.5;">Core</h2></div>');
    Libs_Loader.$.appendTo($('body'));
  },

  reachedMilestone: function(name) {
    var loaded = $('h2', Libs_Loader.$).html();
    $('h2', Libs_Loader.$).html(loaded + ' &#8226; ' + name);
    Libs_Loader.MilestonesReached++;
    if(Libs_Loader.MilestonesReached === Libs_Loader.Milestones) {
      Libs_Loader.onAllMilestonesReached();
    }
  },

  onAllMilestonesReached: function() {
    Libs_Loader.$.remove();
    Libs_Renderer.init();
    Libs_Effect.run(1,Libs_Hero.X,Libs_Hero.Y);
  }

}; 