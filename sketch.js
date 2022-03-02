const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var ground, bridge;
var leftWall, rightWall;
var jointPoint;
var jointLink;
var zombie1, zombie2, zombie3, zombie4, sadzombie;
var breakButton,breakButton2;
var backgroundImage;

var stones = [];
var collided = false;

var zombiesound; 
var buttonpresssound; 
var rocksound;

function preload() {
  zombie1 = loadImage("./assets/zombie1.png");
  zombie2 = loadImage("./assets/zombie2.png");

  zombie3 = loadImage("./assets/zombie3.png");
  zombie4 = loadImage("./assets/zombie4.png");
  sadzombie = loadImage("./assets/sad_zombie.png");

  backgroundImage = loadImage("./assets/background.png");

  rocksound = loadSound("rocksound.mp3");
  zombiesound = loadSound("zombiesound.mp3");
  buttonpresssound = loadSound("buttonpresssound.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  engine = Engine.create();
  world = engine.world;
  frameRate(80);

  ground = new Base(0, height - 10, width * 2, 20);
  leftWall = new Base(100, height - 300, 200, height / 2 + 100);
  rightWall = new Base(width - 100, height - 300, 200, height / 2 + 100);

  bridge = new Bridge(30, { x: 5, y: height / 2 - 70 });
  jointPoint = new Base(width - 250, height / 2 - 100, 40, 20);

  Matter.Composite.add(bridge.body, jointPoint);
  jointLink = new Link(bridge, jointPoint);


  for (var i = 0; i <= 8; i++) {
    var x = random(width / 2 - 200, width / 2 + 300);
    var y = random(-100, 100);
    var stone = new Stone(x, y, 80, 80);
    stones.push(stone);
  }

  zombie = createSprite(width / 2, height - 80, 50, 50);
  zombie.addAnimation("lefttoright", zombie1, zombie2, zombie1);
  zombie.addAnimation("righttoleft", zombie3, zombie4, zombie3);
  zombie.addImage("sad", sadzombie);

  zombie.scale = 0.06;
  zombie.velocityX = 6;

  breakButton = createButton("");
  breakButton.position(width - 200, height / 2 - 50);
  breakButton.class("breakbutton");
  breakButton.mousePressed(handleButtonPress);

  breakButton2 = createButton("");
  breakButton2.position(width - 1250, height / 2 - 90);
  breakButton2.class("breakbutton");
  breakButton2.mousePressed(handleButtonPress);
  
}

function draw() {
  background(backgroundImage);
  Engine.update(engine);

  bridge.show();

 

  for (var stone of stones) {
    stone.show();
    var pos = stone.body.position;
    
    var distance = dist(zombie.position.x, zombie.position.y, pos.x, pos.y);
    //var distance = dist(zombie.position.x, zombie.position.y);
    //var distance = dist(pos.x, pos.y);
    //var distance = dist(zombie, pos);


    /*if (distance >= 50) {
      zombie.velocityX = 0;
      Matter.Body.setVelocity(stone.body, { x: 10, y: -10 });
      zombie.changeImage("sad");
      collided = true;
    }*/

    /*if (distance <= 50) {
      zombie.velocityX = 0;
      Matter.Body.setVelocity(stone.body, { x: 10, y: -10 });
      zombie.Image("sad");
      collided = true;
    }*/

    if (distance <= 50) {
      zombie.velocityX = 0;
      Matter.Body.setVelocity(stone.body, { x: 10, y: -10 });
      zombie.changeImage("sad");
      rocksound.play();
      //zombiesound.stop()
      collided = true;
    }

    /*if (distance <= 50) {
      zombie.velocityX = 0;
      Matter.Body.Velocity(stone.body, { x: 10, y: -10 });
      zombie.changeImage("sad");
      collided = true;
    }*/

    /*if(!zombiesound.isPlaying() && distance > 50){
      zombiesound.play()
      zombiesound.volume = 10
    }*/
  
  }

  
  if (zombie.position.x >= width - 300 && !collided) {
    zombie.velocityX = -5;
    zombie.changeAnimation("righttoleft");
  }

  if (zombie.position.x <= 300 && !collided) {
    zombie.velocityX = 5;
    zombie.changeAnimation("lefttoright");
  }

  drawSprites();
}

function handleButtonPress() {
  buttonpresssound.play()

  jointLink.dettach();
  setTimeout(() => {
    bridge.break();
  }, 1500);
}
