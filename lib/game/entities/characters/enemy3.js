ig.module('game.entities.characters.enemy3')
.requires(
	'game.entities.characters.enemy1'
)
.defines(function() {
    EntityEnemy3 = EntityEnemy1.extend({
        size: { x: 180, y: 232 },
		animSheet: new ig.AnimationSheet( 'media/graphics/sprites/characters/enemy3.png', 292, 239 ),
		type: ig.Entity.TYPE.NONE,
		
        // status
		score: 4,
		upgradePoint: 15,
		health: 3,

		// attack properties
		attackDamage: 0.5,
		attackDistance: 170,
		attackMoveSpeed: 2500,
		attackDelay: 0.04,
		attackDuration: 0.35,
		
		// timer
		idleTime: 2.5,

		// clickable target
		hitAreaSpawns: [
			{ x: 168, y: 85 },
			{ x: 0, y: 128 },
			{ x: 80, y: 80 },
			{ x: 87, y: 225 },
			{ x: 122, y: 147 },
		],
		
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
			this.addAnim('idle', 0, [0], true, null, { x: 63, y: 7 });
			this.addAnim('attack1', 0, [1], true, null, { x: 63, y: 7 });
			this.addAnim('attack2', 0, [2], true, null, { x: 63, y: 7 });
			this.addAnim('die', 0, [3], true, null, { x: 44, y: 7 });
			this.addAnim('die', 0, [4], true, null, { x: 71, y: 7 });
		},
		
		setupHitArea: function()
		{
			for (var i = 0; i < 3; i++) {
				var index = Math.floor(Math.random() * this.hitAreaSpawns.length);
				var pos = this.hitAreaSpawns.splice(index, 1)[0];
				var x = (this.attackSide === 1) ? pos.x : this.size.x - pos.x;
				this.addHitArea(x, pos.y, 0.82);
			}
		}
    });
});