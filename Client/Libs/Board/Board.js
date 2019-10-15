var Libs_Board = {

  init: function(params) {

  },

  getSQM: function(x,y) {
    var $sqm = $('.sqm[data-x="' +x+ '"][data-y="' +y+ '"]');
    if($sqm.length === 0) {
      return false;
    }
    $sqm.isWalkable = Libs_Board.isWalkable;
    return $sqm;
  },

  setSQM: function(sqm, x, y) {
    var url = App.getItemURL(sqm.Ground.Id);
    var $newSQM = $('<div class="sqm" data-x="' +x+ '" data-y="' +y+ '" data-blocking="' +sqm.Ground.IsBlocking+ '" style="background-image: url(' +url+ ');"></div>');
    for(var id in sqm.Items) if (sqm.Items.hasOwnProperty(id)) {
      var item = sqm.Items[id];
      var zindex = parseInt(y+ '' +x);
      if(item.IsAlwaysTop > 0) {
        zindex = zindex+1;
      }
      if(item.IsAlwaysUnder > 0) {
        zindex = 0;
      }
      url = App.getItemURL(item.Id);
      $newSQM.append('<div class="item" data-item-id="' +item.Id+ '" data-item-size="' +item.Size+ '" data-blocking="' +item.IsBlocking+ '" style="z-index: ' +zindex+ '; background-image: url(' +url+ ');"></div>');
    }
    return $newSQM;
  },

  isWalkable: function() {
    var $sqm = $(this);
    if(!$sqm || $sqm.length === 0) {
      return false;
    }
    if($sqm.data('blocking') > 0) {
      return false;
    }
    var itemBlock = false;
    $sqm.find('.item').each(function(){
      if($(this).data('blocking') > 0) {
        itemBlock = true;
      }
    });
    if(itemBlock) {
      return false;
    }
    return true;
  }

};