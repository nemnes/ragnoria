/*
 * Ragnoria Map Editor
 * Created by Adam Łożyński
 */
var MapEditor = {
  ImagesURL: Config.itemsURL,
  ItemsURL: 'items.json',
  LayersOpacity: false,
  InactiveLayersOpacity: '0.8',
  MaxWidth: '100',
  MaxHeight: '100',
  ShiftDown: false,

  Tool: 1, // 1=Pencil, 2=Eraser
  Items: {},
  SelectedItem: null,
  Dragging: false,

  init: function() {
    MapEditor.getItems();

    $('#NewWorld', document).on('click', MapEditor.onNewWorldClick);
    $('#NewWorldModalSubmit', document).on('click', MapEditor.onNewWorldModalSubmit);
    $('#Eraser', document).on('click', MapEditor.onEraser);
    $('#Search', document).on('keyup', MapEditor.resortItemContainer);
    $('#Layer', document).on('change', MapEditor.resortItemContainer);
    $('#Layer', document).on('change', MapEditor.updateLayersOpacity);
    $('#SaveWorld', document).on('click', MapEditor.onSaveWorldClick);
    $('#File', document).on('change', MapEditor.onFile);

    MapEditor.onNewWorldClick();
    MapEditor.rebind();

    $(document).on('mousedown', function(e) {
      MapEditor.Dragging = e.which == 1;
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
    });
    $(document).on('keyup', function(e) {
      if (e.keyCode === 16) {
        e.preventDefault();
        MapEditor.ShiftDown = false;
        $('body').css('cursor', 'default');
      }
    });
  },

  getItems: function() {
    $.get(MapEditor.ItemsURL + '?v=' + Date.now(), function(data) {
      MapEditor.Items = data;
      MapEditor.renderItemContainer();
    });
  },

  selectItem: function(id) {
    var Item = MapEditor.Items[id];
    MapEditor.SelectedItem = Item;
    $('.actual-item-image', document).html('<img src="' + MapEditor.ImagesURL + Item.Id + '"/>');
    $('.actual-item-details', document).html(Item.Name + ' (' + Item.Id + ')');
  },

  renderItemContainer: function() {
    for (var Id in MapEditor.Items) if (MapEditor.Items.hasOwnProperty(Id)) {
      var Item = MapEditor.Items[Id];
      var html = [];
      html.push('<div class="item-select" data-item-layer="' +Item.Type+ '" data-item-id="' + Item.Id + '" data-item-name="' + Item.Name + '">');
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

  onNewWorldClick: function() {
    $('#NewWorldModal', document).modal('show');
  },

  onNewWorldModalSubmit: function() {
    var modalBody = $('#NewWorldModal .modal-body', document);
    var $Width = $('[name="Width"]', modalBody);
    var $Height = $('[name="Height"]', modalBody);

    if(!(/^\+?(0|[1-9]\d*)$/.test($Width.val())) || !(/^\+?(0|[1-9]\d*)$/.test($Height.val()))) {
      alert('put integers');
      return;
    }
    if((parseInt($Width.val()) > MapEditor.MaxWidth || parseInt($Width.val()) < 1) || (parseInt($Height.val()) > MapEditor.MaxHeight || parseInt($Height.val()) < 1)) {
      alert('Width: min 1sqm, max ' +MapEditor.MaxWidth+ 'sqm \n Height: min 1sqm, max ' +MapEditor.MaxHeight+ 'sqm');
      return;
    }

    $('#NewWorldModal', document).modal('hide');
    var html = [];
    for(var i=0;i<$Height.val();i++) {
      html.push('<div class="map-row">');
      for(var j=0;j<$Width.val();j++) {
        var url = MapEditor.ImagesURL+ '1000';
        html.push('<div class="sqm" data-x="' +(j+1)+ '" data-y="' +(i+1)+ '" data-item-id="1000" style="background-image: url(' +url+ ');"></div>');
      }
      html.push('</div>');
    }
    $('.map-container', document).html(html.join(''));
    MapEditor.rebind();
  },

  onSaveWorldClick: function() {
    var map = {};
    var _context = $('.map-container', document);
    $('.sqm', _context).each(function(a) {
      var $sqm = $(this);
      var x = $sqm.data('x');
      var y = $sqm.data('y');
      var groundId = parseInt($sqm.data('item-id'));
      var items = [];
      $('.item', $sqm).each(function(){
        if($(this).attr('id') == 'item-preview') {
          return;
        }
        items.push($(this).data('item-id'));
      });
      if(!map[y]) {
        map[y] = {};
      }
      map[y][x] = [groundId,items];
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
    for (var y in data) if (data.hasOwnProperty(y)) {
      var row = data[y];
      var html = [];
      html.push('<div class="map-row">');
      for (var x in row) if (row.hasOwnProperty(x)) {
        var sqm = row[x];
        var url = MapEditor.ImagesURL + sqm[0];
        html.push('<div class="sqm" data-x="' +x+ '" data-y="' +y+ '" data-item-id="' +sqm[0]+ '" style="background-image: url(' +url+ ');">');
        for(var id in sqm[1]) if (sqm[1].hasOwnProperty(id)) {
          var item = MapEditor.Items[sqm[1][id]];
          url = MapEditor.ImagesURL + item.Id;
          html.push('<div class="item" data-layer="' +item.Type+ '" data-item-id="' +item.Id+ '" data-item-size="' +item.Size+ '" style="background-image: url(' +url+ ');"></div>');
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
    $('.actual-item-image', document).html('<img src="assets/MapEditor/eraser.png"/>');
    $('.actual-item-details', document).html('Eraser');
    $('.item-select', document).removeClass('active');
  },

  drawOnSQM: function($sqm) {
    if(!MapEditor.SelectedItem) {
      return;
    }

    var url;
    // Grounds
    if(MapEditor.SelectedItem.Type == 1) {
      url = MapEditor.ImagesURL + MapEditor.SelectedItem.Id;
      $sqm.data('item-id', MapEditor.SelectedItem.Id);
      $sqm.css('background-image', 'url(' +url+ ')');
      return;
    }

    // Other layers
    var layer = MapEditor.SelectedItem.Type;
    url = MapEditor.ImagesURL + MapEditor.SelectedItem.Id;

    // TODO: ignore line below while holding "shift" key
    if(!MapEditor.ShiftDown) {
      $sqm.find('.item[data-layer="' +layer+ '"]').not($('#item-preview', document)).remove();
    }

    var item = '<div class="item" data-layer="' +layer+ '" data-item-id="' +MapEditor.SelectedItem.Id+ '" data-item-size="' +MapEditor.SelectedItem.Size+ '" style="background-image: url(' +url+ ');"></div>';
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

  updateLayersOpacity: function() {
    if(!MapEditor.LayersOpacity) {
      return;
    }
    var layer = $(this).val();
    $('div.item', document).each(function(){
      if($(this).data('layer') == layer) {
        $(this).css('opacity', 1);
      }
      else {
        $(this).css('opacity', MapEditor.InactiveLayersOpacity);
      }
    });
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
        url = 'assets/MapEditor/eraser.png';
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
      if(!(e.which == 1)) {
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