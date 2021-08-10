ig.module('game.entities.effects.effect-slash')
.requires(
	'impact.entity'
)
.defines(function() {
    EntityEffectSlash = ig.Entity.extend({
        zIndex: 3001,
		animSheet: new ig.AnimationSheet( 'media/graphics/sprites/effects/slash.png', 447, 161 ),
		size: { x: 447, y: 161 },
		minDistance: 100,
		distancePerScale: 100,
		maxScale: 2.25,
		
        init:function(x,y,settings)
        {
            this.parent(x,y,settings);
			this.addAnim('idle', 0.033, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ,10, 11], true);
			this.currentAnim.angle = this.angle;
			this.pos.x -= this.size.x * 0.5;
			this.pos.y -= this.size.y * 0.5;
            this.lifeTimer = new ig.Timer((this.anims.idle.sequence.length + 1) * this.anims.idle.frameTime);
			this.currentAnim.flip.x = this.flipped;

			if(this.distance > this.minDistance)
			{
				var scale = this.distance/this.distancePerScale;
				if(scale > this.maxScale)
				{
					scale = this.maxScale;
					this.pos.x += (this.distance*0.5 - this.distancePerScale * this.maxScale)*this.direction.x;
					this.pos.y += (this.distance*0.5 - this.distancePerScale * this.maxScale)*this.direction.y;
				}
				this.setScale(scale, scale);
			}
        },
		
        update:function()
        {
			if(ig.game.control.isPaused)
				return;
			
			this.parent();
            if(this.lifeTimer.delta() >= 0)
                this.kill();
        },
		
        draw:function(){
            this.parent();
        },
    });
});