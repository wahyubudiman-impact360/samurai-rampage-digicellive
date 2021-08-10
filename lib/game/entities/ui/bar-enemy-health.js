ig.module('game.entities.ui.bar-enemy-health')
.requires(
	'game.entities.ui.base-ui'
)
.defines(function() {
	EntityBarEnemyHealth = EntityBaseUi.extend({
		zIndex: 2010,
		size: {x: 92, y: 8},
		img_health: new ig.Image( 'media/graphics/sprites/ui/enemy-health-bar.png' ),
		owner: null,
		followOwner: true,
		uiOffset: {x: 0, y: 0 },
		filling: false,
		fillScale: 0,
		
		init:function(x,y,settings)
		{
			this.parent(x,y,settings);
			if(!this.owner)
				this.kill();
			
			this.pos.x -= this.size.x*0.5;
			this.pos.y -= this.size.y*0.5;
			this.uiOffset.x = this.pos.x - this.owner.pos.x;
			this.uiOffset.y = this.pos.y - this.owner.pos.y;
		},
		
		update: function()
		{
			if(ig.game.control.isPaused || !this.enabled)
				return;
			
			this.parent();
			
			if(this.owner)
			{
				if(this.owner._killed)
				{
					this.owner = null;
					this.kill();
				} else if (this.followOwner) {
					this.pos.x = this.owner.pos.x + this.uiOffset.x;
					this.pos.y = this.owner.pos.y + this.uiOffset.y;
				}
			}
		},
		
		draw: function()
		{
			if(!this.enabled)
				return;
			if (this.filling) {
				if (this.fillScale > 0)
				this.img_health.draw(this.pos.x, this.pos.y, 0, 0, this.img_health.width * this.fillScale, this.img_health.height);
			} else if(this.owner) {
				var healthPercentage = this.owner.health/this.owner.maxHealth;
				if(healthPercentage > 0)
				{
					if(healthPercentage > 1)
						healthPercentage = 1;

					this.img_health.draw(this.pos.x, this.pos.y, 0, 0, this.img_health.width * healthPercentage, this.img_health.height);			
				}
			}
		},
		
		fill: function(duration, delay) {
			this.filling = true;
			this.fillScale = 0;
			this.tween({ fillScale: 1 }, duration, { delay: delay, onComplete: function(){ this.filling = false; }.bind(this) }).start();;
		}
	});
});