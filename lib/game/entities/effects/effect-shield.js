ig.module('game.entities.effects.effect-shield')
.requires(
	'impact.entity'
)
.defines(function() {
    EntityEffectShield = ig.Entity.extend({
        zIndex: 2009,
        size: { x:177, y:160 },
		animSheet: new ig.AnimationSheet( 'media/graphics/sprites/effects/shield.png', 177, 160 ),
		
		owner: null,
		shieldOffset: { x: 0, y: 0 },
		showDuration: 0.25,
		hitDuration: 0.06,
		breakDuration: 0.25,
		
		alpha: 0,
		activeAlpha: 0.8,
		hitAlpha: 1,
		
		shieldScale: 0,
		activeScale: 2,
		hitScale: 1.8,
		breakScale: 4,
		
		hitSound: 'shieldHit',

        init:function(x,y,settings)
		{
            this.parent(x,y,settings);
			if(!this.owner)
			{
				this.kill();
				return;
			}
			
			this.addAnim('idle', 1, [0], true);
			this.pos.x -= this.size.x * 0.5;
			this.pos.y -= this.size.y * 0.5;
			this.show();
        },
        update:function()
		{
			if(ig.game.control.isPaused)
				return;
            this.parent();
			this.pos.x = this.owner.pos.x + this.shieldOffset.x * this.scale.x;
			this.pos.y = this.owner.pos.y + this.shieldOffset.y * this.scale.y;
        },
        draw: function()
        {
        	this.parent();

        	if (this.isHit)
        		this.parent();
        },
		show: function()
		{
			this.broken = false;
			this.isHit = false;
			this.currentAnim.alpha = 0;
			this.shieldScale = 0;
			this.setScale(this.shieldScale, this.shieldScale);
			this.tween({ currentAnim: { alpha: this.activeAlpha } }, this.showDuration ).start();
			this.tween({ shieldScale: this.activeScale }, this.showDuration, {
				easing: ig.Tween.Easing.Back.EaseOut,
				onUpdate: function(){ this.setScale(this.shieldScale, this.shieldScale); }.bind(this),
				onComplete: function(){ this.setScale(this.shieldScale, this.shieldScale); }.bind(this)
			}).start();
		},
		hide: function()
		{
			this.stopTweens(false);
			this.tween({ currentAnim: { alpha: 0 } }, this.showDuration ).start();
		},
		hit: function()
		{
			this.stopTweens(false);
			this.isHit = true;
			var twn_alpha1 = this.tween({ currentAnim: { alpha: this.hitAlpha } }, this.hitDuration );
			var twn_alpha2 = this.tween({ currentAnim: { alpha: this.activeAlpha } }, this.hitDuration );
			twn_alpha1.chain(twn_alpha2);
			twn_alpha1.start();
			
			var twn_scale1 = this.tween({ shieldScale: this.hitScale }, this.hitDuration, {
				easing: ig.Tween.Easing.Back.EaseOut,
				onUpdate: function(){ this.setScale(this.shieldScale, this.shieldScale); }.bind(this)
			});
			var twn_scale2 = this.tween({ shieldScale: this.activeScale }, this.hitDuration, {
				onUpdate: function(){ this.setScale(this.shieldScale, this.shieldScale); }.bind(this),
				onComplete: function(){ this.isHit = false; }.bind(this)
			});
			twn_scale1.chain(twn_scale2);
			twn_scale1.start();
			ig.soundHandler.sfxPlayer.play(this.hitSound);
		},
		break: function()
		{
			if(this.broken)
				return;
			
			this.stopTweens(false);
			this.broken = true;
			this.isHit = false;
			this.tween({ currentAnim: { alpha: 0 } }, this.breakDuration).start();
			this.tween({ shieldScale: this.breakScale }, this.breakDuration, {
				easing: ig.Tween.Easing.Back.EaseIn,
				onUpdate: function(){ this.setScale(this.shieldScale, this.shieldScale); }.bind(this),
				onComplete: function(){ this.setScale(this.shieldScale, this.shieldScale); this.kill(); }.bind(this)
			}).start();
		}
    });
});