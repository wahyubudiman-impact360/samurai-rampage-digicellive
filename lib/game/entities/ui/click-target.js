ig.module('game.entities.ui.click-target')
.requires(
	'game.entities.hit-box'
)
.defines(function() {
    EntityClickTarget = EntityHitBox.extend({
        zIndex: 5001,
        size: { x: 134, y: 134 },
		offset: { x: -8, y: 0 },
		type: ig.Entity.TYPE.B,
		animSheet: new ig.AnimationSheet( 'media/graphics/sprites/ui/targeting.png', 119, 134 ),
		alpha: 0,
		uiScale: 2,
		startAnimDuration: 0.15,
		targetScale: 1,

        init:function(x,y,settings)
        {
            this.parent(x,y,settings);
			this.addAnim('idle', 0, [0], true);
			this.currentAnim.pivot = { x: 70, y: 87 };
			this.twn_expand = this.tween({ uiScale: 1.1 }, 0.5, { easing: ig.Tween.Easing.Quadratic.EaseOut, onUpdate: function(){ this.setScale(this.targetScale * this.uiScale, this.targetScale * this.uiScale); }.bind(this), onComplete: this.tweenDown.bind(this) } );
			this.twn_shrink = this.tween({ uiScale: 1 }, 0.4, { easing: ig.Tween.Easing.Quadratic.EaseOut, onUpdate: function(){ this.setScale(this.targetScale * this.uiScale, this.targetScale * this.uiScale); }.bind(this), onComplete: this.tweenUp.bind(this) } );
			this.playStartAnimation();
		},

		playStartAnimation: function()
		{
			/*
			this.currentAnim.alpha = this.alpha;
			this.setScale(this.targetScale * this.uiScale, this.targetScale * this.uiScale);
			this.tween({ alpha: 1, uiScale: 1 }, this.startAnimDuration, { 
					onUpdate: function(){
						this.currentAnim.alpha = this.alpha;
						this.setScale(this.targetScale * this.uiScale, this.targetScale * this.uiScale);
					}.bind(this),
					onComplete: this.tweenUp.bind(this)
			}).start();
			*/
			
			this.alpha = 1;
			this.uiScale = 1;
			this.currentAnim.alpha = this.alpha;
			this.setScale(this.targetScale * this.uiScale, this.targetScale * this.uiScale);
			this.tweenUp();
		},
		
		tweenUp: function()
		{
			this.twn_expand.start();
		},
		
		tweenDown: function()
		{
			this.twn_shrink.start();
		},
		
		clicked: function()
		{
            var player = ig.game.control.player;
           	if(player) {
				player.addTarget(this);
				player.attack(this);
			}
		}
    });
});