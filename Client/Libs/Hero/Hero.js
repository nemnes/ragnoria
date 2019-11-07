var Libs_Hero = {
  $: null,
  Id: null,
  Name: null,
  X: null,
  Y: null,
  Speed: null,

  /** @return {number}*/
  StepTime: function() {
    return 600-(Libs_Hero.Speed*5.5)+25;
  },

  init: function(params) {
    Libs_Hero.Id = params.Id;
    Libs_Hero.Name = params.Name;
    Libs_Hero.X = parseInt(params.X);
    Libs_Hero.Y = parseInt(params.Y);
    Libs_Hero.Speed = parseInt(35);
    var url = App.getOutfitURL(params);
    Libs_Hero.$ = $('<div id="Hero" class="player" data-id="' +params.Id+ '" data-nickname="' +params.Name+ '" style="z-index: ' +params.Y+ '' +params.X+ '; background-image: url(' +url+ ')"><div class="nickname">' +params.Name+ '</div></div>');
    $('.sqm[data-x="' +Libs_Hero.X+ '"][data-y="' +Libs_Hero.Y+ '"]').append(Libs_Hero.$);

    Libs_Outfiter.LookType = {
      Base: params.Base,
      Head: params.Head,
      Body: params.Body,
      Back: params.Back,
      Hands: params.Hands,
      HeadColor: params.HeadColor,
      PrimaryColor: params.PrimaryColor,
      SecondaryColor: params.SecondaryColor,
      DetailColor: params.DetailColor
    };
  },

};