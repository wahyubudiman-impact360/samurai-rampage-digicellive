ig.module('game.entities.ui.buttons.button-upgrade')
.requires(
	'game.entities.ui.buttons.button'
)
.defines(function() {
	EntityButtonUpgrade = EntityButton.extend({
		zIndex:5100,
		size: {x: 88, y: 80 },
		animSheet: new ig.AnimationSheet( 'media/graphics/sprites/ui/buy-upgrade-button.png', 88, 80 ),
		
		costFontSize: 30,
		currencyFontSize: 20,
		textFontSize: 22,

		init:function(x,y,settings){
			this.parent(x,y,settings);
			this.addAnim('normal', 0, [0], true);
		},
		
		clicked: function()
		{
			this.parent();
			if (ig.ua.mobile)
				this.isHighlighted = true;
		},
		
		released: function()
		{
			this.parent();
			if (ig.ua.mobile)
				this.isHighlighted = false;
		},

		draw: function()
		{
			this.parent();
			var ctx = ig.system.context;
			ctx.save();
			ctx.fillStyle = '#d62e23';
			ctx.font = this.textFontSize*this.scale.x + 'pt osaka';
			if(this.panel.level < this.panel.upgradeData.maxLevel)
			{
				// ctx.font = 'bold ' + this.costFontSize*this.scale.x + 'pt osaka';
				// var costLength = ctx.measureText(this.panel.cost).width;
				// ctx.font = 'bold ' + this.currencyFontSize*this.scale.x + 'pt osaka';
				// var currencyLength = ctx.measureText(_STRINGS.Upgrade.Currency).width;
				// var costPosX = this.pos.x + (this.size.x - costLength)*0.5;
				// ctx.fillText(_STRINGS.Upgrade.Currency, (costPosX), this.pos.y + 67);
				// ctx.font = 'bold '+ this.costFontSize*this.scale.x + 'pt osaka';
				ctx.fillText(_STRINGS.Upgrade.Currency + this.panel.cost, this.pos.x + 9, this.pos.y + 67);
				// ctx.font = this.textFontSize*this.scale.x + 'pt osaka';
				ctx.textAlign = 'center';
				ctx.fillText(_STRINGS.Upgrade.Buy, this.pos.x + 46, this.pos.y + 42);
			}
			else
			{
				ctx.textAlign = 'center';
				ctx.textBaseline= "middle";
				ctx.fillText(_STRINGS.Upgrade.Maxed, this.pos.x + this.size.x*0.5, this.pos.y + this.size.y*0.5);
			}
			ctx.restore();
		},

		callback:function(){
			this.panel.upgrade();
		},
	});
});