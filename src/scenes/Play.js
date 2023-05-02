class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.image('explosionParticle', './assets/explosionParticle.png');
        this.load.image('powerup1', './assets/powerup1.png');
        this.load.image('powerup2', './assets/powerup2.png');
        this.load.image('bigshot', './assets/biggershot.png');
        this.load.image('bossalien', './assets/boss.png');
        this.load.image('pellet', './assets/bossPellet.png');
    }
    create() {
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0);
        this.bossShip = new Boss(this, game.config.width + borderUISize*6, borderUISize*4+20, 'bossalien', 0, 100).setOrigin(0, 0);
        this.bossShip.alpha=0;
        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        //Implement mouse control for player movement and mouse click to fire (15)
        this.input.on('pointerdown', function (pointer){
            if (pointer.leftButtonDown()){
                this.p1Rocket.shootOnClick()
            }
        }, this);
        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });
        // initialize score
        this.p1Score = 0;
        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
        fixedWidth: 100
        }
        // Display the time remaining (in seconds) on the screen (10)
        // timer config
        let timeConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'middle',
            padding: {
                top: 5,
                bottom: 5,
            },
        fixedWidth: 100
        }
        this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.updateTime, callbackScope: this, loop: true });
        this.currTime = game.settings.gameTimer/1000;
        this.timeLeft = this.add.text(game.config.width/2-borderUISize - borderPadding*2, borderUISize + borderPadding*2, this.currTime, timeConfig);
        scoreConfig.fixedWidth = 0;
        // GAME OVER flag
        this.gameOver = false;
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
        //Implement the 'FIRE' UI text from the original game (5)
        this.fireText = this.add.text(game.config.width - 6*borderPadding-2*borderUISize, borderUISize + borderPadding*2, "", scoreConfig);
        // 60-second play clock

        /*this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);*/

        this.powerupListOne = [];
        this.powerupListTwo = [];
        this.totalEnemies=0;
        this.bossSummoned=false;
        this.bossPellet = [];
    }
    update() {
        if(this.p1Rocket.isFiring==true){
            this.fireText.text="FIRE";
        }else{
            this.fireText.text="";
        }
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        this.starfield.tilePositionX -= 4;
        if (!this.gameOver) { 
            this.p1Rocket.update();
            if(this.bossSummoned==false){
                this.ship01.update();               // update spaceships (x3)
                this.ship02.update();
                this.ship03.update();
            }else{
                this.bossShip.update();
            }
        }
        // check collisions
        if(this.bossSummoned==false){
            if(this.checkCollision(this.p1Rocket, this.ship03)) {
                this.shipExplode(this.ship03);
                this.generatePowerUp();
                this.p1Rocket.reset();
                this.currTime+=1;
                this.totalEnemies++;
            }
            if (this.checkCollision(this.p1Rocket, this.ship02)) {
                this.shipExplode(this.ship02);
                this.generatePowerUp();
                this.p1Rocket.reset();
                this.currTime+=3;
                this.totalEnemies++;
            }
            if (this.checkCollision(this.p1Rocket, this.ship01)) {
                this.shipExplode(this.ship01);
                this.generatePowerUp();
                this.p1Rocket.reset();
                this.currTime+=5;
                this.totalEnemies++;
            }
        }else{
            if(this.checkCollision(this.p1Rocket, this.bossShip)){
                // temporarily hide ship
                this.p1Rocket.alpha = 0;
                // create explosion sprite at ship's position
                let boom = this.add.sprite(this.p1Rocket.x, this.p1Rocket.y, 'explosion').setOrigin(0, 0);
                boom.anims.play('explode');             // play explode animation
                this.p1Rocket.reset();
                boom.on('animationcomplete', () => {    // callback after anim completes
                    this.p1Rocket.alpha = 1;                       // make ship visible again
                    boom.destroy();                       // remove explosion sprite
                });
                this.sound.play('bossHit');
                // score add and repaint
                if(this.p1Rocket.powerup==2){
                    this.p1Score += 2*this.bossShip.points;
                }else{
                    this.p1Score += this.bossShip.points;
                }
                this.scoreLeft.text = this.p1Score;
            }
            var bullet=Math.floor(Math.random() * 20);
            if(bullet<3){
                this.bossPellet.push(this.add.sprite(this.bossShip.x+32,this.bossShip.y+16,"pellet"));
            }
            for (var i = 0; i < this.bossPellet.length; i++) {
                this.bossPellet[i].y+=5;
                if((this.bossPellet[i].y>(game.config.height-borderPadding-borderUISize))){
                    this.bossPellet[i].destroy();
                }
                if(this.checkCollision(this.p1Rocket, this.bossPellet[i])){
                    this.bossPellet[i].destroy();
                    if(this.p1Rocket.powerup==2){
                        this.p1Rocket.powerup=0;
                        this.p1Rocket.setTexture('rocket');
                        this.p1Rocket.reset();
                    }else{
                        this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', this.scoreConfig).setOrigin(0.5);
                        this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', this.scoreConfig).setOrigin(0.5);
                        this.gameOver = true;
                    }
                }
            }
        }
        
        //Implement a new timing/scoring mechanism that adds time to the clock for successful hits (15)
        if(this.currTime==0){
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', this.scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', this.scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }
        //different kinds of powerups (15)
        for (var i = 0; i < this.powerupListOne.length; i++) {
            if(game.settings.mode == 'hard'){
                this.powerupListOne[i].y+=3;
            }else{
                this.powerupListOne[i].y+=1;
            }
            if((this.powerupListOne[i].y>(game.config.height-borderPadding-borderUISize))){
                this.powerupListOne[i].destroy();
            }
            if(this.checkCollision(this.p1Rocket, this.powerupListOne[i])){
                this.powerupListOne[i].destroy();
                if(this.p1Rocket.powerup==2){
                    this.p1Rocket.setTexture('rocket');/////////////////////////////
                }
                this.p1Rocket.powerup=1;
                this.p1Score += 5;
                this.scoreLeft.text = this.p1Score;
            }
        }
        for (var i = 0; i < this.powerupListTwo.length; i++) {
            if(game.settings.mode == 'hard'){
                this.powerupListTwo[i].y+=3;
            }else{
                this.powerupListTwo[i].y+=1;
            }
            if((this.powerupListTwo[i].y>(game.config.height-borderPadding-borderUISize))){
                this.powerupListTwo[i].destroy();
            }
            if(this.checkCollision(this.p1Rocket, this.powerupListTwo[i])){
                this.powerupListTwo[i].destroy();
                this.p1Rocket.powerup=2;
                this.p1Rocket.setTexture('bigshot');
            }
        }
        if((this.totalEnemies==15) && (game.settings.mode == 'hard')){
            this.bossSummoned=true;
            this.ship01.alpha = 0;
            this.ship02.alpha = 0;
            this.ship03.alpha = 0;
            this.bossShip.alpha=1;
        }
    }
    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
          rocket.x + rocket.width > ship.x && 
          rocket.y < ship.y + ship.height &&
          rocket.height + rocket.y > ship. y) {
          return true;
        } else {
          return false;
        }
    }
    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
          ship.reset();                         // reset ship position
          ship.alpha = 1;                       // make ship visible again
          boom.destroy();                       // remove explosion sprite
        });
        // score add and repaint
        if(this.p1Rocket.powerup==1){
            this.p1Score += 2*ship.points;
        }else{
            this.p1Score += ship.points;
        }
        
        this.scoreLeft.text = this.p1Score;
       // Create 4 new explosion sound effects and randomize which one plays on impact (10)
        switch (Math.floor(Math.random() * 5)){
            case 0:
                this.sound.play('sfx_explosion');
                break;
            case 1:
                this.sound.play('sfx_explosion1');
                break;
            case 2:
                this.sound.play('sfx_explosion2');
                break;
            case 3:
                this.sound.play('sfx_explosion3');
                break;
            case 4:
                this.sound.play('sfx_explosion4');
                break;
        }
    }
    generatePowerUp(){
        var chance=Math.floor(Math.random() * 20);
        if(chance == 0){
            this.powerupListOne.push(this.add.sprite(this.p1Rocket.x+32,this.p1Rocket.y+16,"powerup1"));
        }else if(chance == 1){
            this.powerupListTwo.push(this.add.sprite(this.p1Rocket.x+32,this.p1Rocket.y+16,"powerup2"));
        }
    }
    updateTime (){
        if(this.currTime>0&&(!this.gameOver)){
            this.currTime -= 1; // One second
            this.timeLeft.text = this.currTime;
        }
    }
    
}