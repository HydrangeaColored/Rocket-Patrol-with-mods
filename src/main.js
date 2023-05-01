/*
Steven Ren
Dark Souls 4
13 hours
mods:
different kinds of powerups (15)
    2 kinds of powerups. the first gives you an immediate point boost and gives you a modifer on subsequent spaceship and boss hits.
    the second makes your ship bigger so it's easier to hit spaceships. when fighting the boss in hard mode, it will also soak a
    hit from the boss ONLY IF you're firing but you will lose your upgraded size
different kinds of enemies/ boss (15)
    in hard mode, once you destroy 15 ships, a boss appears and will bounce back and forth at the top of the screen. it will also shoot projectiles
    at random intervals. if you get hit, you lose the game unless you have the powerup that makes you bigger aforementioned
    the boss is also worth way more points but moves around at a faster pace. no more powerups can be obtained at this point
Implement a new timing/scoring mechanism that adds time to the clock for successful hits (15)
    you will gained either 5 or 3 or 1 seconds depending on which ship you hit. the further the ship is, the more time you gain
Create a new title screen (e.g., new artwork, typography, layout) (10)
    created a new title screen using sprites
Display the time remaining (in seconds) on the screen (10)
    timer in the top of the middle of the screen
Create 4 new explosion sound effects and randomize which one plays on impact (10)
    4 new sound effects (5 total) that trigger randomly depending on what you hit
Allow the player to control the Rocket after it's fired (5)
    player can move while firing
Implement the 'FIRE' UI text from the original game (5)
    'FIRE' text appears on the top right when the ship is firing
Implement mouse control for player movement and mouse click to fire (15)
    you can use the mouse to control the ship and fire using left click only when the mouse is on the screen (intentional)
    Note: when switching from mouse mode to keyboard, just place mouse below the game and click the game, then you can use
    the keyboard again
*/
let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}
let game = new Phaser.Game(config);
// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT, lClick;
// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;