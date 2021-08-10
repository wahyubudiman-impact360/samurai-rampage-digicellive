ig.module('game.entities.hit-box')
.requires(
	'impact.entity'
)
.defines(function() {
    EntityHitBox = ig.Entity.extend({
        zIndex: 5001,
        size: { x: 80, y: 80 },
		health: 1,
		owner: null,
		boxOffset: { x: 0, y: 0 },

        init:function(x,y,settings)
        {
            this.parent(x,y,settings);
			if(!this.owner)
				this.kill();
			
			this.pos.x -= this.size.x*0.5;
			this.pos.y -= this.size.y*0.5;
			this.boxOffset.x = x - this.owner.pos.x;
			this.boxOffset.y = y - this.owner.pos.y;
		},
		
        update:function()
        {
			if(ig.game.control.isPaused)
				return;
			
			this.parent();
			this.pos.x = this.owner.pos.x + this.boxOffset.x - this.size.x*0.5;
			this.pos.y = this.owner.pos.y + this.boxOffset.y - this.size.y*0.5;
			
			if(this.owner && this.owner._killed)
			{
				this.owner = null;
				this.kill();
			}
        },
		
        draw:function()
        {
			this.parent();
        },

        receiveDamage: function( amount, from )
        {
			if (from.rageMode && !this.owner.immuneToRageMode)
				this.owner.receiveDamage(this.owner.health, from);
			else
				this.owner.receiveDamage(amount, from);
			
			// don't receive damage if owner has a shield
        	if(this.owner.shielded && this.owner.effect_shield)
        		return;
			
			this.parent(amount, from);
			if(this.health <= 0 && this.owner)
			{
				this.owner.removeHitArea(this);
				this.owner.checkHitArea();
			}
        },
		
		kill: function()
		{
			this.parent();
			ig.game.control.removeHitBox(this);
		}
    });
});