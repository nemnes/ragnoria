var Libs_Item = {
  Items: {},
  ItemsLoaded: 0,

  init: function() {
    $.get(Config.items + Date.now(), function(data) {
      Libs_Item.Items = data;
      for(let item in Libs_Item.Items) if(Libs_Item.Items.hasOwnProperty(item)) {
        Libs_Item.Items[item].Image = new Image;
        Libs_Item.Items[item].Image.src = Libs_Misc.getItemURL(Libs_Item.Items[item].Id);
        Libs_Item.Items[item].Image.onload = function(){
          Libs_Item.ItemsLoaded++;
          if(Libs_Item.ItemsLoaded === Object.keys(Libs_Item.Items).length) {
            Libs_Loader.reachedMilestone('Items');
          }
        };
      }
    });
  },
};