ig.module('game.entities.effects.effect-enemy-shield')
.requires(
	'game.entities.effects.effect-shield'
)
.defines(function() {
    EntityEffectEnemyShield = EntityEffectShield.extend({
        size: { x:177, y:160 },
		animSheet: new ig.AnimationSheet( 'media/graphics/sprites/effects/enemy-shield.png', 177, 160 ),
        activeScale: 1,
		hitScale: 0.9,
		breakScale: 2
    });
});