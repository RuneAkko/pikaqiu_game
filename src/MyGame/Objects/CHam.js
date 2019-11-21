/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* File: CHam.js 
 *
 * Creates and initializes a ploatform object
 */

/*jslint node: true, vars: true */
/*global gEngine, GameObject, TextureRenderable, RigidRectangle */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function CHam(texture, atX, atY, width, height) {
    this.mHamburger = new TextureRenderable(texture);
    this.mHamburger.setColor([1, 1, 1, 0]);
    this.mHamburger.getXform().setPosition(atX, atY);
    this.mHamburger.getXform().setSize(width, height);
                                // show each element for mAnimSpeed updates
    GameObject.call(this, this.mHamburger);

    var rigidShape = new RigidRectangle(this.getXform(), width, height);
    rigidShape.setMass(0);  // ensures no movements!
    rigidShape.setDrawBounds(true);
    rigidShape.setColor([1, 0.2, 0.2, 0]);
    this.setPhysicsComponent(rigidShape);
}
gEngine.Core.inheritPrototype(CHam, GameObject);

CHam.prototype.setPosition = function (xPos, yPos) {
    this.mHamburger.getXform().setPosition(xPos, yPos);
}

