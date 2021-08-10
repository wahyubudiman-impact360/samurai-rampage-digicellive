ig.module('game.entities.ui.buttons.button-close')
.requires(
	'game.entities.ui.buttons.button'
)
.defines(function() {
	EntityButtonClose = EntityButton.extend({
		zIndex:5100,
		size: {x: 100, y: 100 },
		animSheet: new ig.AnimationSheet( 'media/graphics/sprites/ui/popup-close-button.png', 100, 100 ),
		
		init:function(x,y,settings){
			this.parent(x,y,settings);
			this.addAnim('normal', 0, [0], true);
			this.addAnim('hover', 0, [1], true);
			this.addAnim('pressed', 0, [2], true);
		},
		
		clicked:function(){
			this.parent();
			this.currentAnim = this.anims.pressed;
		},
		
		released:function(){
			this.parent();
			this.currentAnim = this.anims.normal;
		},
		
		over: function()
		{
			this.currentAnim = this.anims.hover;
		},
		
		leave: function()
		{
			this.currentAnim = this.anims.normal;
		}
	});
});