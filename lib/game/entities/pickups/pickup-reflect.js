ig.module( 
  'game.entities.pickups.pickup-reflect' 
)
.requires(
  'game.entities.pickups.pickup'
)
.defines(function(){
    EntityPickupReflect = EntityPickup.extend
    ({
        size: {x:90, y:90},
		animSheet: new ig.AnimationSheet( 'media/graphics/sprites/pickups/pickup-shuriken.png', 90, 90 ),

        init: function(x, y, settings)
        {
            this.parent(x,y, settings);
		        this.addAnim('idle', 0, [0], true);
		    },

		    activate: function()
		    {
			     this.parent();
			     ig.game.control.player.getReflect();
		    }
    });
});