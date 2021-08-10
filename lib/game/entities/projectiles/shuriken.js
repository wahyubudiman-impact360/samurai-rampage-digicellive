ig.module( 
  'game.entities.projectiles.shuriken' 
)
.requires(
  'impact.entity'
)
.defines(function(){
    EntityShuriken = ig.Entity.extend
    ({
		zIndex: 2001,
        size: {x:45, y:45},
		maxVel: {x: 1800, y: 1800 },
		animSheet: new ig.AnimationSheet( 'media/graphics/sprites/projectiles/shuriken.png', 45, 45 ),
		
		angularVelocity: 12.5,
		type: ig.Entity.TYPE.A,
		checkAgainst: ig.Entity.TYPE.BOTH,
		direction: {x: 0, y: 0 },
		speed: 1800,
		bounceCount: 0,
		maxBounce: 1,
		damage: 1,
		hitTargets: [],
		
		// trail
		trailColor: 'rgba(255,28,28,0.8)',
		trailShadowColor: '#f00',
		trailShadowSize: 10,
		paths: [],
		maxTrailDistance: 1000,
		trailWidth: 10,
		trailShrinkStart: 0.5,

        init: function(x, y, settings)
        {
            this.parent(x,y, settings);
			this.addAnim('idle', 0, [0], true);
			this.pos.x -= this.size.x * 0.5;
			this.pos.y -= this.size.y * 0.5;
			this.vel = { x: this.direction.x * this.speed, y: this.direction.y * this.speed };
			this.addNode();
		},

		update: function()
		{
			if(ig.game.control.isPaused)
				return;
			
			this.parent();
			this.currentAnim.angle += this.angularVelocity * ig.system.tick;
			
			if(this.pos.x < -(this.size.x + this.maxTrailDistance) || this.pos.x > (ig.system.width + this.maxTrailDistance) || this.pos.y < -(this.size.y + this.maxTrailDistance) || this.pos.y > (ig.system.height + this.maxTrailDistance))
				this.kill();

			// update trail
			var scale = 1;
			var point = { x: this.pos.x, y: this.pos.y };
			var trailLeft = this.maxTrailDistance;
			for (var i = this.paths.length - 1; i >= 0; i--)
			{
				var nextPoint = this.paths[i];
				var offset = new Vector2(nextPoint.x - point.x, nextPoint.y - point.y);
				var distance = offset.length();
			
				if (distance > 0 && distance >= trailLeft)
				{
					scale = 0;
					nextPoint.scale = 0;
					var direction = offset.unit();
					nextPoint.x = point.x + direction.x * trailLeft;
					nextPoint.y = point.y + direction.y * trailLeft;

					if (i > 0)
						trailLeft -= distance;

					if (trailLeft <= 0)
						this.paths.splice(0, 1);

					break;
				} else {
					trailLeft -= distance;
					var shrinkDistance = this.trailShrinkStart*this.maxTrailDistance;
					if (trailLeft <= shrinkDistance)
						scale = trailLeft/shrinkDistance;

					point = nextPoint;
					point.scale = scale;
				}
			}
		},
		
		draw:function(){
			var ctx=ig.system.context;
			ctx.save();

			// draw trail
			ctx.fillStyle = this.trailColor;
			ctx.beginPath();
			if (this.paths.length > 0)
			{
				var start = this.paths[0];
				ctx.moveTo(start.x, start.y);
				for (var i = 1; i < this.paths.length; i++) {
					var point = this.paths[i];
					ctx.lineTo(point.x - Math.sin(point.angle) * this.trailWidth * point.scale, point.y + Math.cos(point.angle) * this.trailWidth * point.scale);
				}
				var end = this.paths[this.paths.length - 1];
				ctx.lineTo(this.pos.x + this.size.x*0.5 - Math.sin(end.angle) * this.trailWidth, this.pos.y + this.size.y*0.5 + Math.cos(end.angle) * this.trailWidth);
				ctx.lineTo(this.pos.x + this.size.x*0.5 + Math.sin(end.angle) * this.trailWidth, this.pos.y + this.size.y*0.5 - Math.cos(end.angle) * this.trailWidth);
				
				for (var i = this.paths.length - 1; i > 0; i--) {
					var point = this.paths[i];
					ctx.lineTo(point.x + Math.sin(point.angle) * this.trailWidth * point.scale, point.y - Math.cos(point.angle) * this.trailWidth * point.scale);
				}
			}
			ctx.closePath();
			if (!ig.game.isFirefox) {
				ctx.shadowBlur = this.trailShadowSize;
				ctx.shadowColor = this.trailShadowColor;
			}
			ctx.fill();
			ctx.restore();
			this.parent();
		},
		
		check: function(other)
		{
			if(other instanceof EntityEnemy1 && this.hitTargets.indexOf(other) === -1)
			{
				this.hitTargets.push(other);
				other.receiveDamage(this.damage, this);
				
				if(this.bounceCount >= this.maxBounce || ig.game.control.enemies.length <= 0) {
					this.kill();
				} else {
					this.getNewTarget();
					this.bounceCount++;
				}
			}
		},
		
		getNewTarget: function()
		{
			var nearest = Number.MAX_SAFE_INTEGER;
			var nextTarget = null;
			
			for(var i = 0; i < ig.game.control.enemies.length; i++)
			{
				var target = ig.game.control.enemies[i];
				var targetX = target.pos.x + target.size.x*0.5;
				var targetY = target.pos.y + target.size.y*0.5;
				if(this.hitTargets.indexOf(target) !== -1 || target.health <= 0 || target.shielded || targetX < 0 || targetX > ig.system.width || targetY < 0 || targetY > ig.system.height)
					continue;
				
				var distance = this.distanceTo(target);
				if(distance < nearest)
				{
					nextTarget = target;
					nearest = distance;
				}
			}
			
			if(nextTarget)
			{
				nextTarget.reflected = true;
				this.direction = new Vector2( (nextTarget.pos.x + nextTarget.size.x*0.5) - (this.pos.x + this.size.x*0.5) , (nextTarget.pos.y + nextTarget.size.y*0.5) - (this.pos.y + this.size.y*0.5)).unit();
				this.vel = {x: this.direction.x * this.speed, y: this.direction.y * this.speed };
				this.addNode();
			}
		},

		addNode: function() {
			var direction = new Vector2(this.vel.x, this.vel.y).unit();
			var angle = direction.toAngles();

			if (this.paths.length > 0) {
				var lastNode = this.paths[this.paths.length - 1];
				this.paths.push({ x: this.pos.x + this.size.x*0.5, y: this.pos.y + this.size.y*0.5, angle: lastNode.angle });
			}
			
			this.paths.push({ x: this.pos.x + this.size.x*0.5, y: this.pos.y + this.size.y*0.5, angle: angle, scale: 1 });
		}
    });
});