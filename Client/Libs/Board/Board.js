var Libs_Board = {

  Width: 33,
  Height: 19,
  Area: {},
  AreaStart: {X: null, Y: null},
  Players: {},

  canvasCTX: null,
  canvasScale: 2,
  canvasAntialiasing: false,

  FramerateLimit: 100,
  RenderingInProgress: false,
  RenderingStopped: false,
  FramesDropped: 0,
  FramesRendered: 0,

  init: function(area) {
    $('<canvas id="board" width="' +((Libs_Board.Width*32)*Libs_Board.canvasScale)+ 'px" height="' +((Libs_Board.Height*32)*Libs_Board.canvasScale)+ 'px"></canvas>').appendTo($('body'));
    Libs_Board.canvasCTX = document.getElementById("board").getContext("2d");
    Libs_Board.canvasCTX.scale(Libs_Board.canvasScale, Libs_Board.canvasScale);
    Libs_Board.canvasCTX.imageSmoothingEnabled = Libs_Board.canvasAntialiasing;

    Libs_Board.Area = area;
    Libs_Board.AreaStart.Y = parseInt(Object.keys(area)[0]);
    Libs_Board.AreaStart.X = parseInt(Object.keys(area[Libs_Board.AreaStart.Y])[0]);

    for(var item in Libs_Item) {
      Libs_Item[item].Image = new Image;
      Libs_Item[item].Image.src = Libs_Misc.getItemURL(Libs_Item[item].Id);
    }

    setInterval(function() {
      if(!Libs_Board.RenderingInProgress && !Libs_Board.RenderingStopped) {
        Libs_Board.render();
      }
      else {
        Libs_Board.FramesDropped++;
      }
    }, 1000/Libs_Board.FramerateLimit);

    setInterval(function() {
      Libs_Board.FramesRendered = 0;
    }, 1000);

  },

  render: function(){
    Libs_Board.RenderingInProgress = true;

    var TopMargin = Libs_Hero.getTopMargin();
    var LeftMargin = Libs_Hero.getLeftMargin();
    var X_SERVER;
    var Y_SERVER;
    var X_CLIENT;
    var Y_CLIENT;

    // iterate over area SQMs
    var areaIterations = 2;
    for(var areaIteration=1;areaIteration<=areaIterations;areaIteration++) {
      Y_CLIENT = 0;
      for(Y_SERVER in Libs_Board.Area) if (Libs_Board.Area.hasOwnProperty(Y_SERVER)) {
        X_CLIENT = 0;
        for (X_SERVER in Libs_Board.Area[Y_SERVER]) if (Libs_Board.Area[Y_SERVER].hasOwnProperty(X_SERVER)) {

          if(areaIteration === 1) {
            Libs_Board.renderFloor(X_CLIENT, Y_CLIENT, X_SERVER, Y_SERVER, TopMargin, LeftMargin);
          }
          if(areaIteration === 2) {
            Libs_Board.renderItems(X_CLIENT, Y_CLIENT, X_SERVER, Y_SERVER, TopMargin, LeftMargin);
            Libs_Board.renderHero(X_CLIENT, Y_CLIENT, X_SERVER, Y_SERVER, TopMargin, LeftMargin);
            Libs_Board.renderPlayers(X_CLIENT, Y_CLIENT, X_SERVER, Y_SERVER, TopMargin, LeftMargin);
            Libs_Board.renderItemsAlwaysTop(X_CLIENT, Y_CLIENT, X_SERVER, Y_SERVER, TopMargin, LeftMargin);
          }

          X_CLIENT++;
        }
        Y_CLIENT++;
      }
    }

    // iterate over players on map to get & render nicknames
    for(var playerId in Libs_Board.Players) if (Libs_Board.Players.hasOwnProperty(playerId)) {
      Libs_Board.renderNicknames(TopMargin, LeftMargin, Libs_Board.Players[playerId]);
    }

    // hero nickname always over other players nicknames
    Libs_Board.renderHeroNickname(TopMargin, LeftMargin, Libs_Hero);

    Libs_Board.RenderingInProgress = false;
    Libs_Board.FramesRendered++;
  },

  renderFloor: function(X_CLIENT, Y_CLIENT, X_SERVER, Y_SERVER, TopMargin, LeftMargin) {
    var SQM = Libs_Board.Area[Y_SERVER][X_SERVER];
    for(var stack in SQM) if (SQM.hasOwnProperty(stack)) {
      var Item = Libs_Item[SQM[stack]];
      if([1,2].includes(Item.ItemTypeId)) {
        Libs_Board.drawImage({
          Top: (Y_CLIENT * 32) - ((Item.Size * 32) - 32) + (TopMargin),
          Left: (X_CLIENT * 32) - ((Item.Size * 32) - 32) + (LeftMargin),
          Width: (Item.Size * 32),
          Height: (Item.Size * 32),
          LeftOffset: 0,
          TopOffset: 0,
          Image: Item.Image,
        });
      }
    }
  },

  renderHero: function(X_CLIENT, Y_CLIENT, X_SERVER, Y_SERVER, TopMargin, LeftMargin) {
    var X_HERO_VIRTUAL = Libs_Hero.X;
    var Y_HERO_VIRTUAL = Libs_Hero.Y;
    var X_CLIENT_VIRTUAL = X_CLIENT;
    var Y_CLIENT_VIRTUAL = Y_CLIENT;
    if(Libs_Hero.Animation.CurrentFrame > 16) {
      switch(Libs_Hero.Direction) {
        case 'North':
          Y_HERO_VIRTUAL--;
          Y_CLIENT_VIRTUAL++;
          break;
        case 'NorthEast':
          Y_HERO_VIRTUAL--;
          Y_CLIENT_VIRTUAL++;
          X_HERO_VIRTUAL++;
          X_CLIENT_VIRTUAL--;
          break;
        case 'NorthWest':
          Y_HERO_VIRTUAL--;
          Y_CLIENT_VIRTUAL++;
          X_HERO_VIRTUAL--;
          X_CLIENT_VIRTUAL++;
          break;
        case 'West':
          X_HERO_VIRTUAL--;
          X_CLIENT_VIRTUAL++;
          break;
        case 'East':
          X_HERO_VIRTUAL++;
          X_CLIENT_VIRTUAL--;
          break;
        case 'South':
          Y_HERO_VIRTUAL++;
          Y_CLIENT_VIRTUAL--;
          break;
        case 'SouthEast':
          X_HERO_VIRTUAL++;
          Y_HERO_VIRTUAL++;
          X_CLIENT_VIRTUAL--;
          Y_CLIENT_VIRTUAL--;
          break;
        case 'SouthWest':
          X_HERO_VIRTUAL--;
          Y_HERO_VIRTUAL++;
          X_CLIENT_VIRTUAL++;
          Y_CLIENT_VIRTUAL--;
          break;
      }
    }

    if(parseInt(Y_HERO_VIRTUAL) === parseInt(Y_SERVER) && parseInt(X_HERO_VIRTUAL) === parseInt(X_SERVER)) {
      Libs_Board.drawImage({
        Top: ((Y_CLIENT_VIRTUAL * 32) - 40),
        Left: ((X_CLIENT_VIRTUAL * 32) - 40),
        Width: 64,
        Height: 64,
        LeftOffset: Libs_Hero.getLeftOffset(),
        TopOffset: Libs_Hero.getTopOffset(),
        Image: Libs_Hero.Image
      });
    }
  },

  renderPlayers: function(X_CLIENT, Y_CLIENT, X_SERVER, Y_SERVER, TopMargin, LeftMargin) {
    for(var playerId in Libs_Board.Players) if (Libs_Board.Players.hasOwnProperty(playerId)) {
      var Player = Libs_Board.Players[playerId];

      // pretend player is on previous frame for first 16 frames of his walking animation to keep good layer order on board
      var X_PLAYER_VIRTUAL = Player.X;
      var Y_PLAYER_VIRTUAL = Player.Y;
      if(Player.Animation.Playing && Player.Animation.CurrentFrame < 16) {
        switch(Player.Direction) {
          case 'North':
            Y_PLAYER_VIRTUAL++;
            break;
          case 'South':
            Y_PLAYER_VIRTUAL--;
            break;
          case 'West':
            X_PLAYER_VIRTUAL++;
            break;
          case 'East':
            X_PLAYER_VIRTUAL--;
            break;
          case 'NorthEast':
            Y_PLAYER_VIRTUAL++;
            X_PLAYER_VIRTUAL--;
            break;
          case 'NorthWest':
            Y_PLAYER_VIRTUAL++;
            X_PLAYER_VIRTUAL++;
            break;
          case 'SouthEast':
            Y_PLAYER_VIRTUAL--;
            X_PLAYER_VIRTUAL--;
            break;
          case 'SouthWest':
            Y_PLAYER_VIRTUAL--;
            X_PLAYER_VIRTUAL++;
            break;
        }
      }

      if(parseInt(Y_PLAYER_VIRTUAL) === parseInt(Y_SERVER) && parseInt(X_PLAYER_VIRTUAL) === parseInt(X_SERVER)) {
        Libs_Board.drawImage({
          Top: ((Y_CLIENT * 32) - 40) + (TopMargin) + Libs_Player.getTopMargin(playerId),
          Left: ((X_CLIENT* 32) - 40) + (LeftMargin) + Libs_Player.getLeftMargin(playerId),
          Width: 64,
          Height: 64,
          LeftOffset: Libs_Player.getLeftOffset(playerId),
          TopOffset: Libs_Player.getTopOffset(playerId),
          Image: Player.Image
        });
      }
    }
  },

  renderItems: function(X_CLIENT, Y_CLIENT, X_SERVER, Y_SERVER, TopMargin, LeftMargin) {
    var SQM = Libs_Board.Area[Y_SERVER][X_SERVER];
    for(var stack in SQM) if (SQM.hasOwnProperty(stack)) {
      var Item = Libs_Item[SQM[stack]];
      if(Item.IsAlwaysTop) {
        continue;
      }
      if(!([1,2].includes(Item.ItemTypeId))) {
        Libs_Board.drawImage({
          Top: (Y_CLIENT * 32) - ((Item.Size * 32) - 32) + (TopMargin),
          Left: (X_CLIENT * 32) - ((Item.Size * 32) - 32) + (LeftMargin),
          Width: (Item.Size * 32),
          Height: (Item.Size * 32),
          LeftOffset: 0,
          TopOffset: 0,
          Image: Item.Image,
        });
      }
    }
  },

  renderItemsAlwaysTop: function(X_CLIENT, Y_CLIENT, X_SERVER, Y_SERVER, TopMargin, LeftMargin) {
    var SQM = Libs_Board.Area[Y_SERVER][X_SERVER];
    for(var stack in SQM) if (SQM.hasOwnProperty(stack)) {
      var Item = Libs_Item[SQM[stack]];
      if(!(Item.IsAlwaysTop)) {
        continue;
      }
      if(!([1,2].includes(Item.ItemTypeId))) {
        Libs_Board.drawImage({
          Top: (Y_CLIENT * 32) - ((Item.Size * 32) - 32) + (TopMargin),
          Left: (X_CLIENT * 32) - ((Item.Size * 32) - 32) + (LeftMargin),
          Width: (Item.Size * 32),
          Height: (Item.Size * 32),
          LeftOffset: 0,
          TopOffset: 0,
          Image: Item.Image,
        });
      }
    }
  },

  renderHeroNickname: function(TopMargin, LeftMargin, Player) {
    Libs_Board.drawText({
      Text: Player.Name,
      Font: "bold 6px Tahoma",
      Top: (Libs_Hero.Y - Libs_Board.AreaStart.Y) * 32 - 14,
      Left: (Libs_Hero.X - Libs_Board.AreaStart.X) * 32 + 4,
      Color: '#ffffff',
      Stroke: true,
      StrokeColor: '#000000',
      StrokeWidth: 2
    });
  },

  renderNicknames: function(TopMargin, LeftMargin, Player) {

    // If player is walking we have to pretend that he is still on previous SQM (for first 16 frames of animation) to keep good layer order
    var VirtualCoords = Libs_Board.getPlayerVirtualCoordinates(Player);

    Libs_Board.drawText({
      Text: Player.Name,
      Font: "bold 6px Tahoma",
      Top: (VirtualCoords.Y * 32) - 14 + (TopMargin) + Libs_Player.getTopMargin(Player.Id),
      Left: (VirtualCoords.X * 32) + 4 + (LeftMargin) + Libs_Player.getLeftMargin(Player.Id),
      Color: '#ffffff',
      Stroke: true,
      StrokeColor: '#000000',
      StrokeWidth: 2
    });
  },

  drawImage: function(params) {
    Libs_Board.canvasCTX.drawImage(params.Image, params.LeftOffset, params.TopOffset, params.Width, params.Height, params.Left, params.Top, params.Width, params.Height);
  },

  drawText: function(params) {
    Libs_Board.canvasCTX.font = params.Font;
    Libs_Board.canvasCTX.textAlign = "center";
    if(params.Stroke) {
      Libs_Board.canvasCTX.lineJoin="round";
      Libs_Board.canvasCTX.miterLimit=2;
      Libs_Board.canvasCTX.strokeStyle = params.StrokeColor;
      Libs_Board.canvasCTX.lineWidth = params.StrokeWidth;
      Libs_Board.canvasCTX.strokeText(params.Text, params.Left, params.Top);
    }
    Libs_Board.canvasCTX.fillStyle = params.Color;
    Libs_Board.canvasCTX.fillText(params.Text, params.Left, params.Top);
  },

  getPlayerVirtualCoordinates: function(Player) {
    var VirtualCoords = {
      X: Player.X - Libs_Board.AreaStart.X,
      Y: Player.Y - Libs_Board.AreaStart.Y
    };
    if(Player.Animation.Playing && Player.Animation.CurrentFrame < 16) {
      switch (Player.Direction) {
        case 'North':
          VirtualCoords.Y++;
          break;
        case 'South':
          VirtualCoords.Y--;
          break;
        case 'West':
          VirtualCoords.X++;
          break;
        case 'East':
          VirtualCoords.X--;
          break;
        case 'NorthEast':
          VirtualCoords.Y++;
          VirtualCoords.X--;
          break;
        case 'NorthWest':
          VirtualCoords.Y++;
          VirtualCoords.X++;
          break;
        case 'SouthEast':
          VirtualCoords.Y--;
          VirtualCoords.X--;
          break;
        case 'SouthWest':
          VirtualCoords.Y--;
          VirtualCoords.X++;
          break;
      }
    }
    return VirtualCoords;
  }


};