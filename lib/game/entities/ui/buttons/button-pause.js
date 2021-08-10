ig.module('game.entities.ui.buttons.button-pause')
.requires(
	'game.entities.ui.buttons.button'
)
.defines(function() {
	EntityButtonPause = EntityButton.extend({
		zIndex:4999,
		size: {x: 107, y: 85 },
		animSheet: new ig.AnimationSheet( 'media/graphics/sprites/ui/upper-bar-pause-button.png', 107, 85 ),
		
		init:function(x,y,settings){
			this.parent(x,y,settings);
			this.addAnim('normal', 0, [0], true);
			this.addAnim('hover', 0, [1], true);
			this.addAnim('pressed', 0, [2], true);
		},
		
		clicked:function(){
			if (ig.game.control.tutorialMode)
				return;
			
			this.parent();
			this.currentAnim = this.anims.pressed;
		},
		
		released:function(){
			if (ig.game.control.tutorialMode)
				return;
			
			this.parent();
			this.currentAnim = this.anims.normal;
		},
		
		callback:function(){
			ig.game.control.pause();
		},
		
		over: function()
		{
			this.parent();
			this.currentAnim = this.anims.hover;
		},
		
		leave: function()
		{
			this.parent();
			this.currentAnim = this.anims.normal;
		}
	});
});