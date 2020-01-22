var canvas;
var ctx;
var width;
var height;
var pointSize = 1;
var lookupResolution = 1;
var DEBUG = false;

drawCircle(200);

function drawCircle(radius) {
  // allocate array?
  // build sqRoot lookup array
  var sqRoot = {};
  var x = 0.0;
  var radiusSq = radius * radius;
  var t0 = performance.now();

  while (x < radius) {
    // Using Number.parseFloat().toFixed() to work around javascript's fp weakness.
    var xSquared = Number.parseFloat(x * x).toFixed(2);
    if (DEBUG === true) {
      console.log("sqRoot[" + xSquared + "] = " + x);
    }
    sqRoot[xSquared] = x;
    x = x + lookupResolution;
  }
  var t1 = performance.now();

  x = 0;
  initGraphics();
  ctx.fillStyle = "rgb(30, 30, 30)";
  PlotAxis();
  ctx.fillStyle = "rgb(255, 30, 30)";

  var y = 0;
  var lookupMisses = 0;
  var lookupHits = 0;

  while (x < radius) {
    var ySquared = Number.parseFloat(radiusSq - x * x).toFixed(2);
    // var ySquared = radiusSq - x * x;
    y = sqRoot[ySquared];
    if (y === undefined) {
      lookupMisses++;
    } else {
      lookupHits++;
    }
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
  var t2 = performance.now();
  console.log("done.");
  console.log("Buidling lookup table: " + (t1 - t0) + "ms");
  console.log("Rendering circle: " + (t2 - t1) + "ms");
  console.log("Lookup hits: " + lookupHits);
  console.log("Lookup misses: " + lookupMisses);
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
  ctx.beginPath();
  ctx.arc(x, y, pointSize, 0, 2 * Math.PI);
  ctx.fill();
}

function PlotAxis() {
  var x = 0;
  var y = height / 2;
  while (x < width) {
    PlotPixel(x, y);
    x++;
  }
  x = width / 2;
  y = 0;
  while (y < height) {
    PlotPixel(x, y);
    y++;
  }
}
