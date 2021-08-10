ig.module('game.entities.ui.sign-hit')
.requires(
	'game.entities.ui.base-ui'
)
.defines(function() {
    EntitySignHit = EntityBaseUi.extend({
        zIndex: 5001,
        size: {x: 127, y: 118},
		animSheet: new ig.AnimationSheet( 'media/graphics/sprites/ui/txt-x-hit.png', 127, 118 ),
		textScale: 1,
		hitCount: 0,
		enabled: false,
		
        init:function(x,y,settings)
        {
            this.parent(x,y,settings);
			this.pos.x -= this.size.x*0.5;
			this.pos.y -= this.size.y*0.5;
			this.addAnim('idle', 0, [0], true);
			this.twn_scale = this.tween({ textScale: 1 }, 0.15, { easing: ig.Tween.Easing.Quadratic.EaseOut, onUpdate: function(){ this.setScale(this.textScale, this.textScale); }.bind(this) });
			this.twn_fadeIn = this.tween({ currentAnim: { alpha: 1 }}, 0.1 );
			this.twn_fadeOut = this.tween({ currentAnim: { alpha: 0 }}, 1, { easing: ig.Tween.Easing.Quadratic.EaseIn, onComplete: function(){ this.hide(); }.bind(this) });
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
			
			if(this.currentAnim.alpha > 0)
			{
				var ctx = ig.system.context;
				ctx.save();
				ctx.textAlign = 'left';
				ctx.fillStyle = "#fb0000";
				ctx.textBaseline= "middle";
				if (!ig.game.isFirefox) {
					ctx.shadowColor = '#f00000';
					ctx.shadowOffsetX = 1;
					ctx.shadowOffsetY = 1;
					ctx.shadowBlur = 10;
				}
				ctx.font = 'bold 52pt osaka';
				ctx.globalAlpha = this.currentAnim.alpha*0.85;
				ctx.translate(this.pos.x + this.size.x*0.5 + 28, this.pos.y+this.size.y*0.5 - 35);
				ctx.scale(this.textScale, this.textScale);
				ctx.fillText(this.hitCount, 0, 0);
				ctx.restore();
			}
		},
		
		show: function(count)
		{
			this.enabled = true;
			this.stopTweens(false);
			this.textScale = 3;
			this.currentAnim.alpha = 0;
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