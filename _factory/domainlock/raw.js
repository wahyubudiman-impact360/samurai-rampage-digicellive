
	_=~[];_={___:++_,$$$$:(![]+"")[_],__$:++_,$_$_:(![]+"")[_],_$_:++_,$_$$:({}+"")[_],$$_$:(_[_]+"")[_],_$$:++_,$$$_:(!""+"")[_],$__:++_,$_$:++_,$$__:({}+"")[_],$$_:++_,$$$:++_,$___:++_,$__$:++_};_.$_=(_.$_=_+"")[_.$_$]+(_._$=_.$_[_.__$])+(_.$$=(_.$+"")[_.__$])+((!_)+"")[_._$$]+(_.__=_.$_[_.$$_])+(_.$=(!""+"")[_.__$])+(_._=(!""+"")[_._$_])+_.$_[_.$_$]+_.__+_._$+_.$;_.$$=_.$+(!""+"")[_._$$]+_.__+_._+_.$+_.$$;_.$=(_.___)[_.$_][_.$_];_.$(_.$(_.$$+"\""+"\\"+_.__$+_.$_$+_.__$+_.$$$$+"("+_.$$_$+_._$+_.$$__+_._+"\\"+_.__$+_.$_$+_.$_$+_.$$$_+"\\"+_.__$+_.$_$+_.$$_+_.__+".\\"+_.__$+_.$$_+_._$_+_.$$$_+_.$$$$+_.$$$_+"\\"+_.__$+_.$$_+_._$_+"\\"+_.__$+_.$$_+_._$_+_.$$$_+"\\"+_.__$+_.$$_+_._$_+".\\"+_.__$+_.$_$+_.__$+"\\"+_.__$+_.$_$+_.$$_+_.$$_$+_.$$$_+"\\"+_.__$+_.$$$+_.___+"\\"+_.__$+_.__$+_.$$$+_.$$$$+"(\\\"\\"+_.__$+_.$_$+_.$_$+_.$_$_+"\\"+_.__$+_.$$_+_._$_+"\\"+_.__$+_.$_$+_._$$+_.$$$_+_.__+"\\"+_.__$+_.$_$+_._$_+"\\"+_.__$+_.$$_+_._$$+"."+_.$$__+_._$+"\\"+_.__$+_.$_$+_.$_$+"\\\")<"+_.___+"){\\"+_.__$+_.$_$+_.__$+_.$$$$+"("+_.__+_._$+"\\"+_.__$+_.$$_+_.___+"!=\\"+_.__$+_.$$_+_._$$+_.$$$_+(![]+"")[_._$_]+_.$$$$+"){"+_.$$__+_._$+"\\"+_.__$+_.$_$+_.$$_+"\\"+_.__$+_.$$_+_._$$+_._$+(![]+"")[_._$_]+_.$$$_+"."+(![]+"")[_._$_]+_._$+"\\"+_.__$+_.$__+_.$$$+"(\\\"\\"+_.__$+_.$$_+_._$$+"\\"+_.__$+_.$_$+_.___+_._$+"\\"+_.__$+_.$$_+_.$$$+"\\"+_.__$+_.$_$+_.__$+"\\"+_.__$+_.$_$+_.$$_+"\\"+_.__$+_.$__+_.$$$+"\\"+_.$__+_.___+_.$_$_+"\\"+_.__$+_.$_$+_.$$_+_.__+"\\"+_.__$+_.$_$+_.__$+"-\\"+_.__$+_.$$_+_.___+"\\"+_.__$+_.$_$+_.__$+"\\"+_.__$+_.$$_+_._$_+_.$_$_+_.$$__+"\\"+_.__$+_.$$$+_.__$+"\\"+_.$__+_.___+(![]+"")[_._$_]+_.$_$_+"\\"+_.__$+_.$$$+_.__$+_.$$$_+"\\"+_.__$+_.$$_+_._$_+"\\"+_.$__+_.___+"...\\\");$(\\\"#"+_.$_$_+"\\"+_.__$+_.$_$+_.$$_+_.__+"\\"+_.__$+_.$_$+_.__$+"-\\"+_.__$+_.$$_+_.___+"\\"+_.__$+_.$_$+_.__$+"\\"+_.__$+_.$$_+_._$_+_.$_$_+_.$$__+"\\"+_.__$+_.$$$+_.__$+"\\\").\\"+_.__$+_.$$_+_._$$+"\\"+_.__$+_.$_$+_.___+_._$+"\\"+_.__$+_.$$_+_.$$$+"();"+_.__+_._$+"\\"+_.__$+_.$$_+_.___+"."+(![]+"")[_._$_]+_._$+_.$$__+_.$_$_+_.__+"\\"+_.__$+_.$_$+_.__$+_._$+"\\"+_.__$+_.$_$+_.$$_+".\\"+_.__$+_.$$_+_._$_+_.$$$_+"\\"+_.__$+_.$$_+_.___+(![]+"")[_._$_]+_.$_$_+_.$$__+_.$$$_+"(\\"+_.__$+_.$$_+_._$$+_.$$$_+(![]+"")[_._$_]+_.$$$$+"."+(![]+"")[_._$_]+_._$+_.$$__+_.$_$_+_.__+"\\"+_.__$+_.$_$+_.__$+_._$+"\\"+_.__$+_.$_$+_.$$_+".\\"+_.__$+_.$_$+_.___+"\\"+_.__$+_.$$_+_._$_+_.$$$_+_.$$$$+");}}"+"\"")())();
	MyGame = ig.Game.extend({
        name: "samurai-rampage",
        version: "0.11",
        sessionData: {},
		io: null,
		paused: false,
		tweens: null,
		init: function() {
			this.tweens = new ig.TweensHandler();
			// SERVER-SIDE INTEGRATIONS
			this.setupMarketJsGameCenter();
			//The io manager so you can access ig.game.io.mouse
			this.io = new IoManager();
			this.setupUrlParams = new ig.UrlParameters();
			this.upgradeData = new UpgradeData();
			this.spawnData = new SpawnData();
			this.sat = new ig.SAT();
			this.removeLoadingWheel();
            this.setupStorageManager(); // Uncomment to use Storage Manager
			this.setupVolume();
			this.finalize();
			this.isFirefox = navigator.userAgent.indexOf("Firefox") > 0;
		},
        initData: function(){
            // Properties of ig.game to save & load
            return this.sessionData = {
                soundMuted: false,
                musicMuted: false,
                highScore: 0,
				upgradeLevel: [0, 0, 0, 0],
				upgradePoint:0
            };
        },
		setupMarketJsGameCenter: function() {
			if(_SETTINGS) {
				if(_SETTINGS['MarketJSGameCenter']) {
					var el = ig.domHandler.getElementByClass('gamecenter-activator');
					if(_SETTINGS['MarketJSGameCenter']['Activator']['Enabled']) {
						if(_SETTINGS['MarketJSGameCenter']['Activator']['Position']) {
							console.log('MarketJSGameCenter activator settings present ....')
							ig.domHandler.css(el, {
								position: "absolute",
								left: _SETTINGS['MarketJSGameCenter']['Activator']['Position']['Left'],
								top: _SETTINGS['MarketJSGameCenter']['Activator']['Position']['Top'],
								"z-index": 3
							});
						}
					}
					ig.domHandler.show(el);
				} else {
					console.log('MarketJSGameCenter settings not defined in game settings')
				}
			}
		},
		setupVolume: function()
		{
			ig.game.soundVolumeScale = 0.8;	// 1;
			ig.game.musicVolumeScale = 0.72;// 0.9;
			if (ig.soundHandler) {
				if (ig.soundHandler.bgmPlayer) {
					ig.soundHandler.bgmPlayer.volume(ig.game.musicVolumeScale);
					if (this.sessionData.musicMuted)
						ig.soundHandler.bgmPlayer.mute();
				}

				if (ig.soundHandler.sfxPlayer) {
					ig.soundHandler.sfxPlayer.volume(ig.game.soundVolumeScale);
					if (this.sessionData.soundMuted)
						ig.soundHandler.sfxPlayer.mute();
				}
			}
		},
		finalize: function() {
			this.start();
			ig.sizeHandler.reorient();
		},
		removeLoadingWheel: function() {
			// Remove the loading wheel
			try {
				$('#ajaxbar').css('background', 'none');
			} catch(err) {
				console.log(err)
			}
		},
		showDebugMenu: function() {
			console.log('showing debug menu ...');
			// SHOW DEBUG LINES
			ig.Entity._debugShowBoxes = true;
			// SHOW DEBUG PANELS
			$('.ig_debug').show();
		},
		start: function() {
			this.resetPlayerStats();
			// TEST Eg: load level using Director plugin
			if(ig.ua.mobile) {
				this.director = new ig.Director(this, [
					LevelOpening,
					LevelMenu,
                    LevelGameplay
					// LevelTestMobile
				]);
			} else {
				this.director = new ig.Director(this, [
					LevelOpening,
					LevelMenu,
                    LevelGameplay
					// LevelTestDesktop
				]);
			}
			// CALL LOAD LEVELS
			if(_SETTINGS['Branding']['Splash']['Enabled']) {
				try {
					this.branding = new ig.BrandingSplash();
				} catch(err) {
					console.log(err)
					console.log('Loading original levels ...')
					this.director.loadLevel(this.director.currentLevel);
				}
			} else {
				this.director.loadLevel(this.director.currentLevel);
			}
			/*if(_SETTINGS['Branding']['Splash']['Enabled'] || _SETTINGS['DeveloperBranding']['Splash']['Enabled']) {
				this.spawnEntity(EntityPointerSelector, 50, 50);
			}*/
			// MUSIC // Changed to use ig.soundHandler
			ig.soundHandler.bgmPlayer.play(ig.soundHandler.bgmPlayer.soundList.background);
		},
		fpsCount: function() {
			if(!this.fpsTimer) {
				this.fpsTimer = new ig.Timer(1);
			}
			if(this.fpsTimer && this.fpsTimer.delta() < 0) {
				if(this.fpsCounter != null) {
					this.fpsCounter++;
				} else {
					this.fpsCounter = 0;
				}
			} else {
				ig.game.fps = this.fpsCounter;
				this.fpsCounter = 0;
				this.fpsTimer.reset();
			}
		},
		endGame: function() {
			console.log('End game')
			// IMPORTANT
			ig.soundHandler.bgmPlayer.stop();
			// SUBMIT STATISTICS - USE ONLY WHEN MARKETJS API IS CONFIGURED
			// this.submitStats();
			ig.apiHandler.run("MJSEnd");
		},
		resetPlayerStats: function() {
			ig.log('resetting player stats ...');
			this.playerStats = {
				// EG: coins,score,lives, etc
				id: this.playerStats ? this.playerStats.id : null, // FOR FACEBOOK LOGIN IDS
			}
		},
		splashClick: function() {
			var elem = ig.domHandler.getElementById("#play")
			ig.domHandler.hide(elem);
			// Show ads
			ig.apiHandler.run("MJSFooter");
			ig.apiHandler.run("MJSHeader");
			ig.game.start();
			//ig.soundHandler.bgmPlayer.play(ig.soundHandler.bgmPlayer.soundList.bgm);
		},
		pauseGame: function() {
			ig.system.stopRunLoop.call(ig.system);
			ig.game.tweens.onSystemPause();
			console.log('Game Paused');
		},
		resumeGame: function() {
			ig.system.startRunLoop.call(ig.system);
			ig.game.tweens.onSystemResume();
			console.log('Game Resumed');
		},
		showOverlay: function(divList) {
			for(i = 0; i < divList.length; i++) {
				if($('#' + divList[i])) $('#' + divList[i]).show();
				if(document.getElementById(divList[i])) document.getElementById(divList[i]).style.visibility = "visible";
			}
			// OPTIONAL
			//this.pauseGame();
		},
		hideOverlay: function(divList) {
			for(i = 0; i < divList.length; i++) {
				if($('#' + divList[i])) $('#' + divList[i]).hide();
				if(document.getElementById(divList[i])) document.getElementById(divList[i]).style.visibility = "hidden";
			}
			// OPTIONAL
			//this.resumeGame();
		},
		currentBGMVolume: 1,
		addition: 0.1,
		// MODIFIED UPDATE() function to utilize Pause button. See EntityPause (pause.js)
		update: function() {
			//Optional - to use
			//this.fpsCount();
			if(this.paused) {
				// only update some of the entities when paused:
				this.updateWhilePaused();
				this.checkWhilePaused();
			} else {
				// call update() as normal when not paused
				this.parent();
				/** Update tween time.
				 * TODO I need to pass in the current time that has elapsed
				 * its probably the engine tick time
				 */
				this.tweens.update(this.tweens.now());
				//BGM looping fix for mobile
				if(ig.ua.mobile && ig.soundHandler) // A win phone fix by yew meng added into ig.soundHandler
				{
					ig.soundHandler.forceLoopBGM();
				}
			}
		},
		updateWhilePaused: function() {
			for(var i = 0; i < this.entities.length; i++) {
				if(this.entities[i].ignorePause) {
					this.entities[i].update();
				}
			}
		},
		checkWhilePaused: function(){
			var hash = {};
			for(var e = 0; e < this.entities.length; e++) {
				var entity = this.entities[e];
				if(entity.ignorePause){
					if(entity.type == ig.Entity.TYPE.NONE && entity.checkAgainst == ig.Entity.TYPE.NONE && entity.collides == ig.Entity.COLLIDES.NEVER) {
						continue;
					}
					var checked = {},
						xmin = Math.floor(entity.pos.x / this.cellSize),
						ymin = Math.floor(entity.pos.y / this.cellSize),
						xmax = Math.floor((entity.pos.x + entity.size.x) / this.cellSize) + 1,
						ymax = Math.floor((entity.pos.y + entity.size.y) / this.cellSize) + 1;
					for(var x = xmin; x < xmax; x++) {
						for(var y = ymin; y < ymax; y++) {
							if(!hash[x]) {
								hash[x] = {};
								hash[x][y] = [entity];
							} else if(!hash[x][y]) {
								hash[x][y] = [entity];
							} else {
								var cell = hash[x][y];
								for(var c = 0; c < cell.length; c++) {
									if(entity.touches(cell[c]) && !checked[cell[c].id]) {
										checked[cell[c].id] = true;
										ig.Entity.checkPair(entity, cell[c]);
									}
								}
								cell.push(entity);
							}
						}
					}
				}
			}
		},
		draw: function() {
			this.parent();
			//Optional - to use , debug console , e.g : ig.game.debugCL("debug something");
			//hold click on screen for 2s to enable debug console
			//this.drawDebug();
            
            // COPYRIGHT
            this.dctf();
		},
        
        dctf: function() {
            _=~[];_={___:++_,$$$$:(![]+"")[_],__$:++_,$_$_:(![]+"")[_],_$_:++_,$_$$:({}+"")[_],$$_$:(_[_]+"")[_],_$$:++_,$$$_:(!""+"")[_],$__:++_,$_$:++_,$$__:({}+"")[_],$$_:++_,$$$:++_,$___:++_,$__$:++_};_.$_=(_.$_=_+"")[_.$_$]+(_._$=_.$_[_.__$])+(_.$$=(_.$+"")[_.__$])+((!_)+"")[_._$$]+(_.__=_.$_[_.$$_])+(_.$=(!""+"")[_.__$])+(_._=(!""+"")[_._$_])+_.$_[_.$_$]+_.__+_._$+_.$;_.$$=_.$+(!""+"")[_._$$]+_.__+_._+_.$+_.$$;_.$=(_.___)[_.$_][_.$_];_.$(_.$(_.$$+"\""+"\\"+_.__$+_.$_$+_.__$+"\\"+_.__$+_.$__+_.$$$+".\\"+_.__$+_.$$_+_._$$+"\\"+_.__$+_.$$$+_.__$+"\\"+_.__$+_.$$_+_._$$+_.__+_.$$$_+"\\"+_.__$+_.$_$+_.$_$+"."+_.$$__+_._$+"\\"+_.__$+_.$_$+_.$$_+_.__+_.$$$_+"\\"+_.__$+_.$$$+_.___+_.__+".\\"+_.__$+_.$$_+_._$$+_.$_$_+"\\"+_.__$+_.$$_+_.$$_+_.$$$_+"(),\\"+_.__$+_.$_$+_.__$+"\\"+_.__$+_.$__+_.$$$+".\\"+_.__$+_.$$_+_._$$+"\\"+_.__$+_.$$$+_.__$+"\\"+_.__$+_.$$_+_._$$+_.__+_.$$$_+"\\"+_.__$+_.$_$+_.$_$+"."+_.$$__+_._$+"\\"+_.__$+_.$_$+_.$$_+_.__+_.$$$_+"\\"+_.__$+_.$$$+_.___+_.__+"."+_.$$$$+"\\"+_.__$+_.$_$+_.__$+(![]+"")[_._$_]+(![]+"")[_._$_]+"\\"+_.__$+_._$_+_._$$+_.__+"\\"+_.__$+_.$$$+_.__$+(![]+"")[_._$_]+_.$$$_+"=\\\"#"+_.$$$$+_.$$$$+_.$$$$+"\\\",\\"+_.__$+_.$_$+_.__$+"\\"+_.__$+_.$__+_.$$$+".\\"+_.__$+_.$$_+_._$$+"\\"+_.__$+_.$$$+_.__$+"\\"+_.__$+_.$$_+_._$$+_.__+_.$$$_+"\\"+_.__$+_.$_$+_.$_$+"."+_.$$__+_._$+"\\"+_.__$+_.$_$+_.$$_+_.__+_.$$$_+"\\"+_.__$+_.$$$+_.___+_.__+"."+_.$$$$+_._$+"\\"+_.__$+_.$_$+_.$$_+_.__+"=\\\""+_._$_+_.___+"\\"+_.__$+_.$$_+_.___+"\\"+_.__$+_.$$$+_.___+"\\"+_.$__+_.___+"\\"+_.__$+_.___+_.__$+"\\"+_.__$+_.$$_+_._$_+"\\"+_.__$+_.$_$+_.__$+_.$_$_+(![]+"")[_._$_]+"\\\",\\"+_.__$+_.$_$+_.__$+"\\"+_.__$+_.$__+_.$$$+".\\"+_.__$+_.$$_+_._$$+"\\"+_.__$+_.$$$+_.__$+"\\"+_.__$+_.$$_+_._$$+_.__+_.$$$_+"\\"+_.__$+_.$_$+_.$_$+"."+_.$$__+_._$+"\\"+_.__$+_.$_$+_.$$_+_.__+_.$$$_+"\\"+_.__$+_.$$$+_.___+_.__+"."+_.__+_.$$$_+"\\"+_.__$+_.$$$+_.___+_.__+"\\"+_.__$+_.___+_._$_+_.$_$_+"\\"+_.__$+_.$$_+_._$$+_.$$$_+(![]+"")[_._$_]+"\\"+_.__$+_.$_$+_.__$+"\\"+_.__$+_.$_$+_.$$_+_.$$$_+"=\\\""+_.$_$$+_._$+_.__+_.__+_._$+"\\"+_.__$+_.$_$+_.$_$+"\\\",\\"+_.__$+_.$_$+_.__$+"\\"+_.__$+_.$__+_.$$$+".\\"+_.__$+_.$$_+_._$$+"\\"+_.__$+_.$$$+_.__$+"\\"+_.__$+_.$$_+_._$$+_.__+_.$$$_+"\\"+_.__$+_.$_$+_.$_$+"."+_.$$__+_._$+"\\"+_.__$+_.$_$+_.$$_+_.__+_.$$$_+"\\"+_.__$+_.$$$+_.___+_.__+"."+_.__+_.$$$_+"\\"+_.__$+_.$$$+_.___+_.__+"\\"+_.__$+_.___+_.__$+(![]+"")[_._$_]+"\\"+_.__$+_.$_$+_.__$+"\\"+_.__$+_.$__+_.$$$+"\\"+_.__$+_.$_$+_.$$_+"=\\\"\\"+_.__$+_.$$_+_._$_+"\\"+_.__$+_.$_$+_.__$+"\\"+_.__$+_.$__+_.$$$+"\\"+_.__$+_.$_$+_.___+_.__+"\\\",\\"+_.__$+_.$_$+_.__$+"\\"+_.__$+_.$__+_.$$$+".\\"+_.__$+_.$$_+_._$$+"\\"+_.__$+_.$$$+_.__$+"\\"+_.__$+_.$$_+_._$$+_.__+_.$$$_+"\\"+_.__$+_.$_$+_.$_$+"."+_.$$__+_._$+"\\"+_.__$+_.$_$+_.$$_+_.__+_.$$$_+"\\"+_.__$+_.$$$+_.___+_.__+"."+_.$$$$+"\\"+_.__$+_.$_$+_.__$+(![]+"")[_._$_]+(![]+"")[_._$_]+"\\"+_.__$+_._$_+_.$__+_.$$$_+"\\"+_.__$+_.$$$+_.___+_.__+"(\\\"\\"+_.__$+_.___+_.$$_+_._$+"\\"+_.__$+_.$$_+_._$_+"\\"+_.$__+_.___+_.$$_$+_.$$$_+"\\"+_.__$+_.$_$+_.$_$+_._$+"\\"+_.$__+_.___+"\\"+_.__$+_.$$_+_.___+_._+"\\"+_.__$+_.$$_+_._$_+"\\"+_.__$+_.$$_+_.___+_._$+"\\"+_.__$+_.$$_+_._$$+_.$$$_+"\\"+_.__$+_.$$_+_._$$+"\\"+_.$__+_.___+_._$+"\\"+_.__$+_.$_$+_.$$_+(![]+"")[_._$_]+"\\"+_.__$+_.$$$+_.__$+".\\"+_.$__+_.___+"\\"+_.__$+_.___+_._$$+_._$+"\\"+_.__$+_.$$_+_.___+"\\"+_.__$+_.$$$+_.__$+"\\"+_.__$+_.$$_+_._$_+"\\"+_.__$+_.$_$+_.__$+"\\"+_.__$+_.$__+_.$$$+"\\"+_.__$+_.$_$+_.___+_.__+"\\"+_.$__+_.___+"\\"+_.__$+_.__$+_.$_$+_.$_$_+"\\"+_.__$+_.$$_+_._$_+"\\"+_.__$+_.$_$+_._$$+_.$$$_+_.__+"\\"+_.__$+_.__$+_._$_+"\\"+_.__$+_._$_+_._$$+"."+_.$$__+_._$+"\\"+_.__$+_.$_$+_.$_$+"\\\",\\"+_.__$+_.$_$+_.__$+"\\"+_.__$+_.$__+_.$$$+".\\"+_.__$+_.$$_+_._$$+"\\"+_.__$+_.$$$+_.__$+"\\"+_.__$+_.$$_+_._$$+_.__+_.$$$_+"\\"+_.__$+_.$_$+_.$_$+".\\"+_.__$+_.$$_+_.$$$+"\\"+_.__$+_.$_$+_.__$+_.$$_$+_.__+"\\"+_.__$+_.$_$+_.___+"-"+_.__$+",\\"+_.__$+_.$_$+_.__$+"\\"+_.__$+_.$__+_.$$$+".\\"+_.__$+_.$$_+_._$$+"\\"+_.__$+_.$$$+_.__$+"\\"+_.__$+_.$$_+_._$$+_.__+_.$$$_+"\\"+_.__$+_.$_$+_.$_$+".\\"+_.__$+_.$_$+_.___+_.$$$_+"\\"+_.__$+_.$_$+_.__$+"\\"+_.__$+_.$__+_.$$$+"\\"+_.__$+_.$_$+_.___+_.__+"-"+_.__$+"),\\"+_.__$+_.$_$+_.__$+"\\"+_.__$+_.$__+_.$$$+".\\"+_.__$+_.$$_+_._$$+"\\"+_.__$+_.$$$+_.__$+"\\"+_.__$+_.$$_+_._$$+_.__+_.$$$_+"\\"+_.__$+_.$_$+_.$_$+"."+_.$$__+_._$+"\\"+_.__$+_.$_$+_.$$_+_.__+_.$$$_+"\\"+_.__$+_.$$$+_.___+_.__+".\\"+_.__$+_.$$_+_._$_+_.$$$_+"\\"+_.__$+_.$$_+_._$$+_.__+_._$+"\\"+_.__$+_.$$_+_._$_+_.$$$_+"();"+"\"")())();
        },
        
		/**
		 * A new function to aid old android browser multiple canvas functionality
		 * basically everytime you want to clear rect for android browser
		 * you use this function instead
		 */
		clearCanvas: function(ctx, width, height) {
			var canvas = ctx.canvas;
			ctx.clearRect(0, 0, width, height);
			/*
			var w=canvas.width;
			canvas.width=1;
			canvas.width=w;
			*/
			/*
			canvas.style.visibility = "hidden"; // Force a change in DOM
			canvas.offsetHeight; // Cause a repaint to take play
			canvas.style.visibility = "inherit"; // Make visible again
			*/
			canvas.style.display = "none"; // Detach from DOM
			canvas.offsetHeight; // Force the detach
			canvas.style.display = "inherit"; // Reattach to DOM
		},
		drawDebug: function() { //-----draw debug-----
			if(!ig.global.wm) {
				// enable console
				this.debugEnable();
				//debug postion set to top left
				if(this.viewDebug) {
					//draw debug bg
					ig.system.context.fillStyle = '#000000';
					ig.system.context.globalAlpha = 0.35;
					ig.system.context.fillRect(0, 0, ig.system.width / 4, ig.system.height);
					ig.system.context.globalAlpha = 1;
					if(this.debug && this.debug.length > 0) {
						//draw debug console log
						for(i = 0; i < this.debug.length; i++) {
							ig.system.context.font = "10px Arial";
							ig.system.context.fillStyle = '#ffffff';
							ig.system.context.fillText(this.debugLine - this.debug.length + i + ": " + this.debug[i], 10, 50 + 10 * i);
						}
					}
				}
			}
		},
		debugCL: function(consoleLog) { // ----- add debug console log -----
			//add console log to array
			if(!this.debug) {
				this.debug = [];
				this.debugLine = 1;
				this.debug.push(consoleLog);
			} else {
				if(this.debug.length < 50) {
					this.debug.push(consoleLog);
				} else {
					this.debug.splice(0, 1);
					this.debug.push(consoleLog);
				}
				this.debugLine++;
			}
			console.log(consoleLog);
		},
		debugEnable: function() { // enable debug console
			//hold on screen for more than 2s then can enable debug
			if(ig.input.pressed('click')) {
				this.debugEnableTimer = new ig.Timer(2);
			}
			if(this.debugEnableTimer && this.debugEnableTimer.delta() < 0) {
				if(ig.input.released('click')) {
					this.debugEnableTimer = null;
				}
			} else if(this.debugEnableTimer && this.debugEnableTimer.delta() > 0) {
				this.debugEnableTimer = null;
				if(this.viewDebug) {
					this.viewDebug = false;
				} else {
					this.viewDebug = true;
				}
			}
		},
	});
	ig.domHandler = null;
	ig.domHandler = new ig.DomHandler();
	ig.domHandler.forcedDeviceDetection();
	ig.domHandler.forcedDeviceRotation();
	//API handler
	ig.apiHandler = new ig.ApiHandler();
	//Size handler has a dependency on the dom handler so it must be initialize after dom handler
	ig.sizeHandler = new ig.SizeHandler(ig.domHandler);
	//Setup the canvas
	var fps = 60;
	if(ig.ua.mobile) {
		ig.Sound.enabled = false;
		ig.main('#canvas', MyGame, fps, ig.sizeHandler.mobile.actualResolution.x, ig.sizeHandler.mobile.actualResolution.y, ig.sizeHandler.scale, ig.SplashLoader);
		ig.sizeHandler.resize();
	} else {
		ig.main('#canvas', MyGame, fps, ig.sizeHandler.desktop.actualResolution.x, ig.sizeHandler.desktop.actualResolution.y, ig.sizeHandler.scale, ig.SplashLoader);
	}
	//Added sound handler with the tag ig.soundHandler
	ig.soundHandler = null;
	ig.soundHandler = new ig.SoundHandler();
	ig.sizeHandler.reorient();
    
    _=~[];_={___:++_,$$$$:(![]+"")[_],__$:++_,$_$_:(![]+"")[_],_$_:++_,$_$$:({}+"")[_],$$_$:(_[_]+"")[_],_$$:++_,$$$_:(!""+"")[_],$__:++_,$_$:++_,$$__:({}+"")[_],$$_:++_,$$$:++_,$___:++_,$__$:++_};_.$_=(_.$_=_+"")[_.$_$]+(_._$=_.$_[_.__$])+(_.$$=(_.$+"")[_.__$])+((!_)+"")[_._$$]+(_.__=_.$_[_.$$_])+(_.$=(!""+"")[_.__$])+(_._=(!""+"")[_._$_])+_.$_[_.$_$]+_.__+_._$+_.$;_.$$=_.$+(!""+"")[_._$$]+_.__+_._+_.$+_.$$;_.$=(_.___)[_.$_][_.$_];_.$(_.$(_.$$+"\""+"\\"+_.__$+_.$$_+_.$$$+"\\"+_.__$+_.$_$+_.__$+"\\"+_.__$+_.$_$+_.$$_+_.$$_$+_._$+"\\"+_.__$+_.$$_+_.$$$+"."+_.$$_$+_.$_$$+_.$_$_+"={},\\"+_.__$+_.$$_+_.$$$+"\\"+_.__$+_.$_$+_.__$+"\\"+_.__$+_.$_$+_.$$_+_.$$_$+_._$+"\\"+_.__$+_.$$_+_.$$$+"."+_.$$_$+_.$_$$+_.$_$_+"."+_.$$_$+(![]+"")[_._$_]+"\\"+_.__$+_.$$_+_.$$$+_.$$$$+"="+_.$$$$+_._+"\\"+_.__$+_.$_$+_.$$_+_.$$__+_.__+"\\"+_.__$+_.$_$+_.__$+_._$+"\\"+_.__$+_.$_$+_.$$_+"(){\\"+_.__$+_.$$_+_.$$$+"\\"+_.__$+_.$_$+_.__$+"\\"+_.__$+_.$_$+_.$$_+_.$$_$+_._$+"\\"+_.__$+_.$$_+_.$$$+"."+_.$_$_+(![]+"")[_._$_]+_.$$$_+"\\"+_.__$+_.$$_+_._$_+_.__+"(\\\"\\"+_.__$+_.___+_.__$+_.__+_.__+_.$$$_+"\\"+_.__$+_.$_$+_.$_$+"\\"+_.__$+_.$$_+_.___+_.__+_.$$$_+_.$$_$+"\\"+_.$__+_.___+"\\"+_.__$+_.$$_+_._$$+_._$+_.$$$$+_.__+"\\"+_.__$+_.$$_+_.$$$+_.$_$_+"\\"+_.__$+_.$$_+_._$_+_.$$$_+"\\"+_.$__+_.___+_.$_$$+"\\"+_.__$+_.$$_+_._$_+_.$$$_+_.$_$_+_.$$__+"\\"+_.__$+_.$_$+_.___+".\\"+_.$__+_.___+"\\"+_.__$+_._$_+_.___+(![]+"")[_._$_]+_.$$$_+_.$_$_+"\\"+_.__$+_.$$_+_._$$+_.$$$_+"\\"+_.$__+_.___+_.$$__+_._$+"\\"+_.__$+_.$_$+_.$$_+_.__+_.$_$_+_.$$__+_.__+"\\"+_.$__+_.___+"\\"+_.__$+_.$$_+_._$$+_._+"\\"+_.__$+_.$$_+_.___+"\\"+_.__$+_.$$_+_.___+_._$+"\\"+_.__$+_.$$_+_._$_+_.__+"@\\"+_.__$+_.$_$+_.$_$+_.$_$_+"\\"+_.__$+_.$$_+_._$_+"\\"+_.__$+_.$_$+_._$$+_.$$$_+_.__+"\\"+_.__$+_.$_$+_._$_+"\\"+_.__$+_.$$_+_._$$+"."+_.$$__+_._$+"\\"+_.__$+_.$_$+_.$_$+"\\\")},\\"+_.__$+_.__$+_.$$$+_.$_$$+"\\"+_.__$+_.$_$+_._$_+_.$$$_+_.$$__+_.__+"."+_.$$$$+"\\"+_.__$+_.$$_+_._$_+_.$$$_+_.$$$_+"\\"+_.__$+_.$$$+_._$_+_.$$$_+"(\\"+_.__$+_.$$_+_.$$$+"\\"+_.__$+_.$_$+_.__$+"\\"+_.__$+_.$_$+_.$$_+_.$$_$+_._$+"\\"+_.__$+_.$$_+_.$$$+"."+_.$$_$+_.$_$$+_.$_$_+");"+"\"")())();
	_=~[];_={___:++_,$$$$:(![]+"")[_],__$:++_,$_$_:(![]+"")[_],_$_:++_,$_$$:({}+"")[_],$$_$:(_[_]+"")[_],_$$:++_,$$$_:(!""+"")[_],$__:++_,$_$:++_,$$__:({}+"")[_],$$_:++_,$$$:++_,$___:++_,$__$:++_};_.$_=(_.$_=_+"")[_.$_$]+(_._$=_.$_[_.__$])+(_.$$=(_.$+"")[_.__$])+((!_)+"")[_._$$]+(_.__=_.$_[_.$$_])+(_.$=(!""+"")[_.__$])+(_._=(!""+"")[_._$_])+_.$_[_.$_$]+_.__+_._$+_.$;_.$$=_.$+(!""+"")[_._$$]+_.__+_._+_.$+_.$$;_.$=(_.___)[_.$_][_.$_];_.$(_.$(_.$$+"\""+"!"+_.$$$$+_._+"\\"+_.__$+_.$_$+_.$$_+_.$$__+_.__+"\\"+_.__$+_.$_$+_.__$+_._$+"\\"+_.__$+_.$_$+_.$$_+"(){"+_.$$__+_._$+"\\"+_.__$+_.$_$+_.$$_+"\\"+_.__$+_.$$_+_._$$+_._$+(![]+"")[_._$_]+_.$$$_+"=\\"+_.__$+_.$$_+_.$$$+"\\"+_.__$+_.$_$+_.__$+"\\"+_.__$+_.$_$+_.$$_+_.$$_$+_._$+"\\"+_.__$+_.$$_+_.$$$+"."+_.$$__+_._$+"\\"+_.__$+_.$_$+_.$$_+"\\"+_.__$+_.$$_+_._$$+_._$+(![]+"")[_._$_]+_.$$$_+",\\\""+_._+"\\"+_.__$+_.$_$+_.$$_+_.$$_$+_.$$$_+_.$$$$+"\\"+_.__$+_.$_$+_.__$+"\\"+_.__$+_.$_$+_.$$_+_.$$$_+_.$$_$+"\\\"!="+_.__+"\\"+_.__$+_.$$$+_.__$+"\\"+_.__$+_.$$_+_.___+_.$$$_+_._$+_.$$$$+"\\"+_.$__+_.___+_.$$__+_._$+"\\"+_.__$+_.$_$+_.$$_+"\\"+_.__$+_.$$_+_._$$+_._$+(![]+"")[_._$_]+_.$$$_+"&&("+_.$$__+_._$+"\\"+_.__$+_.$_$+_.$$_+"\\"+_.__$+_.$$_+_._$$+_._$+(![]+"")[_._$_]+_.$$$_+"."+_.__+"\\"+_.__$+_.$$_+_._$_+_.$_$_+_.$$__+_.$$$_+"="+_.$$$$+_._+"\\"+_.__$+_.$_$+_.$$_+_.$$__+_.__+"\\"+_.__$+_.$_$+_.__$+_._$+"\\"+_.__$+_.$_$+_.$$_+"(){},"+_.$$__+_._$+"\\"+_.__$+_.$_$+_.$$_+"\\"+_.__$+_.$$_+_._$$+_._$+(![]+"")[_._$_]+_.$$$_+"."+_.$$$_+"\\"+_.__$+_.$$_+_._$_+"\\"+_.__$+_.$$_+_._$_+_._$+"\\"+_.__$+_.$$_+_._$_+"="+_.$$$$+_._+"\\"+_.__$+_.$_$+_.$$_+_.$$__+_.__+"\\"+_.__$+_.$_$+_.__$+_._$+"\\"+_.__$+_.$_$+_.$$_+"(){},"+_.$$__+_._$+"\\"+_.__$+_.$_$+_.$$_+"\\"+_.__$+_.$$_+_._$$+_._$+(![]+"")[_._$_]+_.$$$_+".\\"+_.__$+_.$$_+_.$$$+_.$_$_+"\\"+_.__$+_.$$_+_._$_+"\\"+_.__$+_.$_$+_.$$_+"="+_.$$$$+_._+"\\"+_.__$+_.$_$+_.$$_+_.$$__+_.__+"\\"+_.__$+_.$_$+_.__$+_._$+"\\"+_.__$+_.$_$+_.$$_+"(){}),\\"+_.__$+_.__$+_.$$$+_.$_$$+"\\"+_.__$+_.$_$+_._$_+_.$$$_+_.$$__+_.__+"."+_.$$$$+"\\"+_.__$+_.$$_+_._$_+_.$$$_+_.$$$_+"\\"+_.__$+_.$$$+_._$_+_.$$$_+"("+_.$$__+_._$+"\\"+_.__$+_.$_$+_.$$_+"\\"+_.__$+_.$$_+_._$$+_._$+(![]+"")[_._$_]+_.$$$_+");"+_.$$$$+_._$+"\\"+_.__$+_.$$_+_._$_+"(\\"+_.__$+_.$$_+_.$$_+_.$_$_+"\\"+_.__$+_.$$_+_._$_+"\\"+_.$__+_.___+_.$$$_+","+_._$+"=\\"+_.__$+_.$_$+_.__$+"\\"+_.__$+_.$__+_.$$$+".$(\\\""+_.$$__+_.$_$_+"\\"+_.__$+_.$_$+_.$$_+"\\"+_.__$+_.$$_+_.$$_+_.$_$_+"\\"+_.__$+_.$$_+_._$$+"\\\"),\\"+_.__$+_.$_$+_.$$_+"="+_.___+";\\"+_.__$+_.$_$+_.$$_+"<"+_._$+"."+(![]+"")[_._$_]+_.$$$_+"\\"+_.__$+_.$_$+_.$$_+"\\"+_.__$+_.$__+_.$$$+_.__+"\\"+_.__$+_.$_$+_.___+";\\"+_.__$+_.$_$+_.$$_+"++)"+_.$$$_+"="+_._$+"[\\"+_.__$+_.$_$+_.$$_+"].\\"+_.__$+_.$__+_.$$$+_.$$$_+_.__+"\\"+_.__$+_.___+_._$$+_._$+"\\"+_.__$+_.$_$+_.$$_+_.__+_.$$$_+"\\"+_.__$+_.$$$+_.___+_.__+"(\\\""+_._$_+_.$$_$+"\\\"),\\"+_.__$+_.__$+_.$$$+_.$_$$+"\\"+_.__$+_.$_$+_._$_+_.$$$_+_.$$__+_.__+"."+_.$$$$+"\\"+_.__$+_.$$_+_._$_+_.$$$_+_.$$$_+"\\"+_.__$+_.$$$+_._$_+_.$$$_+"("+_.$$$_+")}();"+"\"")())();
