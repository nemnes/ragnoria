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
        url = App.getItemURL(sqm.Ground.Id);
        html.push('<div class="sqm" data-x="' +x+ '" data-y="' +y+ '" data-blocking="' +sqm.Ground.IsBlocking+ '" style="background-image: url(' +url+ ');">');
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
          html.push('<div class="item" data-item-id="' +item.Id+ '" data-item-size="' +item.Size+ '" data-blocking="' +item.IsBlocking+ '" style="z-index: ' +zindex+ '; background-image: url(' +url+ ');"></div>');
        }
        html.push('</div>');
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

      $newSQM.append('<div class="item" data-item-id="' +item.Id+ '" data-item-size="' +item.Size+ '" data-blocking="' +item.IsBlocking+ '" data-item-name="' +item.Name+ '" style="z-index: ' +zindex+ '; background-image: url(' +url+ ');"></div>');
    }

    // $newSQM.on('mouseenter', function(e){
    //   var $item = $('.item:last', $(this));
    //   if (Libs_Keyboard.isClicked("shift") && $item.length > 0) {
    //     $('#tooltip', document).remove();
    //     $('.item.highlight', document).removeClass('highlight');
    //     var $tooltip = $('<div id="tooltip" style="left: ' +(e.pageX+5)+ 'px; top: ' +e.pageY+ 'px;"></div>');
    //     $item.addClass('highlight');
    //     $tooltip.text($item.data('item-name'));
    //     $('body').append($tooltip);
    //   }
    // });
    // $newSQM.on('mouseout', function(e){
    //   $('#tooltip', document).remove();
    //   $('.item.highlight', document).removeClass('highlight');
    // });

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