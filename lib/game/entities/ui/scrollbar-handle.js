ig.module( 
  'game.entities.ui.scrollbar-handle'
)
.requires(
  	'game.entities.ui.base-ui'
)
.defines(function(){
    EntityScrollbarHandle = EntityBaseUi.extend({
		zIndex: 5102,
		type:ig.Entity.TYPE.A,
        size: {x:35, y:54},
		offset: {x:14, y: 0},
		scrollbar: null,
		pointer: null,
		pointerOffset: {x:0, y:0},
		dragging: false,
		animSheet: new ig.AnimationSheet( 'media/graphics/sprites/ui/scrollbar-knob.png', 62, 54 ),

        init: function(x, y, settings)
        {
            this.parent(x,y, settings);
			this.addAnim('idle', 0, [0], true);
        },
		
		update: function()
		{
			if(!this.enabled)
				return;
			
			this.parent();
			if(this.dragging)
			{
				this.scrollbar.dragHandle(this.pointer.pos, this.pointerOffset);

				if(this.pointer.isReleased)
				{
					this.scrollbar.onRelease();
					this.dragging = false;
					this.pointer = null;
				}
			}
		},
		
		clicked:function(){
			var pointer = ig.game.getEntitiesByType(EntityPointer)
			pointer = (pointer.length > 0) ? pointer[0] : false;
			if(pointer)
			{
				this.pointer = pointer;
				this.pointerOffset.x = this.pos.x - pointer.pos.x;
				this.pointerOffset.y = this.pos.y - pointer.pos.y;
				this.dragging = true;
			}
		}
    });
});