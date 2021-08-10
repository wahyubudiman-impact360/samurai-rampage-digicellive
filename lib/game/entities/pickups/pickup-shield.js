ig.module( 
  'game.entities.pickups.pickup-shield' 
)
.requires(
  'game.entities.pickups.pickup'
)
.defines(function(){
    EntityPickupShield = EntityPickup.extend
    ({
        size: { x:90, y:90 },
		offset: { x:24, y:40 },
		animSheet: new ig.AnimationSheet( 'media/graphics/sprites/pickups/pickup-shield.png', 128, 134 ),
		protectDuration: 10,

        init: function(x, y, settings)
        {
            this.parent(x,y, settings);
			this.addAnim('idle', 0, [0], true);
		},

		activate: function()
		{
			this.parent();
			ig.game.control.player.getShield(this.protectDuration);
		}
    });
});