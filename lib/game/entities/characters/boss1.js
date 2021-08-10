ig.module('game.entities.characters.boss1')
.requires(
	'game.entities.characters.enemy1'
)
.defines(function() {
    EntityBoss1 = EntityEnemy1.extend({
    	type: ig.Entity.TYPE.NONE,
        size: { x: 354, y: 343 },
		idleAnimSheet: new ig.AnimationSheet( 'media/graphics/sprites/characters/bear-boss/bear-boss-preattack.png', 354, 343 ),
		attackAnimSheet: new ig.AnimationSheet( 'media/graphics/sprites/characters/bear-boss/bear-boss-attack.png', 643, 380 ),
		dieAnimSheet: new ig.AnimationSheet( 'media/graphics/sprites/characters/bear-boss/bear-boss-death.png', 643, 380 ),
		
        // status
		score: 30,
		upgradePoint: 200,
		health: 24,
		immuneToRageMode: true,
		gameSlowMotionScale: 0.065,
		splashEffectRange: 120,

		// stun
		hitCount: 0,
		hitToStun: 12,
		stunDuration: 0.5,
		stunInterval: 0.05,
		stunOffset: 5,
		
		// attack properties
		attackDamage: 1,
		attackDistance: 250,
		attackMoveSpeed: 2500,
		attackDelay: 0,
		attackDuration: 0.35,
		attackSide: 0,

		// timer
		idleDelay: 1,
		idleTime: 5,

		// ui
		uiOffset: { x: 0, y: 50 },

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
		
		setupAnimation: function()
		{
			// (name, frameTime, sequence, stop, pivot, offset)
			this.animSheet = this.idleAnimSheet;
			this.addAnim('idle', 0, [0], true);
			this.animSheet = this.attackAnimSheet;
			this.addAnim('attack', 0, [0], true, { x: 408, y: 215 }, { x: 234, y: 0 });
			this.animSheet = this.dieAnimSheet;
			this.addAnim('die', 0, [0], true, { x: 408, y: 215 }, { x: 234, y: 0 });
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
				var hitAreaSpawns = [
					{ x: 87, y: 143 },
					{ x: 151, y: 103 },
					{ x: 220, y: 160 },
					{ x: 175, y: 240 },
					{ x: 270, y: 187 },
					{ x: 320, y: 220 },
					{ x: 220, y: 300 }
				];

				var spawnCount = (this.health > this.maxHealth * 0.5) ? 2 : 1;
				for (var i = 0; i < spawnCount && this.hitAreas.length < spawnCount; i++) {
					var index = Math.floor(Math.random() * hitAreaSpawns.length);
					var pos = hitAreaSpawns.splice(index, 1)[0];
					var x = (this.attackSide === 0) ? pos.x : this.size.x - pos.x;
					this.addHitArea(x, pos.y, 1, 0.01, true);
				}
			}
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
					this.pos.x = (this.attackSide === 0) ? (ig.system.width - 50) : 50 - this.size.x;
					this.pos.y = ig.system.height + 50 + this.size.y*0.5;
					this.move({ velocity: 1050, angle: 75 });
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
			};

			// stun state
			this.states.stun = {
				onEnter: function()
				{
					this.states.stun.elapsed = 0;
					this.stunTimer = 0;
					this.stunStep = 0;
					this.clearHitArea();
					this.currentAnim.angle = (this.currentAnim.flip.x) ? (-25 * Math.PI/180) : (25 * Math.PI/180);

					if (this.ui_timer)
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
					{ nextState: 'moveOut', condition: function(){ return this.states.stun.elapsed >= this.stunDuration; } },
				]
			};

			// move out state

			this.states.moveOut.onEnter = function()
			{
				this.states.moveOut.elapsed = 0;
				ig.game.control.deactivateSlowMotion();

				this.attackSide = Math.round(Math.random());
				var x = (this.attackSide === 0) ? (ig.system.width + this.size.x) : -(this.size.x*2);
				this.move({ x: x, y: 440, velocity: 1375, angle: 60, slowMotionScale: 0 });
				ig.soundHandler.sfxPlayer.play('jump');
			};

			// attacking state
			this.states.attack.onEnter = function()
			{
				this.attacked = false;
				this.attackDelay = this.attackDelay;
				this.attackTime = this.attackDuration;
				this.changeAnimation(this.anims.attack, this.currentAnim.flip.x);
				this.clearHitArea();
			};
		},
    });
});