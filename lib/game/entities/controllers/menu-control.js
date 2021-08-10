ig.module('game.entities.controllers.menu-control')
.requires(
	'impact.entity',
	'game.entities.ui.screen-overlay',
	'game.entities.ui.buttons.button-menu-play',
	'game.entities.ui.buttons.button-menu-upgrade',
	'game.entities.ui.buttons.button-menu-settings',
	'game.entities.ui.buttons.button-more-games',
	'game.entities.ui.buttons.button-menu-tutorial',
	'game.entities.ui.panels.panel-settings',
	'game.entities.ui.panels.panel-upgrade',
	'game.entities.ui.hud.ui-upgrade-point'
)
.defines(function() {
	EntityMenuControl = ig.Entity.extend({
		background: new ig.Image('media/graphics/sprites/backgrounds/bg-menu.png'),
		secondaryBackground: new ig.Image('media/graphics/sprites/backgrounds/bg-boss.png'),
		secondaryBackgroundAlpha: 0,
		inTween: false,
		tweenDuration: 0.35,
		
		init:function(x,y,settings)
		{
			this.parent(x,y,settings);
			if(ig.global.wm)
                return;
			
			this.overlay = ig.game.spawnEntity(EntityScreenOverlay,0,0, { zIndex: 90000 });
			this.btn_play = ig.game.spawnEntity(EntityButtonMenuPlay, 590, 267, { callback: this.toGameplay.bind(this) });
			this.btn_upgrade = ig.game.spawnEntity(EntityButtonMenuUpgrade, 637, 335, { callback: this.toUpgrade.bind(this) });
			this.btn_settings = ig.game.spawnEntity(EntityButtonMenuSettings, 637, 371, { callback: this.toSettings.bind(this) });
			this.btn_tutorial = ig.game.spawnEntity(EntityButtonMenuTutorial, 637, 412, { callback: this.toTutorial.bind(this) });
			this.btn_fullscreen = ig.game.spawnEntity(ig.FullscreenButton, 10, 10, { enterImage: new ig.Image('media/graphics/misc/enter-fullscreen-transparent.png'), exitImage: new ig.Image('media/graphics/misc/exit-fullscreen-transparent.png') });
			if(_SETTINGS.MoreGames.Enabled)
				this.btn_moregames = ig.game.spawnEntity(EntityButtonMoreGames, 632, 453 );
			
			this.ui_settings = ig.game.spawnEntity(EntityPanelSettings, 0, 0, { onHideComplete: this.showMenu.bind(this) });
			this.ui_upgrade = ig.game.spawnEntity(EntityPanelUpgrade, 0, 0, { onHideComplete: this.showMenu.bind(this) });
			ig.game.sortEntitiesDeferred();
			
			// setup buttons tween position
			var centerX = ig.system.width*0.5;
			this.showPos_play = { x: this.btn_play.pos.x, y: this.btn_play.pos.y };
			this.showPos_upgrade = { x: this.btn_upgrade.pos.x, y: this.btn_upgrade.pos.y };
			this.showPos_settings = { x: this.btn_settings.pos.x, y: this.btn_settings.pos.y };
			this.showPos_tutorial = { x: this.btn_tutorial.pos.x, y: this.btn_tutorial.pos.y };
			this.hidePos_play = { x: this.btn_play.pos.x + centerX, y: this.btn_play.pos.y };
			this.hidePos_upgrade = { x: this.btn_upgrade.pos.x + centerX, y: this.btn_upgrade.pos.y };
			this.hidePos_settings = { x: this.btn_settings.pos.x + centerX, y: this.btn_settings.pos.y };
			this.hidePos_tutorial = { x: this.btn_tutorial.pos.x + centerX, y: this.btn_tutorial.pos.y };
			if(_SETTINGS.MoreGames.Enabled)
			{
				this.showPos_moregame = { x: this.btn_moregames.pos.x, y: this.btn_play.pos.y };
				this.hidePos_moregame = { x: this.btn_moregames.pos.x + centerX, y: this.btn_play.pos.y };
			}
		},
		
		ready: function() {
			if (ig.game.openShopOnMenu)
				this.toUpgrade();
			else
				this.start();
		},
		
		draw: function()
		{
			this.background.draw(0, 0);
			if(this.secondaryBackgroundAlpha > 0)
			{
				var ctx = ig.system.context;
				ctx.globalAlpha = this.secondaryBackgroundAlpha;
				this.secondaryBackground.draw(0,0);
				ctx.globalAlpha = 1;
			}
		},
		
		toGameplay: function()
		{
			if(this.inTween)
				return;
			
			this.inTween = true;
			this.overlay.fade( 1, this.tweenDuration, true,
				function(){
					ig.game.level = 0;
					ig.game.endlessMode = true;
					ig.game.director.jumpTo(LevelGameplay);
					if(this.btn_moregames)
						this.btn_moregames.hide();
				}.bind(this)
			);
		},

		toTutorial: function()
		{
			if(this.inTween)
				return;
			
			this.inTween = true;
			ig.game.tutorialEnd = false;
			this.overlay.fade( 1, this.tweenDuration, true,
				function(){
					ig.game.level = 0;
					ig.game.endlessMode = true;
					ig.game.director.jumpTo(LevelGameplay);
					if(this.btn_moregames)
						this.btn_moregames.hide();
				}.bind(this)
			);
		},
		
		toSettings: function()
		{
			if(this.inTween)
				return;
			
			this.hideMenu();
			this.ui_settings.show();
		},
		
		toUpgrade: function()
		{
			ig.game.openShopOnMenu = false;
			if(this.inTween)
				return;
			
			this.hideMenu();
			this.ui_upgrade.show();
		},
		
		start: function()
		{
			var centerX = ig.system.width*0.5;
			this.btn_play.pos.x = this.hidePos_play.x;
			this.btn_upgrade.pos.x = this.hidePos_upgrade.x;
			this.btn_settings.pos.x = this.hidePos_settings.x;
			this.btn_tutorial.pos.x = this.hidePos_tutorial.x;
			if(this.btn_moregames)
			{
				this.btn_moregames.hide();
				this.btn_moregames.pos.x = this.hidePos_moregame.x;
			}
			this.showMenu();
		},
		
		showMenu: function()
		{
			if(this.inTween)
				return;
			
			this.inTween = true;
			this.tween({ secondaryBackgroundAlpha: 0 }, this.tweenDuration, { onComplete: function(){ this.inTween = false; }.bind(this) }).start();
			this.btn_play.tween({ pos: { x: this.showPos_play.x }}, this.tweenDuration, { easing: ig.Tween.Easing.Back.EaseOut }).start();
			this.btn_upgrade.tween({ pos: { x: this.showPos_upgrade.x }}, this.tweenDuration, { easing: ig.Tween.Easing.Back.EaseOut, delay: 0.05 }).start();
			this.btn_settings.tween({ pos: { x: this.showPos_settings.x }}, this.tweenDuration, { easing: ig.Tween.Easing.Back.EaseOut, delay: 0.1 }).start();
			this.btn_tutorial.tween({ pos: { x: this.showPos_tutorial.x }}, this.tweenDuration, { easing: ig.Tween.Easing.Back.EaseOut, delay: 0.15 }).start();
			if(this.btn_moregames)
				this.btn_moregames.tween({ pos: { x: this.showPos_moregame.x }}, this.tweenDuration, { easing: ig.Tween.Easing.Back.EaseOut, delay: 0.2, onComplete: this.btn_moregames.show.bind(this.btn_moregames) }).start();
		
			if(this.btn_fullscreen)
			{
				this.btn_fullscreen.show();
			}
		},
		
		hideMenu: function()
		{
			if(this.inTween)
				return;
			
			this.inTween = true;
			this.tween({ secondaryBackgroundAlpha: 1 }, this.tweenDuration, { onComplete: function(){ this.inTween = false; }.bind(this) }).start();
			this.btn_play.tween({ pos: { x: this.hidePos_play.x }}, this.tweenDuration, { easing: ig.Tween.Easing.Back.EaseOut }).start();
			this.btn_upgrade.tween({ pos: { x: this.hidePos_upgrade.x }}, this.tweenDuration, { easing: ig.Tween.Easing.Back.EaseOut, delay: 0.05 }).start();
			this.btn_settings.tween({ pos: { x: this.hidePos_settings.x }}, this.tweenDuration, { easing: ig.Tween.Easing.Back.EaseOut, delay: 0.1 }).start();
			this.btn_tutorial.tween({ pos: { x: this.hidePos_tutorial.x }}, this.tweenDuration, { easing: ig.Tween.Easing.Back.EaseOut, delay: 0.15 }).start();

			if(this.btn_moregames)
			{
				this.btn_moregames.hide();
				this.btn_moregames.tween({ pos: { x: this.hidePos_moregame.x }}, this.tweenDuration, { easing: ig.Tween.Easing.Back.EaseOut, delay: 0.2 }).start();
			}

			if(this.btn_fullscreen)
			{
				this.btn_fullscreen.hide();
			}
		}
	});
});