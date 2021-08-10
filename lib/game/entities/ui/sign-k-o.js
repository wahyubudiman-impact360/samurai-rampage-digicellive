ig.module('game.entities.ui.sign-k-o')
.requires(
	'game.entities.ui.base-ui'
)
.defines(function() {
    EntitySignKO = EntityBaseUi.extend({
        zIndex: 5001,
		textScale: 1,
		enabled: false,

        alpha: 1,
		kPos: { x: 0, y: 0 },
		oPos: { x: 0, y: 0 },
		kShadowScale: 0,
		kShadowAlpha: 0,
		oShadowScale: 0,
		oShadowAlpha: 0,
		enterDuration: 0.2,
		enterDelay: 0.3,
		exitDuration: 0.5,

		kShakeTf: 0,
		oShakeTf: 0,
		shakeTfDecreaseMultiplier: 10,

		update: function()
		{
			this.parent();
			if (this.kShakeTf > 0) {
				this.kShakeTf -= ig.system.tick * this.shakeTfDecreaseMultiplier;
				this.kPos.x = this.pos.x + Math.random() *  this.kShakeTf * 2 - this.kShakeTf;
				this.kPos.y = this.pos.y + Math.random() *  this.kShakeTf * 2 - this.kShakeTf;
			}

			if (this.oShakeTf > 0) {
				this.oShakeTf -= ig.system.tick * this.shakeTfDecreaseMultiplier;
				this.oPos.x = this.pos.x + Math.random() *  this.oShakeTf * 2 - this.oShakeTf;
				this.oPos.y = this.pos.y + Math.random() *  this.oShakeTf * 2 - this.oShakeTf;
			}

			if (!this.soundPlayed) {
				this.soundDelay -= ig.system.tick;
				if (this.soundDelay <= 0)
				{
					this.soundPlayed = true;
					ig.soundHandler.sfxPlayer.play("text");
				}
			}
		},

		draw: function()
		{
			if(!this.enabled)
				return;
			
			this.parent();
			
			if(this.alpha > 0)
			{
				var ctx = ig.system.context;
				ctx.save();
				ctx.textAlign = 'right';
				ctx.fillStyle = "#ffffff";
				ctx.textBaseline= "middle";
				ctx.font = 'bold 128pt osaka';
				ctx.globalAlpha = this.alpha;
				ctx.fillText(_STRINGS.Game.K, this.kPos.x,  this.kPos.y);

				if (this.kShadowAlpha > 0)
				{
					var shadowOffset = 47
					ctx.textAlign = 'center';
					ctx.font = 'bold ' + 128 * this.kShadowScale + 'pt osaka';
					ctx.globalAlpha = this.alpha * this.kShadowAlpha;
					ctx.translate(this.kPos.x - shadowOffset, this.kPos.y);
					ctx.scale(this.kShadowScale, this.kShadowScale);
					ctx.fillText(_STRINGS.Game.K, 0,  0);
				}
				ctx.restore();

				ctx.save();
				ctx.textAlign = 'left';
				ctx.fillStyle = "#ffffff";
				ctx.textBaseline= "middle";
				ctx.font = 'bold 128pt osaka';
				ctx.globalAlpha = this.alpha;
				ctx.fillText(_STRINGS.Game.O, this.oPos.x, this.oPos.y);

				if (this.oShadowAlpha > 0)
				{
					var shadowOffset = 108
					ctx.textAlign = 'center';
					ctx.font = 'bold ' + 128 * this.oShadowScale + 'pt osaka';
					ctx.globalAlpha = this.alpha * this.oShadowAlpha;
					ctx.translate(this.oPos.x + shadowOffset, this.oPos.y);
					ctx.scale(this.oShadowScale, this.oShadowScale);
					ctx.fillText(_STRINGS.Game.O, 0,  0);
				}
				ctx.restore();
			}
		},
		
		show: function(count)
		{
			this.enabled = true;
			this.kPos.y = this.pos.y;
			this.oPos.y = this.pos.y;
			this.kPos.x = 0;
			this.oPos.x = ig.system.width;
			this.tween({ kPos: { x: this.pos.x } }, this.enterDuration, { delay: this.enterDelay, easing: ig.Tween.Easing.Quadratic.EaseIn, onComplete: function(){ this.kShakeTf = 5; this.createKShadow(); }.bind(this) }).start();
			this.tween({ oPos: { x: this.pos.x } }, this.enterDuration, { delay: 2*this.enterDelay + this.enterDuration, easing: ig.Tween.Easing.Quadratic.EaseIn, onComplete: function(){ this.oShakeTf = 5; this.createOShadow(); }.bind(this) }).start();
			this.tween({ alpha: 0 }, 0.75, { delay: 1.5 }).start();
			this.soundDelay = 2.5;
			this.soundPlayed = false;
		},
		
		hide: function()
		{
			this.enabled = false;
		},

		createKShadow: function()
		{
			ig.soundHandler.sfxPlayer.play("text");
			this.kShadowAlpha = 1;
			this.kShadowScale = 1;
			this.tween({ kShadowAlpha: 0, kShadowScale: 1.5 }, 0.5, { easing: ig.Tween.Easing.Quadratic.EaseOut }).start();
		},

		createOShadow: function()
		{
			ig.soundHandler.sfxPlayer.play("text");
			this.oShadowAlpha = 1;
			this.oShadowScale = 1;
			this.tween({ oShadowAlpha: 0, oShadowScale: 1.5 }, 0.5, { easing: ig.Tween.Easing.Quadratic.EaseOut }).start();
		}
    });
});