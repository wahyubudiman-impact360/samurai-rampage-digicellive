ig.module('game.entities.characters.enemy1')
.requires(
	'game.entities.characters.base-character'
)
.defines(function() {
    EntityEnemy1 = EntityBaseCharacter.extend({
        size: { x: 160, y: 120 },
		animSheet: new ig.AnimationSheet( 'media/graphics/sprites/characters/enemy1.png', 210, 180 ),
		
        // status
		score: 1,
		upgradePoint: 5,
		health: 1,
		healthScaling: false,
		hitAreas: [],

		// attack properties
		attackDamage: 0.5,
		attackDistance: 170,
		attackMoveSpeed: 2500,
		attackDelay: 0.04,
		attackDuration: 0.35,
		reflected: false,
		
		// timer
		idleTime: 1,
		warningTime: 1,

		// slow motion factors
		idleSlowMotionFactor: 1,
		
		// ui
		uiOffset: { x: 0, y: 8 },
		shieldOffset: { x: -9, y: -11 },
		splashEffectRange: 60,

		// Sounds
		attackSounds: [
			'attack1',
			'attack2',
			'attack3'
		],
		
		hitSounds: [
			'hit1',
			'hit2'
		],
		
		inSounds: [
			// 'smallEnemyIn'
		],
		
		deathSounds: [
			// 'smallEnemyDeath'
		],
		
        init:function(x,y,settings)
        {
            this.parent(x,y,settings);
			// apply difficulty
			this.moveDelay *= this.moveDelayScale;
			this.idleTime *= this.attackDelayScale;
			if (this.healthScaling) this.health = Math.floor(this.health * this.healthScale);
			this.maxHealth = this.health;
			this.setupAnimation();
			this.setupTween();
			this.setupHitArea();
			this.setupChild();
			this.setupStates();
			this.setState(this.states.await);
		},
		
		setupAnimation: function()
		{
			// (name, frameTime, sequence, stop, pivot, offset)
			this.addAnim('idle', 0, [0], true, null, { x: 24, y: 28 });
			this.addAnim('attack1', 0, [1], true, { x: 111, y: 72 }, { x: 24, y: 28 });
			this.addAnim('attack2', 0, [2], true, { x: 104, y: 74 }, { x: 24, y: 28 });
			this.addAnim('die', 0, [3], true, null, { x: 24, y: 28 });
			this.addAnim('die', 0, [4], true, null, { x: 24, y: 28 });
		},
		
		setupTween: function()
		{
	    	this.twn_atk1RotateLeft = this.tween( { currentAnim: { angle: -0.34906585 }}, 0.2, { easing: ig.Tween.Easing.Cubic.EaseOut });
			this.twn_atk1RotateRight = this.tween( { currentAnim: { angle: 0.34906585 }}, 0.2, { easing: ig.Tween.Easing.Cubic.EaseOut });
	    	this.twn_atk2RotateLeft = this.tween( { currentAnim: { angle: -1.04719755 }}, 0.2, { easing: ig.Tween.Easing.Cubic.EaseOut });
			this.twn_atk2RotateRight = this.tween( { currentAnim: { angle: 1.04719755 }}, 0.2, { easing: ig.Tween.Easing.Cubic.EaseOut });
		},
		
		setupChild: function()
		{
			// spawn child entities
			var centerX = this.pos.x + this.size.x*0.5;
			if(this.health > ig.game.control.player.attackPower)
				this.ui_health = ig.game.spawnEntity(EntityBarEnemyHealth, centerX + this.uiOffset.x, this.pos.y + this.uiOffset.y - 12, { owner: this });
			if(this.shielded) {
				this.effect_shield = ig.game.spawnEntity(EntityEffectEnemyShield, this.pos.x, this.pos.y, { owner: this, shieldOffset: this.shieldOffset });
				this.ui_timer = ig.game.spawnEntity(EntityBarAttackTimer, centerX + this.uiOffset.x, this.pos.y + this.uiOffset.y, { owner: this, maxTime: this.warningTime });
				this.ui_shieldTimer = ig.game.spawnEntity(EntityBarAttackTimer, centerX + this.uiOffset.x, this.pos.y + this.uiOffset.y, { owner: this, zIndex: this.ui_timer.zIndex + 1, isShield: true, maxTime: this.idleTime });
			} else{
				this.ui_timer = ig.game.spawnEntity(EntityBarAttackTimer, centerX + this.uiOffset.x, this.pos.y + this.uiOffset.y, { owner: this, maxTime: this.idleTime + this.warningTime });
			}
		},
		
		setupHitArea: function()
		{
			this.addHitBox(this.size.x * 0.5, this.size.y * 0.5);
		},
		
		setupStates: function()
		{

		},

        clicked: function()
        {
			if(this.health <= 0)
				return;
			
            var player = ig.game.control.player;
           	if(player) {
				player.addTarget(this);
				if (this.shielded && !player.rageMode)
					ig.game.control.resetCombo();
			}
        },
		
		attack: function(target)
		{
			target.receiveDamage(this.attackDamage, this);
			var sound = this.attackSounds[Math.floor(Math.random() * this.attackSounds.length)];
			ig.soundHandler.sfxPlayer.play(sound);
		},
		
		onLeftSide: function()
		{
			return this.pos.x + this.size.x*0.5 < ig.system.width * 0.5;
		},
		
        receiveDamage: function( amount, from )
        {
			this.parent(amount, from);
			if(this.shielded && this.effect_shield)
			{
				this.effect_shield.hit();
			} else {
				// play hit sound
				var sound = this.hitSounds[Math.floor(Math.random() * this.hitSounds.length)];
				ig.soundHandler.sfxPlayer.play(sound);
				
				// spawn blood effect
				var effectPosX = this.pos.x + this.size.x * 0.5 + Math.random()*this.splashEffectRange*2 - this.splashEffectRange;
				var effectPosY = this.pos.y + this.size.y * 0.5 + Math.random()*this.splashEffectRange*2 - this.splashEffectRange;
				ig.game.spawnEntity(EntityEffectBloodSplash, effectPosX, effectPosY, { zIndex: this.zIndex - 2 });
				ig.game.sortEntitiesDeferred();
			}
		},
		
		remove: function()
		{
			this.tween( { currentAnim: { alpha: 0 }}, 0.5, { onComplete: function(){ this.kill(); }.bind(this) }).start();
			if (this.ui_health)
			{
            	this.ui_health.kill();
            	this.ui_health = null;
			}
			if (this.ui_timer)
			{
            	this.ui_timer.kill();
            	this.ui_timer = null;
			}
			if (this.ui_shieldTimer)
			{
				this.ui_shieldTimer.kill();
            	this.ui_shieldTimer = null;
			}
            if (this.ui_warning)
            {
            	this.ui_warning.kill();
            	this.ui_warning = null;
            }
			if (this.effect_shield)
			{
            	this.effect_shield.kill();
            	this.effect_shield = null;
			}
			this.clearHitArea();
			ig.game.control.removeEnemy(this);
		},
		
		// add only colision box
		addHitBox: function(x, y, width, height, health)
		{
			var settings = {
				owner: this,
				size: { x: width || 80, y: height || 80 },
				health: health || this.health
			};
			var hitBox = ig.game.spawnEntity(EntityHitBox, this.pos.x + x, this.pos.y + y, settings);
			this.hitAreas.push(hitBox);
			ig.game.control.addHitBox(hitBox);
		},

		// add a visible and clickable target
		addHitArea: function(x, y, scale, startAnimDuration, clickOnly)
		{
			var settings = {
				owner: this,
				startAnimDuration: startAnimDuration || 0.05,
				targetScale: scale || 1
			};

			var hitBox = ig.game.spawnEntity(EntityClickTarget, this.pos.x + x, this.pos.y + y, settings);
			this.hitAreas.push(hitBox);
			if (!clickOnly)
				ig.game.control.addHitBox(hitBox);
			ig.game.sortEntitiesDeferred();
		},
		
		removeHitArea: function(target)
		{
			var index = this.hitAreas.indexOf(target);
			if(index !== -1)
				this.hitAreas.splice(index, 1);
		},
		
		clearHitArea: function()
		{
			for (var i = 0; i < this.hitAreas.length; i++)
			{
				this.hitAreas[i].kill();
			}
			
			this.hitAreas = [];
		},
		
		checkHitArea: function()
		{
			
		},

        update:function()
        {
			if(ig.game.control.isPaused)
				return;
			
			this.parent();
			if (this.slowoutStarted) {
				this.slowMotionFactor += ig.system.tick * (this.idleSlowMotionFactor/this.slowoutDuration);
				if (this.slowMotionFactor >= this.idleSlowMotionFactor) {
					this.slowMotionFactor = this.idleSlowMotionFactor;
					this.slowoutStarted = false;
				}
			}
		},
		
		////////////////////////
		/// character states ///
		////////////////////////
		states: {
			await: {
				onEnter: function() {
					// console.log("Await");
					this.stopMoving = true;
					this.states.await.elapsed = 0;
				},
			
				onUpdate: function() {
					this.states.await.elapsed += ig.system.tick;
				},
				
				transitions: [
					{ nextState: 'moveIn', condition: function(){ return this.states.await.elapsed >= this.moveDelay; } }
				]
			},
		
			moveIn: {
				onEnter: function() {
					// console.log("Move In");
					// set animation facing
		            var flip = this.onLeftSide();
		            this.changeAnimation(this.anims.idle, flip);

					this.move(this.entry);
					this.states.moveIn.elapsed = 0;

					if (this.entry.slowout) {
						this.slowMotionFactor = 0;
						this.slowoutDuration = this.idleDelay + 0.5;
						this.slowoutStarted = true;
					}
					
					// show over head ui
					if(this.effect_shield)
						this.effect_shield.show();
					if(this.ui_shieldTimer)
						this.ui_shieldTimer.show();
					if(this.ui_timer)
						this.ui_timer.show();

					var sound = this.inSounds[Math.floor(Math.random() * this.inSounds.length)];
					ig.soundHandler.sfxPlayer.play(sound);
					ig.soundHandler.sfxPlayer.play('jump');
				},
				
				onUpdate: function() {
					this.states.moveIn.elapsed += ig.system.tick;
				},
				
				transitions: [
					{ nextState: 'idle', condition: function(){ return this.states.moveIn.elapsed > this.idleDelay; } }
				]
			},
			
			idle: {
				onEnter: function() {
					// console.log("Idle");
					this.attackCountDown = this.idleTime;
					if (this.ui_shieldTimer)
						this.ui_shieldTimer.unpause();
					else if (this.ui_timer)
						this.ui_timer.unpause();
				},
				
				onUpdate: function() {
					this.attackCountDown -= ig.system.tick;
				},
				
				onExit: function() {
					this.shielded = false;
					if (this.effect_shield)
						this.effect_shield.break();
					if (this.ui_shieldTimer)
						this.ui_shieldTimer.hide();
				},
				
				transitions: [
					{ nextState: 'warning', condition: function(){ return this.attackCountDown <= 0; } },
				]
			},
			
			warning: {
				onEnter: function()
				{
					// console.log("Pre Attack");
					this.reflected = false;
					this.attackCountDown = this.warningTime;
					this.ui_warning = ig.game.spawnEntity(EntitySignWarning, this.pos.x + this.size.x*0.5 + this.uiOffset.x + 65, this.pos.y + this.uiOffset.y - 7, { owner: this });
					if (this.ui_timer)
						this.ui_timer.unpause();
					ig.game.sortEntitiesDeferred();
				},
				
				onUpdate: function()
				{
					this.attackCountDown -=	ig.system.tick;
				},
				
				onExit: function()
				{
					if(this.ui_warning)
						this.ui_warning.hide();
					if(this.ui_timer)
						this.ui_timer.hide();
					this.clearHitArea();
				},
				
				transitions: [
					{ nextState: 'moveAttack', condition: function(){ return this.attackCountDown <= 0; } },
				]
			},
			
			moveAttack:
			{
				onEnter: function()
				{
					var target = ig.game.control.player;
					var angle = target.angleTo(this);
					var flip = target.pos.x + target.size.x*0.5 > this.pos.x + this.size.x*0.5;
					this.changeAnimation(this.currentAnim, flip);
					this.moveTo(target.pos.x + target.size.x*0.5 + Math.cos(angle)*this.attackDistance, target.pos.y + target.size.y*0.5 + Math.sin(angle)*this.attackDistance, this.attackMoveSpeed, true);
					this.slowMotionFactor = 0;
					ig.soundHandler.sfxPlayer.play('jump');
				},
				
				onUpdate: function()
				{
					if (!this.reflected) {
						var movePercent = this.moveDelta/this.moveDuration;
						if (movePercent > 0.33) {
							var target = ig.game.control.player;
							target.reflectAttack(this);
						}
					}
				},
				
				transitions:
				[
					{ nextState: 'die', condition: function(){ return this.moveCompleted && this.reflected; } },
					{ nextState: 'attack', condition: function(){ return this.moveCompleted && !this.reflected; } },
				]
			},

			attack:
			{
				onEnter: function()
				{
					this.attacked = false;
					this.attackDelay = this.attackDelay;
					this.attackTime = this.attackDuration;
					var attackAnim = Math.floor(Math.random() * 2);
					if(attackAnim === 0)
					{
						this.changeAnimation(this.anims.attack1, this.currentAnim.flip.x);
					
						if(this.currentAnim.flip.x)
						{
							this.currentAnim.angle = -0.785398163;
							this.twn_atk1RotateRight.start();
						} else {
							this.currentAnim.angle = 0.785398163;
							this.twn_atk1RotateLeft.start();
						}
					} else {
						this.changeAnimation(this.anims.attack2, this.currentAnim.flip.x);
					
						if(this.currentAnim.flip.x)
						{
							this.currentAnim.angle = 0.785398163;
							this.twn_atk2RotateLeft.start();
						} else {
							this.currentAnim.angle = -0.785398163;
							this.twn_atk2RotateRight.start();
						}
					}
				},
				
				onUpdate: function()
				{
					this.attackTime -= ig.system.tick;
					this.attackDelay -= ig.system.tick;
					if(!this.attacked && this.attackDelay <= 0)
					{
						var target = ig.game.control.player;
						this.attack(target);
						this.attacked = true;
					}
				},
				
				onExit: function()
				{
					this.changeAnimation(this.anims.idle, this.currentAnim.flip.x);
					this.stopTweens(false);
				},
				
				transitions:
				[
					{ nextState: 'moveOut', condition: function(){ return this.attackTime <= 0; } }
				]
			},
			
			moveOut: {
				onEnter: function()
				{
					// console.log("Move out");
					this.move(this.exit);
					
					if (this.exit.flee) {
						this.flee = true;
						ig.game.control.removeEnemy(this);
					}
					
					this.states.moveOut.elapsed = 0;
					this.type = ig.Entity.TYPE.NONE;
					this.clearHitArea();
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
					{ nextState: 'await', condition: function(){ return this.moveCompleted && !this.flee; } },
					{ nextState: 'flee', condition: function(){ return this.moveCompleted && this.flee; } }
				]
			},
			
			// die state
			die: {
				onEnter: function()
		        {
					this.type = ig.Entity.TYPE.NONE;
					this.changeAnimation(this.anims.die, this.currentAnim.flip.x, this.currentAnim.flip.y);
					this.currentMovement = this.movementType.normal;
					this.stopTweens(false);
					this.remove();
					
					// add score and combo
					ig.game.control.addScore(this.score);
					ig.game.control.addUpgradePoint(this.upgradePoint);	// this.upgradePoint);	
					ig.game.control.addCombo();
					ig.game.control.player.addRage(1);
					
					// spawn blood effect
					var effectRange = 150;
					var effectPosX = this.pos.x + this.size.x * 0.5 + Math.random()*effectRange*2 - effectRange;
					var effectPosY = this.pos.y + this.size.y * 0.5 + Math.random()*effectRange*2 - effectRange;
					ig.game.spawnEntity(EntityEffectBloodSplash, effectPosX, effectPosY);
					
					// spawn pickup
					if(this.giveItem)
						ig.game.spawnEntity(this.giveItem, this.pos.x + this.size.x*0.5, this.pos.y + this.size.y*0.5);
					
					ig.game.sortEntitiesDeferred();
					
					var sound = this.deathSounds[Math.floor(Math.random() * this.deathSounds.length)];
					ig.soundHandler.sfxPlayer.play(sound);
					this.clearHitArea();
		        },
			},
			
			flee: {
				onEnter: function()
		        {
					this.type = ig.Entity.TYPE.NONE;
					this.stopTweens(false);
					this.remove();
		        },
			},
		}
    });
});