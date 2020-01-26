var canvas;
var ctx;
var width;
var height;
var pointSize = 1;
var DEBUG = true;
var SquareRootAccuracy = 0.001;
var SquareRootRecursionLimit = 5;
// Loopup array of square roots for integer values, should be sorted.
var roots = {};
var calcCounts = 0;
var sqrootCounts = 0;

// throw new Error("debugging!");

drawCircle(200);

function drawCircle(radius) {
  // allocate array?
  // build sqRoot lookup array
  // var sqRoot = {};
  var x = 0.0;
  var radiusSq = radius * radius;
  var sqRootTime = 0;
  var renderingTime = 0;
  var t0,
    t1 = 0;

  buildRootLookup(radius);

  x = 0;
  initGraphics();
  ctx.fillStyle = "rgb(30, 30, 30)";
  PlotAxis();
  ctx.fillStyle = "rgb(255, 30, 30)";

  var y = 0;
  var lookupMisses = 0;
  var lookupHits = 0;

  while (x < radius) {
    var ySquared = Number.parseFloat(radiusSq - x * x);
    t0 = performance.now();
    y = squareRoot(ySquared);
    t1 = performance.now();
    sqRootTime = sqRootTime + (t1 - t0);

    if (y === undefined) {
      misses++;
    } else {
      // optimization - refine x increment based on diff in y
      t0 = performance.now();
      PlotPixel(width / 2 + x, height / 2 + y);
      PlotPixel(width / 2 - x, height / 2 + y);
      PlotPixel(width / 2 - x, height / 2 - y);
      PlotPixel(width / 2 + x, height / 2 - y);
      t1 = performance.now();
      renderingTime = renderingTime + (t1 - t0);
    }
    x = x + 1;
  }

  console.log("done.");
  console.log("Square root calculation: " + sqRootTime + "ms");
  console.log("Rendering circle: " + renderingTime + "ms");
  console.log("Lookup misses: " + misses);
  console.log("Calls to squareRoot(): " + sqrootCounts);
  console.log("Calls to calcRoot(): " + calcCounts);
}

// Builds a lookup array of square roots for integer values up to value raduis
function buildRootLookup(radius) {
  var i = 0;
  while (i <= radius) {
    var square = Number.parseFloat(i * i);
    roots[square] = i;
    i++;
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

function squareRoot(value) {
  sqrootCounts++;
  // find closest squares
  if (value in roots) {
    if (DEBUG === true) {
      console.log("found hit for " + value);
    }
    return roots[value];
  }
  var lastValue = roots[0];
  // loop through squares until we find a value greater than what we're looking for
  // sort keys as we're adding new values to end of array, and js doesn't seem to have easy way to sort associative arrays...
  var keys = Object.keys(roots).sort(function(a, b) {
    return a - b;
  });

  var square = 0;
  for (var i = 0; i < keys.length; i++) {
    square = keys[i];
    if (square > value) {
      break;
    }
    lastValue = square;
  }

  var retValue = calcRoot(
    roots[lastValue],
    roots[square],
    value,
    SquareRootRecursionLimit
  );
  return retValue;
}

// Recursive funtion to attempt to calculate approximate square root within specified percentage
function calcRoot(lowerBound, upperBound, target, iteration) {
  calcCounts++;
  iteration--;
  // if we've hit our recursion limit, return lower bound.
  if (iteration === 0) {
    if (DEBUG === true) {
      console.log("Max iteration, returning " + lowerBound);
    }
    return lowerBound;
  }
  var root = upperBound - (upperBound - lowerBound) / 2;
  var rootSquared = root * root;
  var offset = Math.abs(rootSquared - target) / target;
  if (offset < SquareRootAccuracy) {
    if (DEBUG === true) {
      console.log("within accuracy " + offset);
    }
    return root;
  }
  if (rootSquared <= target) {
    return calcRoot(root, upperBound, target, iteration);
  } else {
    return calcRoot(lowerBound, root, target, iteration);
  }
}
