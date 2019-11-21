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

function Hero2(spriteTexture, atX, atY, width, height, moveSpeed, jumpSpeed) {
    this.kXDelta = 1;
    this.kYDelta = 2.0;
    
    this.run = "assets/run.png";
    this.walk = "assets/walk.png"
    
    this.moveSpeed = moveSpeed;
    this.moveSpeed_Max;
    this.moveSpeed_Min;
    
    this.jumpSpeed = jumpSpeed;
    this.isGrounded = false;
    
    this.mDye = new SpriteRenderable(spriteTexture);
    this.mDye.setColor([1, 1, 1, 0]);
    this.mDye.getXform().setPosition(atX, atY);
    this.mDye.getXform().setSize(width, height);
    this.mDye.setElementPixelPositions(0, this.mDye.getTextureWidth(), 0, this.mDye.getTextureHeight());
    GameObject.call(this, this.mDye);
    
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
    
    var r = new RigidRectangle(this.getXform(), this.mDye.getXform().getWidth(), this.mDye.getXform().getHeight());
    r.setMass(0.5);  // less dense than Minions
    r.setRestitution(0.3);
    r.setColor([0, 1, 0, 1]);
    r.setDrawBounds(false);
    this.setPhysicsComponent(r);
}
gEngine.Core.inheritPrototype(Hero2, GameObject);

Hero2.prototype.update = function (platforms) {
    // must call super class update
    GameObject.prototype.update.call(this);

    var v = this.getPhysicsComponent().getVelocity();
    
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Up) && this.isGrounded) {
        v[1] = this.jumpSpeed;
    }
    
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {
        v[0] = this.moveSpeed;
    }
    //  no horizontal input, but still moving
    else {
        if(Math.abs(v[0]) > 1.0) {
            //  moving right, v[0] > 0
            if(Math.sign(v[0] > 0)){
                v[0] -= 2.0;    //  decrease the speed value to around 0
            } 
            //  moving left, v[0] < 0
            else{
                v[0] += 2.0;    //  increase the value value to around 0
            }
        }
    } 
    
    this.mRRunning.updateAnimation();
    this.mRRunning.getXform().setPosition(this.mDye.getXform().getXPos(),this.mDye.getXform().getYPos());
    
    for(var i = 0; i < platforms.size(); i++){
        var platform = platforms.getObjectAt(i);
        var yDis = (this.getXform().getYPos() - this.getXform().getHeight() / 2) 
                - (platform.getXform().getYPos() + platform.getXform().getHeight() / 2);
        var xDis = this.getXform().getXPos() - platform.getXform().getXPos();
        if(Math.abs(xDis) <= platform.getXform().getWidth() / 2)
            if(yDis >= -0.5 && yDis <= 0.5) {
                this.isGrounded = true;
                break;
            } else {
                this.isGrounded = false;
        }
    }
};

Hero2.prototype.getFallingResult = function() {
    return this.getXform().getYPos() < 0;
};

Hero2.prototype.draw = function( aCamera ){
    this.mRRunning.draw(aCamera);
}