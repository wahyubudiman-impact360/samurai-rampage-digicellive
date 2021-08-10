ig.module('game.entities.ui.hud.ui-player-rage')
.requires(
	'game.entities.ui.base-ui'
)
.defines(function() {
    EntityUiPlayerRage = EntityBaseUi.extend({
        zIndex: 5000,
		enabled: true,
		size: { x: 351, y: 16 },
		icon: new ig.Image( 'media/graphics/sprites/ui/rage-icon.png' ),
		img_filled: new ig.Image( 'media/graphics/sprites/ui/rage-bar-filled.png' ),
		img_empty: new ig.Image( 'media/graphics/sprites/ui/rage-bar-empty.png' ),
		img_highlight: new ig.Image( 'media/graphics/sprites/ui/rage-bar-highlight.png' ),
		blinkImage: null,
		blink: false,
		blinkElapsed: 0,
		blinkTime: 0.1,
		blinkColor: '#ffffff',
		character: null,
		
        init:function(x,y,settings)
        {
            this.parent(x,y,settings);
			this.blinkImage = this.img_filled.data;
        },
		
		update: function()
		{
			if(ig.game.control.isPaused)
				return;
			
			this.parent();
			if(this.character.rageMode)
			{
				this.blinkElapsed += ig.system.tick;
				if(this.blinkElapsed >= this.blinkTime)
				{
					this.blink = !this.blink;
					this.blinkElapsed = 0;
				}
			}
		},
		
        draw:function()
        {
			this.img_empty.draw(this.pos.x, this.pos.y);
			var ragePercent = this.character.rage/this.character.maxRage;
			if (ragePercent > 0) {
				this.img_filled.draw(this.pos.x, this.pos.y, 0, 0, this.img_filled.width * ragePercent, this.img_filled.height);
				if (this.character.rageMode && this.blink)
					this.img_highlight.draw(this.pos.x, this.pos.y, 0, 0, this.img_filled.width * ragePercent, this.img_filled.height);
			}
			this.icon.draw(this.pos.x + 261, this.pos.y - 16);
        }
    });
});