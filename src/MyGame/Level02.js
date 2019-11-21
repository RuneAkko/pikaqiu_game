/*
 * File: Level02.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, Scene, GameObjectSet, TextureObject, Camera, vec2,
  FontRenderable, ParticleGameObjectSet, ParticleEmitter
  GameObject, Hero, Minion, Dye, Platform, Wall, DyePack, Particle */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Level02() {    
    this.sceneFile = "assets/Scenes/Level02.json";    
}
gEngine.Core.inheritPrototype(Level02, MyGame);

Level02.prototype.initialize = function () {
    this.initialize0();
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);
    //  Cameras
    this.setCameras();
    //  Characters
    this.setHero2();
    //  Floor
    this.setPlatforms();
    this.setWalls();
    this.setFlower();
    //  Status
    this.setStatus();
    //this.setHamburgers();
    //this.setCatherine();
    this.mHumanAttrs = [];
    this.setHumans();
    
    this.mBackground = new Background(this.kBackgroundTexture2, this.kBackgroundTexture2, 200, 50, 400, 100);
    
    var mHeroPosx=this.mHero.getXform().getXPos();
    var mCenterx=this.mCamera.getWCCenter()[0];
    this.deltax = mCenterx - mHeroPosx;
};
Level02.prototype.draw = function () {
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
    var cx=this.mHero.getXform().getXPos();
    var cy=this.mCamera.getWCCenter()[1];
    this.mCamera.setWCCenter(cx + this.deltax , cy);
    
    this.mCamera.setupViewProjection();
    this.mBackground.draw(this.mCamera);
    this.mAllPlatforms.draw(this.mCamera);
    this.mAllHamburgers.draw(this.mCamera);
    this.mAllWalls.draw(this.mCamera);
    this.mAllHumans.draw(this.mCamera);
    //this.mCatherine.draw(this.mCamera);
    
    this.mHero.draw(this.mCamera);
    this.mFlower.draw(this.mCamera);
    
};

Level02.prototype.physicsSimulation = function() {
    //  platform
    gEngine.Physics.processObjSet(this.mHero, this.mAllPlatforms);
    //gEngine.Physics.processObjSet(this.mCatherine, this.mAllPlatforms);    
    gEngine.Physics.processSetSet(this.mAllHumans, this.mAllPlatforms);    
    //  humans
    gEngine.Physics.processSetSet(this.mAllHumans, this.mAllHumans);
    //  wall
    gEngine.Physics.processObjSet(this.mHero, this.mAllWalls);
    //gEngine.Physics.processObjSet(this.mCatherine, this.mAllWalls);    
    gEngine.Physics.processSetSet(this.mAllHumans, this.mAllWalls);
};
Level02.prototype.update = function(){
    this.update0();
}
Level02.prototype.update0 = function(){
    this.physicsSimulation();
    this.mCamera.update();
    
    //this.mCatherine.update();
    //  Catherine Chasing
    //this.mCatherine.chaseHero(this.mHero);
    //  Humans Chasing
    if (this.mGameStatus === 0){
        
        this.mHero.update(this.mAllPlatforms, this.mAllHamburgers);
        this.mAllHumans.update();
    
        for(var i = 0; i < this.mAllHumans.size(); i++) {
            this.mAllHumans.getObjectAt(i).chaseHero(this.mHero);
        }
        
        if (this.mHero.getFallingResult() || this.mAllHumans.getHumanChaseResult())
        {
            this.nextLevel = new Level02();
            this.mGameStatus = 1;
            //gEngine.GameLoop.stop();
        }
        if (this.mFlower.getTouchingResult(this.mHero.getXform().getPosition()))
        {
            this.nextLevel = new Level03();
            gEngine.GameLoop.stop();
        }
    }
    
    if (this.mGameStatus === 1) {
        //alert(3);
        if (this.showAnimationLose()){
            //alert(7);
            gEngine.GameLoop.stop();
        }
    }
};

Level02.prototype.setHero2 = function() {
    var heroAttr = this.sceneParser.getHeroAttr();
    //  (x, y, width, height, moveSpeed, jumpSpeed);
    this.mHero = new Hero2(this.kHeroSprite, heroAttr[0], heroAttr[1], heroAttr[2], heroAttr[3], heroAttr[4], heroAttr[5]);
};


Level02.prototype.setHumans = function() {
    this.mHumanAttrs = this.sceneParser.getHumansAttr(this.mHumanAttrs);
    if(this.mHumanAttrs !== null) {
        for(var i = 0; i < this.mHumanAttrs.length; i++) {
            var humanAttr = this.mHumanAttrs[i];
            var human = new Human(this.kHuman, humanAttr[0], humanAttr[1], humanAttr[2], humanAttr[3], humanAttr[4], humanAttr[5]);
            this.mAllHumans.addToSet(human);
        }
    }
};
Level02.prototype.setFlower = function() {
    var flowerAttr = this.sceneParser.getFlowerAttr();
    //  (x, y, width, height)
    this.mFlower = new Flower(this.kFlower, flowerAttr[0], flowerAttr[1], flowerAttr[2], flowerAttr[3]);
};

Level02.prototype.showAnimationLose = function(){
    var delta =0.02;
    var mIntensity = gEngine.DefaultResources.getGlobalAmbientIntensity();
    mIntensity -= delta;
    //alert(mIntensity);
    gEngine.DefaultResources.setGlobalAmbientIntensity(mIntensity);
    return mIntensity <= 0;
};