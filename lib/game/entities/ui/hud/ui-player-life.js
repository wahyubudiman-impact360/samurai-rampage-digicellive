ig.module('game.entities.ui.hud.ui-player-life')
.requires(
	'game.entities.ui.base-ui'
)
.defines(function() {
    EntityUiPlayerLife = EntityBaseUi.extend({
        zIndex: 5000,
		enabled: true,
		image_health: new ig.Image( 'media/graphics/sprites/ui/life-symbol.png' ),
		image_reflect: new ig.Image( 'media/graphics/sprites/ui/reflect-symbol.png' ),
		spacing: 5,
		
        draw:function()
        {
            this.parent();
			var character = ig.game.control.player;
			for(var i = character.health, x = 0; i > 0; i--, x++)
			{
				if(i < 1)
					this.image_health.draw(this.pos.x + x*(this.image_health.width+this.spacing), this.pos.y, 0, 0, this.image_health.width*i, this.image_health.height);
				else
					this.image_health.draw(this.pos.x + x*(this.image_health.width+this.spacing), this.pos.y);
			}
			
			if (character.reflect)
			{
				this.image_reflect.draw(this.pos.x + Math.ceil(character.health)*(this.image_health.width+this.spacing), this.pos.y + 7);
			}
        }
    });
});