ig.module('game.entities.ui.sign-warning')
.requires(
	'game.entities.ui.base-ui'
)
.defines(function() {
    EntitySignWarning = EntityBaseUi.extend({
        zIndex: 4000,
        size: {x: 37, y: 34},
		animSheet: new ig.AnimationSheet( 'media/graphics/sprites/ui/attack-warning-sign.png', 37, 34 ),
		flashingTime: 0.2,
		timer: 0,
		following: true,
		enabled: true,
		uiOffset: { x:0, y:0 },
		
        init:function(x,y,settings)
        {
            this.parent(x,y,settings);
			this.pos.x -= this.size.x*0.5;
			this.pos.y -= this.size.y*0.5;
			this.uiOffset.x = this.pos.x - this.owner.pos.x;
			this.uiOffset.y = this.pos.y - this.owner.pos.y;
			this.addAnim('idle', 0, [0], true);
        },
		
        update:function()
        {
			if(ig.game.control.isPaused || !this.enabled)
				return;
			
			this.parent();
			this.timer += ig.system.tick;
			
			if(this.timer >= this.flashingTime)
			{
				this.timer = 0;
				this.currentAnim.alpha = (this.currentAnim.alpha>0)?0:1;
				this.flashingTime = this.owner.attackCountDown/this.owner.warningTime * 0.2;
			}
			
			if(this.following && this.owner)
			{
				this.pos.x = this.owner.pos.x + this.uiOffset.x;
				this.pos.y = this.owner.pos.y + this.uiOffset.y;
			}
        },
		
        draw:function()
        {
			if(!this.enabled)
				return;
			
            this.parent();
        },
		
		show: function()
		{
			this.enabled = true;
		},
		
		hide: function()
		{
			this.enabled = false;
		}
    });
});