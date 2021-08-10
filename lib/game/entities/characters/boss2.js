ig.module('game.entities.characters.boss2')
.requires(
	'game.entities.characters.enemy1'
)
.defines(function() {
    EntityBoss2 = EntityEnemy1.extend({
    	type: ig.Entity.TYPE.NONE,
        size: { x: 207, y: 266 },
		idleAnimSheet: new ig.AnimationSheet( 'media/graphics/sprites/characters/katana-boss/katana-boss-pre-attack.png', 564, 450 ),
		attackAnimSheet: new ig.AnimationSheet( 'media/graphics/sprites/characters/katana-boss/katana-boss-attack.png', 564, 450 ),
		dieAnimSheet: new ig.AnimationSheet( 'media/graphics/sprites/characters/katana-boss/katana-boss-death.png', 564, 450 ),
		
        // status
		score: 30,
		upgradePoint: 200,
		health: 24,
		immuneToRageMode: true,
		gameSlowMotionScale: 0.065,
		splashEffectRange: 120,

		// stun
		hitCount: 0,
		hitToStun: 8,
		stunDuration: 0.05,
		stunInterval: 0.05,
		stunOffset: 5,
		
		// attack properties
		attackDamage: 0.5,
		attackDistance: -500,
		attackMoveSpeed: 4800,
		attackDelay: 0.15,
		attackDuration: 0.35,
		attackSide: 0,

		// timer
		idleDelay: 1,
		idleTime1: 2.5,
		idleTime2: 2.3,
		idleTime3: 2.1,

		// ui
		uiOffset: { x: 0, y: 0 },

		// Sounds
		attackSounds: [
			'slash1',
			'slash2',
			'slash3'
		],
		
		inSounds: [

		],
		
		deathSounds: [

		],
		
		// hit area
		hitAreaSpawns: [
			{ x: 98, y: 42 },
			{ x: 22, y: 103 },
			{ x: 115, y: 156 },
			{ x: 185, y: 115 },
			{ x: 108, y: 215 }
		],

		init:function(x,y,settings)
        {
            this.parent(x,y,settings);
            this.idleTime1 *= this.attackDelayScale;
            this.idleTime2 *= this.attackDelayScale;
            this.idleTime3 *= this.attackDelayScale;
        },

		setupAnimation: function()
		{
			// (name, frameTime, sequence, stop, pivot, offset)
			this.animSheet = this.idleAnimSheet;
			this.addAnim('idle', 0, [0], true, { x: 328, y: 264 }, { x: 218, y: 108 });
			this.animSheet = this.attackAnimSheet;
			this.addAnim('attack', 0, [0], true, { x: 328, y: 264 }, { x: 218, y: 108 });
			this.animSheet = this.dieAnimSheet;
			this.addAnim('die', 0, [0], true, { x: 328, y: 264 }, { x: 218, y: 108 });
		},
		
		setupTween: function()
		{

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

		checkHitArea: function()
		{
			if (this.health > 0 && this.hitCount < this.hitToStun) {
				var index = Math.floor(Math.random() * this.hitAreaSpawns.length);
				var pos = this.hitAreaSpawns[index];
				var x = (this.attackSide === 0) ? pos.x : this.size.x - pos.x;
				this.addHitArea(x, pos.y, 1, 0.01, true);
			}
		},

		attack: function(target)
		{
			this.parent(target);
			// play player hit sound
			ig.soundHandler.sfxPlayer.play('slash2');
			ig.soundHandler.sfxPlayer.play('attack3');
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
				this.moveDelay = 0.1;
			};

			// attack 1 state
			this.states.moveIn = {
				onEnter: function() {
					this.pos.x = (this.attackSide === 0) ? ig.system.width + this.size.x*0.5 : -this.size.x*1.5;
					this.pos.y = 300;
					this.move({ velocity: 700, angle: 60 });
					this.states.moveIn.elapsed = 0;
					this.flipAnimation(this.onLeftSide());
					
					var sound = this.inSounds[Math.floor(Math.random() * this.inSounds.length)];
					ig.soundHandler.sfxPlayer.play(sound);
					ig.soundHandler.sfxPlayer.play('jump');

					if(this.ui_timer) {
						this.ui_timer.show();
						this.ui_timer.pause();
					}
				},
				
				onUpdate: function() {
					this.states.moveIn.elapsed += ig.system.tick;
				},
				
				transitions: [
					{ nextState: 'idle', condition: function(){ return this.states.moveIn.elapsed > this.idleDelay; } }
				]
			};

			this.states.idle.onEnter = function() {
				this.jumpVel.y *= 0.5;
				if (this.health > this.maxHealth * 0.67)
					this.idleTime = this.idleTime1;
				else if (this.health > this.maxHealth * 0.34)
					this.idleTime = this.idleTime2;
				else
					this.idleTime = this.idleTime3;

				this.attackCountDown = this.idleTime;
				if (this.ui_timer) {
					this.ui_timer.maxTime = this.idleTime + this.warningTime;
					this.ui_timer.show();
					this.ui_timer.unpause();
				}

				var control = ig.game.control;
				control.activateSlowMotion(this.gameSlowMotionScale, control.defaultSlowMotionTweenTime);

				this.hitCount = 0;
				this.hitToStun = this.hitToStun;
				this.checkHitArea();
				ig.game.sortEntitiesDeferred();
			};

			this.states.warning.transitions = [
				{ nextState: 'attack', condition: function(){ return this.attackCountDown <= 0; } },
			]

			// stun state
			this.states.stun = {
				onEnter: function()
				{
					this.states.stun.elapsed = 0;
					this.stunTimer = 0;
					this.stunStep = 0;
					this.clearHitArea();
					this.currentAnim.angle = (this.currentAnim.flip.x) ? (-25 * Math.PI/180) : (25 * Math.PI/180);
					if(this.ui_timer)
						this.ui_timer.hide();
					if(this.ui_warning)
						this.ui_warning.kill();
				},

				onUpdate: function()
				{
					this.states.stun.elapsed += ig.system.tick;
					this.stunTimer += ig.system.tick;
					if (this.stunTimer >= this.stunInterval) {
						this.stunTimer = 0;
						this.stunStep = !this.stunStep;
						this.pos.x += (this.stunStep) ? -this.stunOffset : this.stunOffset;
					}
				},

				onExit: function()
				{
					this.currentAnim.angle = 0;
				},

				transitions:
				[
					{ nextState: 'stunMoveOut', condition: function(){ return this.states.stun.elapsed >= this.stunDuration; } },
				]
			};

			// move out state
			this.states.moveOut.onEnter = function()
			{
				this.states.moveOut.elapsed = 0;
				ig.game.control.deactivateSlowMotion();
				this.attackSide = this.onLeftSide() ? 1 : 0;
				var x = (this.attackSide === 0) ? (ig.system.width + this.size.x) : -(this.size.x*2);
				this.move({ x: x, y: 240, velocity: 2500, angle: 60, slowMotionScale: 0 });
				ig.soundHandler.sfxPlayer.play('jump');
			};

			// move out after stun
			this.states.stunMoveOut = {
				onEnter: function()
				{
					this.states.moveOut.elapsed = 0;
					ig.game.control.deactivateSlowMotion();
					this.attackSide = (this.health < this.maxHealth * 0.66 && this.health > this.maxHealth * 0.33) ? 0 : 1;
					var x = (this.attackSide === 0) ? (ig.system.width + this.size.x) : -(this.size.x*2);
					this.move({ x: x, y: 240, velocity: 2500, angle: 60, slowMotionScale: 0 });
					ig.soundHandler.sfxPlayer.play('jump');
				},

				onUpdate: function()
				{
					if(this.states.moveOut.moveTime > 0)
					{
						this.states.moveOut.elapsed += ig.system.tick;
					}
				},
				
				transitions:
				[
					{ nextState: 'await', condition: function(){ return this.moveCompleted } }
				]
			};

			// attacking state
			this.states.attack.onEnter = function()
			{
				var target = ig.game.control.player;
				var angle = new Vector2(this.pos.x + this.size.x*0.5 - ig.game.control.playerPos.x, this.pos.y + this.size.y*0.5 - ig.game.control.playerPos.y).toAngles();
				// var flip = target.pos.x + target.size.x*0.5 > this.pos.x + this.size.x*0.5;
				this.changeAnimation(this.anims.attack);
				// this.moveTo(target.pos.x + target.size.x*0.5 + Math.cos(angle)*this.attackDistance, target.pos.y + target.size.y*0.5 + Math.sin(angle)*this.attackDistance, this.attackMoveSpeed, true);
				this.moveTo(ig.game.control.playerPos.x + Math.cos(angle)*this.attackDistance, ig.game.control.playerPos.y + Math.sin(angle)*this.attackDistance, this.attackMoveSpeed, true);
				this.slowMotionFactor = 0;

				this.attacked = false;
				this.attackDelay = this.attackDelay;
				this.attackTime = this.attackDuration;
				this.changeAnimation(this.anims.attack, this.currentAnim.flip.x);

				target.returning = true;
				this.clearHitArea();
			};
		},
    });
});