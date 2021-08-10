ig.module('game.entities.characters.enemy5')
.requires(
	'game.entities.characters.enemy1'
)
.defines(function() {
    EntityEnemy5 = EntityEnemy1.extend({
        size: { x: 154, y: 184 },
		animSheet: new ig.AnimationSheet( 'media/graphics/sprites/characters/enemy5.png', 293, 229 ),

        // status
		score: 5,
		upgradePoint: 15,
		health: 3,
		healthScaling: true,

		// attack properties
		attackDamage: 1,
		attackDistance: 240,

		// timer
		idleTime: 2,

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
			this.addAnim('idle', 0, [0], true, { x: 166, y: 122 }, { x: 69, y: 25 });
			this.addAnim('attack1', 0, [1], true, { x: 183, y: 128 }, { x: 69, y: 25 });
			this.addAnim('attack2', 0, [2], true, { x: 183, y: 122 }, { x: 69, y: 25 });
			this.addAnim('die', 0, [3], true, { x: 149, y: 122 }, { x: 49, y: 25 });
			this.addAnim('die', 0, [4], true, { x: 166, y: 122 }, { x: 69, y: 25 });
		},
		
		setupTween: function()
		{
	    	this.twn_atkRotateLeft = this.tween( { currentAnim: { angle: -0.34906585 }}, 0.2, { easing: ig.Tween.Easing.Cubic.EaseOut });
			this.twn_atkRotateRight = this.tween( { currentAnim: { angle: 0.34906585 }}, 0.2, { easing: ig.Tween.Easing.Cubic.EaseOut });
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
				var attackAnim =  Math.floor(Math.random() * 2);
				if(attackAnim === 0)
				{
					this.changeAnimation(this.anims.attack1, this.currentAnim.flip.x);
				} else {
					this.changeAnimation(this.anims.attack2, this.currentAnim.flip.x);
				}
				
				if(this.currentAnim.flip.x)
				{
					this.currentAnim.angle = -0.34906585;
					this.twn_atkRotateRight.start();
					this.tween( { pos:{ x: this.pos.x + 150 } }, 0.075 ).start();
				} else {
					this.currentAnim.angle = 0.34906585;
					this.twn_atkRotateLeft.start();
					this.tween( { pos:{ x: this.pos.x - 150 } }, 0.075 ).start();
				}
			};
		}
    });
});