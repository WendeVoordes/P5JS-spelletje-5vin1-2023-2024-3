let playerLives = 2;

class Raster {
  constructor(r, k) {
    this.aantalRijen = r;
    this.aantalKolommen = k;
    this.celGrootte = null;
    this.orangeRegel = r ; 
  }

  berekenCelGrootte() {
    this.celGrootte = canvas.width / this.aantalKolommen;
  }


teken() {
  push();
  noFill();
  stroke('grey');
  for (var rij = 0; rij < this.aantalRijen; rij++) {
    for (var kolom = 0; kolom < this.aantalKolommen; kolom++) {
      if (rij === this.orangeRegel - 1 || kolom === this.orangeRegel + 5) {
        fill('orange');
      } else {
        noFill();
      }
      rect(kolom * this.celGrootte, rij * this.celGrootte, this.celGrootte, this.celGrootte);
    }
    }
  pop();
  }
}


class Bommen {
  constructor() {
    this.size = 55;
    this.speed = random(3, 7);
    this.image = creeperImage;
    this.direction = 1;
    this.toBeRemoved = false; 
    this.x = constrain(random(canvas.width / 2, canvas.width - this.size), 0, canvas.width - this.size);
    this.y = constrain(random(0, canvas.height - raster.celGrootte), 0, canvas.height - this.size);
    }


  beweeg() {
    this.y += this.speed * this.direction;
    if (this.y <= 0 || this.y >= canvas.height - raster.celGrootte) {
      this.direction *= -1;

     }
}

toon() {
  if (!this.toBeRemoved) {
    image(this.image, this.x, this.y, this.size, this.size);
  }
}
    wordtGeraakt(bommen){
     if (this.x == bommen.x && this.y == bommen.y) {
      return true;
    }
    else {
      return false;
    }
  }
}

let bommen = [];

class Apple {
  constructor() {
    this.size = raster.celGrootte;
    this.spawnRandomly();
    this.image = appleImage;
  }

  spawnRandomly() {
    this.x = floor(random(raster.aantalKolommen)) * this.size;
    this.y = floor(random(raster.aantalRijen)) * this.size;
  }

  toon() {
    image(appleImage, this.x, this.y, this.size, this.size);
  }
}

class Jos {
  constructor() {
    this.x = 400;
    this.y = 300;
    this.animatie = [];
    this.frameNummer =  3;
    this.stapGrootte = null;
    this.gehaald = false;
  }
  
  beweeg() {
    if (keyIsDown(65)) {
      this.x -= this.stapGrootte;
      this.frameNummer = 2;
    }
    if (keyIsDown(68)) {
      this.x += this.stapGrootte;
      this.frameNummer = 1;
    }
    if (keyIsDown(87)) {
      this.y -= this.stapGrootte;
      this.frameNummer = 4;
    }
    if (keyIsDown(83)) {
      this.y += this.stapGrootte;
      this.frameNummer = 5;
    }
    
    this.x = constrain(this.x,0,canvas.width);
    this.y = constrain(this.y,0,canvas.height - raster.celGrootte);
    
    if (this.x == canvas.width) {
      this.gehaald = true;
    }
  }
  
    wordtGeraakt(vijand) {
      if (this.x == vijand.x && this.y == vijand.y) {
        return true;
      }
      else {
        return false;
      }
    }
  
  
  toon() {
    image(this.animatie[this.frameNummer],this.x,this.y,raster.celGrootte,raster.celGrootte);
  }  
}
  

class Vijand {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.sprite = null;
    this.stapGrootte = null;
  }

  beweeg() {
    this.x += floor(random(-1,2))*this.stapGrootte;
    this.y += floor(random(-1,2))*this.stapGrootte;

    this.x = constrain(this.x,0,canvas.width - raster.celGrootte);
    this.y = constrain(this.y,0,canvas.height - raster.celGrootte);
  }
  
  toon() {
    image(this.sprite,this.x,this.y,raster.celGrootte,raster.celGrootte);
  }
}

function preload() {
  minecraft = loadImage("achtergrond.png");
  creeperImage = loadImage("creeper.png");
  appleImage = loadImage("images/sprites/goldenApple.png");
}


function setup() {
  canvas = createCanvas(900,600);
  canvas.parent();
  frameRate(10);
  textFont("Verdana");
  textSize(90);
  
  raster = new Raster(12,18);
  
  raster.berekenCelGrootte();
  
  
  eve = new Jos();
  eve.stapGrootte = 1*raster.celGrootte;
  for (var b = 0;b < 6;b++) {
    frameEve = loadImage("images/sprites/Eve100px/Eve_" + b + ".png");
    eve.animatie.push(frameEve);
  }
  
  alice = new Vijand(700,200);
  alice.stapGrootte = 1*eve.stapGrootte;
  alice.sprite = loadImage("zombie.png");

  bob = new Vijand(600,400);
  bob.stapGrootte = 1*eve.stapGrootte;
  bob.sprite = loadImage("Skeleton.jpg");  

    for (let i = 0; i < 5; i++) {
    bommen.push(new Bommen());
    }
   apple = new Apple();
    }
  

function displayLives() {
  fill('orange');
  textSize(24);
  textAlign(LEFT, TOP);
  text(`Levens: ${playerLives}`, 10, 10); 
}

function draw() {
  background(minecraft);
  displayLives();
  raster.teken();
  eve.beweeg();
  alice.beweeg();
  bob.beweeg();
  eve.toon();
  alice.toon();
  bob.toon();
  apple.toon();

  if (eve.wordtGeraakt(apple)) {
    playerLives++; // Increase the player's lives
    // Respawn the apple in a new random location
    apple.spawnRandomly();
  }
  
  if (eve.wordtGeraakt(alice) || eve.wordtGeraakt(bob) || eve.wordtGeraakt(bommen)) {
    playerLives --;}

  for (let i = 0; i < bommen.length; i++) {
    if (eve.wordtGeraakt(bommen[i])) {
      playerLives--; // Decrease the player's lives
    }
  }

  if (playerLives <= 0) {
    
    for (let i = 0; i < bommen.length; i++) {
        bommen[i].toBeRemoved = true; // Remove the bomb that was touched
      }
  
     noLoop();
    background('red');
   textSize(90);
    fill('white');
    textAlign(CENTER, CENTER); 
    text("Game Over", canvas.width / 2, canvas.height / 2);
    textSize(20);
    text("Druk op Enter om opnieuw te spelen", canvas.width / 2, canvas.height / 2 + 50);
document.addEventListener('keydown', function(event) {
  if (event.key === "Enter") {
    location.reload();
  }
});    
  }

  
if (eve.gehaald) {
    for (let i = 0; i < bommen.length; i++) {
      bommen[i].toBeRemoved = true;
    }
     noLoop();
    background('green');
     textSize(90);
       fill('white');
    textAlign(CENTER, CENTER); 
    text("Je hebt gewonnen!", canvas.width / 2, canvas.height / 2);
    fill('white');
      textSize(20);
    text("Druk op Enter om opnieuw te spelen", canvas.width / 2, canvas.height / 2 + 50);
document.addEventListener('keydown', function(event) {
  if (event.key === "Enter") {
    location.reload();
  }
});    
  }


  bommen = bommen.filter((bom) => !bom.toBeRemoved);

  for (let i = 0; i < bommen.length; i++) {
    bommen[i].move();
    bommen[i].show();
  }
}
