ig.module('game.entities.ui.tutorial-pointer')
.requires(
	'game.entities.ui.base-ui'
)
.defines(function() {
    EntityTutorialPointer = EntityBaseUi.extend({
        zIndex: 4000,
        size: {x: 120, y: 124},
		animSheet: new ig.AnimationSheet( 'media/graphics/sprites/ui/tutorial-finger.png', 120, 124 ),
		
        init:function(x,y,settings)
        {
            this.parent(x,y,settings);
			this.addAnim('tapping', 0.2, [0,0,1]);
        }
    });
});