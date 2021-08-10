ig.module('game.entities.ui.sign-critical')
.requires(
	'game.entities.ui.base-ui'
)
.defines(function() {
    EntitySignCritical = EntityBaseUi.extend({
        zIndex: 5001,
        size: {x: 132, y: 83},
		animSheet: new ig.AnimationSheet( 'media/graphics/sprites/ui/txt-critical-hit.png', 132, 83 ),
		textScale: 1,
		enabled: false,
		
        init:function(x,y,settings)
        {
            this.parent(x,y,settings);
			this.pos.x -= this.size.x*0.5;
			this.pos.y -= this.size.y*0.5;
			this.addAnim('idle', 0, [0], true);
			this.twn_scale = this.tween({ textScale: 1 }, 0.15, { easing: ig.Tween.Easing.Quadratic.EaseOut, onUpdate: function(){ this.setScale(this.textScale, this.textScale); }.bind(this) });
			this.twn_fadeIn = this.tween({ currentAnim: { alpha: 1 }}, 0.1 );
			this.twn_fadeOut = this.tween({ currentAnim: { alpha: 0 }}, 1, { easing: ig.Tween.Easing.Quadratic.EaseIn, onComplete: function(){ this.kill(); }.bind(this) });
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
			if (this.enabled)
				this.parent();
		},
		
		show: function()
		{
			this.enabled = true;
			this.stopTweens(false);
			this.textScale = 3;
			this.currentAnim.alpha = 0;
			this.twn_scale.start();
			this.twn_fadeIn.start();
		},
		
		hide: function()
		{
			this.enabled = false;
		}
    });
});