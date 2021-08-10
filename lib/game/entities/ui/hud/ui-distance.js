ig.module('game.entities.ui.hud.ui-distance')
.requires(
	'game.entities.ui.base-ui'
)
.defines(function() {
    EntityUiDistance = EntityBaseUi.extend({
        zIndex: 5000,
		enabled: true,
		image: new ig.Image( 'media/graphics/sprites/ui/upper-bar-distance.png'),
		size: {x: 196, y: 84},

        draw:function()
        {
            this.parent();
			this.image.draw(this.pos.x, this.pos.y);
			var ctx = ig.system.context;
			ctx.save();
			ctx.textAlign = 'right';
			ctx.fillStyle = "#ffffff";
			ctx.textBaseline= "middle";
			ctx.font = 'bold 32pt osaka';
			ctx.fillText(Math.floor(ig.game.control.distance), this.pos.x + this.size.x - 30, this.pos.y + this.size.y*0.5);
			ctx.restore();
        }
    });
});