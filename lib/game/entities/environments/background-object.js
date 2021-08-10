ig.module('game.entities.environments.background-object')
.requires(
	'impact.entity',
	'impact.entity-pool'
)
.defines(function() {
    EntityBackgroundObject = ig.Entity.extend({
		zIndex: 1998,
		maxVel: {x: 1000, y: 1000},
		image: null,
		
		objects:
		[
			{ image: new ig.Image( 'media/graphics/sprites/environments/obj01.png'), size:{ x: 92, y: 414 }, zIndex: 1997 },
			{ image: new ig.Image( 'media/graphics/sprites/environments/obj02.png'), size:{ x: 66, y: 416 }, zIndex: 1997 },
			{ image: new ig.Image( 'media/graphics/sprites/environments/obj03.png'), size:{ x: 82, y: 20 }, zIndex: 1998 },
			{ image: new ig.Image( 'media/graphics/sprites/environments/obj04.png'), size:{ x: 223, y: 243 }, zIndex: 1998 },
			{ image: new ig.Image( 'media/graphics/sprites/environments/obj05.png'), size:{ x: 204, y: 105 }, zIndex: 1998 },
			{ image: new ig.Image( 'media/graphics/sprites/environments/obj06.png'), size:{ x: 216, y: 115 }, zIndex: 1998 },
			{ image: new ig.Image( 'media/graphics/sprites/environments/obj07.png'), size:{ x: 324, y: 208 }, zIndex: 2010 },
			{ image: new ig.Image( 'media/graphics/sprites/environments/obj08.png'), size:{ x: 309, y: 334 }, zIndex: 2010 }
		],
		
		init:function(x,y,settings)
		{
			this.parent(x, y, settings);
			var object = this.objects[this.object];
			this.size.x = object.size.x;
			this.size.y = object.size.y;
			this.image = object.image;
			this.zIndex = object.zIndex || this.zIndex;
		},
		
		reset:function(x,y,settings)
		{
			this.parent(x, y, settings);
			var object = this.objects[this.object];
			this.size.x = object.size.x;
			this.size.y = object.size.y;
			this.image = object.image;
			this.zIndex = object.zIndex || this.zIndex;
		},
		
        update:function()
        {
			if(ig.game.control.isPaused)
				return;
			
			if(ig.game.control.isScrolling && ig.game.control.slowMotionScale > 0.01)
			{
				this.pos.x -= ig.game.control.scrollingSpeed * ig.system.tick * ig.game.control.scrollingSlowMotionScale;
				if(this.pos.x <= -this.size.x)
					this.kill();
			}
        },
		
		draw: function()
		{
			this.image.draw(this.pos.x, this.pos.y);
		},
    });
	
	ig.EntityPool.enableFor( EntityBackgroundObject );
});