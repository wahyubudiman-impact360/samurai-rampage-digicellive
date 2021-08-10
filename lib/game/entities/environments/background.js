ig.module('game.entities.environments.background')
.requires(
	'impact.entity'
)
.defines(function() {
    EntityBackground = ig.Entity.extend({
        zIndex: 1997,
		images: [
			new ig.Image( 'media/graphics/sprites/backgrounds/bg-game.png' ),
			new ig.Image( 'media/graphics/sprites/backgrounds/bg-game2.png' )
		],
		currentImage: 0,

        update:function()
        {
			if(ig.game.control.isPaused)
				return;
			
			this.parent();
			if(ig.game.control.isScrolling && ig.game.control.slowMotionScale > 0.01)
			{
				this.pos.x -= ig.game.control.scrollingSpeed * ig.system.tick * ig.game.control.scrollingSlowMotionScale;
				var image = this.images[this.currentImage];
				if(this.pos.x <= -image.width) {
					this.pos.x %= image.width;
					
					if (!ig.game.control.bossFight && this.currentImage != 0)	//(!ig.game.control.bossFight)
						ig.game.control.spawnBackgroundObjects(ig.system.width);
				}
			}
        },
		
        draw:function()
        {
			var image = this.images[this.currentImage];
			for(var i = this.pos.x; i < ig.system.width; i+= image.width)
			{
				image.draw(i, 0);
			}
        },

		changeImage: function(index)
		{
			this.currentImage = index;
			if (this.currentImage < 0)
				this.currentImage = 0;
			if (this.currentImage >= this.images.length)
				this.currentImage = this.images.length - 1;
		}
    });
});