let table;
let bubbles = [];
let padding = 100;

function preload() {
  table = loadTable('https://docs.google.com/spreadsheets/d/e/2PACX-1vTvE21yVlpKEFkrZebNN-yhxDlwMMPte1eS7DyUjtwRf3Iywf4KAcKG22NmN00ZFsC-oudSKRx3gdA_/pub?output=csv', 'csv', 'header');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let row of table.rows) {
    let car = row.getString('Car');
    let topSpeed = row.getNum('Top Speed (mph)');
    let acceleration = row.getNum('0-60 mph (seconds)');
    let manufacturer = row.getString('Manufacturer');
    let diameter = map(topSpeed, 0, 350, 30, 250);
    let x, y;
    do {
      x = random(width);
      y = random(height);
    } while (isOverlapping(x, y, diameter));
    let bubble = new Bubble(x, y, diameter, car, topSpeed, acceleration, manufacturer);
    bubbles.push(bubble);
  }
}

function draw() {
  background(0);
  for (let bubble of bubbles) {
    bubble.crossfade();
    bubble.display();
    bubble.move(bubbles); 
  }
}

function isOverlapping(x, y, diameter) {
  for (let bubble of bubbles) {
    let d = dist(x, y, bubble.x, bubble.y);
    if (d < (diameter + bubble.diameter) / 2) {
      return true;
    }
  }
  return false;
}

class Bubble {
  constructor(x, y, diameter, car, topSpeed, acceleration, manufacturer) {
    this.x = x;
    this.y = y;
    this.diameter = diameter;
    this.car = car;
    this.topSpeed = topSpeed;
    this.acceleration = acceleration;
    this.manufacturer = manufacturer;
    this.fade = random(255);
    this.fadeStep = random(1, 5); 
    this.angle = random(TWO_PI);
    this.speed = random(0.2, 2); 
  }

  crossfade() {
    this.fade += this.fadeStep;
    if (this.fade >= 255 || this.fade <= 0) {
      this.fadeStep *= -1;
    }
  }

  display() {
    noStroke();
    fill(this.fade, 40, 225 - this.fade, 225);
    ellipse(this.x, this.y, this.diameter);
    textSize(15);
    textAlign(CENTER, CENTER);
    fill(255);
    textStyle(BOLD);
    text(this.car, this.x, this.y - 20);
    textStyle(NORMAL);
    textSize(12);
    text(`Top Speed: ${this.topSpeed} mph`, this.x, this.y + 20);
    text(`Acceleration: ${this.acceleration} sec`, this.x, this.y + 40);
    text(`Manufacturer: ${this.manufacturer}`, this.x, this.y);
  }

  move(allBubbles) {
    let dx = cos(this.angle) * this.speed;
    let dy = sin(this.angle) * this.speed;


    for (let other of allBubbles) {
      if (other !== this) {
        let d = dist(this.x + dx, this.y + dy, other.x, other.y);
        if (d < (this.diameter + other.diameter) / 2) {

          this.angle = random(TWO_PI);
          break; 
        }
      }
    }

    if (this.x - this.diameter / 2 <= 0 || this.x + this.diameter / 2 >= width) {
      this.angle = PI - this.angle;
    }

    if (this.y - this.diameter / 2 <= 0 || this.y + this.diameter / 2 >= height) {
      this.angle = -this.angle;
    }

    this.x += cos(this.angle) * this.speed;
    this.y += sin(this.angle) * this.speed;
  }
}
