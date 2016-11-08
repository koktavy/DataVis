/* DataVisualization version 1 in progress 11-8-16 by Tavius Koktavy for David Rios' "Creative Computing" - NYU Tisch Fall 2016.
   This program takes data from the Open-Notify APIData to display the location of the International Space Station relative
   to Earth as a 3D modeling test.
*/

var angleE = 0;
var angleISS = 0;
var issImg;
var issMask;
var stars = [];
var light = new p5.Vector(300, -150, -300);

var url = 'http://api.open-notify.org/iss-now.json';
var issData;
var issLong;
var issLat;
var issZ;
var long;
var lat;

function preload() {
  earthImg = loadImage("assets/earth.png");
  issImg = loadImage("assets/iss.png");
  issMask = loadImage("assets/issMask.png");
}

function setup() {
  issImg.mask(issMask);
  createCanvas(400, 400, WEBGL);
  setInterval(findISS, 1000);
  
  for(var i = 0; i < 50; i++) { // Loop over and make a new star object
    stars[i] = new Star(random(-1000, 1000), random(-1000, 1000), random(-1000, 1000), random(1, 3));
  }
}

function draw(){
  background(0);
  // translate(-width/2, -height/2, 0); // Shifts the origin coordinate for drawing to top-left coords.
  pointLight(250, 250, 250, -25, 15, 400);
  
  console.log("Long input " +long);
  console.log("X coord: " + issLong);
  console.log("Z coord: " + issZ);
  
  push();
  translate(0, 0, (mouseY/2 - 20)); // Zooms everything relative to mouseY
  rotateY(radians(angleE)); // Sets the new rotation
  angleE += 0.2;
  texture(earthImg);
  sphere(45, 100, 100);
  
  // Draw the stars
  for (var i = 0; i < stars.length; i++) {
    push();
    translate(0, 0, 0);
    stars[i].render();
    pop();
  }
  
  translate(issLong, issLat, issZ); // Location for ISS, z = 80 at default 180 longitude
  //rotateX(radians(angle)); // Rotating as is skewered along the x-axis
  //rotateX(radians(angleISS));
  //rotateY(radians(angleISS));
  //rotateZ(radians(angleISS));
  texture(issImg);
  plane(30, 15);

  angleISS += 0.5;
  //rotateX(radians(mouseX/(2*PI)));
  pop();
  
}


// Star contructor
function Star(x, y, z, size) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.size = size;
  
  this.render = function() {
        translate(this.x, this.y, this.z);
        fill(255);
        sphere(this.size);
      }
}



function getData(data) {
  issData = data;
  lat = data.iss_position.latitude;
  long = data.iss_position.longitude;
  issLat = map(lat, -90, 90, 45, -45); // NOTE: Up is negative Y
  
  // X-mapping
  if (long < -90) {
    issLong = map(long, -180, -90, 0, 80); // At 0, x should be 0 and z should be 80
  }
  if (-90 < long < 0) {
    issLong = map(long, -90, 0, 80, 0); // At 0, x should be 0 and z should be 80
  }
  if (0 < long < 90) {
    issLong = map(long, 0, 90, 0, -80); // At 0, x should be 0 and z should be 80
  }
  if (90 < long) {
    issLong = map(long, 90, 180, -80, 0); // At 0, x should be 0 and z should be 80
  }
  
  // Z-mapping
  if (long < -90) {
    issZ = map(long, -180, -90, 80, 0); // At 0, x should be 0 and z should be 80
  }
  if (-90 < long < 0) {
    issZ = map(long, -90, 0, 0, -80); // At 0, x should be 0 and z should be 80
  }
  if (0 < long < 90) {
    issZ = map(long, 0, 90, -80, 0); // At 0, x should be 0 and z should be 80
  }
  if (90 < long) {
    issZ = map(long, 90, 180, 0, 80); // At 0, x should be 0 and z should be 80
  }
}



function findISS() {
  loadJSON(url, getData);
}
