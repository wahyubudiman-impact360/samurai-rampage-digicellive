ig.module('game.entities.ui.hud.ui-upgrade-point')
.requires(
	'game.entities.ui.base-ui'
)
.defines(function() {
    EntityUiUpgradePoint = EntityBaseUi.extend({
        zIndex: 5000,
		enabled: true,
		image: new ig.Image( 'media/graphics/sprites/ui/upper-bar-money.png'),
		size: {x: 196, y: 84},
		
		init:function(x,y,settings)
		{
			this.parent(x,y,settings);
		},
		
        draw:function()
        {
			this.image.draw(this.pos.x, this.pos.y);
			var ctx = ig.system.context;
			var pointInGame = ig.game.control ? ig.game.control.upgradePoint : 0;
			var point = Math.floor(ig.game.sessionData.upgradePoint + pointInGame);
			ctx.save();
			ctx.fillStyle = "#ffffff";
			ctx.textBaseline= "middle";
			ctx.font = 'bold 32pt osaka';
			ctx.textAlign = 'right';
			ctx.fillText(point, this.pos.x + this.size.x - 30, this.pos.y + this.size.y*0.5);
			ctx.restore();
        },
    });
});