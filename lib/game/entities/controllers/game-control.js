ig.module('game.entities.controllers.game-control')
.requires(
	'impact.entity',
	'game.entities.hit-box',

	// characters
	'game.entities.characters.bunny',
	'game.entities.characters.enemy1',
	'game.entities.characters.enemy2',
	'game.entities.characters.enemy3',
	'game.entities.characters.enemy4',
	'game.entities.characters.enemy5',
	'game.entities.characters.boss1',
	'game.entities.characters.boss2',
	'game.entities.characters.boss3',
	
	// environments
	'game.entities.environments.background',
	'game.entities.environments.background-object',
	'game.entities.environments.background-boss',
	
	// effects
	'game.entities.effects.effect-slash',
	'game.entities.effects.effect-shield',
	'game.entities.effects.effect-enemy-shield',
	'game.entities.effects.effect-blood-splash',

	// projectiles
	'game.entities.projectiles.shuriken',
	
	// UI
	'game.entities.ui.screen-overlay',
	'game.entities.ui.buttons.button-pause',
	'game.entities.ui.panels.panel-pause',
	'game.entities.ui.panels.panel-result',
	'game.entities.ui.panels.panel-tutorial',
	'game.entities.ui.hud.ui-player-life',
	'game.entities.ui.hud.ui-score',
	'game.entities.ui.hud.ui-distance',
	'game.entities.ui.click-target',
	'game.entities.ui.sign-warning',
	'game.entities.ui.sign-combo',
	'game.entities.ui.sign-hit',
	'game.entities.ui.sign-critical',
	'game.entities.ui.sign-rage-mode',
	'game.entities.ui.sign-k-o',
	'game.entities.ui.bar-attack-timer',
	'game.entities.ui.bar-enemy-health',
	'game.entities.ui.bar-boss-health',
	'game.entities.ui.hud.ui-upgrade-point',
	'game.entities.ui.hud.ui-player-rage',
	
	// pick ups
	'game.entities.pickups.pickup-healing',
	'game.entities.pickups.pickup-shield',
	'game.entities.pickups.pickup-reflect'
)
.defines(function() {
	EntityGameControl = ig.Entity.extend({
		inTween: false,
		tweenDuration: 0.35,
		gravity: 787,
		
		// ui properties and current game progress
		score: 0,
		distance: 0,
		upgradePoint: 0,
		isPaused: false,
		distancePerSecond: 6,
		tutorialMode: false,
		endlessMode: true,
		waveData: [],
		currentWave: 0,
		totalWave: 0,
		timeLeft: 0,
		maxScore: 99999,
		maxDistance: 9999,
		maxUpgradePoint: 9999,
		
		// hit combo and score multiplier
		combo: 1,
		maxCombo: 10,
		
		// background scrolling
		isScrolling: false,
		scrollingSpeed: 400,
		
		// slow motion
		slowMotion: false,
		slowMotionScale: 1,
		defaultSlowMotionScale: 0.125,
		defaultSlowMotionTweenTime: 0.25,
		waveSlowMotion: false,
		slowMotionCountdown: 0,
		targetSlowMotionScale: 0,
		targetSlowMotionTweenTime: 0,
		scrollingSlowMotionScale: 1,
		
		// pickup spawning
		wavePerPickup: 9,
		nextPickup: 0,
		wavePerHeal: 3,
		nextHealDrop: 0,

		// boss
		bossFight: false,
		wavePerBoss: 25,
		nextBoss: 0,
		
		// current enemy on scene
		enemies: [],
		hitBoxes: [],
		playerPos: { x: 480, y: 290 },

		difficulty: 0,
		maxDifficulty: 18,

		init:function(x,y,settings)
		{
			this.parent(x,y,settings);
			ig.game.control = this;
			if(ig.global.wm)
                return;
			
			// spawn entities
			this.overlay = ig.game.spawnEntity(EntityScreenOverlay,0,0, { zIndex: 90000 });
            this.bg = ig.game.spawnEntity(EntityBackground, 0, 0);
			this.player = ig.game.spawnEntity(EntityBunny, -this.playerPos.x*0.5, this.playerPos.y);
			
			this.btn_pause = ig.game.spawnEntity(EntityButtonPause, 844, 0);
			this.ui_life = ig.game.spawnEntity(EntityUiPlayerLife, 22, 459);
			this.ui_score = ig.game.spawnEntity(EntityUiScore, 16, 7);
			this.ui_distance = ig.game.spawnEntity(EntityUiDistance, 376, 7);
			this.ui_upgradePoint = ig.game.spawnEntity(EntityUiUpgradePoint, 598, 7);
			this.ui_rage = ig.game.spawnEntity(EntityUiPlayerRage, 650, 512, { character: this.player });
			this.txt_hit = ig.game.spawnEntity(EntitySignHit, ig.system.width*0.5, 220);
			this.txt_combo = ig.game.spawnEntity(EntitySignCombo, ig.system.width*0.5, 190);
			this.txt_rage = ig.game.spawnEntity(EntitySignRageMode, ig.system.width*0.5, 190);
			this.ui_pause = ig.game.spawnEntity(EntityPanelPause);
			this.ui_result = ig.game.spawnEntity(EntityPanelResult);
			this.effect_rage = ig.game.spawnEntity(EntityScreenOverlay, 0, 0, { zIndex: this.player.zIndex + 2, color: "#cc1100", alpha: 0.25 });
			
			// this.spawnBackgroundObjects();
			// this.spawnBackgroundObjects(ig.system.width);
			ig.game.sortEntitiesDeferred();

			// fade black screen overlay
			this.inTween = true;
			this.overlay.alpha = 1;
			this.overlay.fade(0, this.tweenDuration, false, function(){ this.inTween = false; this.overlay.disable(); }.bind(this));
			
			// set up pickup and boss wave
			this.nextPickup = Math.round(this.wavePerPickup*0.5);
			this.nextHealDrop = Math.round(this.wavePerHeal*0.5);
			this.nextBoss = Math.round(this.wavePerBoss*0.5);
			this.setLevel();
		},
		
		update: function()
		{
			if(this.isPaused)
				return;
			
			this.parent();
			if (!this.tutorialMode) {
				this.distance += this.distancePerSecond * ig.system.tick * this.slowMotionScale;
				if(this.distance > this.maxDistance)
					this.distance = this.maxDistance;
			}
			
			// countdown to slow motion
			this.slowMotionCountdown -= ig.system.tick;
			if(this.waveSlowMotion && this.slowMotionCountdown <= 0 && this.enemies.length > 0)
			{
				this.waveSlowMotion = false;
				this.activateSlowMotion(this.targetSlowMotionScale, this.targetSlowMotionTweenTime);
			}
		},
		
		kill: function()
		{
			this.parent();
			ig.game.control = null;
		},

		///////////////////
		// game progress //
		///////////////////
		
		setLevel: function()
		{
			this.endlessMode = ig.game.endlessMode;
			if (this.endlessMode)
				return;
			
			var level = ig.game.spawnData.getLevel(ig.game.level);
			this.difficulty = level.difficulty;
			this.waveData = level.waveData;
			this.totalWave = this.waveData.length;
		},
		
		startGame: function()
		{
			this.isScrolling = true;
			
			if (!ig.game.tutorialEnd) {
				this.ui_tutorial = ig.game.spawnEntity(EntityPanelTutorial, 0, 0);
				this.ui_tutorial.startTutorial();
				this.waveData = ig.game.spawnData.getLevel(0).waveData;	// level 0 = tutorial
				this.totalWave = this.waveData.length;
				this.endlessMode = false;
				this.tutorialMode = true;
				ig.game.sortEntitiesDeferred();
			} else {
				this.checkEnemiesWave();
			}
		},
		
		resetGame: function()
		{
			if(this.inTween)
				return;
			
			this.inTween = true;
			this.overlay.fade( 1, this.tweenDuration, true,
				function(){
					ig.game.director.jumpTo(LevelGameplay);
				}.bind(this)
			);
		},
		
		endTutorial: function()
		{
			// ig.game.sessionData.tutorial = false;
			ig.game.saveAll();
			ig.game.tutorialEnd = true;
			this.tutorialMode = false;
			this.setLevel();
			this.startGame();
		},
		
		endLevel: function()
		{
			
		},
		
		toMainMenu: function()
		{
			if(this.inTween)
				return;
			
			this.inTween = true;
			this.overlay.fade( 1, this.tweenDuration, true,
				function(){
					ig.game.director.jumpTo(LevelMenu);
					this.kill();
				}.bind(this)
			);
		},

		toShop: function()
		{
			ig.game.openShopOnMenu = true;
			this.toMainMenu();
		},
		
		toResult: function()
		{
			this.isPaused = true;
			this.ui_result.show(2.5);
			var koText = ig.game.spawnEntity(EntitySignKO, ig.system.width*0.5, ig.system.height*0.5);
			koText.show();
			var screenFade = ig.game.spawnEntity(EntityScreenOverlay, 0, 0, { zIndex: 5000, color: '#000' });
			screenFade.fade(0.75, 0.5, true, false, 2.25);
			
			// API_END_GAME
			if (this.score > ig.game.sessionData.highScore)
			{
				ig.game.sessionData.highScore = this.score;
				this.newHighScore = true;
			}
			
			ig.game.sessionData.upgradePoint += this.upgradePoint;
			this.upgradePoint = 0;
			ig.game.saveAll();
			ig.game.sortEntitiesDeferred();
		},
		
		pause: function()
		{
			this.isPaused = true;
			this.ui_pause.show();
		},
		
		unpause: function()
		{
			this.isPaused = false;
		},
		
		/////////////
		/// score ///
		/////////////

		addScore: function(value)
		{
			if(value > 0)
				this.score += value * this.combo;
			else
				this.score += value;
			
			if(this.score > this.maxScore)
				this.score = this.maxScore;
		},
		
		addUpgradePoint: function(value)
		{
			this.upgradePoint += value;
			if(this.upgradePoint + ig.game.sessionData.upgradePoint > this.maxUpgradePoint)
				this.upgradePoint = this.maxUpgradePoint - ig.game.sessionData.upgradePoint;
		},
		
		addCombo: function()
		{
			this.combo++;
			if (this.combo > this.maxCombo)
				this.combo = this.maxCombo;
		},
		
		resetCombo: function()
		{
			this.combo = 1;
		},
		
		/////////////////
		// Effect Text //
		/////////////////
		
		showComboText: function(x,y)
		{
			// this.txt_combo.pos.x = x - this.txt_combo.size.x*0.5;
			// this.txt_combo.pos.y = y - this.txt_combo.size.y*0.5;
			this.txt_combo.show();
			this.txt_hit.hide();
		},
		
		showHitText: function(x,y,count)
		{
			this.txt_hit.pos.x = x - this.txt_hit.size.x*0.5;
			this.txt_hit.pos.y = y - this.txt_hit.size.y*0.5;
			this.txt_hit.show(count);
			this.txt_combo.hide();
		},
		
		showCriticalHit: function(x,y)
		{
			var text = ig.game.spawnEntity(EntitySignCritical, x, y);
			text.show();
			this.txt_combo.hide();
			this.txt_hit.hide();
		},
		
		//////////////
		// spawning //
		//////////////
		
		checkEnemiesWave: function()
		{
			if(!this.bossFight && this.enemies.length === 0)
			{
				this.deactivateSlowMotion();
				this.player.returning = true;
				
				if (this.endlessMode) {
					this.spawnEnemyWave();
					this.nextPickup--;
					this.nextBoss--;
				} else {
					if (this.currentWave < this.totalWave)
						this.spawnEnemyWave();
					else
						this.endLevel();
				}
			}
		},
		
		spawnEnemyWave: function()
		{
			var spawnData = ig.game.spawnData;
			spawnData.setDifficulty(this.getDifficulty());
			
			var wave;
			if (this.endlessMode) {
				wave = (this.nextBoss <= 0) ? spawnData.getBossFormation() : spawnData.getRandomFormation();
				
				if (this.nextHealDrop <= 0) {
					// this.wavePerHeal++;
					this.nextHealDrop = this.wavePerHeal;
					ig.game.spawnData.addHealingItemToFormation(wave);
				} else if (this.nextPickup <= 0) {
					this.nextHealDrop--;
					this.nextPickup = this.wavePerPickup;
					ig.game.spawnData.addPickupToFormation(wave);
				}
			} else {
				wave = spawnData.getFormation(this.waveData[this.currentWave]);
				this.currentWave++;
			}
			
			this.waveSlowMotion = wave.slowMotion;
			this.slowMotionCountdown = wave.slowMotionDelay;
			this.targetSlowMotionScale = wave.slowMotionScale || this.defaultSlowMotionScale;
			this.targetSlowMotionTweenTime = wave.slowMotionTweenTime || this.defaultSlowMotionTweenTime;
			
			for(var i = 0; i < wave.entities.length; i++)
			{
				var entityData = spawnData.convertEntitiesData(wave.entities[i]);
				var newEntity = ig.game.spawnEntity(entityData.type, entityData.x, entityData.y, entityData.settings);
				this.enemies.push(newEntity);
				
				if (entityData.boss) {
					this.setBoss(newEntity);
				}
			}
			
			ig.game.sortEntitiesDeferred();
		},

		addEnemy: function(enemy)
		{
			var index = this.enemies.indexOf(enemy);
			if(index === -1)
			{
				this.enemies.push(enemy);
			}
		},
		
		removeEnemy: function(enemy)
		{
			var index = this.enemies.indexOf(enemy);
			if (index !== -1) {
				this.enemies.splice(index, 1);
			}
			
			if (this.currentBoss === enemy) {
				this.removeBoss();
			}
			
			this.checkEnemiesWave();
		},
		
		addHitBox: function(hitbox)
		{
			var index = this.hitBoxes.indexOf(hitbox);
			if(index === -1)
			{
				this.hitBoxes.push(hitbox);
			}
		},
		
		removeHitBox: function(hitbox)
		{
			var index = this.hitBoxes.indexOf(hitbox);
			if (index !== -1) {
				this.hitBoxes.splice(index, 1);
			}
		},

		getDifficulty: function()
		{
			if(this.endlessMode)
			{
				if (this.score < 250)
					return 0;
				else if(this.score < 500)
					return 1;
				else if(this.score < 1000)
					return 2;
				else
					return Math.min(this.maxDifficulty, 3 + Math.floor((this.score - 1000)/400));
			} else {
				return this.difficulty;
			}
		},
		
		setBoss: function(entity)
		{
			this.bossFight = true;
			this.currentBoss = entity;
			this.ui_bossHealth = ig.game.spawnEntity(EntityBarBossHealth, ig.system.width*0.5, 115, { owner: entity });
			this.ui_bossHealth.fill(0.5, 0.5);
			this.bg_boss = ig.game.spawnEntity(EntityBackgroundBoss, 0, 0, { alpha: 0 });
			this.bg_boss.show();
			this.nextBoss = this.wavePerBoss;
			ig.game.sortEntitiesDeferred();
		},
		
		removeBoss: function()
		{
			this.bossFight = false;
			this.currentBoss = null;
			this.ui_bossHealth.kill();
			this.bg_boss.hide();

			// change bg
			if (this.bg.currentImage === 0)
				this.bg.changeImage(1);
		},
		
		spawnBackgroundObjects: function(x) {
			var objects = ig.game.spawnData.getBackgroundObjects();
			x = x || 0;
			for (var i = 0; i < objects.length; i++) {
				var object = objects[i];
				ig.game.spawnEntity(EntityBackgroundObject, object.x + x, object.y, { object: object.type });
			}
			ig.game.sortEntitiesDeferred();
		},
		
		///////////////////
		// slow motions  //
		///////////////////
		
		activateSlowMotion: function(value, tweenDuration)
		{
			if(this.slowMotion)
				return;
			
			if(this.slowMotionTween && typeof this.slowMotionTween.stop == 'function')
				this.slowMotionTween.stop();
			
			var scale = value || this.defaultSlowMotionScale;
			var duration = tweenDuration || this.defaultSlowMotionTweenTime;
			this.slowMotionTween = this.tween({ slowMotionScale: scale, scrollingSlowMotionScale: scale * 1.424 }, duration, { onUpdate: this.updateTimeScale.bind(this), easing: ig.Tween.Easing.Sinusoidal.EaseOut });
			this.slowMotionTween.start();
		},
		
		deactivateSlowMotion: function(tweenDuration)
		{
			this.slowMotion = false;
			
			if(this.slowMotionTween && typeof this.slowMotionTween.stop == 'function')
				this.slowMotionTween.stop();
			
			var duration = tweenDuration || this.defaultSlowMotionTweenTime;
			this.slowMotionTween = this.tween({ slowMotionScale: 1, scrollingSlowMotionScale: 1 }, duration, { onUpdate: this.updateTimeScale.bind(this), easing: ig.Tween.Easing.Sinusoidal.EaseOut });
			this.slowMotionTween.start();
		},
		
		resetSlowMotion: function()
		{
			if(this.slowMotionTween && typeof this.slowMotionTween.stop == 'function')
				this.slowMotionTween.stop();
			
			this.slowMotion = false;
			this.slowMotionScale = 0;
			this.updateTimeScale();
		},
		
		updateTimeScale: function()
		{
			this.player.anims.run.setTimeScale(this.scrollingSlowMotionScale);
		},
		
		/////////////////
		/// Rage Mode ///
		/////////////////
		
		activateRageMode: function()
		{
			ig.soundHandler.sfxPlayer.play('rageMode1');
			ig.soundHandler.sfxPlayer.play('rageMode2');
			this.effect_rage.fade(0.25, 0.2, false);
			this.txt_rage.show();
		},
		
		deactivateRageMode: function()
		{
			this.effect_rage.fade(0, 0.2, false,
				function(){
					this.effect_rage.disable();
				}.bind(this));
		},
	});
});