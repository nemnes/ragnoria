var Libs_Item = {
  Sprites: {
    1: {},
    2: {}
  },
  Items: {},
  ItemsLoaded: 0,

  init: function() {
    Libs_Item.loadItems();
    Libs_Item.loadSprites();
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
          Libs_Item.Sprites[1][i] = new Image();
          Libs_Item.Sprites[1][i].src = canvasSpritesX1.toDataURL();
          i++;
        }
      }
      Libs_Loader.reachedMilestone('Items1');
    };

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
          Libs_Item.Sprites[2][i] = new Image();
          Libs_Item.Sprites[2][i].src = canvasSpritesX2.toDataURL();
          i++;
        }
      }
      Libs_Loader.reachedMilestone('Items2');
    };

  },

  loadItems: function() {
    $.get(Config.items + Date.now(), function(data) {
      Libs_Item.Items = data;
      for(var i in Libs_Item.Items) if (Libs_Item.Items.hasOwnProperty(i)){
        Libs_Item.Items[i].Sprites = JSON.parse(Libs_Item.Items[i].Sprites);
      }
    });
  },

  getItemImage: function(Item, Quantity = 0) {
    var stack = 'Stack1';
    var frame = 'Frame1';

    if(Item.IsStackable) {
      stack = function(Quantity) {
        if(Quantity === 1) { return 'Stack1'; }
        if(Quantity === 2) { return 'Stack2'; }
        if(Quantity === 3) { return 'Stack3'; }
        if(Quantity === 4) { return 'Stack4'; }
        if(Quantity >= 5 && Quantity < 10) { return 'Stack5'; }
        if(Quantity >= 10 && Quantity < 25) { return 'Stack6'; }
        if(Quantity >= 25 && Quantity < 50) { return 'Stack7'; }
        if(Quantity >= 50) { return 'Stack8'; }
        return 'Stack1';
      }(Quantity);
    }
    if(Item.IsAnimating) {
      frame = 'Frame' + Libs_Board.AnimationFrame;
    }

    var spriteId = Item.Sprites[stack][frame];
    return Libs_Item.Sprites[Item.Size][spriteId];
  },

};