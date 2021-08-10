ig.module('game.entities.ui.buttons.button-restart')
.requires(
	'game.entities.ui.buttons.button'
)
.defines(function() {
	EntityButtonRestart = EntityButton.extend({
		zIndex:5011,
		size: {x: 97, y: 98 },
		animSheet: new ig.AnimationSheet( 'media/graphics/sprites/ui/button-reload.png', 97, 98 ),
		
		init:function(x,y,settings){
			this.parent(x,y,settings);
			this.addAnim('normal', 0, [0], true);
		},
	});
});