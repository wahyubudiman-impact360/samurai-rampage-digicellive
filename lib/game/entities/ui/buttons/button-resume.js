ig.module('game.entities.ui.buttons.button-resume')
.requires(
	'game.entities.ui.buttons.button'
)
.defines(function() {
	EntityButtonResume = EntityButton.extend({
		zIndex:5011,
		size: {x: 78, y: 101 },
		animSheet: new ig.AnimationSheet( 'media/graphics/sprites/ui/button-resume.png', 78, 101 ),
		
		init:function(x,y,settings){
			this.parent(x,y,settings);
			this.addAnim('normal', 0, [0], true);
		},
	});
});