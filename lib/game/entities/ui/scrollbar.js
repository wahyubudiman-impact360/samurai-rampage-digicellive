ig.module( 
  'game.entities.ui.scrollbar' 
)
.requires(
  'game.entities.ui.base-ui',
  'game.entities.ui.scrollbar-handle'
)
.defines(function(){
    EntityScrollbar = EntityBaseUi.extend({
		zIndex: 5101,
		type:ig.Entity.TYPE.A,
        size: {x:271, y:7},
		handle: null,
		horizontal: true,
		scrollPos: 0,
		handle_type: EntityScrollbarHandle, 
		clickable: true,
		animSheet: new ig.AnimationSheet( 'media/graphics/sprites/ui/scrollbar.png', 271, 7 ),

        init: function(x, y, settings)
        {
            this.parent(x,y, settings);
			this.addAnim('idle', 0, [0], true);
			
			if(ig.global.wm)
				return;
			
			if(this.handle_type)
			{
				var handleIndex = this.zIndex + 1;
				if(this.horizontal)
				{
					this.handle = ig.game.spawnEntity(this.handle_type, this.pos.x, this.pos.y + (this.size.y * 0.5), {scrollbar: this, zIndex: handleIndex });
					this.handle.pos.y -= this.handle.size.y*0.5;
				}else{
					this.handle = ig.game.spawnEntity(this.handle_type, this.pos.x + (this.size.x * 0.5), this.pos.y, {scrollbar: this, zIndex: handleIndex });
					this.handle.pos.x -= this.handle.size.x*0.5;
				}
			}
			
			this.setScrollPosition(this.scrollPos);
		},
		
		dragHandle: function(position, offset)
		{
			// horizontal scrolling
			if(this.horizontal)
			{
				var max = this.size.x - this.handle.size.x;
				this.handle.pos.x = this.pos.x + (position.x + offset.x - this.pos.x).limit(0, max);
				this.scrollPos = (this.handle.pos.x - this.pos.x)/(this.size.x - this.handle.size.x);
			}
			// vertical scrolling
			else
			{
				var max = this.size.y - this.handle.size.y;
				this.handle.pos.y = this.pos.y + (position.y + offset.y - this.pos.y).limit(0, max);
				this.scrollPos = (this.handle.pos.y - this.pos.y)/(this.size.y - this.handle.size.y);
			}
			
			this.onDrag();
		},
		
		setScrollPosition: function(value)
		{
			if(this.horizontal)
			{
				this.handle.pos.x = this.pos.x + (this.size.x - this.handle.size.x) * value;
				this.handle.pos.y = this.pos.y + (this.size.y * 0.5) - this.handle.size.y * 0.5;
			}else{
				this.handle.pos.y = this.pos.y + (this.size.y - this.handle.size.y) * value;
				this.handle.pos.x = this.pos.x + (this.size.x * 0.5) - this.handle.size.x * 0.5;
			}
			this.scrollPos = value;
		},
		
		onDrag: function()
		{
			
		},
		
		onRelease: function()
		{
			
		},
		
		clicked:function()
		{
			if(this.clickable)
			{
				var pointer = ig.game.getEntitiesByType(EntityPointer)
				pointer = (pointer.length > 0) ? pointer[0] : false;
				if(pointer)
				{
					var scale;
					if(this.horizontal)
						scale = (pointer.pos.x - this.pos.x)/this.size.x;
					else
						scale = (pointer.pos.x - this.pos.y)/this.size.y;
					this.setScrollPosition(scale);
					this.handle.pointer = pointer;
					this.handle.pointerOffset.x = this.handle.pos.x - pointer.pos.x;
					this.handle.pointerOffset.y = this.handle.pos.y - pointer.pos.y;
					this.handle.dragging = true;
				}
			}
		},
		
		moveTo: function(x,y)
		{
			this.parent(x,y);
			if(this.horizontal)
			{
				this.handle.pos.y = this.pos.y + (this.size.y*0.5) - this.handle.size.y*0.5;
			}else{
				this.handle.pos.x = this.pos.x + (this.size.x*0.5) - this.handle.size.x*0.5;
			}
			
			this.setScrollPosition(this.scrollPos);
		},

		enable: function()
		{
			this.parent();
			if (this.handle)
				this.handle.enable();
		},

		disable: function()
		{
			this.parent();
			if (this.handle)
				this.handle.disable();
		},

		kill: function()
		{
			this.parent();
			if (this.handle)
				this.handle.kill();
		}
    });
});