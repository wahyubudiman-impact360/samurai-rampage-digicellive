ig.module('game.entities.characters.boss3')
.requires(
	'game.entities.characters.enemy1'
)
.defines(function() {
    EntityBoss3 = EntityEnemy1.extend({
    	type: ig.Entity.TYPE.NONE,
        size: { x: 597, y: 690 },
		idleAnimSheet: new ig.AnimationSheet( 'media/graphics/sprites/characters/end-boss/endboss-preattack.png', 918, 690 ),
		attackAnimSheet: new ig.AnimationSheet( 'media/graphics/sprites/characters/end-boss/endboss-attack.png', 918, 690 ),
		dieAnimSheet: new ig.AnimationSheet( 'media/graphics/sprites/characters/end-boss/endboss-death.png', 918, 690 ),
		
        // status
		score: 50,
		upgradePoint: 200,
		health: 54,
		immuneToRageMode: true,
		gameSlowMotionScale: 0.065,
		splashEffectRange: 120,

		// stun
		hitCount: 0,
		hitToStun: 18,
		stunDuration: 0.5,
		stunInterval: 0.05,
		stunOffset: 10,
		
		// attack properties
		attackDamage: 1,
		attackDistance: 480,
		attackMoveSpeed: 2500,
		attackDelay: 0.25,
		attackDuration: 0.35,
		attackSide: 0,

		// timer
		idleDelay: 1,
		idleTime: 9,

		// ui
		uiOffset: { x: -126, y: 237 },

		// 
		standPos: { x: 512, y: 590 },

		// Sounds
		attackSounds: [
			'attack2'
		],
		
		inSounds: [
			'bigEnemyIn'
		],
		
		deathSounds: [
			'bigEnemyDeath'
		],
		
		// hit area
		hitAreaSpawns: [
			{ x: 37, y: 340 },
			{ x: 141, y: 308 },
			{ x: 275, y: 310 },
			{ x: 95, y: 420 },
			{ x: 215, y: 395 },
			{ x: 340, y: 400 },
			{ x: 323, y: 496 },
			{ x: 175, y: 493 },
			{ x: 65, y: 533 }
		],

		setupAnimation: function()
		{
			// (name, frameTime, sequence, stop, pivot, offset)
			this.animSheet = this.idleAnimSheet;
			this.addAnim('idle', 0, [0], true, { x: 620, y: 383 }, { x: 321, y: -100 });
			this.animSheet = this.attackAnimSheet;
			this.addAnim('attack', 0, [0], true, { x: 620, y: 383 }, { x: 321, y: -100 });
			this.animSheet = this.dieAnimSheet;
			this.addAnim('die', 0, [0], true, { x: 620, y: 383 }, { x: 321, y: -100 });
		},
		
		setupTween: function()
		{
			this.twn_atkRotate = this.tween( { currentAnim: { angle: 0 }}, 0.2, { easing: ig.Tween.Easing.Cubic.EaseOut });
		},
		
		setupChild: function()
		{
			this.ui_timer = ig.game.spawnEntity(EntityBarAttackTimer, this.pos.x + this.size.x * 0.5 + this.uiOffset.x, this.pos.y + this.uiOffset.y, { owner: this, maxTime: this.idleTime + this.warningTime });
		},
		
		setupHitArea: function()
		{

		},

		receiveDamage: function( amount, from )
        {
			this.parent(amount, from);
			this.hitCount+=amount;
			if (this.hitCount >= this.hitToStun && this.health > 0)
				this.setState(this.states.stun);
		},

		remove: function()
		{
			this.parent();
			ig.game.control.playerPos = this.cachedPlayerPos;
		},

		checkHitArea: function()
		{
			if (this.health > 0 && this.hitCount < this.hitToStun) {
				var index = Math.floor(Math.random() * this.hitAreaSpawns.length);
				var pos = this.hitAreaSpawns[index];
				var x = (this.attackSide === 0) ? pos.x : this.size.x - pos.x;
				this.addHitArea(x, pos.y, 1, 0.01, true);
			}
		},

		playStandingAnim: function() {
			this.tween({ scale: { x: 1.025, y: 0.975 } }, 2, {
				easing: ig.Tween.Easing.Quadratic.EaseInOut,
				onUpdate: this.changeStandingScale.bind(this),
				loop: ig.Tween.Loop.Reverse
			}).start();
		},

		stopStandingAnim: function() {
			this.stopTweens();
			this.setScale(1,1);
			this.changeStandingScale();
		},

		changeStandingScale: function() {
			this.setScale(this.scale.x, this.scale.y);
			this.pos.x = this.standPos.x;
			this.pos.y = this.standPos.y - this.size.y;
		},

		draw: function()
		{
			this.parent();
			if (this.health <= 0)
				return;

			// draw stun guage
			var guageWidth = 225;
			var guageHeight = 10;
			var percentage = this.hitCount/this.hitToStun;
			if (percentage < 0)
				percentage = 0;
			if (percentage > 1)
				percentage = 1;

			var ctx = ig.system.context;
			ctx.save();
			ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
			ctx.fillRect((ig.system.width-guageWidth)*0.5, 124, guageWidth, guageHeight);
			ctx.fillStyle = "#ff8080";
			ctx.fillRect((ig.system.width-guageWidth)*0.5, 124, guageWidth*percentage, guageHeight);
			ctx.restore();
		},

		////////////////////////
		/// character states ///
		////////////////////////

		setupStates: function()
		{
			// await state
			this.states.await.onExit = function() {
				this.moveDelay = 0.01;
				this.entered = true;
			};

			this.states.await.transitions = [
				{ nextState: 'moveIn', condition: function(){ return !this.entered && this.states.await.elapsed >= this.moveDelay; } },
				{ nextState: 'idle', condition: function(){ return this.entered && this.states.await.elapsed >= this.moveDelay; } }
			]

			// enter state
			this.states.moveIn = {
				onEnter: function() {
					this.pos.x = this.standPos.x;
					this.pos.y = this.standPos.y - this.size.y*3;
					this.moveTo(this.pos.x + this.size.x*0.5, this.standPos.y - this.size.y*0.5, 1375, true);
					this.states.moveIn.elapsed = 0;
					this.flipAnimation(this.onLeftSide());
					
					var sound = this.inSounds[Math.floor(Math.random() * this.inSounds.length)];
					ig.soundHandler.sfxPlayer.play(sound);
					ig.soundHandler.sfxPlayer.play('jump');

					this.cachedPlayerPos = ig.game.control.playerPos;
					ig.game.control.player.moveTo(240, ig.game.control.playerPos.y, ig.game.control.scrollingSpeed*0.5, true);
					ig.game.control.playerPos = { x: 240, y: ig.game.control.playerPos.y };

					if(this.ui_timer) {
						this.ui_timer.show();
						this.ui_timer.pause();
					}
				},

				onExit: function() {
					this.ui_timer.followOwner = false;
					var twn_down = this.tween({ scale: { x: 1.1, y: 0.9 } }, 0.1, {
						easing: ig.Tween.Easing.Quadratic.EaseOut,
						onUpdate: this.changeStandingScale.bind(this)
					});
					var twn_up = this.tween({ scale: { x:1, y: 1 } }, 0.2, {
						easing: ig.Tween.Easing.Back.EaseOut,
						onUpdate: this.changeStandingScale.bind(this),
						onComplete: this.playStandingAnim.bind(this)
					});
					twn_down.chain(twn_up);
					twn_down.start();
				},
				
				transitions: [
					{ nextState: 'idle', condition: function(){ return this.moveCompleted; } }
				]
			};

			// idle state
			this.states.idle.onEnter = function() {
				this.attackCountDown = this.idleTime;
				if (this.ui_timer) {
					this.ui_timer.show();
					this.ui_timer.unpause();
				}

				var control = ig.game.control;
				control.activateSlowMotion(this.gameSlowMotionScale, control.defaultSlowMotionTweenTime);

				this.hitCount = 0;
				this.hitToStun = this.hitToStun;
				this.checkHitArea();
				ig.game.sortEntitiesDeferred();

				if (this.tweens.length === 0)
					this.playStandingAnim();
			};

			this.states.warning.transitions = [
				{ nextState: 'attack', condition: function(){ return this.attackCountDown <= 0; } },
			];

			// stun state
			this.states.stun = {
				onEnter: function()
				{
					this.states.stun.elapsed = 0;
					this.states.stun.stunTimer = 0;
					this.states.stun.step = 0;
					this.clearHitArea();
					this.stopStandingAnim();
					if(this.ui_timer)
						this.ui_timer.hide();

					if(this.ui_warning)
						this.ui_warning.kill();
				},

				onUpdate: function()
				{
					this.states.stun.elapsed += ig.system.tick;
					this.states.stun.stunTimer += ig.system.tick;
					if (this.states.stun.stunTimer >= this.stunInterval) {
						this.states.stun.stunTimer = 0;
						this.states.stun.step = !this.states.stun.step;
						this.pos.x += (this.states.stun.step) ? -this.stunOffset : this.stunOffset;
					}
				},

				onExit: function()
				{
					this.currentAnim.angle = 0;
				},

				transitions:
				[
					{ nextState: 'await', condition: function(){ return this.states.stun.elapsed >= this.stunDuration; } },
				]
			};

			// attacking state
			this.states.attack.onEnter = function()
			{
				ig.game.control.player.returning = true;
				this.attacked = false;
				this.attackDelay = this.attackDelay;
				this.attackTime = this.attackDuration;
				this.stopStandingAnim();
				this.changeAnimation(this.anims.attack, this.currentAnim.flip.x);
				this.currentAnim.angle = 0.52;
				this.twn_atkRotate.start();
				this.tween( { pos: { x: this.pos.x - 50 }}, 0.2, {
					easing: ig.Tween.Easing.Cubic.EaseInOut,
					loop: ig.Tween.Loop.Reverse,
					loopCount: 1,
					onComplete: this.changeStandingScale.bind(this)
				}).start();
				this.clearHitArea();
			};

			this.states.attack.transitions = [
				{ nextState: 'await', condition: function(){ return this.attackTime <= 0; } },
			];

			this.states.die.onUpdate =  function()
			{
				this.states.stun.elapsed += ig.system.tick;
				this.states.stun.stunTimer += ig.system.tick;
				if (this.states.stun.stunTimer >= this.stunInterval) {
					this.states.stun.stunTimer = 0;
					this.states.stun.step = !this.states.stun.step;
					this.pos.x += (this.states.stun.step) ? -this.stunOffset : this.stunOffset;
				}
			}
		},
    });
});