class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }
    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
        this.load.audio('sfx_explosion1', './assets/explosion1.wav');
        this.load.audio('sfx_explosion2', './assets/explosion2.wav');
        this.load.audio('sfx_explosion3', './assets/explosion3.wav');
        this.load.audio('sfx_explosion4', './assets/explosion4.wav');
        this.load.audio('bossHit', './assets/bossHit.wav');
        this.load.image('logo', './assets/rocketpatrollogo.png');
        this.load.image('rules', './assets/rules.png');
    }
    create() {
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '14px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
        fixedWidth: 0
        }
        this.add.sprite(game.config.width/2,game.config.height/2-borderUISize-borderPadding,"logo");
        /*menuConfig.backgroundColor='#00FF00';
        menuConfig.color='#000';
        this.add.text(game.config.width/2,game.config.height/2+10*borderPadding, 'Use ←→ arrows to move & (F) to fire', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2+10*borderPadding+borderUISize+borderPadding, 'Press ← for Novice or → for Expert', menuConfig).setOrigin(0.5);*/
        this.add.sprite(game.config.width/2,game.config.height/2+100,"rules");
        //Create a new title screen (e.g., new artwork, typography, layout) (10)
        menuConfig.backgroundColor='#000000';
        menuConfig.color='#ffffff';
        this.add.text(game.config.width/2,game.config.height/2+175, 'By Steven Ren ', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2,game.config.height/2+175+2*borderPadding, 'with the assistance from Professor Altice', menuConfig).setOrigin(0.5);
        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }
    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
          // easy mode
          game.settings = {
            spaceshipSpeed: 3,
            gameTimer: 60000,
            mode: 'easy'   
          }
          this.sound.play('sfx_select');
          this.scene.start('playScene');    
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
          // hard mode
          game.settings = {
            spaceshipSpeed: 4,
            gameTimer: 45000,
            mode: 'hard'  
          }
          this.sound.play('sfx_select');
          this.scene.start('playScene');    
        }
      }
}