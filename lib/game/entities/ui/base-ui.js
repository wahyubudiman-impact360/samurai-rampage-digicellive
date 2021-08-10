ig.module('game.entities.ui.base-ui')
.requires(
	'impact.entity'
)
.defines(function() {
    EntityBaseUi = ig.Entity.extend({
        zIndex: 5000,
        enabled: true,

		init:function(x,y,settings)
		{
			this.parent(x,y,settings);
			this._type = this.type;
		},

		reset:function(x,y,settings)
		{
			this.parent(x,y,settings);
			this._type = this.type;
		},

		update: function()
		{
			if (!this.enabled)
				return;

			this.parent();
		},

		draw: function()
		{
			if (!this.enabled)
				return;

			this.parent();
		},

		enable: function()
		{
			this.enabled = true;
			this.type = this._type;
		},
		
		disable: function()
		{
			this.enabled = false;
			if(this.type != ig.Entity.TYPE.NONE)
				this._type = this.type;
			
			this.type = ig.Entity.TYPE.NONE;
		},

		moveTo: function(x,y)
		{
			this.pos.x = x;
			this.pos.y = y;
		}
    });
});