// different kinds of enemies/ boss (15)
class Boss extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
      super(scene, x, y, texture, frame);
  
      // add object to existing scene
      scene.add.existing(this);
      this.points=pointValue;
      this.moveSpeed = game.settings.spaceshipSpeed+2;
      //1=r->l, 2=l->r
      this.direction=1;
    }
    update(){
        if(this.x<0-this.width){
            this.direction=2;
        }else if(this.x>game.config.width){
            this.direction=1;
        }
        if(this.direction==1){
            this.x-=this.moveSpeed;
        }else if(this.direction==2){
            this.x+=this.moveSpeed;
        }
    }
}