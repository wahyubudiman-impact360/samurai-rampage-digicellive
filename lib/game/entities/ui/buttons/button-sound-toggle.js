ig.module('game.entities.ui.buttons.button-sound-toggle')
.requires(
	'game.entities.ui.buttons.button'
)
.defines(function() {
	EntityButtonSoundToggle = EntityButton.extend({
		zIndex: 5011,
		size: {x: 110, y: 110 },
		onAnimSheet: new ig.AnimationSheet( 'media/graphics/sprites/ui/icon-sound-on.png', 110, 110 ),
		offAnimSheet: new ig.AnimationSheet( 'media/graphics/sprites/ui/icon-sound-off.png', 110, 110 ),

		init:function(x,y,settings){
			this.parent(x,y,settings);
            this.animSheet = this.onAnimSheet;
			this.addAnim('on', 0, [0], true);
            this.animSheet = this.offAnimSheet;
			this.addAnim('off', 0, [0], true);
            this.updateAnimation();
		},
		
		callback:function(){
			if (ig.soundHandler.checkSFX())
                ig.soundHandler.sfxPlayer.unmute();
            else
                ig.soundHandler.sfxPlayer.mute();
            
            this.updateAnimation();
			ig.game.sessionData.soundMuted = ig.soundHandler.checkSFX();
			ig.game.saveAll();
		},

        updateAnimation: function() {
            this.currentAnim = ig.soundHandler.checkSFX() ? this.anims.off : this.anims.on;
        }
	});
});