    var game;
    var ball;
    var blocks;
    var goal;
    var turret;
    var bullet;
    var bullets;
    var accel;
    var timer;
    var currentTime;
    
    var sndElement;
    
    var currentBullet = 0;
    var NUM_BULLETS = 10;
    
    var numBlocks = 7;
    var blockCounter;
    
    //used if building wall down or up
    var buildDown = -1;
    var buildUp = 1;
    
    Block = function(startx,starty,numblocks,build){
        tBlock = new Sprite(game, "images/block.png", 50, 50);
        tBlock.setSpeed(0);
        
        var newY = numblocks*50;
        newY = newY*build;
        
        tBlock.setPosition(startx, starty-newY);
        
        return tBlock;
    } // end Block
    
    function setupBlocks(startx,starty,numblocks,build){
        blocks = null;
        blocks = new Array(numBlocks);
        for (i = 0; i < numBlocks; i++){
            blocks[i] = new Block(startx,starty,i,build);
        } // end for
    } // end setupBlocks
    
    function setupBlocks1(startx,starty,numblocks,build){
        blocks1 = null;
        blocks1 = new Array(numBlocks);
        for (i = 0; i < numBlocks; i++){
            blocks1[i] = new Block(startx,starty,i,build);
        } // end for
    } // end setupBlocks
    
    function updateBlocks(){
        for (i = 0; i < numBlocks; i++){
            if (blocks[i].collidesWith(ball) || blocks1[i].collidesWith(ball)){
              //hide current block to prevent refresh bug.
              blocks[i].hide();
              
              alert("You lose");
              game.stop();
              //re-start game
              document.location.href = "";
            } // end if
            
            blocks[i].update();
            blocks1[i].update();
            
            for(var k = 0; k < NUM_BULLETS; k++ ){
                if (blocks[i].collidesWith(bullets[k]) || blocks1[i].collidesWith(bullets[k])){
                    bullets[k].hide();
                }
            }
            
        } // end for
        
        
    } // end updateBlocks
    
    Turret = function(){
        tTurret = new Sprite(game, "images/turret1.png",100,75);
        tTurret.setSpeed(0);
        tTurret.setPosition(50,25);
                
        
        
        return tTurret;
    }
    
   function changeTurretAngle(currentTime){
        
        modTime = currentTime%7;
        if (modTime>7) {
            timer.reset();
            
        }
        tTurret.setImgAngle(90);
        tTurret.changeImgAngleBy(15*modTime);
        
        
        if (currentTime%1 < 0.07) {
            bullets[currentBullet].fire();
            currentBullet++;
            if (currentBullet >= NUM_BULLETS) {
                currentBullet = 0;
            }
            sndElement.play();
        }
        


    }
    
    Bullet = function(owner){
        tBullet = new Sprite(game, "images/bullet.png", 10, 10);
        
        tBullet.owner = owner;
        tBullet.hide();
        tBullet.setBoundAction(DIE);
        
        tBullet.fire = function(){
            this.setPosition(tBullet.owner.x, tBullet.owner.y);
            this.setMoveAngle(tBullet.owner.getImgAngle());
            this.setSpeed(10);
            this.show();
        }
        
                
        return tBullet;
    }
    
    
    function makeBullets(){
        bullets = new Array(NUM_BULLETS);
        for (i = 0; i < NUM_BULLETS; i++){
            bullets[i] = new Bullet(tTurret);
        } // end for
    } // end makeBullets
    
    function updateBullets(){
        for (i = 0; i < NUM_BULLETS; i++){
            bullets[i].update();
        } // end for
        

        
    } // end updateBullets
    
    
    function checkHit(){
        for(var j = 0; j < NUM_BULLETS; j++){
            if (bullets[j].collidesWith(ball)) {
              //hide current block to prevent refresh bug.
              //blocks[i].hide();
              
              alert("You lose");
              game.stop();
              //re-start game
              document.location.href = "";
            }
            
        }
    } // end checkHit
    
    
    Ball = function(){
        tBall = new Sprite(game, "images/redBall.png", 25, 25);
        tBall.setSpeed(0);
        tBall.setPosition(50, 575);
        tBall.setBoundAction("STOP");
        
    
        tBall.checkKeys = function(){
            //temporary function for testing
            if (keysDown[K_UP]){
                this.changeYby(-5);
            }
            
            if (keysDown[K_DOWN]){
                this.changeYby(5);
            }
            
            if (keysDown[K_LEFT]){
                this.changeXby(-5);
            }
            
            if (keysDown[K_RIGHT]){
                this.changeXby(5);
            }
        } // end checkKeys
        
        tBall.checkAccel = function(){
            //use the accelerometer to get input
            newDX = accel.getAY();
            newDY = accel.getAX();
            
            newDX *= -5;
            newDY *= -5;
            
            ball.setDX(newDX);
            ball.setDY(newDY);
        } // end checkAccel
        
        return tBall;
    } // end ball
    
    Goal = function(){
        tGoal = new Sprite(game, "images/goal.png", 50, 50);
        tGoal.setSpeed(0);
        tGoal.setPosition(750,50);
        
        return tGoal;
    } // end goal
    
    function checkGoal(){
        if (ball.collidesWith(goal)){
            alert("You Win!! Replay?")
            window.location.href = "";
        } // end if
    } // end check
    
    function init(){
        game = new Scene();
        ball = new Ball();
        goal = new Goal();
        timer = new Timer();
        timer.reset();
        turret = new Turret();
        
        setupBlocks(200,575,numBlocks,buildUp);
        setupBlocks1(500,25,numBlocks,buildDown);
        
        blockCounter = document.getElementById("blockCounter");
        accel = new Accel();
        
        sndElement = new Sound("sounds/shell.ogg");
        
        makeBullets();
        
        game.start();
    } // end init
    
    function update(){
        game.clear();
        ball.checkKeys();            
        
        checkGoal();
        goal.update();
        ball.update();
       
        currentTime = timer.getElapsedTime();
        changeTurretAngle(currentTime);
        //changeBulletAngle(currentTime);
        
        updateBullets();
        
        tTurret.update();
        
        checkHit();
        
        updateBlocks();
    } // end update