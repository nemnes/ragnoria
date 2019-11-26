var Libs_Board = {

  $: null,

  init: function(area) {
    var html = [];
    var url;

    html.push('<div id="map">');
    for (var y in area) if (area.hasOwnProperty(y)) {
      var row = area[y];
      html.push('<div class="map-row" data-y="' +y+ '">');
      for (var x in row) if (row.hasOwnProperty(x)) {
        var sqm = row[x];
        if(!sqm) {
          continue;
        }
        html.push(Libs_Board.setSQM(sqm, x, y).prop('outerHTML'));
      }
      html.push('</div>');
    }
    html.push('</div>');
    Libs_Board.$ = $(html.join(''));
    $('body').append(Libs_Board.$);
    $('body').append('<div id="map-overlay"></div>');
    $('#map-overlay').width((Libs_Board.$.width()-128));
    $('#map-overlay').height((Libs_Board.$.height()-128));
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
    var $newSQM = $('<div class="sqm" data-x="' +x+ '" data-y="' +y+ '"></div>');
    for(var key in sqm) if (sqm.hasOwnProperty(key)) {
      var id = sqm[key];
      var item = Libs_Item[id];
      var zindex = parseInt(y+ '' +x);
      if(item.IsAlwaysTop > 0) {
        zindex = zindex+1;
      }
      if(item.IsAlwaysUnder > 0) {
        zindex = 0;
      }
      var url = App.getItemURL(id);

      $newSQM.append('<div class="item" data-item-id="' +id+ '" data-item-size="' +item.Size+ '" data-blocking="' +item.IsBlocking+ '" style="z-index: ' +zindex+ '; background-image: url(' +url+ ');"></div>');
    }

    return $newSQM;
  },

  isWalkable: function() {
    var $sqm = $(this);
    if(!$sqm || $sqm.length === 0) {
      return false;
    }
    var itemBlock = false;
    $sqm.find('.item').each(function(){
      if($(this).data('blocking') > 0) {
        itemBlock = true;
      }
    });

    var creatureBlock = false;
    if($sqm.find('.player').length > 0) {
      creatureBlock = true;
    }
    if($sqm.find('.npc').length > 0) {
      creatureBlock = true;
    }

    if(itemBlock || creatureBlock) {
      return false;
    }
    return true;
  },

};