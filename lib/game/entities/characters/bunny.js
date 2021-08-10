ig.module('game.entities.characters.bunny')
.requires(
	'game.entities.characters.base-character',
	'plugins.game.multiple-sheet-animation'
)
.defines(function() {
    EntityBunny = EntityBaseCharacter.extend({
        zIndex: 2001,
		maxVel: {x: 1000, y: 300},
		size: { x: 1, y: 1 },
		runAnimSheet1: new ig.AnimationSheet( 'media/graphics/sprites/characters/bunny/bunny-run1.png', 376, 338 ),
		runAnimSheet2: new ig.AnimationSheet( 'media/graphics/sprites/characters/bunny/bunny-run2.png', 376, 338 ),
		upAtkSheet: new ig.AnimationSheet( 'media/graphics/sprites/characters/bunny/bunny-attack1.png', 452, 272 ),
        midAtkSheet: new ig.AnimationSheet( 'media/graphics/sprites/characters/bunny/bunny-attack2.png', 452, 272 ),
        downAtkSheet: new ig.AnimationSheet( 'media/graphics/sprites/characters/bunny/bunny-attack3.png', 452, 272 ),

		// sounds
		attackSounds: [
			'slash1',
			'slash2',
			'slash3'
		],
		reflectSound: 'throw',
		
		// status
		health: 3,
		maxHealth: 3,
		extraMaxHealth: 0,
		extraHealing: 0,
		dashSpeed: 3200,

		attackPower: 1,
		attackMoveSpeed: 7200,
		attackOverPass: 50,
		afterAttackInterval: 1,
		afterAttackDistance: 50,

		critDamage: 1,
		critChance: 0,
		extraCritDamage: 0,
		extraCritChance: 0,

		reflect: 0,
		maxReflect: 1,
		targets: [],
		returning: false,
		midAirCombo: false,
		
		// shield
		shielded: false,
		shieldTime: 0,
		extraShieldTime: 0,
		shieldOffset: {
			run: { unflip: { x: -88, y: -60 }, flip: { x: -88, y: -60 } },
			attack: [
				{ unflip: { x: -22, y: -60 }, flip: { x: -110, y: -60 } },
				{ unflip: { x: -22, y: -60 }, flip: { x: -110, y: -60 } },
				{ unflip: { x: -22, y: -60 }, flip: { x: -110, y: -60 } },
			]
		},

		// rage mode
		rageMode: false,
		rage: 0,
		maxRage: 100,
		rageTime: 15,
		extraRageTime: 0,
		
        init:function(x,y,settings)
        {
            this.parent(x,y,settings);
			
			// get upgrade from save data
			var upgrades = ig.game.sessionData.upgradeLevel;
			var data = ig.game.upgradeData;
			var stats = { };
			
			// apply character's stats from upgrade
			for(var i = 0; i < upgrades.length; i++)
			{
				var level = upgrades[i];
				if(level === 0)
					continue;
					
				var upgrade = data.getUpgradeFromID(i);
				var bonus = upgrade.effect;
				if (bonus)
				{
					for(var property in bonus)
					{
						if(stats.hasOwnProperty(property))
						{
							stats[property] += bonus[property] * level;
						} else {
							stats[property] = bonus[property] * level;
						}
					}
				}
				
				var effectByLevel = upgrade.effectByLevel;
				if (effectByLevel)
				{
					for(var j = 0; j < level; j++)
					{
						for(var property in effectByLevel[j])
						{
							if(stats.hasOwnProperty(property))
							{
								stats[property] += effectByLevel[j][property];
							} else {
								stats[property] = effectByLevel[j][property];
							}
						}
					}
				}
			}
			
			ig.merge( this, stats );
			this.health += Math.floor(this.extraMaxHealth);
			this.maxHealth = this.health;
			
			// declare multi animation sheet
			var runAnimationData = [
				{ sheet: this.runAnimSheet1, sequence:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24] },
				{ sheet: this.runAnimSheet2, sequence:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19] },
			];
			
			// pivot and offset at the same point because size = 1
            this.anims.run = new ig.MultipleSheetAnimation( runAnimationData, 0.0225, false);
			this.anims.run._pivot = { x: 258, y: 153 };
			this.anims.run._offset = { x: 258, y: 153 };
			this.animSheet = this.runAnimSheet1;
			this.addAnim('dash', 1, [0], true, { x: 124, y: 111 }, { x: 109, y: 111 });
			this.animSheet = this.upAtkSheet;
			this.addAnim('attack', 1, [0], true, { x: 97, y: 96 }, { x: 82, y: 96 });
			this.animSheet = this.midAtkSheet;
			this.addAnim('attack', 1, [0], true, { x: 67, y: 97 }, { x: 52, y: 97 });
			this.animSheet = this.downAtkSheet;
			this.addAnim('attack', 1, [0], true, { x: 68, y: 141 }, { x: 53, y: 141 });
			this.changeAnimation(this.anims.run);
			this.setState(this.states.moveIn);

			this.effect_hit = ig.game.spawnEntity(EntityScreenOverlay, 0, 0, { zIndex: this.zIndex + 2, color: "#cc1100" });
			this.effect_hit.disable();
		},
		
		update: function()
		{
			if(ig.game.control.isPaused)
				return;
			
			this.parent();
			if(this.shieldTime > 0)
			{
				this.shieldTime -= ig.system.tick;
				if(this.shieldTime <= 0)
				{
					this.shielded = false;
					if (this.effect_shield) {
						this.effect_shield.break();
						this.effect_shield = null;
					}
				}
			}
			if(this.rageMode)
			{
				this.rage -= this.maxRage/this.rageTime * ig.system.tick;
				if(this.rage <= 0) {
					this.rageMode = false;
					ig.game.control.deactivateRageMode();
				}
			}
		},
		
		draw: function()
		{
			if(this.rageMode && !ig.game.isFirefox)
			{
				var ctx = ig.system.context;
				ctx.shadowBlur = 15;
				ctx.shadowColor = "#ff0000";
				this.parent();
				ctx.shadowBlur = 0;
				ctx.shadowColor = "transparent";
			} else {
				this.parent();
			}
			// this.parent();
		},
		
        receiveDamage: function( amount, from )
        {
			this.parent(amount, from);
			if(this.shielded && this.effect_shield)
			{
				this.effect_shield.hit();
			} else {
				this.effect_hit.enable();
				// if (this.health > 0)
					this.effect_hit.tween({ alpha: 1 }, 0.1, { easing: ig.Tween.Easing.Quadratic.EaseOut, loop: ig.Tween.Loop.Reverse, loopCount: 1, onComplete: function(){ this.effect_hit.enabled = false; }.bind(this) }).start();
				// else
					// this.effect_hit.tween({ alpha: 1 }, 0.35).start();
				ig.game.control.resetCombo();
			}
		},
		
		heal: function(amount, from)
		{
			this.health += Math.floor(amount + this.extraHealing);
			var flooredHealth = Math.floor(this.maxHealth);
			if(this.health >= flooredHealth)
				this.health = flooredHealth;
		},
		
		addTarget: function(target)
		{
			// if(this.targets.indexOf(target) === -1)
				this.targets.push(target);
		},
		
		attack: function(target)
		{
			if (Math.random() <= this.critChance + this.extraCritChance)
			{
				target.receiveDamage(this.attackPower * (this.critDamage+this.extraCritDamage), this);
				ig.game.control.showCriticalHit(target.pos.x + target.size.x*0.5, target.pos.y + target.size.y*0.35);
			} else {
				target.receiveDamage(this.attackPower, this);
			}
		},
		
		reflectAttack: function(target)
		{
			if(this.reflect > 0){
				this.reflect--;
				var direction = new Vector2( target.pos.x + target.size.x*0.5 - this.pos.x , target.pos.y + target.size.y*0.5 - this.pos.y).unit();
				ig.game.spawnEntity(EntityShuriken, this.pos.x, this.pos.y, { target: target, direction: direction, damage: this.attackPower*this.critDamage });
				ig.game.sortEntitiesDeferred();
				target.reflected = true;
				ig.soundHandler.sfxPlayer.play(this.reflectSound);
			}
		},
		
		getShield: function(duration)
		{
			this.shielded = true;
			this.shieldTime = duration + this.extraShieldTime;
			
			if(!this.effect_shield) {
				this.effect_shield = ig.game.spawnEntity(EntityEffectShield, this.pos.x, this.pos.y, { owner: this, shieldOffset: { x: -22, y: -20 }});
				this.setShieldOffset();
			}
		},

		setShieldOffset: function()
		{
			if (!this.effect_shield)
				return;

			var offset;
			if( this.currentAnim === this.anims.run )
				offset = this.currentAnim.flip.x ? this.shieldOffset.run.flip : this.shieldOffset.run.unflip;
			else if( this.currentAnim === this.anims.attack[0] )
				offset = this.currentAnim.flip.x ? this.shieldOffset.attack[0].flip : this.shieldOffset.attack[0].unflip;
			else if( this.currentAnim === this.anims.attack[1] )
				offset = this.currentAnim.flip.x ? this.shieldOffset.attack[1].flip : this.shieldOffset.attack[1].unflip;
			else if( this.currentAnim === this.anims.attack[2] )
				offset = this.currentAnim.flip.x ? this.shieldOffset.attack[2].flip : this.shieldOffset.attack[2].unflip;
			else if( this.currentAnim === this.anims.dash )
				offset = this.currentAnim.flip.x ? this.shieldOffset.run.flip : this.shieldOffset.run.unflip;

			this.effect_shield.shieldOffset = offset;
		},
		
		getReflect: function()
		{
			if(this.reflect < this.maxReflect)
				this.reflect++;
		},
		
		addRage: function(value)
		{
			if (this.rageMode)
				return;
			
			if (value > 0)
				this.rage += value;
			
			if(this.rage >= this.maxRage)
			{
				this.rage = this.maxRage;
				this.rageMode = true;
				ig.game.control.activateRageMode();
			}
		},
		
		////////////////////////
		/// character states ///
		////////////////////////
		states:{
			moveIn:
			{
				onEnter: function()
				{
					this.moveTo(ig.game.control.playerPos.x, ig.game.control.playerPos.y, ig.game.control.scrollingSpeed, true);
				},
				
				onExit: function()
				{
					ig.game.control.startGame();
				},
				
				transitions:
				[
					{ nextState: 'idle', condition: function(){ return this.moveCompleted; } },
				]
			},
			
			idle:
			{
				onEnter: function()
				{
					if(this.currentAnim !== this.anims.run)
					{
						this.changeAnimation(this.anims.run, false);
						this.currentAnim.rewind();
					}
					this.setShieldOffset();
				},
				
				transitions:
				[
					{ nextState: 'attack', condition: function(){ return this.targets.length > 0; } },
				]
			},
			
			attack:
			{
				onEnter: function()
				{
					this.stopTweens(false);
					this.returning = false;
					var target = this.targets.shift();
					var destination = { x: target.pos.x + target.size.x*0.5, y: target.pos.y + target.size.y*0.5 };
					var distance = new Vector2(destination.x - this.pos.x+this.size.x*0.5, destination.y - this.pos.y+this.size.y*0.5);
					var direction = distance.unit();
					var flip = distance.x < 0;
					var angle = (flip) ? new Vector2(-distance.x, -distance.y).toAngles() : distance.toAngles();

					this.changeAnimation(this.anims.attack, flip);
					this.currentAnim.angle = angle;
					this.setShieldOffset();
					
					this.moveTo(destination.x + this.attackOverPass*direction.x, destination.y + this.attackOverPass*direction.y, this.attackMoveSpeed, true);
					ig.game.spawnEntity(EntityEffectSlash, this.pos.x + distance.x*0.5, this.pos.y + distance.y*0.5, { flipped: flip, distance: distance.length() + this.attackOverPass + this.afterAttackDistance, angle: angle, direction: direction });

					// check collision with enemy between the way
					var collider = new ig.SAT.Shape(
						[
							{x: this.pos.x + this.size.x*0.5, y: this.pos.y },
							{x: this.pos.x + this.size.x*0.5, y: this.pos.y + this.size.y },
							{x: destination.x, y: destination.y + this.size.y },
							{x: destination.x, y: destination.y },
						]);
					
					this.targetedHitBoxes = [];
					for(var i = 0; i < ig.game.control.hitBoxes.length; i++)
					{
						var hitbox = ig.game.control.hitBoxes[i];
						var hitboxCollider = new ig.SAT.Shape(
							[
								{x: hitbox.pos.x, y: hitbox.pos.y },
								{x: hitbox.pos.x + hitbox.size.x, y: hitbox.pos.y },
								{x: hitbox.pos.x + hitbox.size.x, y: hitbox.pos.y + hitbox.size.y },
								{x: hitbox.pos.x, y: hitbox.pos.y + hitbox.size.y }
							]);
							
						if(ig.game.sat.simpleShapeIntersect(collider, hitboxCollider))
						{
							this.targetedHitBoxes.push(hitbox);
						}
					}
					ig.game.sortEntitiesDeferred();
					
					var sound = this.attackSounds[Math.floor(Math.random() * this.attackSounds.length)];
					ig.soundHandler.sfxPlayer.play(sound);
				},
				
				onExit: function()
				{
					var txtOffsetY = 50;
					if (this.targetedHitBoxes.length > 1)
						ig.game.control.showHitText(this.moveOrigin.x + this.moveDistance.x*0.7, this.moveOrigin.y + this.moveDistance.y*0.7 - txtOffsetY, this.targetedHitBoxes.length);
					else if (this.targetedHitBoxes.length === 1 && this.midAirCombo && ig.game.control.combo > 1)
						ig.game.control.showComboText();
					
					// apply damage to targets
					for(var i = 0; i < this.targetedHitBoxes.length; i++)
					{
						var enemy = this.targetedHitBoxes[i].owner;
						this.attack(this.targetedHitBoxes[i]);
						if(enemy.health <= 0)
							this.midAirCombo = true;
					}
				},
				
				transitions:
				[
					{ nextState: 'attack', condition: function(){ return this.targets.length > 0 && this.moveCompleted; } },
					{ nextState: 'afterAttack', condition: function(){ return this.targets.length === 0 && this.moveCompleted; } }
				]
			},
			
			afterAttack:
			{
				onEnter: function()
				{
					var direction = new Vector2( this.moveDistance.x, this.moveDistance.y ).unit();
					this.tween({ pos: {x: this.pos.x + this.afterAttackDistance*direction.x, y: this.pos.y + this.afterAttackDistance*direction.y }}, this.afterAttackInterval, { easing: ig.Tween.Easing.Quadratic.EaseOut } ).start();
					this.states.afterAttack.countdown = this.afterAttackInterval;
				},
				
				onUpdate: function()
				{
					this.states.afterAttack.countdown -= ig.system.tick;
					if (this.states.afterAttack.countdown < this.afterAttackInterval - 0.175)
						this.midAirCombo = false;
				},
				
				transitions:
				[
					{ nextState: 'moveBack', condition: function(){ return this.states.afterAttack.countdown <= 0 || this.returning === true; } },
					{ nextState: 'attack', condition: function(){ return this.targets.length > 0; } }
				]
			},
			
			moveBack:
			{
				onEnter: function()
				{
					this.returning = false;
					this.midAirCombo = false;
					this.stopTweens(false);
					this.moveTo(ig.game.control.playerPos.x, ig.game.control.playerPos.y, this.dashSpeed, true);
					
					// calculate rotation angle for bunny sprite facing
					var flip = ((this.pos.x + this.size.x*0.5) - ig.game.control.playerPos.x) > 0;
					if(flip)
						var angle = new Vector2(-((this.pos.x + this.size.x*0.5) - ig.game.control.playerPos.x), -((this.pos.y + this.size.x*0.5) - ig.game.control.playerPos.y)).toAngles();
					else
						var angle = new Vector2((this.pos.x + this.size.x*0.5) - ig.game.control.playerPos.x, (this.pos.y + this.size.x*0.5) - ig.game.control.playerPos.y).toAngles();
					this.currentAnim.angle = angle;
					this.changeAnimation(this.anims.dash, flip);
					this.setShieldOffset();
				},
				
				transitions:
				[
					{ nextState: 'idle', condition: function(){ return this.moveCompleted; } },
					{ nextState: 'attack', condition: function(){ return this.targets.length > 0; } }
				]
			},
			
			die:
			{
				onEnter: function()
				{
					ig.game.control.toResult();
				}
			}
		}
    });
});