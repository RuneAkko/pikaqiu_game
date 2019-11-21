/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, Scene, GameObjectSet, TextureObject, Camera, vec2,
  FontRenderable, ParticleGameObjectSet, ParticleEmitter
  GameObject, Hero, Minion, Dye, Platform, Wall, DyePack, Particle */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame() {
    this.sceneFile = "assets/Scenes/Level0.json";

    this.sceneParser = null;
    this.mCameras = [];
    this.mPlatformAttrs = [];
    this.mWallAttrs = [];
    this.mHamburgerAttrs = [];
    this.mTextAttrs = [];
    
    this.mCamera = null;
    this.mHero = null;
    this.mCatherine = null; 
    this.mFlower = null;
    
    this.nextLevel = null;
    this.thisLevel = null;     
    this.deltax = null;
    this.mBackground = null;
}
gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.loadScene = function () {
    this.kPlatformTexture = "assets/Block.png";
    this.kHamburgerTexture = "assets/Hamburger.png";
    this.kBackgTexture = "assets/backg.png";
    this.kBackgroundTexture = "assets/Background.png";
    this.kBackgroundTexture1 = "assets/Background1.png";
    this.kBackgroundTexture2 = "assets/Background2.png";
    this.kWallTexture = "assets/wall.png";
    this.kHeroSprite = "assets/111.png";
    this.kRun = "assets/run.png";
    this.kWalk = "assets/walk.png";
    this.kHuman = "assets/Human.png";
    this.kCatherine = "assets/Catherine.png";
    this.kFlower = "assets/flower.png";
    this.kFire = "assets/fire.png";
    this.kFontCon72 = "assets/fonts/Consolas-72";
    this.kBGM = "assets/sounds/BackgroundMusic.mp3";
    
    this.sceneParser = null;
    this.mCameras = [];
    this.mPlatformAttrs = [];
    this.mHamburgerAttrs = [];
    this.mWallAttrs = [];
    this.mHumanAttrs = [];
    
    this.mTexts = new GameObjectSet();
    this.mAllPlatforms = new GameObjectSet();
    this.mAllHamburgers = new GameObjectSet();
    this.mAllHumans = new GameObjectSet();
    this.mAllWalls = new GameObjectSet();
    
    gEngine.TextFileLoader.loadTextFile(this.sceneFile, gEngine.TextFileLoader.eTextFileType.eJsonFile);
    gEngine.Textures.loadTexture(this.kPlatformTexture);
    gEngine.Textures.loadTexture(this.kHamburgerTexture);
    
    gEngine.Textures.loadTexture(this.kBackgroundTexture);
    gEngine.Textures.loadTexture(this.kBackgroundTexture1);
    gEngine.Textures.loadTexture(this.kBackgroundTexture2);
    gEngine.Textures.loadTexture(this.kWallTexture);
    gEngine.Textures.loadTexture(this.kHeroSprite);
    gEngine.Textures.loadTexture(this.kRun);
    gEngine.Textures.loadTexture(this.kWalk);
    gEngine.Textures.loadTexture(this.kFire);
    gEngine.Textures.loadTexture(this.kFlower);
    gEngine.Textures.loadTexture(this.kHuman);
    gEngine.Textures.loadTexture(this.kCatherine);
    gEngine.Fonts.loadFont(this.kFontCon72);
    
    gEngine.AudioClips.loadAudio(this.kBGM);
};

MyGame.prototype.unloadScene = function () { 
    gEngine.TextFileLoader.unloadTextFile(this.sceneFile);
    gEngine.Core.startScene(this.nextLevel);
};
MyGame.prototype.initialize0 = function () {
    this.thisLevel = new MyGame();
    this.nextLevel = new MyGame(); 
    this.sceneParser = new SceneFileParser(this.sceneFile);
    gEngine.AudioClips.playBackgroundAudio(this.kBGM);
};

MyGame.prototype.initialize = function () {
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
MyGame.prototype.setCameras = function() {
    this.mCameras = this.sceneParser.getCameras(this.mCameras);
    this.mCamera = this.mCameras[0];
};
MyGame.prototype.setHero = function() {
    var heroAttr = this.sceneParser.getHeroAttr();
    //  (x, y, width, height, moveSpeed, jumpSpeed);
    this.mHero = new Hero(this.kHeroSprite, heroAttr[0], heroAttr[1], heroAttr[2], heroAttr[3], heroAttr[4], heroAttr[5]);
};
MyGame.prototype.setPlatforms = function() {
    this.mPlatformAttrs = this.sceneParser.getPlatforms(this.mPlatformAttrs);
    for(var i = 0; i < this.mPlatformAttrs.length; i++) {
        var platformAttr = this.mPlatformAttrs[i];
        var platform = new Platform(this.kPlatformTexture, platformAttr[0], platformAttr[1], platformAttr[2], platformAttr[3]);
        this.mAllPlatforms.addToSet(platform);
    }
};
MyGame.prototype.setHamburgers = function() {
    this.mHamburgerAttrs = this.sceneParser.getHamburgers(this.mHamburgerAttrs);
    for (var i = 0; i < this.mHamburgerAttrs.length; ++i) {
        var hamburgerAttr = this.mHamburgerAttrs[i];
        var hamburger = new CHam(this.kHamburgerTexture, hamburgerAttr[0], hamburgerAttr[1], hamburgerAttr[2], hamburgerAttr[3]);
        this.mAllHamburgers.addToSet(hamburger);
    }
};
MyGame.prototype.setWalls = function() {
    this.mWallAttrs = this.sceneParser.getWalls(this.mWallAttrs);
    for(var i = 0; i < this.mWallAttrs.length; i++) {
        var wallAttr = this.mWallAttrs[i];
        var wall = new Wall(this.kWallTexture, wallAttr[0], wallAttr[1], wallAttr[2], wallAttr[3]);
        this.mAllWalls.addToSet(wall);
    }
};
MyGame.prototype.setStatus = function() {
    this.mGameStatus = this.sceneParser.getStatus();
};

MyGame.prototype.setTexts = function() {
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
MyGame.prototype.setText = function (font, posX, posY, color, textH) {
    font.setColor(color);
    font.getXform().setPosition(posX, posY);
    font.setTextHeight(textH);
};

MyGame.prototype.physicsSimulation = function() {
    //  platform
    gEngine.Physics.processObjSet(this.mHero, this.mAllPlatforms);  
    // Hamburger
    gEngine.Physics.processObjSet(this.mHero, this.mAllHamburgers);
    //  wall
    gEngine.Physics.processObjSet(this.mHero, this.mAllWalls);
};
// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
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

MyGame.prototype.update = function () {
    this.gameResultDetecting(); // win/lose/    
    this.mCamera.update();  // to ensure proper interpolated movement effects    
    this.mAllWalls.update();    
    this.mAllPlatforms.update();
    this.mBackground.update(this.mHero);
    this.mAllHamburgers.update();
    //playing

    //debug
    //this.showAnimationWin();
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.R)) {
        this.nextLevel = this.thisLevel;
        gEngine.GameLoop.stop();
    }
    
    if (this.mGameStatus === 0) {
        this.mHero.update(this.mAllPlatforms, this.mAllHamburgers);
        
        if (this.mHero.isCollided == true)
            gEngine.GameLoop.stop();
        //  debug
        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Q)){
         
            gEngine.GameLoop.stop();
        }       
    }        
    // physics simulation
    //this.physicsSimulation();
    // win/lose
    if (this.mGameStatus === 1) {
        this.nextLevel = this.thisLevel;
        gEngine.GameLoop.stop();
    }
    if (this.mGameStatus === 2) {
        gEngine.GameLoop.stop();    
    }
    
    this.update0(); // to be overwrited; 
};

MyGame.prototype.update0 = function(){
    var incY = 0
    for(var i = 0; i < this.mTextAttrs.length; i++) {
        this.mTexts.getObjectAt(i).getXform().setPosition(this.mCamera.getWCCenter()[0], this.mCamera.getWCCenter()[1]-incY);
        incY += this.mTexts.getObjectAt(i).getXform().getWidth()*1;
    }
    // start menu
    this.optionSelect()
};

MyGame.prototype.gameResultDetecting = function () {

};

MyGame.prototype.optionSelect = function() {

    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.Enter) || gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)) {
        this.nextLevel = new Level01();

        gEngine.GameLoop.stop();
        return true;
    }
    return false;
};

MyGame.prototype.showAnimationLose = function(){
    var delta =0.02;
    var mIntensity = gEngine.DefaultResources.getGlobalAmbientIntensity();
    mIntensity -= delta;
    gEngine.DefaultResources.setGlobalAmbientIntensity(mIntensity);
    return mIntensity <= 0;
};