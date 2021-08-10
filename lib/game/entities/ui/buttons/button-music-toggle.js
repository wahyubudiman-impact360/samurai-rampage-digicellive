ig.module('game.entities.ui.buttons.button-music-toggle')
.requires(
	'game.entities.ui.buttons.button'
)
.defines(function() {
	EntityButtonMusicToggle = EntityButton.extend({
		zIndex: 5011,
		size: {x: 110, y: 110 },
		onAnimSheet: new ig.AnimationSheet( 'media/graphics/sprites/ui/icon-music-on.png', 110, 110 ),
		offAnimSheet: new ig.AnimationSheet( 'media/graphics/sprites/ui/icon-music-off.png', 110, 110 ),

		init:function(x,y,settings){
			this.parent(x,y,settings);
            this.animSheet = this.onAnimSheet;
			this.addAnim('on', 0, [0], true);
            this.animSheet = this.offAnimSheet;
			this.addAnim('off', 0, [0], true);
            this.updateAnimation();
		},
		
		callback:function(){
			if (ig.soundHandler.checkBGM())
                ig.soundHandler.bgmPlayer.unmute();
            else
                ig.soundHandler.bgmPlayer.mute();
            
            this.updateAnimation();
            ig.game.sessionData.musicMuted = ig.soundHandler.checkBGM();
			ig.game.saveAll();
		},

        updateAnimation: function() {
            this.currentAnim = ig.soundHandler.checkBGM() ? this.anims.off : this.anims.on;
        }
	});
});