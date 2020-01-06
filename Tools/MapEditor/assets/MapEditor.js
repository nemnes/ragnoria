/* Ragnoria Map Editor by Adam Lozynski */
var MapEditor = {
  ImagesURL: Config.ImagesURL,
  ItemsURL: Config.ItemsURL,
  ShiftDown: false,

  Tool: 1, // 1=Pencil, 2=Eraser
  Items: {},
  SelectedItem: null,
  SecondaryItem: null,
  Dragging: false,

  init: function() {
    MapEditor.getItems();

    $('#Eraser', document).on('click', MapEditor.onEraser);
    $('#Search', document).on('keyup', MapEditor.resortItemContainer);
    $('#Layer', document).on('change', MapEditor.resortItemContainer);
    $('#SaveWorld', document).on('click', MapEditor.onSaveWorldClick);
    $('#File', document).on('change', MapEditor.onFile);

    MapEditor.rebind();

    $(document).on("mousedown mouseup click focus blur contextmenu mousewheel DOMMouseScroll wheel", function(e) {
      if (e.which === 3) {
        e.preventDefault();
        e.stopPropagation();
      }
    });
    $(document).on('mousedown', function(e) {
      MapEditor.Dragging = e.which === 1;
    });
    $(document).on('mouseup', function() {
      MapEditor.Dragging = false;
    });
    $(document).on('keydown', function(e) {
      var $mapContainer = $(".map-container", document);
      if (e.keyCode === 40) {
        e.preventDefault();
        $mapContainer.scrollTop($mapContainer.scrollTop()+64);
      }
      if (e.keyCode === 38) {
        e.preventDefault();
        $mapContainer.scrollTop($mapContainer.scrollTop()-64);
      }
      if (e.keyCode === 39) {
        e.preventDefault();
        $mapContainer.scrollLeft($mapContainer.scrollLeft()+64);
      }
      if (e.keyCode === 37) {
        e.preventDefault();
        $mapContainer.scrollLeft($mapContainer.scrollLeft()-64);
      }
      if (e.keyCode === 16) {
        e.preventDefault();
        MapEditor.ShiftDown = true;
        $('body').css('cursor', 'alias');
      }
      if (e.keyCode === 88) {
        e.preventDefault();
        var SelectedItem = MapEditor.SelectedItem;
        var SecondaryItem = MapEditor.SecondaryItem;
        if(SecondaryItem) {
          MapEditor.selectItem(SecondaryItem.Id);
        }
        if(SelectedItem) {
          MapEditor.selectSecondaryItem(SelectedItem.Id);
        }
        MapEditor.Tool = 1;
        $('#item-preview').remove();
      }
    });
    $(document).on('keyup', function(e) {
      if (e.keyCode === 16) {
        e.preventDefault();
        MapEditor.ShiftDown = false;
        $('body').css('cursor', 'default');
      }
    });
    MapEditor.createEmptyWorld();
  },

  getItems: function() {
    $.get(MapEditor.ItemsURL + '?v=' + Date.now(), function(data) {
      MapEditor.Items = data;
      MapEditor.renderItemContainer();
    });
  },

  selectItem: function(id) {
    var Item = MapEditor.Items[id];
    if(!Item) return;
    MapEditor.SelectedItem = Item;
    $('.actual-item-image', document).html('<img src="' + MapEditor.ImagesURL + Item.Id + '"/>');
    $('.actual-item-details', document).html(Item.Name + ' (' + Item.Id + ')');
  },

  selectSecondaryItem: function(id) {
    var Item = MapEditor.Items[id];
    if(!Item) return;
    MapEditor.SecondaryItem = Item;
    $('.secondary-item-image', document).html('<img src="' + MapEditor.ImagesURL + Item.Id + '"/>');
  },

  renderItemContainer: function() {
    for (var Id in MapEditor.Items) if (MapEditor.Items.hasOwnProperty(Id)) {
      var Item = MapEditor.Items[Id];
      var html = [];
      html.push('<div class="item-select" data-item-layer="' +Item.ItemTypeId+ '" data-item-id="' + Item.Id + '" data-item-name="' + Item.Name + '">');
      html.push('  <img src="' + MapEditor.ImagesURL + Item.Id + '"/>');
      html.push('</div>');
      $('.item-list', document).append(html.join(''));
    }
    $('.item-select', document).on('click', function () {
      MapEditor.Tool = 1;
      $('.item-select', document).removeClass('active');
      $(this).addClass('active');
      MapEditor.selectItem($(this).data('item-id'));
    });
    $('.item-container', document).on('click mouseup mousedown mouseenter mouseout', function () {
      MapEditor.Dragging = false;
    });
    MapEditor.resortItemContainer();
  },

  resortItemContainer: function() {
    var searchVal = $('#Search').val().toLowerCase();
    var layer = $('#Layer').val();

    $('.item-select', document).hide();
    $('.item-select', document).each(function(){
      var itemLayer = $(this).data('item-layer');
      var itemName = $(this).data('item-name').toLowerCase();
      if(itemLayer == layer) {
        if(!searchVal || itemName.includes(searchVal)) {
          $(this).show();
        }
      }
    });
  },

  createEmptyWorld: function() {
    var html = [];
    for(var i=0;i<100;i++) {
      html.push('<div class="map-row">');
      for(var j=0;j<100;j++) {
        var url = MapEditor.ImagesURL+ '0';
        html.push('<div class="sqm" data-x="' +(j)+ '" data-y="' +(i)+ '" data-item-id="0" style="background-image: url(' +url+ ');"></div>');
      }
      html.push('</div>');
    }
    $('.map-container', document).html(html.join(''));
    MapEditor.rebind();
  },

  onSaveWorldClick: function() {
    var map = [];
    var _context = $('.map-container', document);
    $('.sqm', _context).each(function(a) {
      var $sqm = $(this);
      var x = $sqm.data('x');
      var y = $sqm.data('y');
      var groundId = parseInt($sqm.data('item-id'));
      var items = [];
      items.push(groundId);
      $('.item', $sqm).each(function(){
        if($(this).attr('id') == 'item-preview') {
          return;
        }
        if(MapEditor.Items[$(this).data('item-id')].IsStackable) {
          var quantity = $(this).data('item-quantity') > 0 ? $(this).data('item-quantity') : 1;
          items.push([$(this).data('item-id'), quantity]);
        }
        else {
          items.push($(this).data('item-id'));
        }
      });
      if(!map[y]) {
        map[y] = [];
      }
      map[y][x] = items;
    });
    var world = JSON.stringify(map);
    $.ajax({
      type: "POST",
      url: 'save.php',
      data: {world: world},
    });

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(world));
    element.setAttribute('download', 'World.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  },

  onFile: function() {
    if (!this || !this.files || this.files.length === 0) {
      return;
    }
    var reader = new FileReader();
    new Promise((resolve, reject) => {
      reader.onload = event => resolve(event.target.result);
      reader.onerror = error => reject(error);
      reader.readAsText(this.files[0])
    }).then(data => {
      try {
        data = JSON.parse(data);
      } catch (e) {
        alert('The uploaded file is not a map file or has been damaged.');
        return;
      }
      MapEditor.renderWorld(data);
    });
  },

  renderWorld: function(data) {
    $('.map-container', document).empty();
    for(var y = 0; y < data.length; y++) {
      var html = [];
      var url = '';
      html.push('<div class="map-row">');
      for (var x = 0; x < data[y].length; x++) {
        url = MapEditor.ImagesURL + data[y][x][0];
        html.push('<div class="sqm" data-x="' +x+ '" data-y="' +y+ '" data-item-id="' +data[y][x][0]+ '" style="background-image: url(' +url+ ');">');
        for (var i = 0; i < data[y][x].length; i++) {
          if(i === 0) {
            continue;
          }
          var item = Array.isArray(data[y][x][i]) ? MapEditor.Items[data[y][x][i][0]] : MapEditor.Items[data[y][x][i]];
          var quantityString = '';
          if(item.IsStackable) {
            var quantity = Array.isArray(data[y][x][i]) ? data[y][x][i][1] : null;
            quantityString = 'data-item-quantity="' +quantity+ '"';
          }

          url = MapEditor.ImagesURL + item.Id;
          html.push('<div class="item" data-layer="' + item.ItemTypeId + '" data-item-id="' + item.Id + '" data-item-size="' + item.Size + '" ' +quantityString+ ' style="background-image: url(' + url + ');"></div>');
        }
        html.push('</div>');
      }
      html.push('</div>');
      $('.map-container', document).append(html.join(''));
    }

    MapEditor.rebind();
    $('#Layer', document).trigger('change');
  },

  onEraser: function() {
    MapEditor.Tool = 2;
    MapEditor.SelectedItem = null;
    $('.actual-item-image', document).html('<img src="assets/eraser.png"/>');
    $('.actual-item-details', document).html('Eraser');
    $('.item-select', document).removeClass('active');
  },

  drawOnSQM: function($sqm) {
    if(!MapEditor.SelectedItem) {
      return;
    }

    var url;
    // Grounds
    if(MapEditor.SelectedItem.ItemTypeId == 1) {
      url = MapEditor.ImagesURL + MapEditor.SelectedItem.Id;
      $sqm.data('item-id', MapEditor.SelectedItem.Id);
      $sqm.css('background-image', 'url(' +url+ ')');
      return;
    }

    // Other layers
    var layer = MapEditor.SelectedItem.ItemTypeId;
    url = MapEditor.ImagesURL + MapEditor.SelectedItem.Id;

    if(!MapEditor.ShiftDown) {
      $sqm.find('.item[data-layer="' +layer+ '"]').not($('#item-preview', document)).remove();
    }

    var quantityString = MapEditor.SelectedItem.IsStackable ? 'data-item-quantity="1"' : '';
    var item = '<div class="item" data-layer="' +layer+ '" data-item-id="' +MapEditor.SelectedItem.Id+ '" data-item-size="' +MapEditor.SelectedItem.Size+ '" ' +quantityString+ ' style="background-image: url(' +url+ ');"></div>';
    var $a = $sqm.find('.item').not($('#item-preview', document)).filter(function() {
      return parseInt($(this).data('layer')) <= layer;
    });
    if($a.last().length > 0) {
      $(item).insertAfter($a.last());
    }
    else {
      $sqm.prepend(item);
    }
  },

  eraseOnSQM: function($sqm) {
    $sqm.find('.item').not($('#item-preview')).remove();
  },

  rebind: function() {
    var $sqm = $('.sqm', document);
    $sqm.unbind();
    $sqm.on('mouseenter', function() {
      $('#Coords', document).text('X: ' +$(this).data('x') + ', Y: ' +$(this).data('y'));
    });
    $sqm.on('mouseenter', function() {
      var url;
      if(MapEditor.Tool === 1 && MapEditor.SelectedItem) {
        url = MapEditor.ImagesURL + MapEditor.SelectedItem.Id;
        $('#item-preview', document).remove();
        $(this).append('<div class="item" id="item-preview" data-item-size="' + MapEditor.SelectedItem.Size+ '" style="background-image: url(' +url+ ');"></div>');
      }
      if(MapEditor.Tool === 2) {
        url = 'assets/eraser.png';
        $('#item-preview', document).remove();
        $(this).append('<div class="item" id="item-preview" data-item-size="1" style="background-image: url(' +url+ ');"></div>');
      }
    });
    $sqm.on('mouseenter', function() {
      if(MapEditor.Dragging) {
        if(MapEditor.Tool === 1) {
          MapEditor.drawOnSQM($(this));
        }
        if(MapEditor.Tool === 2) {
          MapEditor.eraseOnSQM($(this));
        }
      }
    });
    $sqm.on('mousedown', function(e) {
      if(e.which === 3) {
        if($('.item:not(#item-preview)', $(this)).last().length > 0) {
          var $item = $('.item:not(#item-preview)', $(this)).last();
          var item = MapEditor.Items[$item.attr('data-item-id')];
          if(item.IsStackable) {
            var quantity = prompt("Enter quantity:", $item.attr('data-item-quantity'));
            quantity = isNaN(parseFloat(quantity)) ? 0 : quantity;
            quantity = quantity > 0 ? quantity : 1;
            quantity = quantity > 100 ? 100 : quantity;
            $item.attr('data-item-quantity', quantity);
          }
        }
      }
      if(!(e.which === 1)) {
        return;
      }
      if(MapEditor.Tool === 1) {
        MapEditor.drawOnSQM($(this));
      }
      if(MapEditor.Tool === 2) {
        MapEditor.eraseOnSQM($(this));
      }
    });
  },

};