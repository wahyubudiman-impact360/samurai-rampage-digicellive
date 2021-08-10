ig.module('game.entities.ui.panels.panel-upgrade')
.requires(
	'game.entities.ui.base-panel',
	'game.entities.ui.upgrade-slot',
	'game.entities.ui.buttons.button-close',
	'game.entities.ui.hud.ui-upgrade-point'
)
.defines(function() {
	EntityPanelUpgrade = EntityBasePanel.extend({
		zIndex: 5010,
		animSheet: new ig.AnimationSheet( 'media/graphics/sprites/ui/popup-large.png', 636, 413 ),
		size: { x: 636, y: 413 },

		init:function(x,y,settings)
		{
			this.parent(x,y,settings);
			
			// setup tween position
			this.hidePos = { x: (ig.system.width - this.size.x)*0.5, y: -this.size.y };
			this.showPos = { x: (ig.system.width - this.size.x)*0.5, y: ig.system.height*0.5 - this.size.y*0.5 };
			this.pos.x = this.hidePos.x;
			this.pos.y = this.hidePos.y;
			
			// set up animation
			this.addAnim('idle', 0, [0], true);
			
			// spawn contents
			this.btn_close = ig.game.spawnEntity(EntityButtonClose, this.pos.x + 534, this.pos.y - 18, { callback: this.hide.bind(this) });
			this.ui_upgradePoint = ig.game.spawnEntity(EntityUiUpgradePoint, this.pos.x - 141, this.pos.y - 43, { zIndex: this.zIndex + 1, enabled: false });
			this.addContent(this.btn_close);
			this.addContent(this.ui_upgradePoint);

			// upgrade slots
			for(var i = 0; i < ig.game.upgradeData.upgrades.length; i++)
				this.addContent(ig.game.spawnEntity(EntityUpgradeSlot, this.pos.x + 126, this.pos.y + 71 + i*70, { upgradeIndex: i, zIndex: this.zIndex + 1}));
			
			// hide panel
			this.disable();
		},
		
		draw: function()
		{
			if (!this.enabled)
				return;

			this.parent();
			
			var ctx = ig.system.context;
			ctx.save();
			ctx.textAlign = 'center';
			ctx.textBaseline= "middle";
			ctx.font = 'bold 25pt osaka';
			ctx.fillText(_STRINGS.Upgrade.Title, this.pos.x + this.size.x*0.5, this.pos.y + 36);
			ctx.restore();
		}
	});
});