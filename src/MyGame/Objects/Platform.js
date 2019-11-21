/* File: Platform.js 
 *
 * Creates and initializes a ploatform object
 */

/*jslint node: true, vars: true */
/*global gEngine, GameObject, TextureRenderable, RigidRectangle */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

/* File: Platform.js 
 *
 * Creates and initializes a ploatform object
 */

/*jslint node: true, vars: true */
/*global gEngine, GameObject, TextureRenderable, RigidRectangle */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Platform(texture, atX, atY, width, height) {
    this.mPlatform = new TextureRenderable(texture);
    this.mPlatform.setColor([1, 1, 1, 0]);
    this.mPlatform.getXform().setPosition(atX, atY);
    this.mPlatform.getXform().setSize(width, height);
                                // show each element for mAnimSpeed updates
    this.fire = "assets/fire.png";

    this.mFiring = new SpriteAnimateRenderable(this.fire);
    this.mFiring.setColor([1, 1, 1, 0]);
    this.mFiring.getXform().setPosition(atX, atY);
    this.mFiring.getXform().setSize(width, height);
    this.mFiring.setElementPixelPositions(0, this.mFiring.getTextureWidth(), 0, this.mFiring.getTextureHeight());
    this.mFiring.setSpriteSequence(256,0,
        171,256,
        3,
        0);
    this.mFiring.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateRight);
    this.mFiring.setAnimationSpeed(10);

    GameObject.call(this, this.mPlatform);

    var rigidShape = new RigidRectangle(this.getXform(), width, height);
    rigidShape.setMass(0);  // ensures no movements!
    rigidShape.setDrawBounds(true);
    rigidShape.setColor([1, 0.2, 0.2, 0]);
    this.setPhysicsComponent(rigidShape);
}
gEngine.Core.inheritPrototype(Platform, GameObject);

Platform.prototype.update = function()
{
    this.mFiring.updateAnimation();
    this.mFiring.getXform().setPosition(this.mPlatform.getXform().getXPos(),this.mPlatform.getXform().getYPos());
}

Platform.prototype.draw = function(c)
{
    this.mFiring.draw(c);
}
