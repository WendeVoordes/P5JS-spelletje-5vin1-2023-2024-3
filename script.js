

// Definieer de Raster-klasse
class Raster {
  constructor(r, k) {
    this.aantalRijen = r; // Aantal rijen
    this.aantalKolommen = k; // Aantal kolommen
    this.celGrootte = null; // Celgrootte
    this.groeneRegel = r;
  }

  // Bereken de celgrootte op basis van de canvasbreedte en het aantal kolommen
  berekenCelGrootte() {
    this.celGrootte = canvas.width / this.aantalKolommen;
  }

  // Teken het raster op de canvas
  teken() {
    push();
    noFill();
    stroke('grey');
    for (var rij = 0; rij < this.aantalRijen; rij++) {
      for (var kolom = 0; kolom < this.aantalKolommen; kolom++) {
        if (rij === this.groeneRegel - 1 || kolom === this.groeneRegel + 5) {
          fill('green');
        } else {
          noFill();
        }
        rect(kolom * this.celGrootte, rij * this.celGrootte, this.celGrootte, this.celGrootte);
      }
    }
    pop();
  }
}

// Definieer de Bommen-klasse
class Bommen {
  constructor() {
    this.size = raster.celGrootte; // Grootte van de bom is gelijk aan de groote van een cel
    this.speed = random(7, 15); // Snelheid van de bom
    this.image = creeperImage; // Afbeelding van de bom
    this.direction = 1;
    this.toBeRemoved = false; // een 'flag' om aan te geven of de bom moet worden verwijderd

    // Calculate the center of a random column on the right side of the canvas
    const rightHalfColumns = floor(raster.aantalKolommen / 2);
    const columnCenter = floor(random(rightHalfColumns, raster.aantalKolommen)) * raster.celGrootte;

    // Set the x-coordinate to the center of the column
    this.x = columnCenter;

    this.y = constrain(random(0, canvas.height - raster.celGrootte), 0, canvas.height - this.size);
    }


  // Beweeg de bom op en neer
  beweeg() {
    this.y += this.speed * this.direction;
    if (this.y <= 0 || this.y >= canvas.height - raster.celGrootte) {
      this.direction *= -1;
    }
  }

  // Toon de bom op de canvas
  toon() {
    if (!this.toBeRemoved) {
      image(this.image, this.x, this.y, this.size, this.size);
    }
  }

  // Controleer of de bom is geraakt door een andere bom
  wordtGeraakt(bommen) {
    return this.x === bommen[i].x && this.y === bom.bommen.y;
  }
}


// Een array om bommen op te slaan
let bommen = [];

// Definieer de Apple-klasse
class Apple {
  constructor() {
    this.size = raster.celGrootte; // De grootte van de appel is gelijk aan de celgrootte
    this.spawnRandomly(); // Plaats de appel willekeurig
    this.image = appleImage; // Afbeelding van de appel
  }

  // Plaats de appel willekeurig binnen het raster
  spawnRandomly() {
    this.x = floor(random(raster.aantalKolommen)) * this.size;
    this.y = floor(random(raster.aantalRijen)) * this.size;
  }

  // Toon de appel op de canvas
  toon() {
    image(appleImage, this.x, this.y, this.size, this.size);
  }
}

// Definieer de Jos (de speler) klasse
class Jos {
  constructor() {
    this.x = 400;
    this.y = 300;
    this.animatie = [];
     this.lastHitTime = 0; // Tijd waarop de speler de laatste keer is geraakt
    this.frameNummer = 3; // frame voor animatie
    this.stapGrootte = null; // Stapgrootte voor beweging
    this.gehaald = false; // Een 'flag' om aan te geven of de speler het einde heeft bereikt
  }

  // Beweeg de speler op basis van toetsenbordinvoer
  beweeg() {
    if (keyIsDown(65)) { // Toets 'A' (links)
      this.x -= this.stapGrootte;
      this.frameNummer = 2;
    }
    if (keyIsDown(68)) { // Toets 'D' (rechts)
      this.x += this.stapGrootte;
      this.frameNummer = 1;
    }
    if (keyIsDown(87)) { // Toets 'W' (omhoog)
      this.y -= this.stapGrootte;
      this.frameNummer = 4;
    }
    if (keyIsDown(83)) { // Toets 'S' (omlaag)
      this.y += this.stapGrootte;
      this.frameNummer = 5;
    }
    // Controleer of Jos wordt geraakt door een vijand of een bom
    if (this.wordtGeraakt(alice) || this.wordtGeraakt(bob)){ 
      playerLives--;
      console.log("Player hit by enemy. Lives: " + playerLives);
    }

    for (let i = 0; i < bommen.length; i++) {
       if (this.wordtGeraakt(bommen[i])) {
         playerLives--;
         console.log("Player hit by bomb. Lives: " + playerLives)
        }
      }
    
    
  // Beperk de positie van de speler binnen de canvasgrenzen
    this.x = constrain(this.x, 0, canvas.width);
    this.y = constrain(this.y, 0, canvas.height - raster.celGrootte);

    // Controleer of de speler het einde heeft bereikt
    if (this.x == canvas.width) {
      this.gehaald = true;
    }
  }

  // Controleer of het spelkarakter is geraakt door een vijand
  wordtGeraakt(vijand) {
    return this.x === vijand.x && this.y === vijand.y;
  }

  // Toon de speler (ook wel Jos) op de canvas
  toon() {
    image(this.animatie[this.frameNummer], this.x, this.y, raster.celGrootte, raster.celGrootte);
  }

//code die zorgt voor een cooldown voor het aantal levens dat de speler binnen 3 sec kan verliezen
wordtGeraakt(object) {
  if (object instanceof Apple) {
    // Check contact met appels
    const playerLeft = this.x;
    const playerRight = this.x + raster.celGrootte;
    const playerTop = this.y;
    const playerBottom = this.y + raster.celGrootte;

    const objectLeft = object.x;
    const objectRight = object.x + object.size;
    const objectTop = object.y;
    const objectBottom = object.y + object.size;

    if (
      playerLeft < objectRight &&
      playerRight > objectLeft &&
      playerTop < objectBottom &&
      playerBottom > objectTop
    ) {
      return true; // Botsing gevonden met appel
    }
  } else {
    // Check de laatste keer botsing met een bom of vijand
    const currentTime = millis();
    const timeDifference = currentTime - this.lastHitTime;

    // Als het tijdverschil groter is dan 3 seconde 
    if (timeDifference > 3000) {
      if (object instanceof Bommen || object instanceof Vijand) {
        // Check contact vijand of bom
        const playerLeft = this.x;
        const playerRight = this.x + raster.celGrootte;
        const playerTop = this.y;
        const playerBottom = this.y + raster.celGrootte;

        const objectLeft = object.x;
        const objectRight = object.x + object.size;
        const objectTop = object.y;
        const objectBottom = object.y + object.size;

        if (
          playerLeft < objectRight &&
          playerRight > objectLeft &&
          playerTop < objectBottom &&
          playerBottom > objectTop
        ) {
          // update de laatste keer botsing
          this.lastHitTime = millis();
          return true; // Controleer of jos in contact komt met vijand of bom
        }
      }
    }
  }

  return false; // als er geen contact is of contact is tijdens de cooldown
  }
}


// Definieer de Vijand-klasse
class Vijand {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = null; 
    this.stapGrootte = null; // Stapgrootte voor beweging van de vijand
  }

  // Beweeg de vijand willekeurig binnen de canvasgrenzen
  beweeg() {
    this.x += floor(random(-1, 2)) * this.stapGrootte;
    this.y += floor(random(-1, 2)) * this.stapGrootte;

    // Beperk de positie van de vijand binnen de canvasgrenzen
    this.x = constrain(this.x, 0, canvas.width - raster.celGrootte);
    this.y = constrain(this.y, 0, canvas.height - raster.celGrootte);
  }

  // Toon de vijand op de canvas
  toon() {
    image(this.sprite, this.x, this.y, raster.celGrootte, raster.celGrootte);
  }
}
//definieer heartImages
let heartImages = [];

// Afbeeldingen laden die in het spel worden gebruikt
function preload() {
  minecraft = loadImage("achtergrond.png");
  creeperImage = loadImage("creeper.png");
  appleImage = loadImage("images/sprites/goldenApple.png");

  // harten laden en een max van 10 harten aanhouden
  for (let i = 1; i <= 10; i++) {
    heartImages[i] = loadImage("heart.png");
  }
}

function setup() {
  canvas = createCanvas(900, 600);
  canvas.parent();
  frameRate(10);
  textFont("Verdana");
  textSize(90);

  // Maak het raster
  raster = new Raster(12, 18);
  raster.berekenCelGrootte();

  // Jos( de speler) heet nu eve
  eve = new Jos();
  eve.stapGrootte = 1 * raster.celGrootte;

  // Laad de animatieframes van eve
  for (var b = 0; b < 6; b++) {
    frameEve = loadImage("images/sprites/Eve100px/Eve_" + b + ".png");
    eve.animatie.push(frameEve);
  }

  // Vijanden toevoegen
  alice = new Vijand(700, 200);
  alice.stapGrootte = 1 * eve.stapGrootte;
  alice.sprite = loadImage("zombie.png");

  bob = new Vijand(600, 400);
  bob.stapGrootte = 1 * eve.stapGrootte;
  bob.sprite = loadImage("Skeleton.jpg");

  // Maak bommen en voeg ze toe aan de array
  for (let i = 0; i < 5; i++) {
    bommen.push(new Bommen());
  }

  // Appel toevoegen
  apple = new Apple();
}

let maxLives = 10;

// Toon het aantal resterende levens
function displayLives() {
  let heartSize = 50; // grootte hartjes
  let heartSpacing = 0.5; // de ruimte tussen de hartjes
  
  for (let i = 1; i <= maxLives; i++) {
    // Laat alleen harten zien tot dat het maximum is bereikt
    if (i <= playerLives) {
      image(heartImages[i], i * (heartSize + heartSpacing), 10, heartSize, heartSize);
    }
  }
  }

// Het aantal levens dat de speler heeft aan het begin van het spel
let playerLives = 2;

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

 
  // Controleer of Jos wordt geraakt door een van de bommen
  for (let i = 0; i < bommen.length; i++) {
    if (eve.wordtGeraakt(bommen[i])) {
      playerLives--;
      console.log("Player hit by bomb. Lives: " + playerLives);
    }
  }

  // Controleer of Jos een appel heeft gegeten
  if (eve.wordtGeraakt(apple) && playerLives < maxLives) {
    playerLives++;
    apple.spawnRandomly();
  }

  // Controleer of Jos een appel heeft gegeten
  if (eve.wordtGeraakt(apple)) {
    playerLives++;
    apple.spawnRandomly();
  }
  
  // Controleer of Jos wordt geraakt door een van de bommen
  for (let i = 0; i < bommen.length; i++) {
    if (eve.wordtGeraakt(bommen[i])) {
      playerLives--;
      console.log("Player hit by bomb. Lives: " + playerLives);
    }
  }
  
  // Controleer of Jos wordt geraakt door een vijand of een bom
  if (eve.wordtGeraakt(alice) || eve.wordtGeraakt(bob)) {
    playerLives--;
    //zorgt ervoor dat de speler max 10 levens kan hebben
    playerLives = constrain(playerLives, 0, 10);
  }
  
  for (let i = 0; i < bommen.length; i++) {
     if (eve.wordtGeraakt(bommen[i])) {
       playerLives--;
       console.log("Player hit by bomb. Lives: " + playerLives)
     }
      }
  

  // Voorwaarde voor het verliezen van het spel
  if (playerLives <= 0) {
    for (let i = 0; i < bommen.length; i++) {
      bommen[i].toBeRemoved = true;
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

  // Voorwaarde voor het winnen van het spel
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

  // Verwijder bommen die gemarkeerd zijn voor verwijdering uit de array
  bommen = bommen.filter((bom) => !bom.toBeRemoved);

  // Verplaats en toon de overgebleven bommen
  for (let i = 0; i < bommen.length; i++) {
    bommen[i].beweeg();
    bommen[i].toon();
  }
}
