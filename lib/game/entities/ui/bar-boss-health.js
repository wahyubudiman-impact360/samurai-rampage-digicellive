ig.module('game.entities.ui.bar-boss-health')
.requires(
	'game.entities.ui.bar-enemy-health'
)
.defines(function() {
	EntityBarBossHealth = EntityBarEnemyHealth.extend({
		size: { x: 236, y: 27 },
		img_health: new ig.Image( 'media/graphics/sprites/ui/boss-health-bar.png' ),
		followOwner: false,
		filling: true
	});
});