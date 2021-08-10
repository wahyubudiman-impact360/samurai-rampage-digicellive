ig.module('game.entities.ui.screen-overlay')
.requires(
	'game.entities.ui.base-ui'
)
.defines(function() {
	EntityScreenOverlay = EntityBaseUi.extend({
		zIndex: 5000,
		enabled: false,
		color: "#000000",
		image: null,
		alpha: 0,
		
		init:function(x,y,settings)
		{
			this.parent(x,y,settings);
			
			this.size.x = ig.system.width;
			this.size.y = ig.system.height;
			this.type = this.clickable ? ig.Entity.TYPE.A : ig.Entity.TYPE.NONE;
		},
		
		draw: function()
		{
			if(!this.enabled)
				return;

			if(this.alpha > 0)
			{
				var ctx = ig.system.context;
				ctx.save();
				ctx.globalAlpha = this.alpha;
				
				if(this.image)
				{
					this.image.draw(0,0);
				}
				else
				{
					ctx.fillStyle =	this.color;
					ctx.fillRect(0,0, this.size.x, this.size.y);
				}
				
				ctx.globalAlpha = 1;
				ctx.restore();
			}
		},
		
		clicked:function()
		{
			
		},
		
		fade: function(newValue, time, clickable, onComplete, delay)
		{
			this.enable();
			this.type = clickable ? ig.Entity.TYPE.A : ig.Entity.TYPE.NONE;

			if(onComplete)
        		this.tween({ alpha: newValue }, time,
					{
						delay: delay,
						easing: ig.Tween.Easing.Linear.EaseNone,
						onComplete: onComplete
					}
				).start();
			else
        		this.tween({ alpha: newValue }, time,
					{
						delay: delay,
						easing: ig.Tween.Easing.Linear.EaseNone
					}
				).start();
		}
	});
});