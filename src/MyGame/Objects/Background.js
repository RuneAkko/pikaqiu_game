/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/*
Background

 */
"use strict"

function Background(texture,texture2, atX, atY, width, height) {
    this.mBackground = new TextureRenderable(texture);
    this.mBackgroundNext = new TextureRenderable(texture2);

    this.mBackground.setColor([1, 1, 1, 0]);
    this.mBackground.getXform().setPosition(atX, atY);
    this.mBackground.getXform().setSize(width, height);

    this.mBackgroundNext.setColor([1, 1, 1, 0]);
    this.mBackgroundNext.getXform().setPosition(atX, atY);
    this.mBackgroundNext.getXform().setSize(width, height);

    this.state = 0;

    GameObject.call(this, this.mBackground);

}
gEngine.Core.inheritPrototype(Background, GameObject);

Background.prototype.update = function (hero) {
    var heroX =  hero.getXform().getXPos();
    var bgX1 = this.mBackground.getXform().getXPos();
    var bgX2 = this.mBackgroundNext.getXform().getXPos();
    var bgY = this.mBackground.getXform().getYPos();
    var bgWidth = this.mBackground.getXform().getWidth();
    if(this.state == 0 && heroX > bgX1 - bgWidth/2.45)
    {
        this.mBackgroundNext.getXform().setPosition(bgX1 + bgWidth -3, bgY);
        this.state = 1;
    }
    else if(this.state == 1 && heroX > bgX2 - bgWidth/2.45) {
        this.mBackground.getXform().setPosition(bgX2 + bgWidth - 3, bgY);
        this.state = 0;
    }
}

Background.prototype.draw = function(Camera){
    this.mBackground.draw(Camera);
    this.mBackgroundNext.draw(Camera);
}
