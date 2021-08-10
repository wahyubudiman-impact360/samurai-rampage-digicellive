ig.module('game.entities.ui.panels.panel-pause')
.requires(
	'game.entities.ui.base-panel',
	'game.entities.ui.screen-overlay',
	// 'game.entities.ui.scrollbar',
	'game.entities.ui.buttons.button-resume',
	'game.entities.ui.buttons.button-restart',
	'game.entities.ui.buttons.button-home',
	'game.entities.ui.buttons.button-sound-toggle',
	'game.entities.ui.buttons.button-music-toggle'
)
.defines(function() {
	EntityPanelPause = EntityBasePanel.extend({
		zIndex: 5010,
		animSheet: new ig.AnimationSheet( 'media/graphics/sprites/ui/popup-small.png', 473, 426 ),
		// icon_music: new ig.Image('media/graphics/sprites/ui/slider-icon-music.png'),
		// icon_sfx: new ig.Image('media/graphics/sprites/ui/slider-icon-sound.png'),
		size: { x: 473, y: 426 },

		init:function(x,y,settings)
		{
			this.parent(x,y,settings);
			
			// setup tween position
			this.hidePos = { x: (ig.system.width - this.size.x)*0.5, y: ig.system.height + this.size.y*0.5 };
			this.showPos = { x: this.hidePos.x, y: ig.system.height*0.565 - this.size.y*0.5 };
			this.pos.x = this.hidePos.x;
			this.pos.y = this.hidePos.y;

			// setup animation
			this.addAnim('idle', 0, [0], true);
			
			// spawn contents
			this.overlay = ig.game.spawnEntity(EntityScreenOverlay, 0, 0, { zIndex: this.zIndex - 1, clickable: true });
			this.btn_resume = ig.game.spawnEntity(EntityButtonResume, this.pos.x + 199, this.pos.y + 257, { callback: this.hide.bind(this) });
			this.btn_restart = ig.game.spawnEntity(EntityButtonRestart, this.pos.x + 94, this.pos.y + 259, { callback: ig.game.control.resetGame.bind(ig.game.control) });
			this.btn_home = ig.game.spawnEntity(EntityButtonHome, this.pos.x + 272, this.pos.y + 251, { callback: ig.game.control.toMainMenu.bind(ig.game.control) });
			this.btn_sound = ig.game.spawnEntity(EntityButtonSoundToggle, this.pos.x + 104, this.pos.y + 111);
			this.btn_music = ig.game.spawnEntity(EntityButtonMusicToggle, this.pos.x + 252, this.pos.y + 111);
			/*
			this.bar_music = ig.game.spawnEntity(EntityScrollbar, this.pos.x + 100, this.pos.y + 130, 
				{
 					scrollPos: ig.soundHandler.bgmPlayer.getVolume()/ig.game.musicVolumeScale,
 					onDrag: function(){ ig.soundHandler.bgmPlayer.volume(this.scrollPos*ig.game.musicVolumeScale); },
					onRelease: function(){
						ig.game.sessionData.music = ig.soundHandler.bgmPlayer.getVolume()/ig.game.musicVolumeScale;
						ig.game.saveAll();
					}
				});
			this.bar_sfx = ig.game.spawnEntity(EntityScrollbar, this.pos.x + 80, this.pos.y + 223, 
				{
					scrollPos: ig.soundHandler.sfxPlayer.getVolume(),
					onDrag: function(){ ig.soundHandler.sfxPlayer.volume(this.scrollPos); },
					onRelease: function(){
						ig.soundHandler.sfxPlayer.play('hit2');
						ig.game.sessionData.sound = ig.soundHandler.sfxPlayer.getVolume();
						ig.game.saveAll();
					}
				});
			*/
			
			this.addContent(this.btn_resume);
			this.addContent(this.btn_restart);
			this.addContent(this.btn_home);
			this.addContent(this.btn_sound);
			this.addContent(this.btn_music);
			// this.addContent(this.bar_music);
			// this.addContent(this.bar_sfx);
			
			// hide panel
			this.disable();
		},
		
		draw: function()
		{
			if(!this.enabled)
				return;
			
			this.parent();
			// this.icon_music.draw(this.pos.x + 212, this.pos.y + 69);
			// this.icon_sfx.draw(this.pos.x + 217, this.pos.y + 161);
			
			var ctx = ig.system.context;
			ctx.save();
			ctx.textAlign = 'center';
			ctx.textBaseline= "middle";
			ctx.font = 'bold 25pt osaka';
			ctx.fillText(_STRINGS.Pause.Title, this.pos.x + this.size.x*0.5, this.pos.y + 36);
			ctx.restore();
		},
		
		onShowStart: function()
		{
			this.overlay.fade(0.5, this.tweenDuration*0.5, true);
		},
		
		onHideStart: function()
		{
			this.overlay.fade(0, this.tweenDuration*0.5, true);
		},
		
		onHideComplete: function()
		{
			ig.game.control.unpause();
			ig.game.saveAll();
		},
		
		enable: function()
		{
			this.parent();
			this.overlay.enable();
		},
		
		disable: function()
		{
			this.parent();
			this.overlay.disable();
		}
	});
});