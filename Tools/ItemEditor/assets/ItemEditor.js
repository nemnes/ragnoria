var ItemEditor = {

  ImagesURL: 'http://root.localhost/ragnoria/Tools/Images/?nogif&id=',
  ItemsURL: 'items.json',
  Items: {},

  init: function() {
    ItemEditor.getItems();
    $('#save', document).on('click', function(){
      ItemEditor.save();
    });
  },

  getItems: function() {
    $.get(ItemEditor.ItemsURL + '?v=' + Date.now(), function(data) {
      ItemEditor.Items = data;
      ItemEditor.renderItemContainer();
    });
    $('input, select', document).on('change keydown keyup', function() {
      ItemEditor.refreshInputs();
    });
    ItemEditor.refreshInputs();
  },

  renderItemContainer: function () {
    for (var Id in ItemEditor.Items) if (ItemEditor.Items.hasOwnProperty(Id)) {
      var Item = ItemEditor.Items[Id];
      var html = [];
      html.push('<div class="item-select" data-item-layer="' + Item.ItemTypeId + '" data-item-id="' + Item.Id + '" data-item-name="' + Item.Name + '">');
      html.push('  <img src="' + ItemEditor.ImagesURL + Item.Id + '"/>');
      html.push('</div>');
      $('.item-list', document).append(html.join(''));
    }
    $('.item-select', document).on('click', function () {
      $('.item-select', document).removeClass('active');
      $(this).addClass('active');
      ItemEditor.selectItem($(this).data('item-id'));
    });
  },

  selectItem: function(id) {
    $.ajax({
      type: "GET",
      url: 'LoadItem.php',
      data: {id: id},
      success: function(response) {
        let Item = JSON.parse(response);
        $('[name="Id"]', document).val(Item.Id);
        $('[name="Name"]', document).val(Item.Name);
        $('[name="ItemTypeId"]', document).val(Item.ItemTypeId);
        $('[name="LightSize"]', document).val(Item.LightSize);
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
        ItemEditor.refreshInputs();
      }
    });
  },

  save: function() {
    $.ajax({
      type: "POST",
      url: 'SaveItem.php',
      data: {
        Id: $('[name="Id"]', document).val(),
        Name: $('[name="Name"]', document).val(),
        ItemTypeId: $('[name="ItemTypeId"]', document).val(),
        LightSize: $('[name="LightSize"]', document).val(),
        LightLevel: $('[name="LightLevel"]', document).val(),
        LightColor: $('[name="LightColor"]', document).val(),
        IsAnimating: $('[name="IsAnimating"]', document).prop('checked') ? '1' : '0',
        IsBlocking: $('[name="IsBlocking"]', document).prop('checked') ? '1' : '0',
        IsBlockingProjectiles: $('[name="IsBlockingProjectiles"]', document).prop('checked') ? '1' : '0',
        IsBlockingItems: $('[name="IsBlockingItems"]', document).prop('checked') ? '1' : '0',
        IsMoveable: $('[name="IsMoveable"]', document).prop('checked') ? '1' : '0',
        IsPickupable: $('[name="IsPickupable"]', document).prop('checked') ? '1' : '0',
        IsStackable: $('[name="IsStackable"]', document).prop('checked') ? '1' : '0',
        IsAlwaysTop: $('[name="IsAlwaysTop"]', document).prop('checked') ? '1' : '0'
      },
      success: function() {
        alert('saved');
      }
    });
  },

  refreshInputs: function() {
    if($('[name="ItemTypeId"]', document).val() === '6') {
      $('[name="Slot"]', document).removeAttr('disabled');
    }
    else {
      $('[name="Slot"]', document).val('').attr('disabled', 'disabled');
    }
    if($('[name="LightSize"]', document).val() > 0) {
      $('[name="LightLevel"]', document).removeAttr('disabled');
      $('[name="LightColor"]', document).removeAttr('disabled');
    }
    else {
      $('[name="LightLevel"]', document).val('').attr('disabled', 'disabled');
      $('[name="LightColor"]', document).val('').attr('disabled', 'disabled');
    }
  },

};