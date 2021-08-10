ig.module('game.entities.ui.panels.panel-settings')
.requires(
	'game.entities.ui.base-panel',
	// 'game.entities.ui.scrollbar',
	'game.entities.ui.buttons.button-home',
	'game.entities.ui.buttons.button-sound-toggle',
	'game.entities.ui.buttons.button-music-toggle'
)
.defines(function() {
	EntityPanelSettings = EntityBasePanel.extend({
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

			// add contents
			this.btn_home = ig.game.spawnEntity(EntityButtonHome, this.pos.x + 181, this.pos.y + 251, { callback: function(){ this.save(); this.hide(); }.bind(this) });
			this.btn_sound = ig.game.spawnEntity(EntityButtonSoundToggle, this.pos.x + 104, this.pos.y + 111);
			this.btn_music = ig.game.spawnEntity(EntityButtonMusicToggle, this.pos.x + 252, this.pos.y + 111);
			/*
			this.bar_music = ig.game.spawnEntity(EntityScrollbar, this.pos.x + 100, this.pos.y + 130, 
				{
 					scrollPos: ig.soundHandler.bgmPlayer.getVolume()/ig.game.musicVolumeScale,
 					onDrag: function(){ ig.soundHandler.bgmPlayer.volume(this.scrollPos*ig.game.musicVolumeScale); }
				});
			this.bar_sfx = ig.game.spawnEntity(EntityScrollbar, this.pos.x + 100, this.pos.y + 223, 
				{
					scrollPos: ig.soundHandler.sfxPlayer.getVolume(),
					onDrag: function(){ ig.soundHandler.sfxPlayer.volume(this.scrollPos); },
					onRelease: function(){ ig.soundHandler.sfxPlayer.play('hit2'); }
				});
			*/
				
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
			if (!this.enabled)
				return;

			this.parent();
			// this.icon_music.draw(this.pos.x + 212, this.pos.y + 69);
			// this.icon_sfx.draw(this.pos.x + 217, this.pos.y + 161);
			
			var ctx = ig.system.context;
			ctx.save();
			ctx.textAlign = 'center';
			ctx.textBaseline= "middle";
			ctx.font = 'bold 25pt osaka';
			ctx.fillText(_STRINGS.Settings.Title, this.pos.x + this.size.x*0.5, this.pos.y + 36);
			ctx.restore();
		},
		
		save: function()
		{
			// ig.game.sessionData.music = ig.soundHandler.bgmPlayer.getVolume()/ig.game.musicVolumeScale;
			// ig.game.sessionData.sound = ig.soundHandler.sfxPlayer.getVolume();
			ig.game.saveAll();
		}
	});
});