<html>
<head>
  <link rel="stylesheet" type="text/css" href="assets/ItemEditor.css" >
  <script src="assets/jquery/jquery-3.4.1.js"></script>
  <script src="assets/ItemEditor.js"></script>
</head>
<body>
<table cellspacing="0" cellpadding="0">
<tr>
  <td class="item-container">
    <div class="item-list"></div>
  </td>
  <td style="padding: 25px;">

    <div>
      <div class="form-label">Id</div>
      <div class="form-input"><input name="Id" type="text" disabled/></div>
    </div>

    <div>
      <div class="form-label">Name</div>
      <div class="form-input"><input name="Name" type="text"/></div>
    </div>

    <div>
      <div class="form-label">Item Type</div>
      <div class="form-input">
        <select name="ItemTypeId">
          <option value="1">Ground</option>
          <option value="2">Edge</option>
          <option value="3">Wall</option>
          <option value="4">Object</option>
          <option value="5">Ornament</option>
          <option value="6">Accessory</option>
        </select>
      </div>
    </div>

    <div>
      <div class="form-label">Slot</div>
      <div class="form-input">
        <select name="Slot">
          <option value=""></option>
          <option value="1">Helmet</option>
          <option value="2">Armor</option>
          <option value="3">Legs</option>
          <option value="4">Boots</option>
          <option value="5">Weapon</option>
          <option value="6">Shield</option>
          <option value="7">Amulet</option>
          <option value="8">Ring</option>
          <option value="9">Ammunition</option>
        </select>
      </div>
    </div>

    <div>
      <div class="form-label">Light Size</div>
      <div class="form-input"><input name="LightSize" type="number"/></div>
    </div>

    <div>
      <div class="form-label">Light Level</div>
      <div class="form-input"><input name="LightLevel" type="text"/></div>
    </div>

    <div>
      <div class="form-label">Light Color</div>
      <div class="form-input">
        <select name="LightColor">
          <option value=""></option>
          <option value="red">red</option>
          <option value="orange">orange</option>
          <option value="yellow">yellow</option>
          <option value="green">green</option>
          <option value="blue">blue</option>
          <option value="purple">purple</option>
        </select>
      </div>
    </div>

    <input id="save" type="button" value="Save"/>

  </td>

  <td style="padding: 25px;">
    <label><input name="IsAnimating" type="checkbox"/> Is Animating</label>
    <label><input name="IsBlocking" type="checkbox"/> Is Blocking</label>
    <label><input name="IsBlockingProjectiles" type="checkbox"/> Is Blocking Projectiles</label>
    <label><input name="IsBlockingItems" type="checkbox"/> Is Blocking Items</label>
    <label><input name="IsMoveable" type="checkbox"/> Is Moveable</label>
    <label><input name="IsPickupable" type="checkbox"/> Is Pickupable</label>
    <label><input name="IsStackable" type="checkbox"/> Is Stackable</label>
    <label><input name="IsAlwaysTop" type="checkbox"/> Is Always Top</label>
  </td>

</tr>
</table>


<script>
  $(document).ready(function() {
    ItemEditor.init();
  });
</script>

</body>
</html>
