ig.module('game.entities.ui.hud.ui-score')
.requires(
	'game.entities.ui.base-ui'
)
.defines(function() {
    EntityUiScore = EntityBaseUi.extend({
        zIndex: 5000,
		enabled: true,
		image: new ig.Image( 'media/graphics/sprites/ui/upper-bar-score.png'),
		size: {x: 283, y: 84},
		
        draw:function()
        {
            this.parent();
			this.image.draw(this.pos.x, this.pos.y);
			var ctx = ig.system.context;
			ctx.save();

			ctx.fillStyle = "#ffffff";
			ctx.textBaseline= "middle";

			// draw score
			ctx.textAlign = 'right';
			ctx.font = 'bold 42pt osaka';
			ctx.fillText(Math.floor(ig.game.control.score), this.pos.x + 250, this.pos.y + this.size.y*0.5);
			
			/*
			// draw combo
			ctx.textAlign = 'left';
			ctx.fillText(Math.floor(ig.game.control.combo), this.pos.x + 222, this.pos.y + this.size.y*0.5 - 5);
			ctx.font = 'bold 22pt osaka';
			ctx.fillText(_STRINGS.Game.ComboUnit, this.pos.x + 200, this.pos.y + 46);
			*/

			ctx.restore();
        }
    });
});