var gameState="play";
var ground, mario ;
var mario_running, mario_stop;
var score= 0;
var gameOver,gameOverImage,restart,restartImage;

function preload() {//loading animations and images
  mario_running = loadAnimation("Capture1.png", "Capture3.png", "Capture4.png");
  mario_stop = loadAnimation("mariodead.png");
  coinImage=loadImage("coin.png");
  obstacle1Img = loadImage("obstacle1.png");
  obstacle2Img = loadImage("obstacle2.png");
  obstacle3Img = loadImage("obstacle3.png");
  restartImage=loadImage("restart.png");
  gameOverImage=loadImage("gameOver.png");
  
}
function setup() {//create ground,main character,gameover,restart,groups
   createCanvas(windowWidth,windowHeight); 
   ground = createSprite(width/2,height,width*2,10);
   ground.x = ground.width/2;
   ground.shapeColor="brown"
   ground.velocityX = -4;
   mario = createSprite(50,height-70,20,50);
   mario.addAnimation("running",mario_running);
   mario.addAnimation("stop",mario_stop);
   mario.scale=0.3;
   //mario.debug=true;
   //mario.setCollider("rectangle",0,0,mario.width+150,mario.height);
   coinsGroup = createGroup();
   obstaclesGroup = createGroup();
   gameOver=createSprite(width/2,height/2);
   gameOver.addImage (gameOverImage);
   gameOver.scale=0.5;
   restart=createSprite(width/2,height/2+50);
   restart.addImage (restartImage);
   restart.scale=0.5;
}


function draw() {     
  background(0,0,0);
  text("Score : "+score, width-50,50);

  if(gameState==="play"){ 
    ground.velocityX=-4;
    gameOver.visible=false;
    restart.visible=false;
    if (ground.x<0) {
      ground.x = ground.width/2; // reset the ground to create a infinite gaming world
    } 
    if ((touches.length>0 || keyDown("space")) && mario.y > height-220) {
      mario.velocityY = -10; //step 1 for jump
      touches=[];
    }
    mario.velocityY = mario.velocityY + 0.5; // step 2 for jump -simulate gravity
    spawnCoins();
    spawnObstacles();
    if (mario.isTouching(coinsGroup)) {
      score++;
      coinsGroup[0].destroy();

    }
    if(mario.isTouching(obstaclesGroup)){ 
      gameState="end"
      //mario.velocityY=-10;
    }
  }
  else if (gameState=== "end"){
    ground.velocityX=0;
    mario.velocityY=0;
    gameOver.visible=true;
    restart.visible=true;
    mario.changeAnimation("stop",mario_stop);
    obstaclesGroup.setVelocityXEach(0);
    coinsGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
    coinsGroup.setLifetimeEach(-1);
    if (touches.length>0 || keyDown("space")){
     reset();
     touches=[];
    }
  }
  

 
 
  

  mario.collide(ground); // step 3 , stop when touching the ground
  //console.log(mario.y);
  
  drawSprites();
}
function reset(){
  gameState="play";
  score=0;
  obstaclesGroup.destroyEach();
  coinsGroup.destroyEach();
  mario.changeAnimation("running",mario_running);
}
function spawnCoins(){
  if (frameCount%50===0){
    var coin=createSprite(width,height/2,50,50);
    coin.addImage(coinImage)
    coin.velocityX=-6;
    coin.scale=0.1;
    coin.lifetime = width/6;
    coin.y = Math.round(random(height/2,height/1.5));
    //console.log(coin.y);
    coinsGroup.add(coin);
  }
}

function spawnObstacles() {
  if (frameCount%150===0){
    var obstacle = createSprite(width,height-70,10,10);
    var rand=Math.round(random(1,3));
    if (rand===1){
      obstacle.addImage(obstacle1Img);
    }
    if (rand===2){
      obstacle.addImage(obstacle2Img);
    }
    if (rand===3){
      obstacle.addImage(obstacle3Img);
    }
    
    
    obstacle.velocityX = -(6+score/10);
    obstacle.scale = random(0.1,0.6);
    obstacle.lifetime = width/6;
    obstaclesGroup.add(obstacle);
  }
} 