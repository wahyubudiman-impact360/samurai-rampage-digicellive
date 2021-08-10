ig.module(
	'plugins.game.character-animation'
)
.requires(
	'impact.entity',
	'impact.animation',
	'impact.timer'
)
.defines(function()
{
	ig.Entity.inject({
        changeAnimation: function(animation, flipX, flipY)
        {
        	if(animation.length > 0)
        	{
        		if(animation.indexOf(this.currentAnim) === -1)
        		{
        			var animIndex = Math.floor(Math.random() * animation.length);
            		this.currentAnim = animation[animIndex];	
        		}
        	}
        	else
        	{
        		this.currentAnim = animation;
        	}
			
			this.flipAnimation(flipX, flipY);
		},
		
		flipAnimation: function(flipX, flipY)
		{
        	if(flipX !== undefined)
        		this.currentAnim.flip.x = flipX;
        	if(flipY !== undefined)
        		this.currentAnim.flip.y = flipY;
			
            if(flipX)
			{
				this._offset.x = this.offset.x = this.currentAnim.sheet.width - this.currentAnim._offset.x - this.size.x;
				this.currentAnim.pivot.x = this.currentAnim.sheet.width - this.currentAnim._pivot.x;
			}
			else
			{
				this._offset.x = this.offset.x = this.currentAnim._offset.x;
				this.currentAnim.pivot.x = this.currentAnim._pivot.x;
			}
			
            if(flipY)
			{
				this._offset.y = this.offset.y = this.currentAnim.sheet.height - this.size.y - this.currentAnim._offset.y;
				this.currentAnim.pivot.y = this.currentAnim.sheet.height - this.currentAnim._pivot.y;
			}
			else
			{
				this._offset.y = this.offset.y = this.currentAnim._offset.y;
				this.currentAnim.pivot.y = this.currentAnim._pivot.y;
			}
		}
	});
	
	ig.Entity.prototype.addAnim = function( name, frameTime, sequence, stop, pivot, offset ) 
	{
		if( !this.animSheet ) {
			throw( 'No animSheet to add the animation '+name+' to.' );
		}
		var a = new ig.Animation( this.animSheet, frameTime, sequence, stop );
		if(pivot && pivot.x !== undefined && pivot.y !== undefined)
			a._pivot = pivot;
		else
			a._pivot = { x: a.sheet.width*0.5, y: a.sheet.height*0.5 };
		
		if(offset && offset.x !== undefined && offset.y !== undefined)
			a._offset = offset;
		else
			a._offset = { x: 0, y: 0 };
		
		if(this.anims[name] === undefined || this.anims[name] === null)
		{
			this.anims[name] = a;
		}
		else if(this.anims[name] instanceof ig.Animation)
		{
			var oldAnim = this.anims[name];
			this.anims[name] = [];
			this.anims[name].push(oldAnim);
			this.anims[name].push(a);
		}
		else
		{
			this.anims[name].push(a);
		}
		
		if( !this.currentAnim ) {
			this.currentAnim = a;
		}
		
		return a;
	};
	
	ig.Animation.inject({
		update: function() {
			if(typeof this.timer.timeScale === "number")
				this.timer.step();
				
			this.parent();
		},
		
		setTimeScale: function(value)
		{
			this.timer.timeScale = value;
			
			if(!this.timer.time)
				this.timer.time = ig.Timer.time;
			if(!this.timer._last)
				this.timer._last = ig.Timer._last;
		},
	});
	
	ig.Timer.inject({
		delta: function() {
			if(typeof this.timeScale === 'number')
			{
				return (this.pausedAt || this.time) - this.base - this.target;
			}
			else
			{
				return (this.pausedAt || ig.Timer.time) - this.base - this.target;
			}
		},
		
		step: function() {
			var current = Date.now();
			var delta = (current - this._last) / 1000;
			this.time += Math.min(delta, ig.Timer.maxStep) * this.timeScale * ig.Timer.timeScale;
			this._last = current;
		},
		
		set: function( seconds ) {
			this.parent();
			if(typeof this.timeScale === 'number')
			{
				this.time = ig.Timer.time;
				this._last = ig.Timer._last;
			}
		},
	});
});