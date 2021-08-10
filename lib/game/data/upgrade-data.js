ig.module(
	'game.data.upgrade-data'
).defines(function()
{
	UpgradeData = ig.Class.extend({
		getUpgradeFromID: function(id)
		{
			return this[this.upgrades[id]];
		},
		
		getID: function(upgradeName)
		{
			return this.upgrades.indexOf(upgradeName);
		},
		
		getCost: function(upgrade, level)
		{
			var cost = upgrade.cost;
			for(var i = 0; i < level; i++)
			{
				cost += Math.floor(cost*upgrade.upgradeCost/5)*5;
			}
			return cost;
		},
		
		upgrades:[
			"Health",
			"ExtraShield",
			"CriticalAttack",
			"RageAttack",
		],
		
		// upgrade effect
		Health:
		{
			strings: 'Health',
			image: "media/graphics/sprites/ui/upgrade-health.png",
			effectByLevel: [
				{ extraHealing: 1 },
				{ extraMaxHealth: 1 },
				{ extraHealing: 1 },
				{ extraMaxHealth: 1  },
				{ extraHealing: 1 }
			],
			cost: 250,
			upgradeCost: 0.2,
			maxLevel: 5
		},
		ExtraShield:
		{
			strings: 'Shield',
			image: "media/graphics/sprites/ui/upgrade-shield.png",
			effect: { extraShieldTime: 2 },
			cost: 250,
			upgradeCost: 0.2,
			maxLevel: 5
		},
		CriticalAttack:
		{
			strings: 'Critical',
			image: "media/graphics/sprites/ui/upgrade-critical-attack.png",
			effectByLevel: [
				{ extraCritDamage: 1, extraCritChance: 0.05 },
				{ extraCritChance: 0.05 },
				{ extraCritChance: 0.05 },
				{ extraCritChance: 0.05 },
				{ extraCritChance: 0.05 }
			],
			cost: 100,
			upgradeCost: 0.2,
			maxLevel: 5
		},
		RageAttack:{
			strings: 'Rage',
			image: "media/graphics/sprites/ui/upgrade-rage-attack.png",
			effect: { extraRageTime: 3 },
			cost: 150,
			upgradeCost: 0.2,
			maxLevel: 5
		}
	});
});