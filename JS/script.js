var canvas;
var canvasContext;
var ballX = 50, ballY=50, ballR=10;

var bar1Y=10;
var bar2Y=10;
var barW=5; barL=100;
var barP = 20; //bar padding
var c =0;

var showingWinner = false;

var ballSpeedX = 10;
var ballSpeedY = 5;
var barSpeed2Y = 6;

var score1 = 0; score2 = 0;
const winningScore = 3;

function calcMouse(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY
  };
}

window.onload = function () {

  canvas = document.getElementById('gameC');
  canvasContext = canvas.getContext('2d');

  var framesPerSecond = 30;

  setInterval(function () {
    update();
    draw();
  }, 1000/framesPerSecond);

  canvas.addEventListener('mousemove', function (evt) {
    var mousePos = calcMouse(evt);
    bar1Y = mousePos.y - barL/2;
    // bar2Y = mousePos.y - barL/2;
  });
}

function update () {

  if (showingWinner) {
    return;
  }

  computerMovement();

  // Updates position and speed of bars and balls
  if (ballX >= canvas.width-ballR) {
    score1++; // must be before reset for winning score if
    ballReset();
  }
  if ((ballX-ballR)<=0) {
    score2++; // must be before reset for winning score if
    ballReset();
  }
  if (ballY > bar1Y && ballY < bar1Y+barL-ballR && ballX-ballR <= barP+barW) {
    ballSpeedX=-ballSpeedX;
    var deltaY = ballY - bar1Y - barL/2;
    ballSpeedY = deltaY * .35;
  }
  if ((ballY > bar2Y) && (ballY < bar2Y+barL-ballR) && (ballX+ballR*2 >= canvas.width-barP-barW)) {
    ballSpeedX=-ballSpeedX;
    var deltaY = ballY - bar2Y - barL/2;
    ballSpeedY = deltaY * .4;
  }
  if (ballY >= canvas.height-ballR || (ballY-ballR)<=0) {
    ballSpeedY=-ballSpeedY;
  }

  ballX += ballSpeedX;
  ballY += ballSpeedY;
}

function draw () {
  // Resets screen and adds figures
  rect(0,0,canvas.width,canvas.height, 'black');

  if (showingWinner) {
    canvasContext.fillStyle = 'white';
    if (score1 >= winningScore) {
      canvasContext.fillText("Left player won!", 350, 200);
    }

    if (score2 >= winningScore) {
      canvasContext.fillText("Right player won!", 350, 200);
    }

    canvasContext.fillText("Click to continue",350,500);
    canvas.addEventListener('click', function () {
      score1 = 0;
      score2 = 0;
      showingWinner=false;
    });
    return;
  }

  drawNet();

  rect(barP,bar1Y,barW,barL, 'white'); // left paddle
  rect(canvas.width-barP-barW,bar2Y,barW,barL, 'white'); // right paddle

  ball(ballX, ballY, ballR, 'white');

  canvasContext.fillText(score1, canvas.width/2-100, 100);
  canvasContext.fillText(score2, canvas.width/2+100, 100);
}

function rect (x, y, w, h, c) {
  canvasContext.fillStyle = c;
  canvasContext.fillRect(x, y, w, h);
}

function ball (x, y, r, c) {
  canvasContext.fillStyle=c;
  canvasContext.beginPath();
  canvasContext.arc(x, y, r, 0, Math.PI*2, true);
  canvasContext.fill();
}

function ballReset() {

  if (score1 >= winningScore || score2 >= winningScore) {
    showingWinner = true;
  }

  var newSpeed = Math.round(Math.random()+1);

  if (newSpeed==2) {
    newSpeed = -1;
  }

  ballX = canvas.width/2-ballR/2;
  ballY = canvas.height/2-ballR/2;
  ballSpeedX=newSpeed*ballSpeedX;
  ballSpeedY = 0;
}

function computerMovement() {
  if (bar2Y+barL/2 < ballY - barL*.3) {
    bar2Y += barSpeed2Y;
  } else if (bar2Y+barL/2 > ballY - barL*.3) {
    bar2Y -= barSpeed2Y;
  }
}

function drawNet() {
  for (i=0; i<canvas.height; i+=40) {
    rect(canvas.width/2-1,i,2,20,'white');
  }
}
