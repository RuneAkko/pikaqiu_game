/* File: Hero.js
 *
 * Creates and initializes the Hero (Dye)
 * overrides the update function of GameObject to define
 * simple Dye behavior
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, GameObject, SpriteRenderable, RigidCircle, RigidRectangle, Particle */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Hero3(spriteTexture, atX, atY, width, height, moveSpeed, jumpSpeed) {
    this.kXDelta = 1;
    this.kYDelta = 2.0;
    
    this.run = "assets/run.png";
    this.walk = "assets/walk.png"
    this.moveSpeed = moveSpeed;
    this.moveSpeed_Max;
    this.moveSpeed_Min;
    
    this.jumpSpeed = jumpSpeed;
    this.isCollided = false;
    this.RunningCountDown = 0;
    
    this.mDye = new SpriteRenderable(spriteTexture);
    this.mDye.setColor([1, 1, 1, 0]);
    this.mDye.getXform().setPosition(atX, atY);
    this.mDye.getXform().setSize(width, height);
    this.mDye.setElementPixelPositions(0, this.mDye.getTextureWidth(), 0, this.mDye.getTextureHeight());
    
    this.mRRunning = new SpriteAnimateRenderable(this.run);
    this.mRRunning.setColor([1, 1, 1, 0]);
    this.mRRunning.getXform().setPosition(atX, atY);
    this.mRRunning.getXform().setSize(width, height);
    this.mRRunning.setElementPixelPositions(0, this.mRRunning.getTextureWidth(), 0, this.mRRunning.getTextureHeight());
    this.mRRunning.setSpriteSequence(256,0,
                                    256,256,
                                    4,
                                    0);
    this.mRRunning.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateRight);
    this.mRRunning.setAnimationSpeed(10);


    this.mWalking = new SpriteAnimateRenderable(this.walk);
    this.mWalking.setColor([1, 1, 1, 0]);
    this.mWalking.getXform().setPosition(atX, atY);
    this.mWalking.getXform().setSize(width, height);
    this.mWalking.setElementPixelPositions(0, this.mWalking.getTextureWidth(), 0, this.mWalking.getTextureHeight());
    this.mWalking.setSpriteSequence(512,0,
        512,512,
        4,
        0);
    this.mWalking.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateRight);
    this.mWalking.setAnimationSpeed(20);
    
    GameObject.call(this, this.mDye);
    //var r = new RigidRectangle(this.getXform(), this.mDye.getXform().getWidth(), this.mDye.getXform().getHeight());
    //r.setMass(0.5);  // less dense than Minions
    //r.setRestitution(0.3);
    //r.setColor([0, 1, 0, 1]);
    //r.setDrawBounds(false);
    //this.setPhysicsComponent(r);
}
gEngine.Core.inheritPrototype(Hero3, GameObject);

Hero3.prototype.update = function (platforms, hamburgers) {
    // must call super class update
    GameObject.prototype.update.call(this);

    // control by ←→↑↓
    var delta = 0.5;
    //alert(this.getXform().getWidth());
    var mHeroBottom=this.getXform().getYPos() - this.getXform().getHeight()/2;
    var mHeroTop=this.getXform().getYPos() + this.getXform().getHeight()/2;
    var mHeroLeft=this.getXform().getXPos() - this.getXform().getWidth()/2;
    var mHeroRight=this.getXform().getXPos() + this.getXform().getWidth()/2;
    //var v = this.getPhysicsComponent().getVelocity();
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Up) && mHeroTop<50) {
        this.getXform().incYPosBy(delta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Down) && mHeroBottom>0) {
        this.getXform().incYPosBy(-delta);
    }


    this.mRRunning.updateAnimation();
    this.mWalking.updateAnimation();
/*
    if(this.RunningCountDown)
    {
        this.getXform().incXPosBy(2 * delta);
        this.RunningCountDown --;
    }
    else
    {
        this.getXform().incXPosBy(delta);
    }
*/

    this.mRRunning.getXform().setPosition(this.mDye.getXform().getXPos(),this.mDye.getXform().getYPos());
    this.mWalking.getXform().setPosition(this.mDye.getXform().getXPos(),this.mDye.getXform().getYPos());
   
    for(var i = 0; i < platforms.size(); i++){
        var platform = platforms.getObjectAt(i);
        
        var mPlatformBottom=platform.getXform().getYPos() - platform.getXform().getHeight()/2;
        var mPlatformTop=platform.getXform().getYPos() + platform.getXform().getHeight()/2;
        var mPlatformLeft=platform.getXform().getXPos() - platform.getXform().getWidth()/2;
        var mPlatformRight=platform.getXform().getXPos() + platform.getXform().getWidth()/2;
        
    /*    if (((mHeroBottom < mPlatformTop) && (mHeroTop > mPlatformBottom) && (mHeroRight > mPlatformLeft))
         || ((mHeroLeft < mPlatformRight) && (mHeroRight > mPlatformLeft) && ((mHeroTop > mPlatformBottom) ||(mHeroBottom < mPlatformTop))))
                this.isCollided = true;
        else 
                this.isCollided = false;
    */  
        if ((mHeroBottom < mPlatformTop) && (mHeroTop > mPlatformBottom))
            if ((mHeroLeft < mPlatformRight) && (mHeroRight > mPlatformLeft))
                this.isCollided = true;
    }

    // Collision with hamburger
    for(var i = 0; i < hamburgers.size(); i++){
        var hamburger = hamburgers.getObjectAt(i);

        var mHamburgerBottom=hamburger.getXform().getYPos() - hamburger.getXform().getHeight()/2;
        var mHamburgerTop=hamburger.getXform().getYPos() + hamburger.getXform().getHeight()/2;
        var mHamburgerLeft=hamburger.getXform().getXPos() - hamburger.getXform().getWidth()/2;
        var mHamburgerRight=hamburger.getXform().getXPos() + hamburger.getXform().getWidth()/2;

        if ((mHeroBottom < mHamburgerTop) && (mHeroTop > mHamburgerBottom))
            if ((mHeroLeft < mHamburgerRight) && (mHeroRight > mHamburgerLeft)) {
                hamburger.setPosition(-200, -200);
                this.RunningCountDown = 1000;
            }
    }
};

Hero3.prototype.getFallingResult = function() {
    return this.getXform().getYPos() < -5;
};

Hero3.prototype.draw = function( aCamera ){
    if(this.RunningCountDown) {
        this.mRRunning.draw(aCamera);
    }
    else
    {
        this.mWalking.draw(aCamera);
    }
}
