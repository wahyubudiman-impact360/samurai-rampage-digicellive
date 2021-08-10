ig.module('game.entities.ui.buttons.button-shop')
.requires(
	'game.entities.ui.buttons.button'
)
.defines(function() {
	EntityButtonShop = EntityButton.extend({
		zIndex:5011,
		size: {x: 111, y: 106 },
		animSheet: new ig.AnimationSheet( 'media/graphics/sprites/ui/button-shop.png', 111, 106 ),
		
		init:function(x,y,settings){
			this.parent(x,y,settings);
			this.addAnim('normal', 0, [0], true);
		},
	});
});