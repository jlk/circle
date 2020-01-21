var canvas;
var ctx;
var width;
var height;
var pointSize = 1;
var lookupResolution = 0.01;
var DEBUG = false;

drawCircle(100);

function drawCircle(radius) {
  // allocate array?
  // build sqRoot lookup array
  var sqRoot = {};
  var x = 0.0;
  var radiusSq = radius * radius;
  while (x < radius) {
    // Using Number.parseFloat().toFixed() to work around javascript's fp weakness.
    var xSquared = Number.parseFloat(x * x).toFixed(2);
    if (DEBUG === true) {
      console.log("sqRoot[" + xSquared + "] = " + x);
    }
    sqRoot[xSquared] = x;
    x = x + lookupResolution;
  }

  x = 0;
  initGraphics();

  var y = 0;
  while (x < radius) {
    var ySquared = Number.parseFloat(radiusSq - x * x).toFixed(2);
    // var ySquared = radiusSq - x * x;
    y = sqRoot[ySquared];
    if (DEBUG === true) {
      console.log("looking for sqRoot[" + ySquared + ": " + y);
    }
    // optimization - refine x increment based on diff in y
    PlotPixel(width / 2 + x, height / 2 + y);
    PlotPixel(width / 2 - x, height / 2 + y);
    PlotPixel(width / 2 - x, height / 2 - y);
    PlotPixel(width / 2 + x, height / 2 - y);
    x = x + 0.1;
  }
  console.log("done.");
}

// initGraphics and PlotPixel based on https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Drawing_graphics
function initGraphics() {
  canvas = document.querySelector(".circleExample");
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  ctx = canvas.getContext("2d");
  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.fillRect(0, 0, width, height);
}

function PlotPixel(x, y) {
  ctx.fillStyle = "rgb(255, 0, 0)";
  ctx.beginPath();
  ctx.arc(x, y, pointSize, 0, 2 * Math.PI);
  ctx.fill();
}
