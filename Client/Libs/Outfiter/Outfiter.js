var Libs_Outfiter = {
  $: null,
  LookType: {
    'Base': 1,
    'Head': 0,
    'Body': 0,
    'Back': 0,
    'Hands': 0,
    'HeadColor': '#e66465',
    'PrimaryColor': '#e66465',
    'SecondaryColor': '#e66465',
    'DetailColor': '#e66465',
  },

  init: function() {
    var html = [];
    html.push('<div id="outfiter">');
    html.push('<div class="preview" style="background-image: url(' +App.getOutfitURL(Libs_Outfiter.LookType)+ ');"></div>');

    html.push('<hr/>');

    html.push('<input type="color" name="HeadColor" value="#e66465"/>');
    html.push('<input type="color" name="PrimaryColor" value="#e66465"/>');
    html.push('<input type="color" name="SecondaryColor" value="#e66465"/>');
    html.push('<input type="color" name="DetailColor" value="#e66465"/>');

    html.push('<hr/>');

    html.push('<label>Hair:</label>');
    html.push('<select name="Head">');
    html.push('<option value="0">-</option>');
    html.push('<option value="1">#1</option>');
    html.push('<option value="2">#2</option>');
    html.push('</select>');
    html.push('<br/>');

    html.push('<label>Body:</label>');
    html.push('<select name="Body">');
    html.push('<option value="0">-</option>');
    html.push('<option value="1">Armour</option>');
    html.push('</select>');
    html.push('<br/>');

    html.push('<label>Back:</label>');
    html.push('<select name="Back">');
    html.push('<option value="0">-</option>');
    html.push('<option value="1">Cape</option>');
    html.push('<option value="2">Sword</option>');
    html.push('</select>');
    html.push('<br/>');

    html.push('<label>Hands:</label>');
    html.push('<select name="Hands">');
    html.push('<option value="0">-</option>');
    html.push('<option value="1">Daggers</option>');
    html.push('</select>');

    html.push('<hr/>');

    html.push('<button name="Save" type="button">Save</button>');

    html.push('</div>');
    Libs_Outfiter.$ = $(html.join(''));
    $('body').append(Libs_Outfiter.$);

    $('input, select', Libs_Outfiter.$).on('change', function(){
      Libs_Outfiter.LookType = {
        'Base': 1,
        'Head': $('[name="Head"]', Libs_Outfiter.$).val(),
        'Body': $('[name="Body"]', Libs_Outfiter.$).val(),
        'Back': $('[name="Back"]', Libs_Outfiter.$).val(),
        'Hands': $('[name="Hands"]', Libs_Outfiter.$).val(),
        'HeadColor': $('[name="HeadColor"]', Libs_Outfiter.$).val(),
        'PrimaryColor': $('[name="PrimaryColor"]', Libs_Outfiter.$).val(),
        'SecondaryColor': $('[name="SecondaryColor"]', Libs_Outfiter.$).val(),
        'DetailColor': $('[name="DetailColor"]', Libs_Outfiter.$).val(),
      };
      var url = App.getOutfitURL(Libs_Outfiter.LookType);
      $('div.preview', Libs_Outfiter.$).css('background-image', 'url(' +url+ ')');
    });

    $('button[name="Save"]', Libs_Outfiter.$).on('click', function(){
      App.emit('SetOutfit', [Libs_Outfiter.LookType]);
      Libs_Misc.refresh();
    });

  },

  toggle: function() {
    if(Libs_Outfiter.$.is(":visible")) {
      Libs_Outfiter.hide();
    }
    else {
      Libs_Outfiter.show();
    }
  },

  show: function() {
    $('[name="Head"]', Libs_Outfiter.$).val(Libs_Outfiter.LookType.Head);
    $('[name="Body"]', Libs_Outfiter.$).val(Libs_Outfiter.LookType.Body);
    $('[name="Back"]', Libs_Outfiter.$).val(Libs_Outfiter.LookType.Back);
    $('[name="Hands"]', Libs_Outfiter.$).val(Libs_Outfiter.LookType.Hands);
    $('[name="HeadColor"]', Libs_Outfiter.$).val(Libs_Outfiter.LookType.HeadColor);
    $('[name="PrimaryColor"]', Libs_Outfiter.$).val(Libs_Outfiter.LookType.PrimaryColor);
    $('[name="SecondaryColor"]', Libs_Outfiter.$).val(Libs_Outfiter.LookType.SecondaryColor);
    $('[name="DetailColor"]', Libs_Outfiter.$).val(Libs_Outfiter.LookType.DetailColor);
    Libs_Outfiter.$.slideDown(200);
  },

  hide: function() {
    Libs_Outfiter.$.slideUp(200);
  },


}; 