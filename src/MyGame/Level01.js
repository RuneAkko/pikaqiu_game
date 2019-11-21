/*
 * File: Level01.js
 * This is the logic of our game.
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, Scene, GameObjectSet, TextureObject, Camera, vec2,
  FontRenderable, ParticleGameObjectSet, ParticleEmitter
  GameObject, Hero, Minion, Dye, Platform, Wall, DyePack, Particle */
/* find out more about jslint: http://www.jslint.com/help.html */

/*
 * File: Level01.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, Scene, GameObjectSet, TextureObject, Camera, vec2,
  FontRenderable, ParticleGameObjectSet, ParticleEmitter
  GameObject, Hero, Minion, Dye, Platform, Wall, DyePack, Particle */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Level01() {
    this.sceneFile = "assets/Scenes/Level01.json";
    this.curOptionID = 0;

    this.sceneParser = null;
    this.mCameras = [];
    this.mPlatformAttrs = [];
    this.mWallAttrs = [];
    this.mHamburgerAttrs = [];
    this.mTextAttrs = [];

    this.mCamera = null;
    this.mHero = null;

    this.nextLevel = null;
    this.thisLevel = null;
    this.deltax = null;
    this.mBackground = null;
}
gEngine.Core.inheritPrototype(Level01, Scene);

Level01.prototype.loadScene = function () {
    this.kPlatformTexture = "assets/Block.png";
    this.kHamburgerTexture = "assets/Hamburger.png";
    this.kBackgTexture = "assets/backg.png";
    this.kBackgroundTexture = "assets/Background.png";
    this.kBackgroundTexture1 = "assets/Background1.png";
    this.kWallTexture = "assets/wall.png";
    this.kHeroSprite = "assets/111.png";
    this.kRun = "assets/run.png";
    this.kWalk = "assets/walk.png";
    this.kFontCon72 = "assets/fonts/Consolas-72";

    this.sceneParser = null;
    this.mCameras = [];
    this.mPlatformAttrs = [];
    this.mHamburgerAttrs = [];
    this.mWallAttrs = [];
    this.mTexts = new GameObjectSet();
    this.mAllPlatforms = new GameObjectSet();
    this.mAllHamburgers = new GameObjectSet();
    this.mAllWalls = new GameObjectSet();

    gEngine.TextFileLoader.loadTextFile(this.sceneFile, gEngine.TextFileLoader.eTextFileType.eJsonFile);
    gEngine.Textures.loadTexture(this.kPlatformTexture);
    gEngine.Textures.loadTexture(this.kHamburgerTexture);

    gEngine.Textures.loadTexture(this.kBackgroundTexture);
    gEngine.Textures.loadTexture(this.kBackgroundTexture1);
    gEngine.Textures.loadTexture(this.kWallTexture);
    gEngine.Textures.loadTexture(this.kHeroSprite);
    gEngine.Textures.loadTexture(this.kRun);
    gEngine.Textures.loadTexture(this.kWalk);
    gEngine.Fonts.loadFont(this.kFontCon72);

};

Level01.prototype.unloadScene = function () {
    gEngine.TextFileLoader.unloadTextFile(this.sceneFile);
    gEngine.Core.startScene(this.nextLevel);
};
Level01.prototype.initialize0 = function () {
    this.thisLevel = new Level01();
    this.nextLevel = new Level01();
    this.sceneParser = new SceneFileParser(this.sceneFile);
};

Level01.prototype.initialize = function () {
    this.initialize0();
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);
    //  Cameras
    this.setCameras();
    //  Characters
    this.setHero();
    //  Floor
    this.setPlatforms();
    this.setWalls();
    // Hamburger
    this.setHamburgers();
    // Text
    this.setTexts();
    //  Status
    this.setStatus();

    this.mBackground = new Background(this.kBackgroundTexture,this.kBackgroundTexture1, 100, 50, 200, 100);


    var mHeroPosx=this.mHero.getXform().getXPos();
    var mCenterx=this.mCamera.getWCCenter()[0];
    this.deltax = mCenterx - mHeroPosx;
};
Level01.prototype.setCameras = function() {
    this.mCameras = this.sceneParser.getCameras(this.mCameras);
    this.mCamera = this.mCameras[0];
};
Level01.prototype.setHero = function() {
    var heroAttr = this.sceneParser.getHeroAttr();
    //  (x, y, width, height, moveSpeed, jumpSpeed);
    this.mHero = new Hero(this.kHeroSprite, heroAttr[0], heroAttr[1], heroAttr[2], heroAttr[3], heroAttr[4], heroAttr[5]);
};
Level01.prototype.setPlatforms = function() {
    this.mPlatformAttrs = this.sceneParser.getPlatforms(this.mPlatformAttrs);
    for(var i = 0; i < this.mPlatformAttrs.length; i++) {
        var platformAttr = this.mPlatformAttrs[i];
        var platform = new Platform(this.kPlatformTexture, platformAttr[0], platformAttr[1], platformAttr[2], platformAttr[3]);
        this.mAllPlatforms.addToSet(platform);
    }
};
Level01.prototype.setHamburgers = function() {
    this.mHamburgerAttrs = this.sceneParser.getHamburgers(this.mHamburgerAttrs);
    for (var i = 0; i < this.mHamburgerAttrs.length; ++i) {
        var hamburgerAttr = this.mHamburgerAttrs[i];
        var hamburger = new CHam(this.kHamburgerTexture, hamburgerAttr[0], hamburgerAttr[1], hamburgerAttr[2], hamburgerAttr[3]);
        this.mAllHamburgers.addToSet(hamburger);
    }
};
Level01.prototype.setWalls = function() {
    this.mWallAttrs = this.sceneParser.getWalls(this.mWallAttrs);
    for(var i = 0; i < this.mWallAttrs.length; i++) {
        var wallAttr = this.mWallAttrs[i];
        var wall = new Wall(this.kWallTexture, wallAttr[0], wallAttr[1], wallAttr[2], wallAttr[3]);
        this.mAllWalls.addToSet(wall);
    }
};
Level01.prototype.setStatus = function() {
    this.mGameStatus = this.sceneParser.getStatus();
};

Level01.prototype.setTexts = function() {
    this.mTextAttrs = this.sceneParser.getTexts(this.mTextAttrs);
    if(this.mTextAttrs !== null) {
        for(var i = 0; i < this.mTextAttrs.length; i++) {
            var textAttr = this.mTextAttrs[i];
            var text = new FontRenderable(textAttr[0]);
            text.setFont(this.kFontCon72);
            this.setText(text, textAttr[1], textAttr[2], textAttr[3], textAttr[4]);
            this.mTexts.addToSet(text);
        }
    }
};
Level01.prototype.setText = function (font, posX, posY, color, textH) {
    font.setColor(color);
    font.getXform().setPosition(posX, posY);
    font.setTextHeight(textH);
};

Level01.prototype.physicsSimulation = function() {
    //  platform
    gEngine.Physics.processObjSet(this.mHero, this.mAllPlatforms);
    // Hamburger
    gEngine.Physics.processObjSet(this.mHero, this.mAllHamburgers);
    //  wall
    gEngine.Physics.processObjSet(this.mHero, this.mAllWalls);
};
// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
Level01.prototype.draw = function () {
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    var cx=this.mHero.getXform().getXPos();
    var cy=this.mCamera.getWCCenter()[1];
    this.mCamera.setWCCenter(cx + this.deltax , cy);

    this.mCamera.setupViewProjection();
    this.mBackground.draw(this.mCamera);
    this.mAllPlatforms.draw(this.mCamera);
    this.mAllHamburgers.draw(this.mCamera);
    this.mAllWalls.draw(this.mCamera);

    this.mHero.draw(this.mCamera);

    this.mTexts.draw(this.mCamera);

};

Level01.prototype.update = function () {
    this.gameResultDetecting(); // win/lose/    
    this.mCamera.update();  // to ensure proper interpolated movement effects    
    this.mAllWalls.update();
    this.mAllPlatforms.update();
    this.mBackground.update(this.mHero);
    this.mAllHamburgers.update();
    //playing
    var incY = 0
    for(var i = 0; i < this.mTextAttrs.length; i++) {
        this.mTexts.getObjectAt(i).getXform().setPosition(this.mCamera.getWCCenter()[0], this.mCamera.getWCCenter()[1]-incY);
        incY += this.mTexts.getObjectAt(i).getXform().getWidth()*1;
    }

    //debug
    //this.showAnimationWin();
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.R)) {
        this.nextLevel = this.thisLevel;
        gEngine.GameLoop.stop();
    }

    if (this.mGameStatus === 0) {
        this.mHero.update(this.mAllPlatforms, this.mAllHamburgers);

        if (this.mHero.isCollided == true)
        {
            //Entry
            this.nextLevel = new Level01();
            this.mGameStatus = 1;
        }
        if (this.mHero.Finish())
        {
            this.nextLevel = new Level02();
            gEngine.GameLoop.stop();
        }
        //  debug
        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Q)){
            this.nextLevel = new Level02();
            gEngine.GameLoop.stop();
        }
    }
    // physics simulation
    //this.physicsSimulation();
    // win/lose
    if (this.mGameStatus === 1) {
        if (this.showAnimationLose()){
            this.nextLevel = this.thisLevel;
            gEngine.GameLoop.stop();
        }
    }
    if (this.mGameStatus === 2) {
        gEngine.GameLoop.stop();
    }

    this.update0(); // to be overwrited; 
};

Level01.prototype.update0 = function(){

};

Level01.prototype.gameResultDetecting = function () {

};

Level01.prototype.optionSelect = function() {
    if((gEngine.Input.isKeyClicked(gEngine.Input.keys.Up) || gEngine.Input.isKeyClicked(gEngine.Input.keys.W) )&& this.curOptionID === 1) {
        this.curOptionID = 0;
    } else if ((gEngine.Input.isKeyClicked(gEngine.Input.keys.Down) || gEngine.Input.isKeyClicked(gEngine.Input.keys.D)) && this.curOptionID === 0) {
        this.curOptionID = 1;
    }

    if(this.curOptionID === 1) {
        this.mTexts.getObjectAt(1).setTextHeight(8);
        this.mTexts.getObjectAt(0).setTextHeight(6);
        //this.mTexts.getObjectAt(1).getXform().setPosition(24 - 10, 40);
        //this.mTexts.getObjectAt(0).getXform().setPosition(27, 53);
    } else if (this.curOptionID === 0) {
        this.mTexts.getObjectAt(1).setTextHeight(6);
        this.mTexts.getObjectAt(0).setTextHeight(8);
        //this.mTexts.getObjectAt(1).getXform().setPosition(27 - 10,53);
        //this.mTexts.getObjectAt(0).getXform().setPosition(24, 40);
    }
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.Enter) || gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)) {
        if(this.curOptionID === 0) {
            this.nextLevel = new Level01();
        } else if (this.curOptionID === 1) {
            this.nextLevel = new Credits();
        }
        gEngine.GameLoop.stop();
        return true;
    }
    return false;
};

Level01.prototype.showAnimationLose = function(){
    var delta =0.02;
    var mIntensity = gEngine.DefaultResources.getGlobalAmbientIntensity();
    mIntensity -= delta;
    gEngine.DefaultResources.setGlobalAmbientIntensity(mIntensity);
    return mIntensity <= 0;
};