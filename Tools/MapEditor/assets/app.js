var App = {

  Tool: null, // 0 = pointer, 1 = brush, 2=eraser
  BrushSize: null,
  Sprites: {
    1: [],
    2: []
  },
  CustomSprites: {},

  Items: {},
  Area: {},
  Canvas: {
    General: null,
    Floor: {}
  },

  SelectedItem: null,
  SecondaryItem: null,
  HighlightedItem: null,

  ShiftDown: false,
  CursorPosition: {
    X: 0,
    Y: 0,
  },
  CurrentFloor: 0,
  MinFloor: -5,
  MaxFloor: 5,

  MapRangeX: {},
  MapRangeY: {},
  MapWidth: null,
  MapHeight: null,

  init: function() {
    App.MapRangeX = {From: 0, To: 49};
    App.MapRangeY = {From: 0, To: 49};
    App.MapWidth = App.MapRangeX.To - App.MapRangeX.From + 1;
    App.MapHeight = App.MapRangeY.To - App.MapRangeY.From + 1;
    App.Canvas.General = document.getElementById('map');
    App.Canvas.General.width = App.MapWidth*32 + ((App.MaxFloor - App.MinFloor) * 32);
    App.Canvas.General.height = App.MapHeight*32 + ((App.MaxFloor - App.MinFloor) * 32);
    App.loader();
  },

  loader: function() {
    typeof window.LoadingIndex == 'undefined' ? window.LoadingIndex = 1 : window.LoadingIndex++;
    let L = window.LoadingIndex;

    L === 1 && App.loadSprites();
    L === 2 && App.loadItems();
    L === 3 && App.renderItemContainer();
    L === 4 && App.setFloors();
    L === 5 && App.setArea();
    L === 6 && App.setKeyboardEvents();
    L === 7 && App.setMouseEvents();
    L === 8 && App.finishLoading();
  },

  finishLoading: function() {
    App.setTool('pointer');
    App.setBrushSize(1);
    App.selectItem(0);
    App.selectSecondaryItem(0);
    $('#loader', document).fadeOut('fast');
  },

  loadSprites: function() {
    // custom sprites (key = ItemId)
    App.CustomSprites[1] = new Image();
    App.CustomSprites[1].src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAACgSURBVHja7NexDYQwDIVh/6dUWYqBmCcDsQOz0D6aKwAlcAUOJ+F0kSz5i2NFDpLsyfWxh1fabgD3ckiiCgA0Z/8TA9oi0jFgckw+mFnJe0SqBY6LD6BW4dQKLtm4M/m4mC6bsEcVfgZ8O/bO5vvPdyAAAQhAAAIQgAAE4GwiUmuKcQUMjenVHSAJQCX3vQKOg2fv7xmv/x2vAAAA//8DAGqjLSbSL4WpAAAAAElFTkSuQmCC';

    App.CustomSprites[2] = new Image();
    App.CustomSprites[2].src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAACJSURBVHja7NfLCcNADITh+c125pK2DrfjW2qbXO14MRgiO5DRbUGgb18gYVtPxqSHo20XQPlx2GYIAKy1fseAt4h2yHgVVp8l9T2iDROXQsDZG9hFF18tvsg/+QsCCCCAAAIIIIAAAmhXe7h6wDzuXssBtgGsfu8V8Dmc3j2e8ffT8RsAAP//AwBIJSXFkHIFGAAAAABJRU5ErkJggg==';

    App.CustomSprites[3] = new Image();
    App.CustomSprites[3].src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAD4SURBVHja7JZNCsIwEIXfiOdw714tiGcQD+DClWJPILgWPUEFVy7EtXgGEardd9+LPBdtwf6IoW0MSB6EQBKGL29mQoQkTKoFw7IAFsA4QFv1oIjk+1WaaGGlICLFYyLNQFROwXoKAKAkJNod8L3s2vUez5tTPSdUAQDgG0Sl+lBNAUlgsMwujofpZnYAoLYa+AShvQ0f+2p7TTkgjosgjMy+hP3ZDovtuVkA5WrN9XuhI97luABJ0fkQiePicLmZcyBVr9vB87j6vQOpgjCqWaAklYaC5pMR6HtgHFYtbt0UlN4pudhPUlDKqqUI7Z/QAliAvwV4DQDz0aRH0DODTwAAAABJRU5ErkJggg==';

    let SpritesX1 = new Image();
    SpritesX1.src = Config.SpritesX1;
    SpritesX1.onload = function() {
      let i = 1;
      let canvasSpritesX1 = document.createElement("canvas");
      let ctx = canvasSpritesX1.getContext("2d");
      canvasSpritesX1.width = 32;
      canvasSpritesX1.height = 32;

      for(let y = 0; y < this.height; y=y+32) {
        for(let x = 0; x < this.width; x=x+32) {
          ctx.clearRect(0, 0, 32, 32);
          ctx.drawImage(SpritesX1, -x, -y);
          App.Sprites[1][i] = new Image();
          App.Sprites[1][i].src = canvasSpritesX1.toDataURL();
          i++;
        }
      }

      // and then load 2x
      let SpritesX2 = new Image();
      SpritesX2.src = Config.SpritesX2;
      SpritesX2.onload = function() {
        let i = 1;
        let canvasSpritesX2 = document.createElement("canvas");
        let ctx = canvasSpritesX2.getContext("2d");
        canvasSpritesX2.width = 64;
        canvasSpritesX2.height = 64;

        for(let y = 0; y < this.height; y=y+64) {
          for(let x = 0; x < this.width; x=x+64) {
            ctx.clearRect(0, 0, 64, 64);
            ctx.drawImage(SpritesX2, -x, -y);
            App.Sprites[2][i] = new Image();
            App.Sprites[2][i].src = canvasSpritesX2.toDataURL();
            i++;
          }
        }
        App.loader();
      };
    };
  },

  setTool: function(tool) {
    $('.menu-button', document).removeClass('active');
    App.HighlightedItem = null;
    if(tool === 'pointer') {
      App.Tool = 0;
    }
    if(tool === 'brush') {
      App.Tool = 1;
    }
    if(tool === 'eraser') {
      App.Tool = 2;
    }
    $('.menu-button[data-tool="' +tool+ '"]', document).addClass('active');
    App.render();
  },

  setBrushSize: function(size) {
    App.BrushSize = size;
    App.render();
  },

  loadItems: function() {
    $.get(Config.ItemsURL + '?v=' + Date.now(), function(data) {
      App.Items = data;
      App.loader();
    });
  },

  getItemSprite: function(Item) {
    if(Item.Sprites) {
      if(typeof App.CustomSprites[Item.Id] !== 'undefined') {
        return App.CustomSprites[Item.Id];
      }
      if(typeof Item.Sprites === 'string') {
        Item.Sprites = JSON.parse(Item.Sprites);
      }
      let spriteid = Item.Sprites.Stack1.Frame1;
      if(App.Sprites[Item.Size][spriteid]) {
        return App.Sprites[Item.Size][spriteid];
      }
    }
    return '';
  },

  renderItemContainer: function() {
    let html = [];
    for (let Id in App.Items) if (App.Items.hasOwnProperty(Id)) {
      let Item = App.Items[Id];
      let img = App.getItemSprite(Item);
      html = [];
      html.push('<div class="item-select" data-item-layer="' +Item.ItemTypeId+ '" data-item-id="' + Item.Id + '" data-item-name="' + Item.Name + '">');
      html.push('  <img src="' + img.src + '"/>');
      html.push('</div>');
      $('.item-list', document).append(html.join(''));
    }
    $('.item-select', document).on('click', function () {
      $('.item-select', document).removeClass('active');
      $(this).addClass('active');
      App.selectItem($(this).data('item-id'));
      App.setTool('brush');
    });
    $('.item-container', document).on('click mouseup mousedown mouseenter mouseout', function () {
      App.Dragging = false;
    });
    $('#Layer', document).on('change', App.resortItemContainer).trigger('change');
    App.loader();
  },

  resortItemContainer: function() {
    let searchVal = $('#Search', document).val().toLowerCase();
    let layer = $('#Layer', document).val();

    $('.item-select', document).hide();
    $('.item-select', document).each(function(){
      let itemLayer = $(this).data('item-layer');
      let itemName = $(this).data('item-name').toLowerCase();
      if(parseInt(itemLayer) === parseInt(layer)) {
        if(!searchVal || itemName.includes(searchVal)) {
          $(this).show();
        }
      }
    });
  },

  selectItem: function(id) {
    let Item = App.Items[id];
    if(!Item) return;
    App.SelectedItem = Item;
    $('.actual-item-image', document).html('<img src="' + App.getItemSprite(Item).src + '"/>');
    $('.actual-item-details', document).html(Item.Name + ' (' + Item.Id + ')');
  },

  selectSecondaryItem: function(id) {
    let Item = App.Items[id];
    if(!Item) return;
    App.SecondaryItem = Item;
    $('.secondary-item-image', document).html('<img src="' + App.getItemSprite(Item).src + '"/>');
  },

  setFloors: function() {
    for(let z = App.MinFloor; z <= App.MaxFloor; z++) {
      App.Canvas.Floor[z] = document.createElement('canvas');
      App.Canvas.Floor[z].width = App.MapWidth*32;
      App.Canvas.Floor[z].height = App.MapHeight*32;
    }
    App.loader();
  },

  setArea: function() {
    // setup area
    App.Area = {};
    for(let z = App.MinFloor; z <= App.MaxFloor;z++) {
      App.Area[z] = {};
      for(let y=App.MapRangeY.From;y<=App.MapRangeY.To;y++) {
        App.Area[z][y] = {};
        for(let x=App.MapRangeX.From;x<=App.MapRangeX.To;x++) {
          App.Area[z][y][x] = [];
        }
      }
    }
    // App.Area[0][5][5].push({Id: '4200', Quantity: '1',});
    App.loader();
  },

  setKeyboardEvents: function() {
    $(document).on("keydown", function(e) {
      if (e.keyCode === 107) {
        e.preventDefault();
        App.CurrentFloor = App.CurrentFloor + 1 > App.MaxFloor ? App.CurrentFloor : App.CurrentFloor+1;
        $('.pos-z', document).text('Z: ' +App.CurrentFloor);
        App.render();
      }
      if (e.keyCode === 109) {
        e.preventDefault();
        App.CurrentFloor = App.CurrentFloor - 1 < App.MinFloor ? App.CurrentFloor : App.CurrentFloor-1;
        $('.pos-z', document).text('Z: ' +App.CurrentFloor);
        App.render();
      }
      let $mapContainer = $(".map-container", document);
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
      if (e.keyCode === 88) {
        e.preventDefault();
        let SelectedItem = App.SelectedItem;
        let SecondaryItem = App.SecondaryItem;
        if(SecondaryItem) {
          App.selectItem(SecondaryItem.Id);
        }
        if(SelectedItem) {
          App.selectSecondaryItem(SelectedItem.Id);
        }
        $('#item-preview', document).remove();
        App.setTool('brush');
      }
      if (e.keyCode === 16) {
        e.preventDefault();
        App.ShiftDown = true;
        $('body').css('cursor', 'alias');
      }
      if (e.keyCode === 46) {
        if(App.HighlightedItem) {
          App.Area[App.HighlightedItem.Z][App.HighlightedItem.Y][App.HighlightedItem.X].pop();
          App.HighlightedItem = null;
          App.render();
        }
      }
    });
    $(document).on('keyup', function(e) {
      if (e.keyCode === 16) {
        e.preventDefault();
        App.ShiftDown = false;
        $('body').css('cursor', 'default');
      }
    });
    App.loader();
  },

  setMouseEvents: function() {
    $(document).on("mousedown mouseup click focus blur contextmenu mousewheel DOMMouseScroll wheel", function(e) {
      if (e.which === 3) {
        e.preventDefault();
        e.stopPropagation();
      }
    });

    $(document).on('mousedown', function(e) {
      App.Dragging = e.which === 1;
    });

    $(document).on('mouseup', function() {
      App.Dragging = false;
    });

    $('#map', document).on('mousemove', function(event){
      let bounds = event.target.getBoundingClientRect();
      let x = (parseInt((parseInt(event.clientX) - parseInt(bounds.left))/32)-(App.MaxFloor-App.CurrentFloor));
      let y = (parseInt((parseInt(event.clientY) - parseInt(bounds.top))/32)-(App.MaxFloor-App.CurrentFloor));
      x = App.MapRangeX.From + x;
      y = App.MapRangeY.From + y;
      x = x < App.MapRangeX.From ? App.MapRangeX.From : x;
      y = y < App.MapRangeY.From ? App.MapRangeY.From : y;
      x = x > App.MapRangeX.To ? App.MapRangeX.To : x;
      y = y > App.MapRangeY.To ? App.MapRangeY.To : y;
      if(App.CursorPosition.X !== x || App.CursorPosition.Y !== y) {
        App.CursorPosition = {X: x, Y: y};
        $('.pos-x', document).text('X: ' +x);
        $('.pos-y', document).text('Y: ' +y);
        $('.pos-z', document).text('Z: ' +App.CurrentFloor);
        if(App.Dragging) {
          if(App.Tool === 1 && App.BrushSize === 1) {
            App.drawOnSQM(App.CurrentFloor, App.CursorPosition.Y, App.CursorPosition.X);
          }
          if(App.Tool === 1 && App.BrushSize === 3) {
            App.drawOnSQM(App.CurrentFloor, App.CursorPosition.Y-1, App.CursorPosition.X-1);
            App.drawOnSQM(App.CurrentFloor, App.CursorPosition.Y-1, App.CursorPosition.X);
            App.drawOnSQM(App.CurrentFloor, App.CursorPosition.Y-1, App.CursorPosition.X+1);
            App.drawOnSQM(App.CurrentFloor, App.CursorPosition.Y, App.CursorPosition.X-1);
            App.drawOnSQM(App.CurrentFloor, App.CursorPosition.Y, App.CursorPosition.X);
            App.drawOnSQM(App.CurrentFloor, App.CursorPosition.Y, App.CursorPosition.X+1);
            App.drawOnSQM(App.CurrentFloor, App.CursorPosition.Y+1, App.CursorPosition.X-1);
            App.drawOnSQM(App.CurrentFloor, App.CursorPosition.Y+1, App.CursorPosition.X);
            App.drawOnSQM(App.CurrentFloor, App.CursorPosition.Y+1, App.CursorPosition.X+1);
          }
          if(App.Tool === 2 && App.BrushSize === 1) {
            App.clearOnSQM(App.CurrentFloor, App.CursorPosition.Y, App.CursorPosition.X);
          }
          if(App.Tool === 2 && App.BrushSize === 3) {
            App.clearOnSQM(App.CurrentFloor, App.CursorPosition.Y-1, App.CursorPosition.X-1, true);
            App.clearOnSQM(App.CurrentFloor, App.CursorPosition.Y-1, App.CursorPosition.X, true);
            App.clearOnSQM(App.CurrentFloor, App.CursorPosition.Y-1, App.CursorPosition.X+1, true);
            App.clearOnSQM(App.CurrentFloor, App.CursorPosition.Y, App.CursorPosition.X-1, true);
            App.clearOnSQM(App.CurrentFloor, App.CursorPosition.Y, App.CursorPosition.X, true);
            App.clearOnSQM(App.CurrentFloor, App.CursorPosition.Y, App.CursorPosition.X+1, true);
            App.clearOnSQM(App.CurrentFloor, App.CursorPosition.Y+1, App.CursorPosition.X-1, true);
            App.clearOnSQM(App.CurrentFloor, App.CursorPosition.Y+1, App.CursorPosition.X, true);
            App.clearOnSQM(App.CurrentFloor, App.CursorPosition.Y+1, App.CursorPosition.X+1, true);
          }
        }
        App.render();
      }
    });

    $('#map', document).on('mousedown', function(e) {
      if(e.which === 3) {
        App.setTool('pointer');
        App.highlightOnSQM(App.CurrentFloor, App.CursorPosition.Y, App.CursorPosition.X);
        return;
      }
      if(!(e.which === 1)) {
        return;
      }
      if(App.Tool === 1 && App.BrushSize === 1) {
        App.drawOnSQM(App.CurrentFloor, App.CursorPosition.Y, App.CursorPosition.X);
      }
      if(App.Tool === 1 && App.BrushSize === 3) {
        App.drawOnSQM(App.CurrentFloor, App.CursorPosition.Y-1, App.CursorPosition.X-1);
        App.drawOnSQM(App.CurrentFloor, App.CursorPosition.Y-1, App.CursorPosition.X);
        App.drawOnSQM(App.CurrentFloor, App.CursorPosition.Y-1, App.CursorPosition.X+1);
        App.drawOnSQM(App.CurrentFloor, App.CursorPosition.Y, App.CursorPosition.X-1);
        App.drawOnSQM(App.CurrentFloor, App.CursorPosition.Y, App.CursorPosition.X);
        App.drawOnSQM(App.CurrentFloor, App.CursorPosition.Y, App.CursorPosition.X+1);
        App.drawOnSQM(App.CurrentFloor, App.CursorPosition.Y+1, App.CursorPosition.X-1);
        App.drawOnSQM(App.CurrentFloor, App.CursorPosition.Y+1, App.CursorPosition.X);
        App.drawOnSQM(App.CurrentFloor, App.CursorPosition.Y+1, App.CursorPosition.X+1);
      }
      if(App.Tool === 0) {
        App.highlightOnSQM(App.CurrentFloor, App.CursorPosition.Y, App.CursorPosition.X);
      }
      if(App.Tool === 2 && App.BrushSize === 1) {
        App.clearOnSQM(App.CurrentFloor, App.CursorPosition.Y, App.CursorPosition.X);
      }
      if(App.Tool === 2 && App.BrushSize === 3) {
        App.clearOnSQM(App.CurrentFloor, App.CursorPosition.Y-1, App.CursorPosition.X-1, true);
        App.clearOnSQM(App.CurrentFloor, App.CursorPosition.Y-1, App.CursorPosition.X, true);
        App.clearOnSQM(App.CurrentFloor, App.CursorPosition.Y-1, App.CursorPosition.X+1, true);
        App.clearOnSQM(App.CurrentFloor, App.CursorPosition.Y, App.CursorPosition.X-1, true);
        App.clearOnSQM(App.CurrentFloor, App.CursorPosition.Y, App.CursorPosition.X, true);
        App.clearOnSQM(App.CurrentFloor, App.CursorPosition.Y, App.CursorPosition.X+1, true);
        App.clearOnSQM(App.CurrentFloor, App.CursorPosition.Y+1, App.CursorPosition.X-1, true);
        App.clearOnSQM(App.CurrentFloor, App.CursorPosition.Y+1, App.CursorPosition.X, true);
        App.clearOnSQM(App.CurrentFloor, App.CursorPosition.Y+1, App.CursorPosition.X+1, true);
      }
      App.render();
    });

    $('.menu-button[data-tool="pointer"]', document).on('click', function(){
      App.setTool('pointer');
    });
    $('.menu-button[data-tool="brush"]', document).on('click', function(){
      App.setTool('brush');
    });
    $('.menu-button[data-tool="eraser"]', document).on('click', function(){
      App.setTool('eraser');
    });
    $('#BrushSize', document).on('change', function(){
      App.setBrushSize(parseInt($(this).val()));
    });
    $('.menu-button[data-action="save"]', document).on('click', function(){
      App.save();
    });
    $('.menu-button[data-action="load"]', document).on('click', function(){
      $('#load-box', document).show();
    });
    $('#load', document).on('click', function(){
      let fromX = $('input[name="FromX"]', $('#load-box', document)).val();
      let fromY = $('input[name="FromY"]', $('#load-box', document)).val();
      App.load(fromX, fromY);
      $('#load-box', document).hide();
      $('#wait', document).show();
    });

    App.loader();
  },

  drawOnSQM: function(z,y,x) {
    if(!App.Area[z] || !App.Area[z][y] || !App.Area[z][y][x]) {
      return;
    }
    if(!App.SelectedItem || !(App.Tool === 1)) {
      return;
    }
    let drawn = false;

    // Map editor allows to draw only one item of type on each tile (unless its not a ground and "shift" is pressed)
    if(!App.ShiftDown) {
      for(let key in App.Area[z][y][x]) if (App.Area[z][y][x].hasOwnProperty(key)) {
        let itemId = App.Area[z][y][x][key].Id;
        let Item = App.Items[itemId];
        if(Item.ItemTypeId === App.SelectedItem.ItemTypeId) {
          if(!drawn) {
            App.Area[z][y][x][key] = {Id: App.SelectedItem.Id, Quantity: '1'};
            drawn = true;
          }
          else {
            App.Area[z][y][x].splice(key, 1);
          }
        }
      }
    }

    if(!drawn) {
      if(App.SelectedItem.ItemTypeId === '1') {
        App.Area[z][y][x].unshift({Id: App.SelectedItem.Id, Quantity: '1',});
      }
      else {
        App.Area[z][y][x].push({Id: App.SelectedItem.Id, Quantity: '1',});
      }
    }
  },

  clearOnSQM: function(z,y,x, hardClear = false) {
    if(!App.Area[z] || !App.Area[z][y] || !App.Area[z][y][x]) {
      return;
    }
    if(App.Area[z][y][x].length === 0) {
      return;
    }
    if(!(App.Tool === 2)) {
      return;
    }
    let item = App.Area[z][y][x][(App.Area[z][y][x].length-1)];
    console.log(App.Items[item.Id].ItemTypeId);
    if(!hardClear && App.Items[item.Id].ItemTypeId === '1') {
      return;
    }
    if(hardClear) {
      App.Area[z][y][x] = [];
    }
    else {
      App.Area[z][y][x].pop();
    }
  },

  highlightOnSQM: function(z,y,x) {
    if(!App.Area[z] || !App.Area[z][y] || !App.Area[z][y][x] || App.Area[z][y][x].length === 0) {
      return;
    }
    var item = App.Area[z][y][x].slice(-1)[0];
    App.HighlightedItem = {Item: App.Items[item.Id], X: x, Y: y, Z: z};
    App.render();
  },

  load: function(fromX, fromY) {
    fromX = parseInt(fromX);
    fromY = parseInt(fromY);
    let toX = fromX+49;
    let toY = fromY+49;

    $.ajax({
      type: "POST",
      url: 'load.php',
      data: {
        FromX: fromX,
        FromY: fromY,
        ToX: toX,
        ToY: toY,
      },
      success: function(data) {
        let area = JSON.parse(data);
        App.MapRangeX = {From: fromX, To: toX};
        App.MapRangeY = {From: fromY, To: toY};
        App.MapWidth = App.MapRangeX.To - App.MapRangeX.From + 1;
        App.MapHeight = App.MapRangeY.To - App.MapRangeY.From + 1;
        App.setArea();

        for(let z in area) if (area.hasOwnProperty(z)) {
          for(let y in area[z]) if (area[z].hasOwnProperty(y)) {
            for (let x in area[z][y]) if (area[z][y].hasOwnProperty(x)) {
              App.Area[z][y][x] = area[z][y][x];
            }
          }
        }
        App.render();

        $('#wait').fadeOut('fast');
      }
    });

  },

  save: function() {
    if(typeof App.MapRangeX.From == 'undefined' || typeof App.MapRangeX.To == 'undefined' || typeof App.MapRangeY.From == 'undefined' || typeof App.MapRangeX.To == 'undefined') {
      alert('undefined zone');
      return;
    }
    $('#wait').fadeIn('fast');
    $.ajax({
      type: "POST",
      url: 'save.php',
      data: {Area: JSON.stringify(App.Area)},
      success: function(data) {
        alert(data);
        $('#wait').fadeOut('fast');
      }
    });
  },

  render: function() {
    let CTX;
    for(let z = App.MinFloor; z <= App.MaxFloor;z++) {
      // do not render not visible floors!
      if(!(App.CurrentFloor - z < 5) || (App.CurrentFloor >= 0 && z < 0)) {
        continue;
      }

      CTX = App.Canvas.Floor[z].getContext('2d');
      CTX.clearRect(0, 0, App.MapWidth*32, App.MapHeight*32);
      CTX.globalAlpha = 0.50;
      CTX.fillStyle = "#000000";
      CTX.fillRect(0, 0, App.MapWidth*32, App.MapHeight*32);
      CTX.globalAlpha = 1;

      for(let y=App.MapRangeY.From; y <= App.MapRangeY.To; y++) {
        for(let x=App.MapRangeX.From; x <= App.MapRangeX.To; x++) {
          for(let stack in App.Area[z][y][x]) if(App.Area[z][y][x].hasOwnProperty(stack)) {
            let object = App.Area[z][y][x][stack];
            let Item = App.Items[object.Id];
            let drawX = x - App.MapRangeX.From;
            let drawY = y - App.MapRangeY.From;

            // if highlighted
            if(App.HighlightedItem && x == App.HighlightedItem.X && y == App.HighlightedItem.Y && z == App.HighlightedItem.Z && Item.Id == App.HighlightedItem.Item.Id && (parseInt(stack)+1) == App.Area[z][y][x].length) {
              CTX.drawImage(App.getItemSprite(Item), drawX*32 - (32*(Item.Size-1)) -6, drawY*32 - (32*(Item.Size-1))-6);
              CTX.globalCompositeOperation = 'lighter';
              CTX.drawImage(App.getItemSprite(Item), drawX*32 - (32*(Item.Size-1)) -6, drawY*32 - (32*(Item.Size-1))-6);
              CTX.globalCompositeOperation = 'source-over';
            }
            else {
              CTX.drawImage(App.getItemSprite(Item), drawX*32 - (32*(Item.Size-1)), drawY*32 - (32*(Item.Size-1)));
            }
          }
        }
      }

      // render cursor
      if(z === App.CurrentFloor) {
        let x = ((App.CursorPosition.X - App.MapRangeX.From)*32);
        let y = ((App.CursorPosition.Y - App.MapRangeY.From)*32);

        // tool pointer
        if(App.Tool === 0) {
          CTX.lineWidth = 1;
          CTX.strokeStyle = "#ffffff";
          CTX.strokeRect(x+0.5, y+0.5, 31, 31);
          CTX.strokeStyle = "#000000";
          CTX.strokeRect(x+1, y+1, 31, 31);
        }

        // tool brush/eraser
        if(App.Tool === 1 || App.Tool === 2) {

          if(App.BrushSize === 1) {
            if(App.Tool === 1 && App.SelectedItem) {
              CTX.drawImage(App.getItemSprite(App.SelectedItem), x - (32*(App.SelectedItem.Size-1)), y - (32*(App.SelectedItem.Size-1)));
            }
            CTX.lineWidth = 1;
            CTX.strokeStyle = App.Tool === 1 ? "#ffffff" : '#ff0000';
            CTX.strokeRect(x+0.5, y+0.5, 31, 31);
            CTX.strokeStyle = "#000000";
            CTX.strokeRect(x+1, y+1, 31, 31);
          }

          if(App.BrushSize === 3) {
            if(App.Tool === 1 && App.SelectedItem) {
              CTX.drawImage(App.getItemSprite(App.SelectedItem), x - (32*(App.SelectedItem.Size-1))-32, y - (32*(App.SelectedItem.Size-1))-32);
              CTX.drawImage(App.getItemSprite(App.SelectedItem), x - (32*(App.SelectedItem.Size-1)), y - (32*(App.SelectedItem.Size-1))-32);
              CTX.drawImage(App.getItemSprite(App.SelectedItem), x - (32*(App.SelectedItem.Size-1))+32, y - (32*(App.SelectedItem.Size-1))-32);
              CTX.drawImage(App.getItemSprite(App.SelectedItem), x - (32*(App.SelectedItem.Size-1))-32, y - (32*(App.SelectedItem.Size-1)));
              CTX.drawImage(App.getItemSprite(App.SelectedItem), x - (32*(App.SelectedItem.Size-1)), y - (32*(App.SelectedItem.Size-1)));
              CTX.drawImage(App.getItemSprite(App.SelectedItem), x - (32*(App.SelectedItem.Size-1))+32, y - (32*(App.SelectedItem.Size-1)));
              CTX.drawImage(App.getItemSprite(App.SelectedItem), x - (32*(App.SelectedItem.Size-1))-32, y - (32*(App.SelectedItem.Size-1))+32);
              CTX.drawImage(App.getItemSprite(App.SelectedItem), x - (32*(App.SelectedItem.Size-1)), y - (32*(App.SelectedItem.Size-1))+32);
              CTX.drawImage(App.getItemSprite(App.SelectedItem), x - (32*(App.SelectedItem.Size-1))+32, y - (32*(App.SelectedItem.Size-1))+32);
            }
            CTX.lineWidth = 1;
            CTX.strokeStyle = App.Tool === 1 ? "#ffffff" : '#ff0000';
            CTX.strokeRect(x-32+0.5, y-32+0.5, 31+64, 31+64);
            CTX.strokeStyle = "#000000";
            CTX.strokeRect(x-32+1, y-32+1, 31+64, 31+64);
          }

        }
      }

    }

    let margin = (App.MaxFloor - App.MinFloor) * 32;
    CTX = App.Canvas.General.getContext('2d');
    CTX.clearRect(0, 0, App.MapWidth*32 + margin, App.MapHeight*32 + margin);

    for(let z = App.MinFloor; z <= App.MaxFloor;z++) {
      // do not apply not visible floors!
      if(!(App.CurrentFloor - z >= 5) && !(App.CurrentFloor >= 0 && z < 0)) {
        CTX.drawImage(App.Canvas.Floor[z], margin, margin);
      }
      margin = margin-32;
      if(z === App.CurrentFloor) {
        break;
      }
    }
    document.getElementById('minimap').width = 150;
    document.getElementById('minimap').height = 150;
    CTX = document.getElementById('minimap').getContext('2d');
    CTX.drawImage(App.Canvas.Floor[App.CurrentFloor], 0, 0, 150, 150);
  },

};
