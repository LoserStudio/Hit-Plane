//-----------------------------------------------------------------------------
// 建立遊戲預設值
//

var Ls_system = {
	screenWidth  : 1280, //解析度寬
	screenHeight : 720,	 //解析度高
	PI : Math.PI / 180,
};

Math.randomInt = function(max){
	return Math.floor(max * Math.random());
};

Math.minRandom = function( min, max ) {
	return Math.random() * ( max - min ) + min;
}

function hexToRgba( color, Opacity ){
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
	var red    = parseInt(result[1], 16) + ",";
	var green  = parseInt(result[2], 16) + ",";
	var blue   = parseInt(result[3], 16) + ",";
	var Opac   = Opacity / 255;
	return 'rgba(' + red + green + blue + Opac + ')' ;
}

function getAngle( x, y, ax, ay ){
	var m = Math.atan((ay - y)/(ax - x));
	var angle = Math.round( Math.abs( m / (2 * Math.PI / 360 )) );
	if( angle == 90 ){ return y > ay ? 180 : 0  ; } //水平線
	if( angle == 0  ){ return x > ax ? 90  : 270; } //垂直線
	if( x < ax && y > ay ){
		return 270 - angle;
	}else if( x < ax && y < ay ){
		return 270 + angle;
	}else if( x > ax && y > ay ){
		return 90 + angle;
	}else if( x > ax && y < ay ){
		return 90 - angle;
	}
}

//-----------------------------------------------------------------------------
// 建立遊戲主程序
//

function Ls_Manager(){
	throw new Error('This is a static class');
}

Ls_Manager.initialize = function() {
	Ls_Game.initialize();
	Ls_Touch.initialize();
	Ls_Scene.initialize();
	this.getBgm();
	this.mainUpdata();
}

Ls_Manager.getImageName = function(filename) {
	return "img/" + encodeURIComponent(filename) + ".png";
}

Ls_Manager.mainUpdata = function() {
	Ls_Game.update();
	Ls_Scene.mainUpdate();
	Ls_Touch.setActionInitialize();
	requestAnimationFrame(this.mainUpdata.bind(this))
}

Ls_Manager.getBgm = function() {
	this.bgm = new Audio("audio/" + encodeURIComponent('wwbgm') + ".wav");
	this.bgm.autoplay = true;
	this.bgm.loop = true;
	this.bgm.volume = 0.5;
}

//-----------------------------------------------------------------------------
// 鍵盤與滑鼠事件
//

function Ls_Touch(){
	throw new Error('This is a static class');
}

Ls_Touch.initialize = function(){
	this.x = 0;
	this.y = 0;
	this.keepDownLeft = false;
	this.setActionInitialize();
	this.listener();
}

Ls_Touch.setActionInitialize = function(){
	this.now = {};
	this.now.move = false;
	this.now.downLeft   = false;
	this.now.downMiddle = false;
	this.now.downRight  = false;
}

Ls_Touch.listener = function(){
	document.addEventListener('mousemove', this.onMouseMove.bind(this));
	document.addEventListener('mousedown', this.onMouseDown.bind(this));
	document.addEventListener('mouseup', this.onMouseUp.bind(this));
}

Ls_Touch.onMouseMove = function(event){
	this.x = event.pageX;
	this.y = event.pageY;
	this.now.move = true;
}

Ls_Touch.onMouseDown = function(event){
    if ( event.button === 0 ) {
		this.keepDownLeft = true;
        this.now.downLeft = true;
		return;
    }
	if ( event.button === 1 ) {
        this.now.downMiddle = true;
		return;
    }
	if ( event.button === 2 ) {
        this.now.downRight = true;
		return;
    }
}

Ls_Touch.onMouseUp = function(event){
    if ( event.button === 0 ) {
		this.keepDownLeft = false;
		return;
    }
}

Ls_Touch.nowAction = function(action){
	if( action === "move" && this.now.move ){
		return true;
	}
	if( action === "down_left" && this.now.downLeft ){
		return true;
	}
	if( action === "down_middle" && this.now.downMiddle ){
		return true;
	}
	if( action === "down_right" && this.now.downRight ){
		return true;
	}
	if( action === "keepdonw_left" && this.keepDownLeft ){
		return true;
	}
	return false;
}

//-----------------------------------------------------------------------------
// 建立事件
//

function Ls_Game(){
	throw new Error('This is a static class');
}

Ls_Game.initialize = function() {
	this.airplaneTime = 0;
	this.cloudTime = 0;
}

Ls_Game.update = function() {
	this.airplaneTime += 1;
	this.cloudTime += 1;
	this.makeAirplane();
	this.makeCloud();
}

Ls_Game.makeAirplane = function() {
	if( this.airplaneTime >= 50 ){
		Ls_event.makeAirplane();
		Ls_event.makeAirplane();
		this.airplaneTime = 0;
	}
}

Ls_Game.makeCloud = function() {
	if( this.cloudTime >= 40 ){
		Ls_event.makeCloud();
		this.cloudTime = 0;
	}
}

//-----------------------------------------------------------------------------
// 建立遊戲繪製基底
//

function Ls_Scene(){
	throw new Error('This is a static class');
}

Ls_Scene.initialize = function() {
	this.width = Ls_system.screenWidth || 1;
	this.height = Ls_system.screenHeight || 1;
	this.getRenderer();
	this.getPlayerRenderer();
	this.getStage();
}

Ls_Scene.getRenderer = function(){
	this.canvas = document.getElementById('background');
	this.canvas.width = this.width;
    this.canvas.height = this.height;
	this.renderer = PIXI.autoDetectRenderer( this.width, this.height, { view: this.canvas } );
	this.renderer.autoResize = true;
	this.renderer.resize( this.width, this.height );
	this.renderer.backgroundColor = 0x000000;
	document.body.appendChild(this.renderer.view);
}

Ls_Scene.getPlayerRenderer = function(){
	this.playerCanvas = document.getElementById('player');
	this.playerCanvas.width = this.width;
    this.playerCanvas.height = this.height;
	this.playerRenderer = PIXI.autoDetectRenderer( this.width, this.height, { view: this.playerCanvas , transparent: true } );
	this.playerRenderer.autoResize = true;
	this.playerRenderer.resize( this.width, this.height );
	this.renderer.backgroundColor = 0x0000ff;
	document.body.appendChild(this.playerRenderer.view);
}

Ls_Scene.getStage = function(){
	this.stage = new PIXI.Container();
	this.stage.addChild( new Ls_backGround() );
	this.stage.addChild( new Ls_gameEvent() );
	this.stage.addChild( new Ls_mountain() );
	this.playerStage = new PIXI.Container();
	this.playerStage.addChild( new Ls_Player() );
}

Ls_Scene.mainUpdate = function(){
	this.stageUpdate();
	this.eventUpdate();
	this.animate();
}

Ls_Scene.stageUpdate = function(){
	this.stage.children.forEach( function(child) { if (child.update) { child.update(); } });
	this.playerStage.children.forEach( function(child) { if (child.update) { child.update(); } });
}

Ls_Scene.eventUpdate = function(){
	Ls_event.data.forEach( function(event) { if (event.mainUpdate) { event.mainUpdate(); } });
}

Ls_Scene.animate = function(){
	this.renderer.render(this.stage);
	this.playerRenderer.render(this.playerStage);
}

//-----------------------------------------------------------------------------
// 建立Bitmap
//

function Ls_Bitmap(){
	this.initialize.apply(this, arguments);
}

Ls_Bitmap.prototype.initialize = function( w, h ){
	this.canvas = document.createElement('canvas');
	this.canvas.width = w || Ls_system.screenWidth;
    this.canvas.height = h || Ls_system.screenHeight;
	this.context = this.canvas.getContext('2d');
	this.setPIXI();
	this.setFont();
}

Ls_Bitmap.prototype.setPIXI = function(){
	this.texture = new PIXI.Texture(new PIXI.BaseTexture(this.canvas));
    this.texture.mipmap = false;
    this.texture.scaleMode = PIXI.SCALE_MODES.NEAREST;
}

Ls_Bitmap.prototype.setFont = function() {
	this.context.textAlign = 'center';		//文字位置
	this.context.font = '24px GameFont';	//文字大小與自體
}

//-----------------------------------------------------------------------------
// 建立Sprite
//

function Ls_Canvas(){
	this.initialize.apply(this, arguments);
}

Ls_Canvas.prototype = Object.create(PIXI.Sprite.prototype);
Ls_Canvas.prototype.constructor = Ls_Canvas;

Ls_Canvas.prototype.initialize = function( w, h ){
	this.bitmap = new Ls_Bitmap( w || Ls_system.screenWidth, h || Ls_system.screenHeight);
	this.context = this.bitmap.context;
	PIXI.Sprite.call( this, this.bitmap.texture );
}

Ls_Canvas.prototype.drawText = function( text, x, y ) {
	this.context.strokeText(text, x, y, this.bitmap.canvas.width );
	this.context.fillText( text, x, y, this.bitmap.canvas.width );
};

Ls_Canvas.prototype.canvasClear = function() {
	var width = this.bitmap.canvas.width;
	var height = this.bitmap.canvas.width;
	this.context.clearRect( 0, 0, width, height);
};

Ls_Canvas.prototype.drawRect = function( x, y, w, h, color, opacity ) {
	this.context.save();
	this.context.fillStyle = hexToRgba( color || "#FFFFFF", opacity || 255 );
	this.context.fillRect( x, y, w, h );
	this.context.restore();
};

//-----------------------------------------------------------------------------
// 建立玩家
//

function Ls_Player(){
	this.initialize.apply(this, arguments);
}

Ls_Player.prototype = Object.create(Ls_Canvas.prototype);
Ls_Player.prototype.constructor = Ls_Player;

Ls_Player.prototype.initialize = function(){
	Ls_Canvas.prototype.initialize.call(this);
	this.x = 0;
	this.y = 0;
	this.shotWait = 0;
	this.setBigGun();
	this.setSE();
	this.nowActionShot = true;
	this.setTrans();
}

Ls_Player.prototype.setTrans = function(){
	this.trans = document.getElementById('player');
	this.trans.style.transformOrigin = "50% 100%";
	this.transData = "perspective(1000px)";
	this.transX = 0;
	this.transY = 0;
}

Ls_Player.prototype.setBigGun = function(){
	var system = this;
	this.bigGun = new Image();
	this.bigGun.src = Ls_Manager.getImageName("GUN")
	this.bigGunShot = new Image();
	this.bigGunShot.src = Ls_Manager.getImageName("GUN-SHOT");
	this.bigGun.onload = function(){ system.drawBigGun(); };
}

Ls_Player.prototype.mouseMove = function(){
	if( Ls_Touch.nowAction("move") ){
		this.transX = -50 + Ls_Touch.y / ( Ls_system.screenHeight / 50 );
		this.transY = 45 - Ls_Touch.x / ( Ls_system.screenWidth / 90 );
		this.getTrans();
	}
}

Ls_Player.prototype.getTrans = function(){
	this.trans.style.transform = this.transData + " rotateX(" + this.transX + "deg) rotateY(" + this.transY + "deg) rotateZ(0deg)";
}

Ls_Player.prototype.drawBigGun = function(){
	this.canvasClear();
	var x = Ls_system.screenWidth / 2 - this.bigGun.width / 2;
	var y = Ls_system.screenHeight - this.bigGun.height + 50;
	var w = this.bigGun.width;
	var h = this.bigGun.height;
	this.context.drawImage( this.bigGun, 0, 0, w, h, x, y, w, h);
	this.nowActionShot = false;
	this.action();
}

Ls_Player.prototype.update = function(){
	if( this.nowActionShot ){
		this.drawBigGun();
	}
	if( Ls_Touch.nowAction("keepdonw_left") && this.shotWait === 0 ){
		this.shot();
	}
	if( this.shotWait !== 0 ){
		this.shotWait -= 1;
	}
	this.mouseMove();
}

Ls_Player.prototype.shot = function(){
	Ls_event.makeBullet();
	this.openSE();
	this.canvasClear();
	this.shotWait = 5;
	var x = Ls_system.screenWidth / 2 - this.bigGunShot.width / 2;
	var y = Ls_system.screenHeight - this.bigGunShot.height + 62;
	var w = this.bigGunShot.width;
	var h = this.bigGunShot.height;
	this.context.drawImage( this.bigGunShot, 0, 0, w, h, x, y, w, h);
	this.nowActionShot = true;
	this.action();
}

Ls_Player.prototype.action = function(){
	this.bitmap.texture.update();
}

Ls_Player.prototype.setSE = function() {
	this.se = new Audio("audio/" + encodeURIComponent('GUN') + ".wav");
}

Ls_Player.prototype.openSE = function() {
	if( this.se.currentTime >= this.se.duration - 0.5 ){
		this.se.currentTime = 0;
	}
	this.se.play();
}

//-----------------------------------------------------------------------------
// 建立山脈
//

function Ls_mountain(){
	this.initialize.apply(this, arguments);
}

Ls_mountain.prototype = Object.create(Ls_Canvas.prototype);
Ls_mountain.prototype.constructor = Ls_mountain;

Ls_mountain.prototype.initialize = function(){
	Ls_Canvas.prototype.initialize.call(this);
	this.mountain = new Image();
	this.mountain.src = "img/" + encodeURIComponent('Mountain') + ".png";
	var w = Ls_system.screenWidth;
	var h = Ls_system.screenHeight;
	this.context.drawImage( this.mountain, 0, 0 , w, h, 0, this.height - 135, w, h );
}

Ls_mountain.prototype.update = function(){
	this.canvasClear();
	var w = Ls_system.screenWidth;
	var h = Ls_system.screenHeight;
	this.context.drawImage( this.mountain, 0, 0 , w, h, 0, this.height - 135, w, h );
	this.bitmap.texture.update();
}

//-----------------------------------------------------------------------------
// 建立遊戲背景層
//

function Ls_backGround(){
	this.initialize.apply(this, arguments);
}

Ls_backGround.prototype = Object.create(Ls_Canvas.prototype);
Ls_backGround.prototype.constructor = Ls_backGround;

Ls_backGround.prototype.initialize = function(){
	Ls_Canvas.prototype.initialize.call(this);
	this.width = Ls_system.screenWidth;
	this.height = Ls_system.screenHeight;
	this.waveTime = 0;
	this.wave = [];
	this.waveData = {};
	this.getSea();
	this.getBgs();
}

Ls_backGround.prototype.getSea = function(){
	var system = this;
	this.sea = new Image();
	this.sea.src = "img/" + encodeURIComponent('SEA') + ".png";
}

Ls_backGround.prototype.drawSea = function(){
	var w = this.width;
	var h = this.height;
	this.context.drawImage( this.sea, 0, 0 , w, h, 0, 0, w, h );
}

Ls_backGround.prototype.update = function(){
	this.canvasClear();
	this.drawSea();
	this.makeWave();
	this.waveUpdata();
	this.openBgs();
	this.bitmap.texture.update();
}

Ls_backGround.prototype.waveUpdata = function(){
	for( var i = 0 ; i < this.wave.length ; i++ ){
		this.waveData = this.wave[i];
		this.waveData.update();
		this.drawSprite()
		if( this.waveData.frames > this.waveData.character_unit - 1 ){
			this.wave.splice(i,1);
		}
	}
}

Ls_backGround.prototype.makeWave = function() {
	this.waveTime += 1;
	if( this.waveTime >= 30 ){
		this.wave.push( new Ls_Wave() );
		this.waveTime = 0;
	}
}

Ls_backGround.prototype.drawSprite = function(){
	var image = this.waveData.character;
	var x = this.waveData.x - ( this.waveData.width / 2 );
	var y = this.waveData.y - ( this.waveData.height / 2 );
	var w = this.waveData.realWidth;
	var h = this.waveData.realHeight;
	var dw = this.waveData.width;
	var dh = this.waveData.height;
	var frames = this.waveData.frames;
	this.context.drawImage( image, w * frames, 0 , w, h, x, y, dw, dh );
}

Ls_backGround.prototype.getBgs = function() {
	this.bgs = new Audio("audio/" + encodeURIComponent('Sea') + ".wav");
	this.bgs.volume = 0.6;
}

Ls_backGround.prototype.openBgs = function() {
	if( this.bgs.currentTime >= this.bgs.duration - 0.5 ){
		this.bgs.currentTime = 0;
	}
	this.bgs.play();
}

//-----------------------------------------------------------------------------
// 建立遊戲事件層
//

function Ls_gameEvent(){
	this.initialize.apply(this, arguments);
}

Ls_gameEvent.prototype = Object.create(Ls_Canvas.prototype);
Ls_gameEvent.prototype.constructor = Ls_gameEvent;

Ls_gameEvent.prototype.initialize = function(){
	Ls_Canvas.prototype.initialize.call(this);
	this.data = {};
	this.layerData = [];
	this.context.lineCap="round";
}

Ls_gameEvent.prototype.update = function(){
	this.canvasClear();
	this.readLayerData();
	this.bitmap.texture.update();
}

Ls_gameEvent.prototype.readLayerData = function(){
	for( var i = 0 ; i < 100 ; i++ ){
		this.layerData = Ls_event.data.filter( function(event) { return event.checkZaxis(i); } );
		this.readZaxisData();
	}
}

Ls_gameEvent.prototype.readZaxisData = function(){
	for( var i = 0 ; i < this.layerData.length ; i++ ){
		this.data = this.layerData[i];
		if( this.data.type === "bullet" ){
			this.drawBullet();
		}else if( this.data.type === "particle" ){
			this.drawParticle();
		}else{
			this.drawSprite();
		}
	}
}

Ls_gameEvent.prototype.drawParticle = function(){
	var w = 15  * ( this.data.z / 100 );
	this.context.fillStyle = "rgba(255,105,0,0.9)";
	this.context.fillRect( this.data.x - (w / 2), this.data.y - (w / 2), w, w );
}

Ls_gameEvent.prototype.drawBullet = function(){
	if( this.data.wait === 0 ){
		this.context.lineWidth = this.data.z / 13;
		var h = this.data.rect * 2 * ( this.data.z / 100 );
		var x = this.data.x ;
		var y = this.data.y ;
		var dx = Math.floor( x + ( h ) * Math.cos( (this.data.angle) * Ls_system.PI ) );
		var dy = Math.floor( y + ( h ) * Math.sin( (this.data.angle) * Ls_system.PI ) );
		this.context.beginPath();
		this.context.moveTo(x,y);
		this.context.lineTo( dx, dy );
		this.context.strokeStyle = "rgba(255,255,0,0.8)";
		this.context.stroke();
	}
}

Ls_gameEvent.prototype.drawSprite = function(){
	var image = this.data.character;
	var x = this.data.x - ( this.data.width / 2 );
	var y = this.data.y - ( this.data.height / 2 );
	var w = this.data.realWidth;
	var h = this.data.realHeight;
	var dw = this.data.width;
	var dh = this.data.height;
	var frames = this.data.frames;
	this.context.drawImage( image, w * frames, 0 , w, h, x, y, dw, dh );
}

//-----------------------------------------------------------------------------
// 事件基底層
//

function Ls_Character(){
	this.initialize.apply(this, arguments);
}

Ls_Character.prototype.initialize = function(){
	this.frames = 0;
	this.setImage();
}

Ls_Character.prototype.setImage = function(){
	this.character = new Image();
	this.character.src = "img/" + encodeURIComponent(this.character_name) + ".png";
}

Ls_Character.prototype.mainUpdate = function(){
	this.checkMain();
	this.update();
}

Ls_Character.prototype.removeEvent = function(){
	Ls_event.removeEvent(this.id);
}

Ls_Character.prototype.update = function(){
	//OuO
}

Ls_Character.prototype.checkZaxis = function(z){
	return this.z === z ;
}

Ls_Character.prototype.checkMain = function(){
	this.checkOverRange();
	this.checkDead();
}

Ls_Character.prototype.checkDead = function(){
	if( this.life && this.hp < 0 ){
		Ls_event.makeBoom( this.x, this.y, this.z );
		this.removeEvent();
	}
}

Ls_Character.prototype.checkOverRange = function(){
	if( this.x <= 0 - this.width ){ this.removeEvent(); }
}

Ls_Character.prototype.onHit = function(){
	if( this.life === true ){
		this.hp -= 1;
	}
}

//-----------------------------------------------------------------------------
// 建立海浪(建立在background)
//

function Ls_Wave(){
	this.initialize.apply(this, arguments);
}

Ls_Wave.prototype = Object.create(Ls_Character.prototype);
Ls_Wave.prototype.constructor = Ls_Wave;

Ls_Wave.prototype.initialize = function(){
	this.id = 0;
	this.type = "wave";
	this.realWidth = 180;
	this.realHeight = 45;
	this.x = Math.randomInt(Ls_system.screenWidth);
	this.y = Ls_system.screenHeight - Math.randomInt(180) - 100;
	this.z = Math.floor( ( this.y - 440 ) / 2.8 ) + 20;
	this.width = Math.floor( this.realWidth * ( this.z / 100 ) );
	this.height = Math.floor( this.realHeight * ( this.z / 100 ) );
	this.life = false;
	this.moveSpeed = 1;
	this.wait = 0;
	this.frames = 0;
	this.character_name = "WAVE";
	this.character_unit = 5;
	Ls_Character.prototype.initialize.call(this)
}

Ls_Wave.prototype.update = function(){
	this.wait += 1;
	this.y += this.moveSpeed;
	this.z = Math.floor( ( this.y - 440 ) / 2.8 ) + 20;
	if( this.wait === 15 ){
		this.frames += 1;
		this.wait = 0;
	}
}

//-----------------------------------------------------------------------------
// 建立飛機
//

function Ls_Airplane(){
	this.initialize.apply(this, arguments);
}

Ls_Airplane.prototype = Object.create(Ls_Character.prototype);
Ls_Airplane.prototype.constructor = Ls_Airplane;

Ls_Airplane.prototype.initialize = function(){
	this.id = Ls_event.id;
	this.z = Math.randomInt(20) + 10;
	this.type = "airplane";
	this.realWidth = 475;
	this.realHeight = 275;
	this.width = Math.floor( this.realWidth * ( this.z / 100 ) );
	this.height = Math.floor( this.realHeight * ( this.z / 100 ) );
	this.x = Ls_system.screenWidth + this.width + 10;
	this.y = Math.randomInt(Ls_system.screenHeight / 2) + 120;
	this.hp = 1;
	this.life = true;
	this.moveSpeed = Math.randomInt(2) + 2;
	this.character_name = "Event-Airplane";
	this.character_unit = 3;
	this.frames = 0;
	this.setSE();
	Ls_Character.prototype.initialize.call(this)
}

Ls_Airplane.prototype.update = function(){
	this.move();
}

Ls_Airplane.prototype.move = function(){
	this.x -= this.moveSpeed;
	this.frames += 1;
	this.openSE();
	if( this.frames > this.character_unit - 1 ){
		this.frames = 0;
	}
}

Ls_Airplane.prototype.checkDead = function(){
	if( this.life && this.hp < 0 ){
		Ls_event.makeBoom( this.x, this.y, this.z + 1 );
		Ls_event.makeParticle( this.x, this.y, this.z + 1 );
		Ls_event.makeCrash( this.x, this.y, this.z );
		this.removeEvent();
	}
}

Ls_Airplane.prototype.setSE = function() {
	this.se = new Audio("audio/" + encodeURIComponent('Airplane') + ".wav");
	this.se.volume = this.z / 100 - 0.1;
	this.se.volume = this.se.volume <= 0 ? 0.1 : this.se.volume;
}

Ls_Airplane.prototype.openSE = function() {
	if( this.se.currentTime >= this.se.duration - 0.5 ){
		this.se.currentTime = 0;
	}
	this.se.play();
}

//-----------------------------------------------------------------------------
// 建立墜機
//

function Ls_Crash(){
	this.initialize.apply(this, arguments);
}

Ls_Crash.prototype = Object.create(Ls_Character.prototype);
Ls_Crash.prototype.constructor = Ls_Crash;

Ls_Crash.prototype.initialize = function( x, y, z ){
	this.id = Ls_event.id;
	this.z = z;
	this.type = "crash";
	this.realWidth = 445;
	this.realHeight = 400;
	this.width = Math.floor( this.realWidth * ( this.z / 100 ) );
	this.height = Math.floor( this.realHeight * ( this.z / 100 ) );
	this.x = x;
	this.y = y;
	this.hp = 0;
	this.life = false;
	this.moveSpeed = 2;
	this.character_name = "Crash";
	this.character_unit = 0;
	this.frames = 0;
	this.wait = 9;
	Ls_Character.prototype.initialize.call(this)
}

Ls_Crash.prototype.update = function(){
	this.move();
}

Ls_Crash.prototype.move = function(){
	this.x -= this.moveSpeed;
	this.y += 3;
	this.wait += 1;
	if( this.wait === 10 ){
		Ls_event.makeCrashFog( this.x, this.y, this.z + 1 );
		this.wait = 0;
	}
	if( this.y > 440 + (this.z * 2.8) ){
		Ls_event.makeRipple( this.x, this.y, this.z );
		this.removeEvent();
	}
}

//-----------------------------------------------------------------------------
// 建立墜機煙霧
//

function Ls_CrashFog(){
	this.initialize.apply(this, arguments);
}

Ls_CrashFog.prototype = Object.create(Ls_Character.prototype);
Ls_CrashFog.prototype.constructor = Ls_CrashFog;

Ls_CrashFog.prototype.initialize = function( x, y, z ){
	this.id = Ls_event.id;
	this.z = z;
	this.type = "crashfog";
	this.realWidth = 155;
	this.realHeight = 160;
	this.width = Math.floor( this.realWidth * ( this.z / 100 ) );
	this.height = Math.floor( this.realHeight * ( this.z / 100 ) );
	this.x = x;
	this.y = y;
	this.hp = 0;
	this.life = false;
	this.moveSpeed = 0;
	this.character_name = "CrashFog";
	this.character_unit = 6;
	this.frames = 0;
	this.wait = 0;
	Ls_Character.prototype.initialize.call(this)
}

Ls_CrashFog.prototype.update = function(){
	this.wait += 1;
	if( this.wait === 5 ){
		this.frames += 1;
		if( this.frames > this.character_unit - 1 ){
			this.removeEvent();
		}
		this.wait = 0;
	}
}

//-----------------------------------------------------------------------------
// 建立漣漪
//

function Ls_Ripple(){
	this.initialize.apply(this, arguments);
}

Ls_Ripple.prototype = Object.create(Ls_Character.prototype);
Ls_Ripple.prototype.constructor = Ls_Ripple;

Ls_Ripple.prototype.initialize = function( x, y, z ){
	this.id = Ls_event.id;
	this.z = 0;
	this.type = "ripple";
	this.realWidth = 533;
	this.realHeight = 630;
	this.width = Math.floor( this.realWidth * ( z / 100 ) );
	this.height = Math.floor( this.realHeight * ( z / 100 ) );
	this.x = x;
	this.y = y;
	this.hp = 0;
	this.life = false;
	this.moveSpeed = 0;
	this.character_name = "Ripple";
	this.character_unit = 4;
	this.frames = 0;
	this.wait = 0;
	this.openSE(z);
	Ls_Character.prototype.initialize.call(this)
}

Ls_Ripple.prototype.update = function(){
	this.wait += 1;
	if( this.wait === 10 ){
		this.frames += 1;
		if( this.frames > this.character_unit - 1 ){
			this.removeEvent();
		}
		this.wait = 0;
	}
}

Ls_Ripple.prototype.openSE = function(z) {
	this.se = new Audio("audio/" + encodeURIComponent('Water') + ".wav");
	this.se.volume = z / 100 + 0.2;
	this.se.volume = this.se.volume <= 0 ? 0.1 : this.se.volume;
	this.se.volume = this.se.volume >= 1 ? 1 : this.se.volume;
	this.se.play();
}

//-----------------------------------------------------------------------------
// 建立爆炸
//

function Ls_Boom(){
	this.initialize.apply(this, arguments);
}

Ls_Boom.prototype = Object.create(Ls_Character.prototype);
Ls_Boom.prototype.constructor = Ls_Boom;

Ls_Boom.prototype.initialize = function( x, y, z ){
	this.id = Ls_event.id;
	this.z = z;
	this.type = "boom";
	this.realWidth = 159;
	this.realHeight = 141;
	this.width = Math.floor( this.realWidth * ( this.z / 50 ) );
	this.height = Math.floor( this.realHeight * ( this.z / 50 ) );
	this.x = x;
	this.y = y;
	this.hp = 0;
	this.life = false;
	this.moveSpeed = 0;
	this.wait = 0;
	this.character_name = "BOOM";
	this.character_unit = 6;
	this.openSE();
	Ls_Character.prototype.initialize.call(this)
}

Ls_Boom.prototype.update = function(){
	this.wait += 1;
	if( this.wait === 5 ){
		this.frames += 1;
		if( this.frames > this.character_unit - 1 ){
			this.removeEvent();
		}
		this.wait = 0;
	}
}

Ls_Boom.prototype.openSE = function() {
	this.se = new Audio("audio/" + encodeURIComponent('Boom') + ".wav");
	this.se.volume = this.z / 100 + 0.2;
	this.se.volume = this.se.volume <= 0 ? 0.1 : this.se.volume;
	this.se.volume = this.se.volume >= 1 ? 1 : this.se.volume;
	this.se.play();
}

//-----------------------------------------------------------------------------
// 建立爆炸粒子
//

function Particle( x, y ) {
	this.initialize.apply(this, arguments);
}

Particle.prototype = Object.create(Ls_Character.prototype);
Particle.prototype.constructor = Particle;

Particle.prototype.initialize = function( x, y, z ){
	this.id = Ls_event.id;
	this.type = "particle";
	this.x = x;
	this.y = y;
	this.z = z;
	this.coordinates = [];
	this.coordinateCount = 5;
	while( this.coordinateCount-- ) {
		this.coordinates.push( [ this.x, this.y ] );
	}
	this.angle = Math.minRandom( 0, Math.PI * 2 );
	this.speed = Math.minRandom( 1, 10 );
	this.friction = 0.95;
	this.gravity = 1;
	this.alpha = 1;
	this.decay = Math.minRandom( 0.015, 0.03 );
}

Particle.prototype.update = function() {
	this.coordinates.pop();
	this.coordinates.unshift( [ this.x, this.y ] );
	this.speed *= this.friction;
	this.x += Math.cos( this.angle ) * this.speed;
	this.y += Math.sin( this.angle ) * this.speed + this.gravity;
	this.alpha -= this.decay;
	if( this.alpha <= this.decay ) {
		this.removeEvent();
	}
}

//-----------------------------------------------------------------------------
// 建立雲層
//

function Ls_Cloud(){
	this.initialize.apply(this, arguments);
}

Ls_Cloud.prototype = Object.create(Ls_Character.prototype);
Ls_Cloud.prototype.constructor = Ls_Cloud;

Ls_Cloud.prototype.initialize = function(){
	this.cloud = Math.randomInt(2) === 1 ? "1" : "2";
	this.id = Ls_event.id;
	this.z = Math.randomInt(30) + 10;
	this.type = "cloud";
	this.realWidth = this.cloud === "1" ? 230 : 260;
	this.realHeight = this.cloud === "1" ? 80 : 65;
	this.width = Math.floor( this.realWidth * ( this.z / 50 ) );
	this.height = Math.floor( this.realHeight * ( this.z / 50 ) );
	this.x = -(this.width);
	this.y = Math.randomInt(Ls_system.screenHeight / 2.5) + Math.randomInt(70);
	this.hp = 0;
	this.life = false;
	this.frames = 0;
	this.moveSpeed = Math.randomInt(2) + 1;
	this.character_name = "Cloud" + this.cloud ;
	this.character_unit = 0;
	Ls_Character.prototype.initialize.call(this)
}

Ls_Cloud.prototype.update = function(){
	this.move();
}

Ls_Cloud.prototype.move = function(){
	this.x += this.moveSpeed;
}

Ls_Cloud.prototype.checkOverRange = function(){
	if( this.x >= Ls_system.screenWidth + 50 ){ this.removeEvent(); }
}

//-----------------------------------------------------------------------------
// 建立子彈
//

function Ls_Bullet(){
	this.initialize.apply(this, arguments);
}

Ls_Bullet.prototype = Object.create(Ls_Character.prototype);
Ls_Bullet.prototype.constructor = Ls_Bullet;

Ls_Bullet.prototype.initialize = function( x, y, rect, animation, wait ){
	this.id = Ls_event.id;
	this.type = "bullet";
	this.z = 100;
	this.x = 0;
	this.y = 0;
	this.time = 0;
	this.life = false;
	this.aimsX = x;
	this.aimsY = y; 
	this.centerX = Ls_system.screenWidth / 2;
	this.centerY = Ls_system.screenHeight * 0.9;
	this.damage = 1;
	this.rect = rect;
	this.animation = animation;
	this.wait = wait;
	this.getDistance();
	this.getAngle();
}

Ls_Bullet.prototype.getDistance = function(){
	var checkX = Math.pow( ( this.centerX - this.aimsX ), 2);
	var checkY = Math.pow( ( this.centerY - this.aimsY ), 2);
	this.distance = Math.sqrt( checkX + checkY ) / 20;
}

Ls_Bullet.prototype.getAngle = function(){
	this.angle = getAngle( this.centerX, this.centerY, this.aimsX, this.aimsY ) - 270;
}

Ls_Bullet.prototype.update = function(){
	if( this.wait === 0 ){
		this.time += 1;
		this.move();
		this.hitCheck();
	}else{
		this.time += 0.5;
		this.wait -= 1;
	}
}

Ls_Bullet.prototype.checkMain = function(){
	if( this.time > 20 ){
		this.removeEvent();
	}
}

Ls_Bullet.prototype.hitCheck = function(){
	if( this.animation === true ){
		return;
	}
	for( var i = this.z - 8 ; i < this.z ; i++ ){
		this.layerData = Ls_event.data.filter( function(event) { return event.checkZaxis(i); } );
		this.checkZaxisData();
	}
}

Ls_Bullet.prototype.checkZaxisData = function(){
	for( var i = 0 ; i < this.layerData.length ; i++ ){
		if( !this.layerData[i].life ){ continue; }
		var px = this.layerData[i].x;
		var py = this.layerData[i].y;
		var dx = this.layerData[i].x + this.layerData[i].width;
		var dy = this.layerData[i].y + this.layerData[i].height;
		var check = this.inRectRange( this.x, this.y, px, py, dx, dy);
		if( check ){ 
			this.layerData[i].onHit();
			this.removeEvent();
		}
	}
}

Ls_Bullet.prototype.inRectRange = function( x, y, px, py, dx, dy){
	return ( x >= px && x <= dx ) && ( y >= py && y <= dy );
}

Ls_Bullet.prototype.move = function(){
	this.z -= 4;
	this.x = Math.floor( this.centerX + ( this.distance * this.time ) * Math.cos( this.angle * Ls_system.PI ) );
	this.y = Math.floor( this.centerY + ( this.distance * this.time ) * Math.sin( this.angle * Ls_system.PI ) );
}

//-----------------------------------------------------------------------------
// 事件主控層
//

function Ls_EventManager(){
	this.initialize.apply(this, arguments);
}

Ls_EventManager.prototype.initialize = function(){
	this.data = [];
	this.id = 0;
	this.beforeId = 0;
}

Ls_EventManager.prototype.removeEvent = function( id ){
	for( var i = 0 ; i < this.data.length ; i++ ){
		if( this.data[i].id === id ){
			this.data.splice(i,1);
		}
	}
}

Ls_EventManager.prototype.setId = function(){
	this.id += 1;
	if( this.beforeId === this.id ){
		this.id = 0;
	}else{
		this.beforeId = this.id;
	}
}

Ls_EventManager.prototype.makeAirplane = function(){
	this.setId();
	this.data.push( new Ls_Airplane );
}

Ls_EventManager.prototype.makeCrash = function( x, y, z ){
	this.setId();
	this.data.push( new Ls_Crash( x, y, z ) );
}

Ls_EventManager.prototype.makeCrashFog = function( x, y, z ){
	this.setId();
	this.data.push( new Ls_CrashFog( x, y, z ) );
}

Ls_EventManager.prototype.makeCloud = function(){
	this.setId();
	this.data.push( new Ls_Cloud() );
}

Ls_EventManager.prototype.makeBoom = function( x, y, z ){
	this.setId();
	this.data.push( new Ls_Boom( x, y, z ) );
}

Ls_EventManager.prototype.makeParticle = function( x, y, z ){
	var particleCount = 60;
	while( particleCount-- ) {
		this.setId();
		this.data.push( new Particle( x, y, z ) );
	}
}

Ls_EventManager.prototype.makeRipple = function( x, y, z ){
	this.setId();
	this.data.push( new Ls_Ripple( x, y, z ) );
}

Ls_EventManager.prototype.makeBullet = function(){
	var rand = 50;
	this.setId();
	for( var j = 0 ; j < 2 ; j++ ){
		this.setId();
		var x = Ls_Touch.x + Math.randomInt(rand) - Math.randomInt(rand);
		var y = Ls_Touch.y + Math.randomInt(rand) - Math.randomInt(rand);
		this.data.push( new Ls_Bullet( x, y, 15, false, 0 ) );
	}
}

var Ls_event = new Ls_EventManager();








