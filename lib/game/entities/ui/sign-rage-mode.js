ig.module('game.entities.ui.sign-rage-mode')
.requires(
	'game.entities.ui.base-ui'
)
.defines(function() {
    EntitySignRageMode = EntityBaseUi.extend({
        zIndex: 5001,
		textScale: 1,
		enabled: false,
        alpha: 0,
		
        init:function(x,y,settings)
        {
            this.parent(x,y,settings);
			this.twn_scale = this.tween({ textScale: 1 }, 0.15, { easing: ig.Tween.Easing.Quadratic.EaseOut, onUpdate: function(){ this.setScale(this.textScale, this.textScale); }.bind(this) });
			this.twn_fadeIn = this.tween({ alpha: 1 }, 0.1 );
			this.twn_fadeOut = this.tween({ alpha: 0 }, 1, { easing: ig.Tween.Easing.Quadratic.EaseIn, onComplete: function(){ this.hide(); }.bind(this) });
			this.twn_fadeIn.chain(this.twn_fadeOut);
		},
		
        update: function()
        {
			if(ig.game.control.isPaused || !this.enabled)
				return;
			
			this.parent();
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
				ctx.textAlign = 'center';
				ctx.fillStyle = "#fb0000";
				ctx.textBaseline= "middle";
				ctx.font = 'bold 52pt osaka';
				ctx.globalAlpha = this.alpha;
				ctx.translate(this.pos.x, this.pos.y);
				ctx.scale(this.textScale, this.textScale);
				ctx.fillText(_STRINGS.Game.RageMode, 0, 0);
				ctx.restore();
			}
		},
		
		show: function(count)
		{
			this.enabled = true;
			this.stopTweens(false);
			this.textScale = 3;
			this.alpha = 0;
			this.twn_scale.start();
			this.twn_fadeIn.start();
			this.hitCount = count;
		},
		
		hide: function()
		{
			this.enabled = false;
		}
    });
});