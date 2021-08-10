ig.module('game.entities.ui.buttons.button-menu-tutorial')
.requires(
	'game.entities.ui.buttons.button'
)
.defines(function() {
	EntityButtonMenuTutorial = EntityButton.extend({
		zIndex: 1001,
		size: {x: 176, y: 25 },
		// animSheet: new ig.AnimationSheet( 'media/graphics/sprites/ui/main-menu-play.png', 312, 54 ),
        fontSize: 40,

		init:function(x,y,settings){
			this.parent(x,y,settings);
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
            ctx.fillText(_STRINGS.Menu.Tutorial, this.pos.x + this.size.x*0.5, this.pos.y+this.size.y*0.5);
            ctx.restore();
		}
	});
});