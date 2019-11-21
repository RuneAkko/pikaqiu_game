/*
 * File: Level4.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, Scene, GameObjectSet, TextureObject, Camera, vec2,
  FontRenderable, ParticleGameObjectSet, ParticleEmitter
  GameObject, Hero, Minion, Dye, Platform, Wall, DyePack, Particle */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Level03() {    
    this.sceneFile = "assets/Scenes/Level03.json";    
}
gEngine.Core.inheritPrototype(Level03, MyGame);

Level03.prototype.initialize = function () {
    this.initialize0();
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);
    //  Cameras
    this.setCameras();
    //  Characters
    this.setHero3();
    //  Floor
    //  Status
    this.setStatus();
    //this.setHamburgers();
    //this.setCatherine();
    
    this.mBackground = new Background(this.kBackgroundTexture2, this.kBackgroundTexture2, 200, 50, 400, 100);
    
    //var mHeroPosx=this.mHero.getXform().getXPos();
    //var mCenterx=this.mCamera.getWCCenter()[0];
    //this.deltax = mCenterx - mHeroPosx;
};

Level03.prototype.draw = function () {
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
    //var cx=this.mHero.getXform().getXPos();
    //var cy=this.mCamera.getWCCenter()[1];
    //this.mCamera.setWCCenter(cx + this.deltax , cy);
    
    this.mCamera.setupViewProjection();
    //this.mBackground.draw(this.mCamera);
    //this.mAllPlatforms.draw(this.mCamera);
    //this.mAllHamburgers.draw(this.mCamera);
    //this.mAllWalls.draw(this.mCamera);
    //this.mAllHumans.draw(this.mCamera);
    //this.mCatherine.draw(this.mCamera);
    
    this.mHero.draw(this.mCamera);
    //this.mFlower.draw(this.mCamera);
    
};

Level03.prototype.update0 = function(){
};

Level03.prototype.setHero3 = function() {
    var heroAttr = this.sceneParser.getHeroAttr();
    //  (x, y, width, height, moveSpeed, jumpSpeed);
    this.mHero = new Hero3(this.kHeroSprite, heroAttr[0], heroAttr[1], heroAttr[2], heroAttr[3], heroAttr[4], heroAttr[5]);
};