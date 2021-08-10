ig.module('game.entities.ui.buttons.button-more-games')
.requires(
	'game.entities.ui.buttons.button'
	,'plugins.clickable-div-layer'
)
.defines(function() {
	EntityButtonMoreGames = EntityButton.extend({
		type:ig.Entity.TYPE.A,
		gravityFactor:0,
		logo: new ig.AnimationSheet('media/graphics/sprites/ui/main-menu-more-games.png', 237, 25),
		size:{x:237, y:25},
		zIndex: 1001,
		clickableLayer:null,
		link:null,
		newWindow:false,
		div_layer_name:"more-games",
		name:"moregames",
		init:function(x,y,settings){
			this.parent(x,y,settings);

            //ig.soundHandler.unmuteAll(true);
            
			if(ig.global.wm)
			{
				return;
			}
			
			if(settings.div_layer_name)
			{
				//console.log('settings found ... using that div layer name')
				this.div_layer_name = settings.div_layer_name;
			}
			else
			{
				this.div_layer_name = 'more-games'
			}
			
			if(_SETTINGS.MoreGames.Enabled)
			{
				this.anims.idle = new ig.Animation(this.logo,0,[0], true);
				this.currentAnim = this.anims.idle;
				
				if(_SETTINGS.MoreGames.Link)
				{
					this.link=_SETTINGS.MoreGames.Link;
				}
				if(_SETTINGS.MoreGames.NewWindow)
				{
					this.newWindow = _SETTINGS.MoreGames.NewWindow;
				}
				this.clickableLayer = new ClickableDivLayer(this);
			}
			else
			{
				this.kill();
			}	
		},
		draw: function() {
			if (this.isHighlighted && !ig.game.isFirefox) {
				var ctx = ig.system.context;
				ctx.save();
				ctx.shadowBlur = 20;
				ctx.shadowColor = "#ff0000";
				this.parent();
				ctx.restore();
			} else {
				this.parent();
			}
		},
        show:function()
        {
            var elem = ig.domHandler.getElementById("#"+this.div_layer_name);
            if (elem) { ig.domHandler.show(elem); }
        },
        hide:function()
        {
            var elem = ig.domHandler.getElementById("#"+this.div_layer_name);
            if (elem) { ig.domHandler.hide(elem); }
        },
		clicked:function()
		{
			
		},
		clicking:function()
		{
			
		},
		released:function()
		{
			
		}
	});
});