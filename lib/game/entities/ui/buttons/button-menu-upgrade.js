ig.module('game.entities.ui.buttons.button-menu-upgrade')
.requires(
	'game.entities.ui.buttons.button'
)
.defines(function() {
	EntityButtonMenuUpgrade = EntityButton.extend({
		zIndex: 1001,
		size: {x: 100, y: 24 },
		// animSheet: new ig.AnimationSheet( 'media/graphics/sprites/ui/main-menu-upgrade.png', 169, 24 ),
		fontSize: 40,
		init:function(x,y,settings){
			this.parent(x,y,settings);
			// this.addAnim('normal', 0, [0], true);
		},

		draw: function() {
            var ctx = ig.system.context;
            ctx.save();
			if (this.isHighlighted && !ig.game.isFirefox) {
				ctx.shadowBlur = 20;
				ctx.shadowColor = "#ff0000";
				this.parent();
			} else {
				this.parent();
			}
            ctx.textAlign = "center";
            ctx.textBaseline= "middle";
            ctx.fillStyle = "#ffffff";
            ctx.font = this.fontSize*this.scale.y + 'px osaka';
            ctx.fillText(_STRINGS.Menu.Shop, this.pos.x + this.size.x*0.5, this.pos.y+this.size.y*0.5);
            ctx.restore();
		}
	});
});