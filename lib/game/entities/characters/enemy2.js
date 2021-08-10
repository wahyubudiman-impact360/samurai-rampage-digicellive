ig.module('game.entities.characters.enemy2')
.requires(
	'game.entities.characters.enemy1'
)
.defines(function() {
    EntityEnemy2 = EntityEnemy1.extend({
        size: {x: 120, y: 156},
		animSheet: new ig.AnimationSheet( 'media/graphics/sprites/characters/enemy2.png', 173, 159 ),
		
        // status
		score: 2,
		upgradePoint: 5,
		health: 1,
		shieldOffset: { x: -25, y: 0 },

		// attack properties
		attackDamage: 0.5,
		attackDistance: 125,
		attackMoveSpeed: 2500,
		attackDelay: 0,
		attackDuration: 0.175,
		attackFrameTime: 0.02,
		
		// timer
		idleTime: 0.75,

		// Sounds
		attackSounds: [
			'attack3'
		],
		
        init:function(x,y,settings)
        {
            this.parent(x,y,settings);
			this.setupStates();
		},
		
		setupAnimation: function()
		{
			// (name, frameTime, sequence, stop, pivot, offset)
			this.addAnim('idle', 0, [0], true, { x: 101, y: 95 }, { x: 32, y: -3 });
			this.addAnim('attack', 0, [1], true, { x: 84, y: 95 }, { x: 25, y: -3 });
			this.addAnim('attack', 0, [2], true, { x: 84, y: 95 }, { x: 15, y: -3 });
			this.addAnim('die', 0, [3], true, null, { x: 33, y: 2 });
			this.addAnim('die', 0, [4], true, null, { x: 21, y: 2 });
		},
		
		setupTween: function()
		{
			
		},
		
		////////////////////////
		/// character states ///
		////////////////////////
		
		setupStates: function()
		{
			this.states.moveAttack.onEnter = function() {
				var target = ig.game.control.player;
				var angle = target.angleTo(this);
				var flip = target.pos.x + target.size.x*0.5 > this.pos.x + this.size.x*0.5;
				var imageAngle = 0.331612558;
				this.changeAnimation(this.anims.attack, flip);
					
				if(flip)
					this.currentAnim.angle = this.angleTo(target) - imageAngle;
				else
					this.currentAnim.angle = angle + imageAngle;
					
				this.moveTo(target.pos.x + target.size.x*0.5 + Math.cos(angle)*this.attackDistance, target.pos.y + target.size.y*0.5 - 25 + Math.sin(angle)*this.attackDistance*0.5, this.attackMoveSpeed, true);
				this.slowMotionFactor = 0;
				target.reflectAttack(this);
			};
			
			this.states.attack.onEnter = function() {
				var target = ig.game.control.player;
				var distance = 5;
				var direction = new Vector2(this.pos.x + this.size.x*0.5 - target.pos.x + target.size.x*0.5, this.pos.y + this.size.y*0.5 - target.pos.y + target.size.y*0.5).unit();
				this.states.attack.animTimer = 0;
				this.states.attack.animStep = 0;
				this.states.attack.animOrigin = { x: this.pos.x, y: this.pos.y };
				this.states.attack.animOffset = { x: this.states.attack.animOrigin.x + distance * direction.x, y: this.states.attack.animOrigin.y + distance * direction.y };
				this.attackTime = this.attackDuration;
				this.attack(target);
			};
			
			this.states.attack.onUpdate = function() {
				this.attackTime -= ig.system.tick;
				this.states.attack.animTimer += ig.system.tick;
				if(this.states.attack.animTimer >= this.attackFrameTime)
				{
					this.states.attack.animTimer = 0;
					if(this.attackAnimStep == 0)
					{
						this.attackAnimStep = 1;
						this.pos.x = this.states.attack.animOrigin.x;
						this.pos.y = this.states.attack.animOrigin.y;
					} else {
						this.attackAnimStep = 0;
						this.pos.x = this.states.attack.animOffset.x;
						this.pos.y = this.states.attack.animOffset.y;
					}
				}
			};
		},
    });
});