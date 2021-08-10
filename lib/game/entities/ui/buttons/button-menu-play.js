ig.module('game.entities.ui.buttons.button-menu-play')
.requires(
	'game.entities.ui.buttons.button'
)
.defines(function() {
	EntityButtonMenuPlay = EntityButton.extend({
		zIndex: 1001,
		size: {x: 312, y: 54 },
		animSheet: new ig.AnimationSheet( 'media/graphics/sprites/ui/main-menu-play.png', 312, 54 ),

		init:function(x,y,settings){
			this.parent(x,y,settings);
			this.addAnim('normal', 0, [0], true);
		},

		draw: function() {
			if (this.isHighlighted && !ig.game.isFirefox) {
				var ctx = ig.system.context;
				ctx.save();
				ctx.shadowBlur = 20;
				ctx.shadowColor = "#ff0000";
				this.parent();
				ctx.restore();
			} else {
				this.parent();
			}
		}
	});
});