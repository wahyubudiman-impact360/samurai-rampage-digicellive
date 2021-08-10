ig.module( 
  'game.entities.pickups.pickup-healing' 
)
.requires(
  'game.entities.pickups.pickup'
)
.defines(function(){
    EntityPickupHealing = EntityPickup.extend
    ({
        size: { x:90, y:90 },
		offset: { x:-2, y: 0 },
		animSheet: new ig.AnimationSheet( 'media/graphics/sprites/pickups/pickup-sewing-kit.png', 86, 90 ),
		healingAmount: 2,

        init: function(x, y, settings)
        {
            this.parent(x,y, settings);
			this.addAnim('idle', 0, [0], true);
		},

		activate: function()
		{
			this.parent();
			ig.game.control.player.heal(this.healingAmount);
		}
    });
});