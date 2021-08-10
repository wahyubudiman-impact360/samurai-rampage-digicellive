ig.module('game.entities.ui.bar-attack-timer')
.requires(
	'game.entities.ui.base-ui'
)
.defines(function() {
	EntityBarAttackTimer = EntityBaseUi.extend({
		zIndex: 2010,
		size: {x: 92, y: 8},
		
		img_timer: new ig.Image( 'media/graphics/sprites/ui/enemy-timer.png' ),
		img_shieldTimer: new ig.Image( 'media/graphics/sprites/ui/enemy-shield-timer.png' ),
		currentImage: null,
		owner: null,
		uiOffset: {x: 0, y: 0 },
		time: 0,
		paused: true,
		enabled: false,
		isShield: false,
		followOwner: true,

		init:function(x,y,settings)
		{
			this.parent(x,y,settings);
			this.pos.x -= this.size.x*0.5;
			this.pos.y -= this.size.y*0.5;
			if (this.owner) {
				this.uiOffset.x = this.pos.x - this.owner.pos.x;
				this.uiOffset.y = this.pos.y - this.owner.pos.y;
			}
			this.currentImage = this.isShield ? this.img_shieldTimer : this.img_timer;
		},
		
		update: function()
		{
			if(ig.game.control.isPaused)
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
			
			if(!this.paused)
			{
				this.time -= ig.system.tick;
			}
		},
		
		draw: function()
		{
			if(!this.enabled)
				return;
			
			this.parent();
			
			var percentage = Math.min(1,this.time/this.maxTime);
			if(percentage > 0)
			{
				var currentWidth = this.currentImage.width * percentage;
				this.currentImage.draw(this.pos.x + this.currentImage.width - currentWidth, this.pos.y, this.currentImage.width - currentWidth, 0, currentWidth, this.currentImage.height);
			}
		},
		
		show: function()
		{
			this.enabled = true;
			this.time = this.maxTime;
		},
		
		hide: function()
		{
			this.enabled = false;
		},
		
		pause: function()
		{
			this.paused = true;
		},
		
		unpause: function()
		{
			this.paused = false;
		}
	});
});