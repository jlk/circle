import "./styles.css";

var canvas;
var ctx;
var width;
var height;
var pointSize = 1;

drawCircle(100);

function drawCircle(radius) {
  // allocate array?
  // build sqRoot lookup array
  var sqRoot = {};
  var x = 0;
  while (x < radius * radius) {
    sqRoot[x * x] = x;
    x = x + 0.1;
  }

  // iterate from 0 to radius
  // calculate y
  x = 0;
  initGraphics();
  var y = 0;
  while (x < radius) {
    x = x + 0.1;
    y = sqRoot(radius * radius - x * x);
    // optimization - refine x increment based on diff in y
    PlotPixel(x, y);
    console.log("points: " + x + ", " + y);
    // PlotPixel(-1 * x, y);
    // PlotPixel(-1 * x, -1 * y);
    // PlotPixel(x, -1 * y);
  }
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
