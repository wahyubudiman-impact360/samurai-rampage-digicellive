ig.module('game.entities.effects.effect-blood-splash')
.requires(
	'impact.entity'
)
.defines(function() {
    EntityEffectBloodSplash = ig.Entity.extend({
        zIndex: 2000,
        size: { x:235, y:203 },
		animSheet: new ig.AnimationSheet( 'media/graphics/sprites/effects/blood-splash.png', 235, 203 ),
		lifeTime: 1,
		
        init:function(x,y,settings)
		{
            this.parent(x,y,settings);
			this.addAnim('idle', 0.016, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], true);
			this.pos.x -= this.size.x * 0.5;
			this.pos.y -= this.size.y * 0.5;
			this.currentAnim.angle = Math.PI * 2 * Math.random();
			var size = Math.random()*0.5 + 0.5;
			this.setScale( size, size );
			this.tween({ currentAnim: { alpha: 0 } }, this.lifeTime, { 
				delay: (this.anims.idle.sequence.length + 1) * this.anims.idle.frameTime,
				onComplete: function(){ this.kill(); }.bind(this) 
			}).start();
        },
        update:function()
		{
			if(ig.game.control.isPaused)
				return;
            this.parent();
        },
    });
});