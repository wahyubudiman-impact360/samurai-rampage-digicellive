ig.module('game.entities.characters.base-character')
.requires(
	'impact.entity',
	'plugins.game.character-animation'
)
.defines(function() {
    EntityBaseCharacter = ig.Entity.extend({
        zIndex: 2000,
        type: ig.Entity.TYPE.B,
		maxVel: { x: 1000, y: 1000, fall: 400 },
		
		// status
        health: 1,
		attack: 1,
		speed: 800,
        shielded: false,
		stopMoving: false,
		
		// character states
		states:{},
		currentState: null,

		// movement
		movementType: { normal: 0, linear: 1, curve: 2 },
		currentMovement: 0,
		lastMovement: 0,
		moveOrigin: {x: 0, y: 0 },
		moveDistance: {x: 0, y: 0 },
		moveDelta: 0,
		moveDuration: 0,
		moveCompleted: false,
		stopOnMoveComplete: false,
		slowMotionFactor: 0,
		jumpVel: { x: 0, y: 0 },

        init:function(x,y,settings)
        {
            this.parent(x,y,settings);
			this.pos.x -= this.size.x * 0.5;
			this.pos.y -= this.size.y * 0.5;
	    },
		
        update:function()
        {
			if(ig.game.control.isPaused)
				return;
			
			this.parent();
			this.updateMovement();
			this.updateState();
		},
		
		updateMovement: function()
		{
			if(this.stopMoving)
				return;
			
			var deltaTime = this.getDeltaTime();
			this.moveDelta += deltaTime;
			if(this.moveDelta >= this.moveDuration)
			{
				this.moveCompleted = true;
				if(this.stopOnMoveComplete)
				{
					this.stopMoving = true;
					deltaTime = this.moveDuration - this.moveDelta;
					this.moveDelta = this.moveDuration;
				}
			}
			var movePercent = this.moveDelta/this.moveDuration;
			if(this.currentMovement === this.movementType.normal)
			{
				this.jumpVel.y += ig.game.control.gravity * this.gravityFactor * deltaTime;
				
				if(this.jumpVel.y > this.maxVel.fall)
					this.jumpVel.y = this.maxVel.fall;

				this.pos.x += this.jumpVel.x * deltaTime;
				this.pos.y += this.jumpVel.y * deltaTime;
			}
			else if(this.currentMovement === this.movementType.linear)
			{
				this.pos.x = this.moveOrigin.x + this.moveDistance.x * movePercent;
				this.pos.y = this.moveOrigin.y + this.moveDistance.y * movePercent;
			}
			else if(this.currentMovement === this.movementType.curve)
			{
				var deltaX = this.moveDistance.x * movePercent;
				this.pos.x = this.moveOrigin.x + deltaX;
				deltaX = Math.abs(deltaX);
				this.pos.y = this.moveOrigin.y - ((this.jumpP*(deltaX*deltaX)) + this.tanA*deltaX);
			}
		},

		getDeltaTime: function()
		{
			if (ig.game.control.slowMotionScale < 1 && this.slowMotionFactor > 0)
			{
				if (this.slowMotionFactor === 1)
				{
					return ig.system.tick * ig.game.control.slowMotionScale;
				}
				else if (this.slowMotionFactor < 1) {
					return ig.system.tick * ig.game.control.slowMotionScale + ig.system.tick*(1-ig.game.control.slowMotionScale)*(1-this.slowMotionFactor);
				} else {
					return ig.system.tick * Math.pow(ig.game.control.slowMotionScale, this.slowMotionFactor);
				}
			} else {
				return ig.system.tick;
			}
		},

        receiveDamage: function( amount, from )
        {
			if (this.shielded && !from.rageMode)
				return;
			
            this.health -= amount;
            if(this.health <= 0 && this.currentState !== this.states.die)
            {
                this.setState(this.states.die);
            }
        },
		
		jump: function(velocity, angle, side, stopOnComplete, duration)
		{
        	this.moveOrigin.x = this.pos.x;
			this.moveOrigin.y = this.pos.y;
			angle *= Math.PI/180;
			this.jumpVel.x = velocity * Math.cos(angle);
			this.jumpVel.y = -velocity * Math.sin(angle);
			this.moveDelta = 0;
			this.moveDuration = duration;
			this.moveCompleted = false;
			this.stopOnMoveComplete = stopOnComplete;
			this.currentMovement = this.movementType.normal;
			this.stopMoving = false;

			if (side <= 0)
				this.jumpVel.x *= -1;
		},
		
        moveTo: function(x, y, velocity, stopOnComplete)
        {
        	x -= this.size.x * 0.5;
        	y -= this.size.y * 0.5;
			
        	this.moveOrigin.x = this.pos.x;
			this.moveOrigin.y = this.pos.y;
			this.moveDistance.x = x - this.pos.x;
			this.moveDistance.y = y - this.pos.y;
			this.moveDelta = 0;
			var distance = new Vector2(this.moveDistance.x, this.moveDistance.y).length();
			this.moveDuration = distance/velocity;
			this.moveCompleted = false;
			this.stopOnMoveComplete = stopOnComplete;
			this.currentMovement = this.movementType.linear;
			this.stopMoving = false;
        },

		jumpTo: function(x, y, velocity, angle, stopOnComplete)
		{
			x -= this.size.x * 0.5;
        	y -= this.size.y * 0.5;
        	angle *= Math.PI/180;

        	this.moveOrigin.x = this.pos.x;
			this.moveOrigin.y = this.pos.y;
			this.moveDistance.x = x - this.pos.x;
			this.moveDistance.y = y - this.pos.y;
			this.moveDelta = 0;
			var distance = Math.abs(this.moveDistance.x);
        	this.moveDuration = distance/(velocity * Math.cos(angle));
        	this.moveCompleted = false;
			this.stopOnMoveComplete = stopOnComplete;
			
        	if(y < this.pos.y)
        	{
        		var destinationAngle = new Vector2(this.moveDistance.x, -this.moveDistance.y).toAngles();
        		var rightAngle = 1.5707963267948966;
        		if(destinationAngle > rightAngle)
        			destinationAngle = rightAngle*2 - destinationAngle;
        		if(destinationAngle >= angle)
        		{
        			angle = destinationAngle + (rightAngle - destinationAngle)*0.5;
        		}
        	}

        	this.tanA = Math.tan(angle);
			this.jumpP = (-this.moveDistance.y - (Math.tan(angle)*distance))/(distance*distance);
			this.currentMovement = this.movementType.curve;
			this.stopMoving = false;
		},

		move: function(movementInfo)
		{
			var velocity = movementInfo.velocity || this.moveSpeed;
			if (movementInfo.angle)
			{
				if(movementInfo.x !== undefined && movementInfo.y !== undefined) {
					this.jumpTo(movementInfo.x, movementInfo.y, velocity, movementInfo.angle, movementInfo.stop);
				} else {
					if(movementInfo.side !== 0 && movementInfo.side !== 1)
						movementInfo.side = (this.pos.x + this.size.x*0.5 < ig.system.width*0.5) ? 1 : 0;
					this.jump(velocity, movementInfo.angle, movementInfo.side, movementInfo.stop, movementInfo.duration);
				}
			} else {
				this.moveTo(movementInfo.x, movementInfo.y, velocity, movementInfo.stop)
			}
					
			if(movementInfo.slowMotionScale !== undefined && movementInfo.slowMotionScale >= 0)
				this.slowMotionFactor = movementInfo.slowMotionScale;
			else
				this.slowMotionFactor = 1;
		},

		updateState: function()
		{
			if(this.currentState)
			{
				if(typeof this.currentState.onUpdate === "function")
					this.currentState.onUpdate.call(this);
				
				if(this.currentState.transitions)
				{
					for(var i = 0; i < this.currentState.transitions.length; i++)
					{
						var transition = this.currentState.transitions[i];
						if(transition.condition.call(this) === true)
						{
							this.setState(this.states[transition.nextState]);
							break;
						}
					}
				}
			}
		},
		
		setState: function(state)
		{
			if(this.currentState && typeof this.currentState.onExit === "function")
				this.currentState.onExit.call(this);

			this.currentState = state;
			
			if(typeof state.onEnter === "function")
				state.onEnter.call(this);
		},
		
		/*
		// state test
		testStep: 0,
		startState:
		{
			onEnter: function()
			{
				console.log("Enter Start State");
			},
			
			onUpdate: function()
			{
				console.log("State Update");
			},
			
			onExit: function()
			{
				console.log("End Start State");
			},
			
			transitions: [
				{ nextState: 'endState', condition: function(){ return this.testStep > 100; } }
			]
		},
		
		endState:
		{
			onEnter: function()
			{
				console.log("Enter End State");
			},
		},
		*/
    });
});