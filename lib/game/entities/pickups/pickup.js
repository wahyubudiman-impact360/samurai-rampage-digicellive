ig.module( 
  'game.entities.pickups.pickup' 
)
.requires(
  'impact.entity'
)
.defines(function(){
    EntityPickup = ig.Entity.extend
    ({
		zIndex: 2001,
        size: {x:100, y:100},
		maxVel: {x: 1000, y: 1000},
        type: ig.Entity.TYPE.B,
		pickedUp: false,
		lifeTime: 5,
		blinkInterval: 0.08,
		startBlinkTime: 2,
		blinkOpacity: 0.3,

		itemScale: 0,
		tweenOffset: 10,
		tweenDuration: 0.75,
		_wmIgnore: true,

        init: function(x, y, settings)
        {
            this.parent(x,y, settings);
            this.pos.x -= this.size.x*0.5;
            this.pos.y -= this.size.y*0.5;
			this.twn_up = this.tween({ pos: {y:this.pos.y - this.tweenOffset} }, this.tweenDuration, { easing: ig.Tween.Easing.Quadratic.EaseInOut });
			this.twn_down = this.tween({ pos: {y:this.pos.y + this.tweenOffset} }, this.tweenDuration, { easing: ig.Tween.Easing.Quadratic.EaseInOut });;
			this.twn_up.chain(this.twn_down);
			this.twn_down.chain(this.twn_up);
			this.setScale(0, 0);
			this.tween({ itemScale: 1 }, 0.2, {
				easing: ig.Tween.Easing.Back.EaseOut,
				onUpdate: function(){ this.setScale(this.itemScale, this.itemScale); }.bind(this),
				onComplete: function(){ this.twn_up.start(); }.bind(this)
			}).start();
			this.blinkTimer = new ig.Timer(this.blinkInterval);
        },
		
		update: function()
		{
			if(ig.game.control.isPaused)
				return;
			
			this.parent();
			this.lifeTime -= ig.system.tick;
			if(this.lifeTime <= 0)
				this.kill();

			if(this.lifeTime <= this.startBlinkTime && this.blinkTimer.delta() >= 0)
			{
				this.blinkTimer.reset();
				if(this.currentAnim.alpha === this.blinkOpacity)
				{
					this.currentAnim.alpha = 1;
				} else {
					this.currentAnim.alpha = this.blinkOpacity;
				}
			}
		},
		
		clicked: function()
		{
			if(!this.pickedUp)
			{
				/*
				var character = ig.game.control.player;
				if(character)
					character.pickupItem(this);
				*/
				
				this.activate();
				ig.soundHandler.sfxPlayer.play('upgrade');
			}
		},
		
		activate: function()
		{
			this.pickedUp = true;
			this.kill();
		},
    });
});