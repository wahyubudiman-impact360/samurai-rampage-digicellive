ig.module('game.entities.ui.panels.panel-result')
.requires(
	'game.entities.ui.base-panel',
	'game.entities.ui.screen-overlay',
	'game.entities.ui.buttons.button-restart',
	'game.entities.ui.buttons.button-home',
	'game.entities.ui.buttons.button-shop'
)
.defines(function() {
	EntityPanelResult = EntityBasePanel.extend({
		zIndex: 5010,
		animSheet: new ig.AnimationSheet( 'media/graphics/sprites/ui/popup-small.png', 473, 426 ),
		size: { x: 473, y: 426 },

		distance: 0,
		score: 0,
		highScore: 0,
		distancePos: { x: 236, y: 114 },
		scorePos: { x: 236, y: 160 },
		highScorePos: { x: 236, y: 209 },
		
		init:function(x,y,settings)
		{
			this.parent(x,y,settings);
			
			// set up tween position
			this.hidePos = { x: (ig.system.width - this.size.x)*0.5, y:  ig.system.height + this.size.y*0.5 };
			this.showPos = { x: (ig.system.width - this.size.x)*0.5, y: 305 - this.size.y*0.5 };
			this.pos.x = this.hidePos.x;
			this.pos.y = this.hidePos.y;
			
			// set up animation
			this.addAnim('idle', 0, [0], true);
			
			// spawn contents
			// this.overlay = ig.game.spawnEntity(EntityScreenOverlay, 0, 0, {zIndex: this.zIndex - 1});
			this.btn_shop = ig.game.spawnEntity(EntityButtonShop, this.pos.x + 84, this.pos.y + 251, { callback: ig.game.control.toShop.bind(ig.game.control) });
			this.btn_restart = ig.game.spawnEntity(EntityButtonRestart, this.pos.x + 193, this.pos.y + 251, { callback: ig.game.control.resetGame.bind(ig.game.control) });
			this.btn_home = ig.game.spawnEntity(EntityButtonHome, this.pos.x + 282, this.pos.y + 251, { callback: ig.game.control.toMainMenu.bind(ig.game.control) });
			this.addContent(this.btn_shop);
			this.addContent(this.btn_restart);
			this.addContent(this.btn_home);
			
			// hide panel
			this.disable();
		},
		
		draw: function()
		{
			if(!this.enabled)
				return;
			
			this.parent();
			
			var ctx = ig.system.context;
			ctx.save();
			ctx.textAlign = 'center';
			ctx.textBaseline= "middle";
			ctx.font = 'bold 25pt osaka';
			ctx.fillText(_STRINGS.Results.Title, this.pos.x + this.size.x*0.5, this.pos.y + 36);
			
			var text_distance = _STRINGS.Results.Distance;
			var text_score = _STRINGS.Results.Score;
			var text_hiscore = _STRINGS.Results.Hiscore;
			
			var num_distance = Math.floor(ig.game.control.distance) + _STRINGS.Game.DistanceUnit;
			var num_score = Math.floor(ig.game.control.score);
			var num_hiscore = Math.floor(ig.game.sessionData.highScore);
			
			var distanceTextLength = ctx.measureText(text_distance).width;
			var distanceNumLength = ctx.measureText(num_distance).width;
			var text_distancePos = (distanceTextLength - distanceNumLength)*0.5;
			
			var scoreTextLength = ctx.measureText(text_score).width;
			var scoreNumLength = ctx.measureText(num_score).width;
			var text_scorePos = (scoreTextLength - scoreNumLength)*0.5;

			var hiscoreTextLength = ctx.measureText(text_hiscore).width;
			var hiscoreNumLength = ctx.measureText(num_hiscore).width;
			var text_hiscorePos = (hiscoreTextLength - hiscoreNumLength)*0.5;
			
			// ctx.fillStyle = '#ffffff';
			ctx.textAlign = 'right';
			ctx.fillText(text_distance, this.pos.x + this.distancePos.x, this.pos.y + this.distancePos.y);
			ctx.fillText(text_score, this.pos.x + this.scorePos.x, this.pos.y + this.scorePos.y);
			ctx.fillText(text_hiscore, this.pos.x + this.highScorePos.x, this.pos.y + this.highScorePos.y);
			
			// ctx.fillStyle = '#ff0000';
			ctx.textAlign = 'left';
			ctx.fillText(num_distance, this.pos.x + this.distancePos.x + 30, this.pos.y + this.distancePos.y);
			ctx.fillText(num_score, this.pos.x + this.scorePos.x + 30, this.pos.y + this.scorePos.y);
			ctx.fillText(num_hiscore, this.pos.x + this.highScorePos.x + 30, this.pos.y + this.highScorePos.y);
			ctx.restore();
		},
		
		onShowStart: function()
		{
			// this.overlay.fade(0.5, this.tweenDuration*0.5, true);

		},
		
		onHideStart: function()
		{
			// this.overlay.fade(0, this.tweenDuration*0.5, true);
		},
		
		enable: function()
		{
			this.parent();
			// this.overlay.enable();
		},
		
		disable: function()
		{
			this.parent();
			// this.overlay.disable();
		}
	});
});