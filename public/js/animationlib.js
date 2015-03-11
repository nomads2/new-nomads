// Animation functions generated from Animation Mockups (Illustrator)
// Returns follow orientation
function followOrientation(x1, y1, x2, y2, direction) {

  // Forward?
  if (direction == 1) {

    return slope(x1, y1, x2, y2);
  }
  else {

    return slope(x2, y2, x1, y1);
  }
}

// Returns a position along a cubic Bezier curve
function bezier(u, p0, p1, p2, p3) {

  return Math.pow(u, 3) * (p3 + 3 * (p1 - p2) - p0)
         + 3 * Math.pow(u, 2) * (p0 - 2 * p1 + p2)
         + 3 * u * (p1 - p0) + p0;
}

// Returns a position along a quadratic curve
function quadratic(u, p0, p1, p2) {

  u = Math.max(Math.min(1.0, u), 0.0);

  return Math.pow((1.0 - u), 2) * p0 +
         2 * u * (1.0 - u) * p1 +
         u * u * p2;
}

// Returns the slope between two points
function slope(x1, y1, x2, y2) {

  var dx = (x2 - x1);
  var dy = (y2 - y1);

  return Math.atan2(dy, dx);
}

// Penner timing functions
// Based on Robert Penner's easing equations: http://www.robertpenner.com/easing/
function linear(t) {
  return t;
}

function sineEaseIn(t) {
  return -Math.cos(t * (Math.PI/2)) + 1;
}

function sineEaseOut(t) {
  return Math.sin(t * (Math.PI/2));
}

function sineEaseInOut(t) {
  return -0.5 * (Math.cos(Math.PI * t) - 1);
}

function quintEaseIn(t) {
  return t * t * t * t * t;
}

function quintEaseOut(t) {
  t--;
  return t * t * t * t * t + 1;
}

function quintEaseInOut(t) {
  t /= 0.5;
  if (t < 1) { return 0.5 * t * t * t * t * t; }
  t -= 2;
  return 0.5 * (t * t * t * t * t + 2);
}

function quartEaseIn(t) {
  return t * t * t * t;
}

function quartEaseOut(t) {
  t--;
  return -(t * t * t * t - 1);
}

function quartEaseInOut(t) {
  t /= 0.5;
  if (t < 1) { return 0.5 * t * t * t * t; }
  t -= 2;
  return -0.5 * (t * t * t * t - 2);
}

function circEaseIn(t) {
  return -(Math.sqrt(1 - (t * t)) - 1);
}

function circEaseOut(t) {
  t--;
  return Math.sqrt(1 - (t * t));
}

function circEaseInOut(t) {
  t /= 0.5;
  if (t < 1) { return -0.5 * (Math.sqrt(1 - t * t) - 1); }
  t-= 2;
  return 0.5 * (Math.sqrt(1 - t * t) + 1);
}

function quadEaseIn(t) {
  return t * t;
}

function quadEaseOut(t) {
  return -1.0 * t * (t - 2.0);
}

function quadEaseInOut(t) {
  t /= 0.5;
  if (t < 1.0) {
    return 0.5 * t * t;
  }
  t--;
  return -0.5 * (t * (t - 2.0) - 1);
}

function cubicEaseIn(t) {
  return t * t * t;
}

function cubicEaseOut(t) {
  t--;
  return t * t * t + 1;
}

function cubicEaseInOut(t) {
  t /= 0.5;
  if (t < 1) { return 0.5 * t * t * t; }
  t -= 2;
  return 0.5 * (t * t * t + 2);
}

function bounceEaseOut(t) {
  if (t < (1.0 / 2.75)) {
    return (7.5625 * t * t);
  } else if (t < (2 / 2.75)) {
    t -= (1.5 / 2.75);
    return (7.5625 * t * t + 0.75);
  } else if (t < (2.5 / 2.75)) {
    t -= (2.25 / 2.75);
    return (7.5625 * t * t + 0.9375);
  } else {
    t -= (2.625 / 2.75);
    return (7.5625 * t * t + 0.984375);
  }
}

function bounceEaseIn(t) {
  return 1.0 - bounceEaseOut(1.0 - t);
}

function bounceEaseInOut(t) {
  if (t < 0.5) {
    return bounceEaseIn(t * 2.0) * 0.5;
  } else {
    return bounceEaseOut(t * 2.0 - 1.0) * 0.5 + 0.5;
  }
}

function expoEaseIn(t) {
  return (t == 0.0) ? 0.0 : Math.pow(2.0, 10.0 * (t - 1));
}

function expoEaseOut(t) {
  return (t == 1.0) ? 1.0 : -Math.pow(2.0, -10.0 * t) + 1.0;
}

function expoEaseInOut(t) {
  if (t == 0) {
    return 0.0;
  } else if (t == 1.0) {
    return 1.0;
  } else if ((t / 0.5) < 1.0) {
    t /= 0.5;
    return 0.5 * Math.pow(2.0, 10.0 * (t - 1));
  } else {
    t /= 0.5;
    return 0.5 * (-Math.pow(2.0, -10.0 * (t - 1)) + 2);
  }
}

// Other timing functions

function zeroStep(t) {
  return (t <= 0.0 ? 0.0 : 1.0);

}

function halfStep(t) {
  return (t < 0.5 ? 0.0 : 1.0);

}

function oneStep(t) {
  return (t >= 1.0 ? 1.0 : 0.0);
}

function random(t) {
  return Math.random();
}

function randomLimit(t) {
  return Math.random() * t;
}

function clockTick(t) {
  var steps = 60.0;
  return Math.floor(t * steps) / steps;
}