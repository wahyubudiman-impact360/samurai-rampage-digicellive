ig.module(
  'game.entities.ui.upgrade-slot'
)
.requires(
	'game.entities.ui.base-ui',
	'game.entities.ui.buttons.button-upgrade'
)
.defines(function(){
    EntityUpgradeSlot = EntityBaseUi.extend
    ({
		zIndex: 5100,
        size: {x:395, y:64},
		animSheet: new ig.AnimationSheet( 'media/graphics/sprites/ui/popup-content-slot.png', 395, 64 ),
		upgradeIndex: 0,
		upgradeData: null,
		image: null,
		titleUnderline: new ig.Image('media/graphics/sprites/ui/upgrade-title-underline.png'),
		img_upgradeFilled: new ig.Image('media/graphics/sprites/ui/upgrade-slot-full.png'),
		img_upgradeEmpty: new ig.Image('media/graphics/sprites/ui/upgrade-slot-empty.png'),
		level: 0,
		cost: 0,
		maxLevel: 5,
		
        init: function(x, y, settings)
        {
			this.parent(x,y, settings);
			this.addAnim('idle', 1, [0], true);
			this.upgradeData = ig.game.upgradeData.getUpgradeFromID(this.upgradeIndex);
			this.image = new ig.Image(this.upgradeData.image);
			this.btn_upgrade = ig.game.spawnEntity(EntityButtonUpgrade, this.pos.x + this.size.x - 95, this.pos.y - 12, { zIndex: this.zIndex+1, panel:this });
			this.updateData();
		},
		
		moveTo: function(x,y)
		{
			this.parent(x,y);
			this.btn_upgrade.pos.x = this.pos.x + this.size.x - 95;
			this.btn_upgrade.pos.y = this.pos.y - 12;
		},
		
		draw: function()
		{
			if(!this.enabled)
				return;

			this.parent();
			this.image.draw(this.pos.x - 30, this.pos.y - 1);

			for(var i = 0; i < this.maxLevel; i++)
			{
				if(i < this.level)
					this.img_upgradeFilled.draw(this.pos.x + 41 + (i*50), this.pos.y + 47);
				else
					this.img_upgradeEmpty.draw(this.pos.x + 41 + (i*50), this.pos.y + 47);
			}
			
			var ctx = ig.system.context;
			ctx.save();
			ctx.font = 'bold 22pt osaka';
			ctx.fillStyle = '#eb0000';
			ctx.fillText(_STRINGS.UpgradeContents[this.upgradeData.strings].name, this.pos.x + 45, this.pos.y + 25);
			ctx.font = 'bold 10pt osaka';
			var description = _STRINGS.UpgradeContents[this.upgradeData.strings].description[this.level];
			if(description)
				ctx.fillText(description, this.pos.x + 45, this.pos.y + 38);
			ctx.restore();
		},
		
		updateData: function()
		{
			this.level = ig.game.sessionData.upgradeLevel[this.upgradeIndex];
			this.cost = ig.game.upgradeData.getCost(this.upgradeData, this.level);
		},
		
		upgrade: function()
		{
			if(this.level >= this.upgradeData.maxLevel || ig.game.sessionData.upgradePoint < this.cost)
				return;
			
			ig.game.sessionData.upgradePoint -= this.cost;
			ig.game.sessionData.upgradeLevel[this.upgradeIndex] += 1;
			ig.game.saveAll();
			this.updateData();
			ig.soundHandler.sfxPlayer.play('upgrade');
		},

		enable: function()
		{
			this.parent();
			this.btn_upgrade.enable();
		},

		disable: function()
		{
			this.parent();
			this.btn_upgrade.disable();
		},

		kill: function()
		{
			this.parent();
			this.btn_upgrade.kill();
		}
    });
});