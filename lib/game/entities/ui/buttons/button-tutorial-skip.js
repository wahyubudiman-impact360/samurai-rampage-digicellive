ig.module('game.entities.ui.buttons.button-tutorial-skip')
.requires(
	'game.entities.ui.buttons.button'
)
.defines(function() {
	EntityButtonTutorialSkip = EntityButton.extend({
		zIndex:5011,
		size: {x: 115, y: 40 },
		fontSize: 28,
		textOffset: -53, // position in x axis from center of button
		animSheet: new ig.AnimationSheet( 'media/graphics/sprites/ui/tutorial-skip-icon.png', 32, 32 ),
		offset: { x: -75, y: -4 },
		
		init:function(x,y,settings){
			this.parent(x,y,settings);
			this.addAnim('normal', 0, [0], true);
		},
		
		draw: function() {
			if (!this.enabled)
				return;
			
			var ctx = ig.system.context;
			ctx.save();
			
			// draw button text
			ctx.textBaseline= "middle";
			ctx.textAlign = 'left';
			ctx.fillStyle = "#000";
			ctx.font = this.fontSize*this.scale.y + 'px osaka';
			ctx.fillText(_STRINGS.Tutorial.Skip, this.pos.x + this.size.x*0.5 + this.textOffset*this.scale.x, this.pos.y + this.size.y*0.5);
			
			// draw button icon
			this.parent();
			ctx.restore();
		},
		
		clicked:function(){
			this.parent();
		},
		
		released:function(){
			this.parent();
		},
		
		callback:function(){
			this.panel.skipTutorial();
		}
	});
});