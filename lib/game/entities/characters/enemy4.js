ig.module('game.entities.characters.enemy4')
.requires(
	'game.entities.characters.enemy1'
)
.defines(function() {
    EntityEnemy4 = EntityEnemy1.extend({
        size: { x: 175, y: 158 },
		animSheet: new ig.AnimationSheet( 'media/graphics/sprites/characters/enemy4.png', 254, 202 ),

        // status
		score: 5,
		upgradePoint: 15,
		health: 5,
		healthScaling: true,

		// attack properties
		attackDamage: 0.5,
		attackDistance: 280,
		
		// timer
		idleTime: 3,

		// ui
		uiOffset: { x: 0, y: -5 },
		
		inSounds: [
			'bigEnemyIn'
		],
		
		deathSounds: [
			'bigEnemyDeath'
		],

        init:function(x,y,settings)
        {
			settings.shielded = false;
            this.parent(x,y,settings);
		},
		
		setupAnimation: function()
		{
			// (name, frameTime, sequence, stop, pivot, offset)
			this.addAnim('idle', 0, [0], true, { x: 137, y: 88 }, { x: 41, y: 17 });
			this.addAnim('attack1', 0, [1], true, { x: 117, y: 88 }, { x: 41, y: 17 });
			this.addAnim('attack2', 0, [2], true, { x: 137, y: 88 }, { x: 41, y: 17 });
			this.addAnim('die', 0, [3], true, { x: 117, y: 88 }, { x: 41, y: 17 });
			this.addAnim('die', 0, [4], true, { x: 117, y: 88 }, { x: 41, y: 17 });
		},
		
		setupTween: function()
		{
	    	this.twn_atk1RotateLeft = this.tween( { currentAnim: { angle: -0.785398163 }}, 0.2, { easing: ig.Tween.Easing.Cubic.EaseOut });
			this.twn_atk1RotateRight = this.tween( { currentAnim: { angle: 0.785398163 }}, 0.2, { easing: ig.Tween.Easing.Cubic.EaseOut });
	    	this.twn_atk2RotateLeft = this.tween( { currentAnim: { angle: -0.34906585 }}, 0.2, { easing: ig.Tween.Easing.Cubic.EaseOut });
			this.twn_atk2RotateRight = this.tween( { currentAnim: { angle: 0.34906585 }}, 0.2, { easing: ig.Tween.Easing.Cubic.EaseOut });
		},

		////////////////////////
		/// character states ///
		////////////////////////
		
		setupStates: function()
		{
			this.states.attack.onEnter = function()
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
						this.tween( { pos:{ x: this.pos.x + 150 } }, 0.075 ).start();
					} else {
						this.currentAnim.angle = 0.785398163;
						this.twn_atk1RotateLeft.start();
						this.tween( { pos:{ x: this.pos.x - 150 } }, 0.075 ).start();
					}
				} else {
					this.changeAnimation(this.anims.attack2, this.currentAnim.flip.x);
				
					if(this.currentAnim.flip.x)
					{
						this.currentAnim.angle = 0;
						this.twn_atk2RotateRight.start();
						this.tween( { pos:{ x: this.pos.x + 150 } }, 0.075 ).start();
					} else {
						this.currentAnim.angle = 0;
						this.twn_atk2RotateLeft.start();
						this.tween( { pos:{ x: this.pos.x - 150 } }, 0.075 ).start();
					}
				}
			};
		}
    });
});