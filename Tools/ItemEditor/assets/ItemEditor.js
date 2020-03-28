/* Ragnoria Item Editor by Adam Lozynski */
var ItemEditor = {

  Items: {},
  Sprites: {
    1: {},
    2: {}
  },


  init: function() {
    ItemEditor.loadSprites();

    $('#save', document).on('click', function(){
      ItemEditor.save();
    });
    $('input, select', document).on('change keydown keyup', function() {
      ItemEditor.refreshInputs();
    });
    $('.sprite-box', document).on('click', function(){
      ItemEditor.showModal($(this));
    });
    ItemEditor.refreshInputs();

    document.addEventListener("keydown", function(e) {
      if (e.keyCode === 27) {
        e.preventDefault();
        $('.sprite-modal', document).remove();
      }
    });
  },

  getItems: function() {
    $.get(Config.ItemsURL + '?v=' + Date.now(), function(data) {
      ItemEditor.Items = data;
      ItemEditor.renderItemContainer();
    });
  },

  renderItemContainer: function () {
    $('.item-list', document).empty();
    let html;
    for (let Id in ItemEditor.Items) if (ItemEditor.Items.hasOwnProperty(Id)) {
      let Item = ItemEditor.Items[Id];
      let img = '';
      let paddings = (Item.PaddingX !== 0 || Item.PaddingY !== 0) ? 'true' : 'false';
      if(Item.Sprites) {
        Item.Sprites = JSON.parse(Item.Sprites);
        var spriteid = Item.Sprites.Stack1.Frame1;
        if(ItemEditor.Sprites[Item.Size][spriteid]) {
          img = ItemEditor.Sprites[Item.Size][spriteid].src;
        }
      }
      html = [];
      html.push('<div class="item-select" data-item-layer="' + Item.ItemTypeId + '" data-item-id="' + Item.Id + '" data-item-name="' + Item.Name + '" data-paddings="' + paddings + '">');
      html.push('  <img src="' +img+ '"/>');
      html.push('</div>');
      $('.item-list', document).append(html.join(''));
    }
    $('.item-select', document).on('click', function () {
      $('.item-select', document).removeClass('active');
      $(this).addClass('active');
      ItemEditor.selectItem($(this).data('item-id'));
    });

    html = [];
    html.push('<div class="item-add">');
    html.push('  <img src="assets/add.png"/>');
    html.push('</div>');
    $('.item-list', document).append(html.join(''));
    $('.item-add', document).on('click', function(){
      let id = prompt("Enter ID", "");
      if (id == null || id == "") {
        return;
      } else {
        $.ajax({
          type: "POST",
          url: 'save.php',
          data: {
            Id: id,
            Name: 'undefined',
            Size: '1',
            ItemTypeId: id.charAt(0),
            LightRadius: '0',
            LightLevel: '',
            LightColor: '',
            IsAnimating: '0',
            IsBlocking: '0',
            IsBlockingProjectiles: '0',
            IsBlockingItems: '0',
            IsMoveable: '0',
            IsPickupable: '0',
            IsStackable: '0',
            IsAlwaysTop: '0',
            PaddingX: '0',
            PaddingY: '0',
            Sprites: {Stack1: {Frame1: 0}}
          },
          success: function() {
            ItemEditor.getItems();
          }
        });
      }
    });
  },

  selectItem: function(id) {
    $.ajax({
      type: "GET",
      url: 'load.php',
      data: {id: id},
      success: function(response) {
        let Item = JSON.parse(response);
        $('[name="Id"]', document).val(Item.Id);
        $('[name="Name"]', document).val(Item.Name);
        $('[name="Size"]', document).val(Item.Size);
        $('[name="Altitude"]', document).val(Item.Altitude);
        $('[name="ItemTypeId"]', document).val(Item.ItemTypeId);
        $('[name="LightRadius"]', document).val(Item.LightRadius);
        $('[name="LightLevel"]', document).val(Item.LightLevel);
        $('[name="LightColor"]', document).val(Item.LightColor);
        $('[name="IsAnimating"]', document).prop('checked', Item.IsAnimating === '1');
        $('[name="IsBlocking"]', document).prop('checked', Item.IsBlocking === '1');
        $('[name="IsBlockingProjectiles"]', document).prop('checked', Item.IsBlockingProjectiles === '1');
        $('[name="IsBlockingItems"]', document).prop('checked', Item.IsBlockingItems === '1');
        $('[name="IsMoveable"]', document).prop('checked', Item.IsMoveable === '1');
        $('[name="IsPickupable"]', document).prop('checked', Item.IsPickupable === '1');
        $('[name="IsStackable"]', document).prop('checked', Item.IsStackable === '1');
        $('[name="IsAlwaysTop"]', document).prop('checked', Item.IsAlwaysTop === '1');
        $('[name="PaddingX"]', document).val(Item.PaddingX);
        $('[name="PaddingY"]', document).val(Item.PaddingY);
        $('.sprite-box', document).attr('data-sprite-id', '').css('background-image', 'none');
        if(Item.Sprites) {
          Item.Sprites = JSON.parse(Item.Sprites);
          for(var stack in Item.Sprites) if (Item.Sprites.hasOwnProperty(stack)) {
            for(var frame in Item.Sprites[stack]) if (Item.Sprites[stack].hasOwnProperty(frame)) {
              var stackId = stack.split('Stack').join('');
              var frameId = frame.split('Frame').join('');
              var spriteId = Item.Sprites[stack][frame];
              var $sprBox = $('[data-stack="' +stackId+ '"][data-animation-frame="' +frameId+ '"]', document);
              if(ItemEditor.Sprites[Item.Size][spriteId]) {
                var img = ItemEditor.Sprites[Item.Size][spriteId].src;
                $sprBox.attr('data-sprite-id', spriteId);
                $sprBox.css('background-image', 'url(' +img+ ')');
              }
            }
          }
        }
        ItemEditor.refreshInputs();
      }
    });
  },

  save: function() {
    $.ajax({
      type: "POST",
      url: 'save.php',
      data: {
        Id: $('[name="Id"]', document).val(),
        Name: $('[name="Name"]', document).val(),
        ItemTypeId: $('[name="ItemTypeId"]', document).val(),
        Size: $('[name="Size"]', document).val(),
        Altitude: $('[name="Altitude"]', document).val(),
        LightRadius: $('[name="LightRadius"]', document).val(),
        LightLevel: $('[name="LightLevel"]', document).val(),
        LightColor: $('[name="LightColor"]', document).val(),
        IsAnimating: $('[name="IsAnimating"]', document).prop('checked') ? '1' : '0',
        IsBlocking: $('[name="IsBlocking"]', document).prop('checked') ? '1' : '0',
        IsBlockingProjectiles: $('[name="IsBlockingProjectiles"]', document).prop('checked') ? '1' : '0',
        IsBlockingItems: $('[name="IsBlockingItems"]', document).prop('checked') ? '1' : '0',
        IsMoveable: $('[name="IsMoveable"]', document).prop('checked') ? '1' : '0',
        IsPickupable: $('[name="IsPickupable"]', document).prop('checked') ? '1' : '0',
        IsStackable: $('[name="IsStackable"]', document).prop('checked') ? '1' : '0',
        IsAlwaysTop: $('[name="IsAlwaysTop"]', document).prop('checked') ? '1' : '0',
        PaddingX: $('[name="PaddingX"]', document).val(),
        PaddingY: $('[name="PaddingY"]', document).val(),
        Sprites: ItemEditor.getObjectSprites()
      },
      success: function() {
        var spriteId = $('[data-stack="1"][data-animation-frame="1"]', document).attr('data-sprite-id');
        var size = $('[name="Size"]', document).val();
        $('.item-select.active img', document).attr('src', ItemEditor.Sprites[size][spriteId].src);
        alert('saved');
      }
    });
  },

  getObjectSprites: function() {
    var Sprites = {};

    var loopStackFrames = $('[name="IsStackable"]', document).prop('checked');
    var loopAnimationFrames = $('[name="IsAnimating"]', document).prop('checked');
    var stack, frame;

    if(loopStackFrames && loopAnimationFrames) {
      for(stack = 1;stack<=8;stack++) {
        for(frame = 1;frame<=4;frame++) {
          Sprites['Stack' +stack] = Sprites['Stack' +stack] || {};
          Sprites['Stack' +stack]['Frame' +frame] = ItemEditor.getObjectSprite(stack,frame);
        }
      }
      return Sprites;
    }

    if(loopStackFrames) {
      for(stack = 1;stack<=8;stack++) {
        Sprites['Stack' +stack] = Sprites['Stack' +stack] || {};
        Sprites['Stack' +stack]['Frame1'] = ItemEditor.getObjectSprite(stack,1);
      }
      return Sprites;
    }

    if(loopAnimationFrames) {
      for(frame = 1;frame<=4;frame++) {
        Sprites['Stack1'] = Sprites['Stack1'] || {};
        Sprites['Stack1']['Frame' +frame] = ItemEditor.getObjectSprite(1,frame);
      }
      return Sprites;
    }

    Sprites['Stack1'] = {};
    Sprites['Stack1']['Frame1'] = ItemEditor.getObjectSprite(1,1);
    return Sprites;
  },

  getObjectSprite(stack, frame) {
    let sprite = $('[data-stack="' +stack+ '"][data-animation-frame="' +frame+ '"]', document).attr('data-sprite-id');
    sprite = parseInt(sprite) || 0;
    return sprite;
  },

  refreshInputs: function() {
    if($('[name="ItemTypeId"]', document).val() === '8') {
      $('[name="Slot"]', document).removeAttr('disabled');
    }
    else {
      $('[name="Slot"]', document).val('').attr('disabled', 'disabled');
    }
    if($('[name="LightRadius"]', document).val() > 0) {
      $('[name="LightLevel"]', document).removeAttr('disabled');
      $('[name="LightColor"]', document).removeAttr('disabled');
    }
    else {
      $('[name="LightLevel"]', document).val('').attr('disabled', 'disabled');
      $('[name="LightColor"]', document).val('').attr('disabled', 'disabled');
    }
    if($('[name="IsStackable"]', document).prop('checked')) {
      $('[data-stack="2"], [data-stack="3"], [data-stack="4"], [data-stack="5"], [data-stack="6"], [data-stack="7"], [data-stack="8"]', document).show();
      $('.stack-label-1, .stack-label-2, .stack-label-3, .stack-label-4, .stack-label-5, .stack-label-6, .stack-label-7, .stack-label-8', document).show();
    }
    else {
      $('[data-stack="2"], [data-stack="3"], [data-stack="4"], [data-stack="5"], [data-stack="6"], [data-stack="7"], [data-stack="8"]', document).hide();
      $('.stack-label-1, .stack-label-2, .stack-label-3, .stack-label-4, .stack-label-5, .stack-label-6, .stack-label-7, .stack-label-8', document).hide();
    }

    if($('[name="IsAnimating"]', document).prop('checked')) {
      if($('[name="IsStackable"]', document).prop('checked')) {
        $('[data-animation-frame="2"], [data-animation-frame="3"], [data-animation-frame="4"]', document).show();
      }
      else {
        $('[data-stack="1"][data-animation-frame="2"], [data-stack="1"][data-animation-frame="3"], [data-stack="1"][data-animation-frame="4"]', document).show();
      }
    }
    else {
      $('[data-animation-frame="2"], [data-animation-frame="3"], [data-animation-frame="4"]', document).hide();
    }
  },

  loadSprites: function() {
    let SpritesX1 = new Image();
    SpritesX1.crossOrigin = "anonymous";
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
          ItemEditor.Sprites[1][i] = new Image();
          ItemEditor.Sprites[1][i].src = canvasSpritesX1.toDataURL();
          i++;
        }
      }

      // and then load 2x
      let SpritesX2 = new Image();
      SpritesX2.crossOrigin = "anonymous";
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
            ItemEditor.Sprites[2][i] = new Image();
            ItemEditor.Sprites[2][i].src = canvasSpritesX2.toDataURL();
            i++;
          }
        }

        // and then get items
        ItemEditor.getItems();
      };
    };


  },

  showModal: function($selector) {
    $('.sprite-modal', document).remove();
    let stack = $selector.data('stack');
    let frame = $selector.data('animation-frame');
    let size = $('[name="Size"]', document).val();

    let $modal = $('<div class="sprite-modal x'+size+'"/>');
    let $div;

    if(size === '1') {
      for(let i in ItemEditor.Sprites[1]) if (ItemEditor.Sprites[1].hasOwnProperty(i)) {
        $div = $('<div data-sprite-id="' +i+ '" class="sprite"></div>');
        $div.append(ItemEditor.Sprites[1][i]);
        $modal.append($div);
      }
    }
    if(size === '2') {
      for(let i in ItemEditor.Sprites[2]) if (ItemEditor.Sprites[2].hasOwnProperty(i)) {
        $div = $('<div data-sprite-id="' +i+ '" class="sprite"></div>');
        $div.append(ItemEditor.Sprites[2][i]);
        $modal.append($div);
      }
    }
    $('body').append($modal);
    $('.sprite', $('.sprite-modal', document)).unbind().on('click', function(){
      $selector.attr('data-sprite-id', $(this).attr('data-sprite-id'));
      var src = $('img', $(this)).attr('src');
      $selector.css('background-image', 'url(' +src+ ')');
      $('.sprite-modal', document).remove();
    });
  },

};