// 
// Main Javascipt File
//

$(document).ready(function() {
  var canvas = $("#myCanvas");
  var context = canvas.get(0).getContext("2d");


  var players = [];

  /*
  //websockets
  var websocket = new WebSocket('ws://10.0.0.224:8080');

  //right now the messages sent are just player objects
  websocket.onmessage = function(event) {
    console.log("received message");
    var obj = JSON.parse(event.data);
    var inserted = false;
    // look through the players for stuff
    for (var i = 0; i < players.length; i++) {
      if (players[i].name = obj.name) {
        players[i] = obj;
        inserted = true;
        break;
      }
    }
    if (!inserted) {
      players.push(obj);
    }
  }
  */

  
  //canvas Dimensions
  var canvasWidth = canvas.width();
  var canvasHeight = canvas.height();

  $(window).resize(resizeCanvas);
  function resizeCanvas() {
    canvas.attr("width", $(window).get(0).innerWidth);
    canvas.attr("height", $(window).get(0).innerHeight);
    canvasWidth = canvas.width();
    canvasHeight = canvas.height();
  }
  resizeCanvas();

  //map dimmensions
  var mapWidth = canvasWidth;
  var mapHeight = canvasHeight;

  // Game settings
  var playGame;

  // Game UI
  var ui = $("#gameUI");
  var uiIntro = $("#gameIntro");
  var uiStats = $("#gameStats");
  var uiComplete = $("#gameComplete");
  var uiPlay = $("#gamePlay");
  var uiName = $("#gameName");
  var uiReset = $(".gameReset");
  var uiScore = $(".gameScore");

  // player rocket
  var player;

  var playerHeight = 22;
  var playerWidth = 24;
  var playerHalfHeight = playerHeight/2;
  var playerHalfWidth = playerWidth/2;

  var moveRight = false;
  var moveUp = false;
  var moveLeft = false;


  var Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.vX = 0;
    this.vY = 0;
    this.angle = 0;
    this.moveSpeed = 0.5;
    this.flameLength = 20;
    this.flames = false;
    this.name = "none";
  }

  var arrowUp = 38;
  var arrowRight = 39;
  var arrowLeft = 37;
  

  //Reset and start the game
  function startGame() {
    //Reset game stats
    uiScore.html("0");
    uiStats.show();
    //Set up initial game settings
    playGame = true;

    //set up player
    player = new Player(150, canvasHeight/2);
    player.name = uiName.get(0).value;

    $(window).keydown(function(e) {
      var keyCode = e.keyCode;

      if (keyCode == arrowRight) {
        moveRight = true;
      } else if (keyCode == arrowUp) {
        moveUp = true;
      } else if (keyCode == arrowLeft) {
        moveLeft = true;
      }
    });

    $(window).keyup(function(e) {
      var keyCode = e.keyCode;
      if (keyCode == arrowRight) {
        moveRight = false;
      } else if (keyCode == arrowUp) {
        moveUp = false;
      } else if (keyCode == arrowLeft) {
        moveLeft = false;
      }

    });

    // sever
    // websocket.send(JSON.stringify(player));
    // Start the animation loop
    loop();
  };

  //Initialize the game environment
  function init() {
    uiStats.hide();
    uiComplete.hide();

    uiPlay.click(function(e) {
      e.preventDefault();
      uiIntro.hide();
      startGame();
    });

    uiReset.click(function(e) {
      e.preventDefault();
      uiComplete.hide();
      $(window).unbind("keyup");
      $(window).unbind("keydown");
      startGame();
    });
  };

  function drawPlayer(player) {
    //Draw the player
    context.save();
    context.translate(player.x, player.y);
    context.rotate(player.angle);
    context.beginPath();
    context.moveTo(playerHalfHeight, 0);
    context.lineTo(-playerHalfHeight, -playerHalfWidth);
    context.lineTo(-playerHalfHeight, +playerHalfWidth);
    context.closePath();
    context.fill();
    //Draw the flames
    if (player.flames) {
      context.translate(-playerHalfHeight, 0);
      context.fillStyle = "orange";
      context.beginPath();
      context.moveTo(0,-5);
      context.lineTo(-player.flameLength, 0);
      context.lineTo(0,5);
      context.closePath();
      context.fill();
      player.flames = false;
    }
    context.restore();
  }
  function updatePlayer(player) {
    // velocity update
    player.x += player.vX;
    player.y += player.vY;

    // bounds checking
    if (player.x < 0) {
      player.x *= -1;
      player.vX *= -0.3;
    } else if (player.x > mapWidth) {
      player.x -= player.x - mapWidth;
      player.vX *= -0.3;
    }
    if (player.y < 0) {
      player.y *= -1;
      player.vY *= -0.3;
    } else if (player.y > mapHeight) {
      player.y -= player.y - mapHeight;
      player.vY *= -0.3;
    }
  }
 

  // main game loop
  function loop() {
    //clear
    context.clearRect(0, 0, canvasWidth, canvasHeight);

    if (playGame) {
      
      //movement update
      if (moveRight) {
        player.angle += .3;
      } else if (moveLeft) {
        player.angle -= .3;
      } else if (moveUp) {
        player.flames = true;
        player.vX += Math.cos(player.angle) * player.moveSpeed;
        player.vY += Math.sin(player.angle) * player.moveSpeed;
        if (player.flameLength == 20) {
          player.flameLength = 15;
        } else {
          player.flameLength = 20;
        }  
      }
      updatePlayer(player);

      // server updates
      /* if (moveRight || moveLeft || moveUp) {
        websocket.send(JSON.stringify(player));
      } */
      
      context.fillStyle = "rgb(255,0,0)";
      for (var i = 0; i < players.length; i++) {
        if (players[i].name == player.name) {
          break;
        }
        updatePlayer(players[i]);
        drawPlayer(players[i]);
      }
 
      context.fillStyle = "rgb(0,0,255)";
      drawPlayer(player);

     
      //start loop timer again in 33 milliseconds
      setTimeout(loop, 33);
    }
  }



  init();
});
