ig.module('game.entities.environments.background-boss')
.requires(
	'impact.entity'
)
.defines(function() {
    EntityBackgroundBoss = ig.Entity.extend({
        zIndex: 1999,
		image: new ig.Image( 'media/graphics/sprites/backgrounds/bg-boss.png' ),
		alpha: 1,
		tweenDuration: 0.5,
		
        update:function()
        {
			if(ig.game.control.isPaused)
				return;
			
			this.parent();
			if(ig.game.control.isScrolling && ig.game.control.slowMotionScale > 0.01)
			{
				this.pos.x -= ig.game.control.scrollingSpeed * ig.system.tick * ig.game.control.slowMotionScale;
				if(this.pos.x <= -this.image.width)
					this.pos.x %= this.image.width;
			}
        },
		
        draw:function()
        {
			var ctx = ig.system.context;
			var cachedAlpha = ctx.globalAlpha;
			ctx.globalAlpha = this.alpha;
			for(var i = this.pos.x; i < ig.system.width; i+=this.image.width)
			{
				this.image.draw(i, 0);
			}
			ctx.globalAlpha = cachedAlpha;
        },
		
		show: function() {
			this.tween({ alpha: 1 }, this.tweenDuration).start();
		},
		
		hide: function() {
			this.tween({ alpha: 0 }, this.tweenDuration, { onComplete: function() { this.kill(); }.bind(this) }).start();
		}
    });
});