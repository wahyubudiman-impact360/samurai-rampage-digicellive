ig.module(
	'game.data.spawn-data'
).defines(function () {
	SpawnData = ig.Class.extend({
		difficulty: 0,
		maxBackgroundRandomCount: 3,

		pickupTypes: [
			'EntityPickupReflect',
			'EntityPickupShield'
		],

		healingItems: [
			'EntityPickupHealing'
		],

		enemyTypes: [
			'EntityEnemy1',
			'EntityEnemy2',
			'EntityEnemy3',
			'EntityEnemy4',
			'EntityEnemy5',
			'EntityBoss1',
			'EntityBoss2',
			'EntityBoss3'
		],

		moveIn: [
			// for jump from bottom during slow motion
			{ velocity: 937, angle: 85, slowout: true, maxVel: { fall: 250 } },

			// jump from bottom
			{ velocity: 930, angle: 85 },
			{ velocity: 910, angle: 80 },
			{ velocity: 900, angle: 75 },
			{ velocity: 900, angle: 70 },

			// for jumping from side
			{ velocity: 750, angle: 65 },
			{ velocity: 750, angle: 60 },
			{ velocity: 675, angle: 50 },
			{ velocity: 675, angle: 45 },

			// for falling from top of screen
			{ velocity: 1, angle: 85 },
			{ velocity: 450, angle: 45 },
			{ velocity: 150, angle: 1 }
		],

		moveOut: [
			// x, y = distance from top-center of screen
			{ velocity: 1375, angle: 45, x: 680, y: 140 },
			{ velocity: 1375, angle: 45, x: 680, y: 240 },
			{ velocity: 1375, angle: 45, x: 580, y: 480 },
			{ velocity: 1375, angle: 35, x: 580, y: 640 },
			{ velocity: 1375, angle: 30, x: 580, y: 740 }
		],

		formationPreset: [
			[100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110],	// easy
			[200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212],	// normal
			[300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318],	// hard
			[302, 303, 400, 401, 402, 403, 404]	// very hard
		],

		// pattern to picking formation preset for each diffuculty
		currentPattern: null,
		patternIndex: 0,
		formationPresetPatterns: [
			[0], // easy
			[0, 1], // normal
			[0, 1, 2, 1, 2],	// hard
			[0, 1, 2, 3, 1, 2, 3]
		],

		bossFormation: [
			900, 901, 902
		],
		bossIndex: 0,

		setDifficulty: function (difficulty) {
			if (difficulty < this.formationPresetPatterns.length && this.currentPattern != this.formationPresetPatterns[difficulty]) {
				this.currentPattern = this.formationPresetPatterns[difficulty];
				this.patternIndex = 0;
			}

			this.difficulty = difficulty;
			switch (difficulty) {
				case 0: // easy
					this.shuffleDelayRange = 0.3;
					this.minShuffleMoveDelay = 0.4;
					this.delayScaleRange = 0.1;
					this.minDelayScale = 1;
					this.attackDelayScale = 1;
					this.healthScale = 1;
					break;
				case 1: // normal
					this.shuffleDelayRange = 0.3;
					this.minShuffleMoveDelay = 0.35;
					this.delayScaleRange = 0.175;
					this.minDelayScale = 0.925;
					this.attackDelayScale = 0.95;
					this.healthScale = 1;
					break;
				case 2: // hard
					this.shuffleDelayRange = 0.3;
					this.minShuffleMoveDelay = 0.325;
					this.delayScaleRange = 0.15;
					this.minDelayScale = 0.85;
					this.attackDelayScale = 0.9;
					this.healthScale = 1;
					break;
				case 3: // max
					this.shuffleDelayRange = 0.3;
					this.minShuffleMoveDelay = 0.3;
					this.delayScaleRange = 0.2;
					this.minDelayScale = 0.8;
					this.attackDelayScale = 0.85;
					this.healthScale = 1;
					break;
				default:
					this.shuffleDelayRange = 0.3;
					this.minShuffleMoveDelay = 0.4;
					this.delayScaleRange = 0.2;
					this.minDelayScale = 0.8 - (this.difficulty - 4) * 0.03;
					this.attackDelayScale = 0.8 - (this.difficulty - 4) * 0.025;
					this.healthScale = 1 + (this.difficulty - 4) * 0.05;
					break;
			}
		},

		adjustFormationDifficulty: function (formation) {
			var entities = formation.entities;
			for (var i = 0; i < entities.length; i++) {
				entities[i].moveDelayScale = formation.randomDelay ? (this.minDelayScale + Math.random() * this.delayScaleRange) : (this.minDelayScale + this.delayScaleRange);
				entities[i].attackDelayScale = this.attackDelayScale;
				entities[i].healthScale = this.healthScale;
			}

			if (formation.slowMotionDelay)
				formation.slowMotionDelay -= entities[0].moveDelay - entities[0].moveDelay * entities[0].moveDelayScale;
		},

		shuffleFormation: function (formation) {
			var entities = formation.entities;
			// shuffle an entity array
			for (var i = entities.length - 1; i > 0; i--) {
				var j = Math.floor(Math.random() * (i + 1));
				var temp = entities[i];
				entities[i] = entities[j];
				entities[j] = temp;
			}

			// setup entity move delay
			var baseDelay = formation.moveDelay || 0;
			for (var i = 0; i < entities.length; i++) {
				entities[i].moveDelay = baseDelay + i * (Math.random() * this.shuffleDelayRange + this.minShuffleMoveDelay);
			}

			// if(formation.slowMotionDelay)
			//	formation.slowMotionDelay += entities[entities.length - 1].settings.moveDelay;

			// setup entity warning timer
			/*
			var timerDelay = formation.slowMotionDelay - entities[0].settings.moveDelay;
			for(var i = 0; i < entities.length; i++)
			{
				entities[i].settings.entry.attackTimerDelay += timerDelay;
			}
			*/
		},

		flipFormation: function (formation) {
			var center = ig.system.width * 0.5;
			for (var i = 0; i < formation.entities.length; i++) {
				var entity = formation.entities[i];
				entity.x = (entity.x < center) ? center + (center - entity.x) : center - (entity.x - center);
			}
		},

		addPickupToFormation: function (formation, itemIndex) {
			var entities = formation.entities;
			var entityIndex = Math.floor(Math.random() * entities.length);
			if (typeof itemIndex !== 'number' || itemIndex < 0 || itemIndex >= this.pickupTypes.length)
				itemIndex = Math.floor(Math.random() * this.pickupTypes.length);

			entities[entityIndex].giveItem = this.pickupTypes[itemIndex];
		},

		addHealingItemToFormation: function (formation, itemIndex) {
			var entities = formation.entities;
			var entityIndex = Math.floor(Math.random() * entities.length);
			if (typeof itemIndex !== 'number' || itemIndex < 0 || itemIndex >= this.healingItems.length)
				itemIndex = Math.floor(Math.random() * this.healingItems.length);

			entities[entityIndex].giveItem = this.healingItems[itemIndex];
		},

		addShieldToFormation: function (formation) {
			var maxShield = 0;
			var entitiesLength = formation.entities.length;
			switch (this.difficulty) {
				case 0:
					maxShield = Math.round(Math.random() * entitiesLength * 0.33);
					break;
				case 1:
					maxShield = Math.floor(Math.random() * entitiesLength * 0.5) + 1;
					break;
				case 2:
					maxShield = Math.floor(Math.random() * entitiesLength * 0.22 + entitiesLength * 0.33);
				default:
					maxShield = Math.floor(Math.random() * entitiesLength * 0.42 + entitiesLength * 0.33);
					break;
			}

			var indexList = [];
			var entities = formation.entities;
			for (var i = 0; i < entitiesLength; i++) {
				if (!entities[i].ignoreRandomShield)
					indexList.push(i);
			}

			for (var j = 0; j < maxShield; j++) {
				var entityIndex = indexList.splice(Math.floor(Math.random() * indexList.length), 1)[0];
				entities[entityIndex].shielded = true;
			}
		},

		randomEntityTypeInFormation: function (formation) {
			var indexList = [];
			var entities = formation.entities;
			for (var i = 0; i < entities.length; i++) {
				if (entities[i].fixedType !== true)
					indexList.push(i);
			}

			var randomEntityType = formation.randomEntityType;
			for (var j = 0; j < randomEntityType.length; j++) {
				var type = randomEntityType[j];
				while (type.amount > 0) {
					var entityIndex = indexList.splice(Math.floor(Math.random() * indexList.length), 1)[0];
					if (type.type.length > 0) {
						var index = Math.floor(Math.random() * type.type.length);
						entities[entityIndex].type = type.type[index];
					} else {
						entities[entityIndex].type = type.type;
					}
					type.amount--;
				}
			}
		},

		getLevel: function (level) {
			var levelData;
			switch (level) {
				case 0: // tutorial level
					levelData = { difficulty: 1, waveData: [0, 1, 2, 3] };	// difficulty, waveData
					break;
			}
			return levelData;
		},

		getBossFormation: function () {
			var index = this.bossFormation[this.bossIndex];
			var formation = this.getFormation(index);
			this.bossIndex++;
			if (this.bossIndex >= this.bossFormation.length)
				this.bossIndex = 0;

			return formation;
		},

		getRandomFormation: function () {
			var presetIndex = this.currentPattern[this.patternIndex];
			var preset = this.formationPreset[presetIndex];
			var formationIndex = Math.floor(Math.random() * preset.length);
			var formation = this.getFormation(preset[formationIndex]);

			this.patternIndex++;
			if (this.patternIndex >= this.currentPattern.length)
				this.patternIndex = 0;

			// console.log(preset[formationIndex]);
			return formation;
		},

		getFormation: function (index) {
			var formation;
			switch (index) {
				case 0: formation = { // tutorial, 1 enemy_1
					slowMotion: true, slowMotionDelay: 1.5, slowMotionScale: 0.0001,
					entities: [
						{ type: 0, x: 930, y: 650, moveDelay: 1, idleDelay: 0.5, entry: 2, exit: 1, idleTime: 3 }
					]
				};
					break;
				case 1: formation = { // tutorial, 1 enemy_5
					slowMotion: true, slowMotionDelay: 1.5, slowMotionScale: 0.0001,
					entities: [
						{ type: 4, x: 930, y: 660, moveDelay: 1, idleDelay: 0.5, entry: 2, exit: 1, idleTime: 3 }
					]
				};
					break;
				case 2: formation = { // tutorial, 1 enemy_3
					slowMotion: true, slowMotionDelay: 1.5, slowMotionScale: 0.0001,
					entities: [
						{ type: 2, x: 930, y: 680, moveDelay: 1, idleDelay: 0.5, entry: 2, exit: 1, idleTime: 3 }
					]
				};
					break;
				case 3: formation = { // tutorial, 1 enemy_1
					slowMotion: true, slowMotionDelay: 1.5, slowMotionScale: 0.0001,
					entities: [
						{ type: 0, x: 930, y: 650, moveDelay: 1, idleDelay: 0.5, entry: 2, exit: 1, warningTime: 999999, shielded: true, giveItem: 1 }
					]
				};
					break;

				// easy formation
				case 100: formation = { // 2 enemies on one side, 1 on other
					slowMotion: true, slowMotionDelay: 2.2, flippable: true, randomShield: true, randomEntityType: [{ type: [0, 1], amount: 1 }],
					entities: [
						{ type: 0, x: 75, y: 690, moveDelay: 1, idleDelay: 1.2, entry: 2, exit: 1 },
						{ type: 0, x: -25, y: 800, moveDelay: 1.5, idleDelay: 1.2, entry: 2, exit: 2 },
						{ type: 0, x: 885, y: 650, moveDelay: 2, idleDelay: 1.2, entry: 2, exit: 3 }
					]
				};
					break;
				case 101: formation = { // 4 enemies, move in pair
					slowMotion: true, slowMotionDelay: 1.9375, randomShield: true,
					entities: [
						{ type: 0, x: -50, y: 710, moveDelay: 1, idleDelay: 1, entry: 3, exit: 0 },
						{ type: 0, x: 1010, y: 710, moveDelay: 1, idleDelay: 1, entry: 3, exit: 0 },
						{ type: 0, x: 25, y: 860, moveDelay: 1.7, idleDelay: 0.9, entry: 0, exit: 1 },
						{ type: 0, x: 935, y: 860, moveDelay: 1.7, idleDelay: 0.9, entry: 0, exit: 1 }
					]
				};
					break;
				case 102: formation = { // 4 enemies in random order
					slowMotion: true, slowMotionDelay: 1.5, moveDelay: 1, shuffle: true, randomShield: true,
					entities: [
						{ type: 0, x: 50, y: 740, idleDelay: 1, entry: 0, exit: 0 },
						{ type: 0, x: 910, y: 740, idleDelay: 1, entry: 0, exit: 0 },
						{ type: 0, x: 200, y: 840, idleDelay: 1, entry: 0, exit: 1 },
						{ type: 0, x: 760, y: 840, idleDelay: 1, entry: 0, exit: 1 }
					]
				};
					break;
				case 103: formation = { // 3 enemies on one side
					slowMotion: true, slowMotionDelay: 2.1, flippable: true, randomShield: true, randomEntityType: [{ type: [0, 1], amount: 1 }],
					entities: [
						{ type: 0, x: 0, y: 650, moveDelay: 1, idleDelay: 1.3, entry: 3, exit: 0 },
						{ type: 0, x: -25, y: 750, moveDelay: 1.3, idleDelay: 1.3, entry: 3, exit: 1 },
						{ type: 0, x: -50, y: 750, moveDelay: 1.6, idleDelay: 1.3, entry: 3, exit: 2 }
					]
				};
					break;
				case 104: formation = { // 3 enemies on one side
					slowMotion: true, slowMotionDelay: 0.825, flippable: true, randomShield: true, randomEntityType: [{ type: [0, 1], amount: 1 }],
					entities: [
						{ type: 0, x: 25, y: 710, moveDelay: 0, idleDelay: 1, entry: 1, exit: 1 },
						{ type: 0, x: 150, y: 760, moveDelay: 0.2, idleDelay: 1, entry: 1, exit: 2 },
						{ type: 0, x: 275, y: 770, moveDelay: 0.4, idleDelay: 1, entry: 1, exit: 3 }
					]
				};
					break;
				case 105: formation = { // 3 enemies on one side dropping from top
					slowMotion: true, slowMotionDelay: 1.5, flippable: true, randomShield: true, randomEntityType: [{ type: [0, 1], amount: 1 }],
					entities: [
						{ type: 0, x: -50, y: -100, moveDelay: 0.3, idleDelay: 1.4, entry: 11, exit: 1 },
						{ type: 0, x: 150, y: -100, moveDelay: 0.5, idleDelay: 1.4, entry: 11, exit: 2 },
						{ type: 0, x: 62, y: -100, moveDelay: 0.7, idleDelay: 1.4, entry: 11, exit: 3 }
					]
				};
					break;
				case 106: formation = { // 2 enemy_1 and 2 enemy_2, moving at the same time from side
					slowMotion: true, slowMotionDelay: 1, randomEntityType: [{ type: 1, amount: 2 }], randomShield: true,
					entities: [
						{ type: 0, x: -150, y: 370, moveDelay: 0.5, idleDelay: 0.7, entry: 7, exit: 1 },
						{ type: 0, x: 1110, y: 370, moveDelay: 0.5, idleDelay: 0.7, entry: 7, exit: 1 },
						{ type: 0, x: -200, y: 550, moveDelay: 0.5, idleDelay: 0.7, entry: 7, exit: 2 },
						{ type: 0, x: 1160, y: 550, moveDelay: 0.5, idleDelay: 0.7, entry: 7, exit: 2 }
					]
				};
					break;
				case 107: formation = { // 2 enemies on one side, 1 big enemy on other
					slowMotion: true, slowMotionDelay: 2.2, flippable: true, randomEntityType: [{ type: [2, 3, 4], amount: 1 }],
					entities: [
						{ type: 0, x: 50, y: 710, moveDelay: 1, idleDelay: 1.2, entry: 2, exit: 1, fixedType: true },
						{ type: 0, x: -25, y: 800, moveDelay: 1.5, idleDelay: 1.2, entry: 2, exit: 3, fixedType: true },
						{ type: 2, x: 885, y: 830, moveDelay: 2, idleDelay: 1.2, entry: 0, exit: 2 }
					]
				};
					break;
				case 108: formation = { // 3 small enemies and 1 big enemy in random order
					slowMotion: true, slowMotionDelay: 1.5, moveDelay: 1, shuffle: true, randomEntityType: [{ type: [2, 3, 4], amount: 1 }],
					entities: [
						{ type: 2, x: 50, y: 740, idleDelay: 1, entry: 0, exit: 0 },
						{ type: 0, x: 910, y: 740, idleDelay: 1, entry: 0, exit: 0, fixedType: true },
						{ type: 0, x: 200, y: 840, idleDelay: 1, entry: 0, exit: 1, fixedType: true },
						{ type: 0, x: 760, y: 840, idleDelay: 1, entry: 0, exit: 1, fixedType: true }
					]
				};
					break;
				case 109: formation = { // 2 small enemies from top, 1 big enemy
					slowMotion: true, slowMotionDelay: 1.3, flippable: true, randomShield: true, randomEntityType: [{ type: [2, 3, 4], amount: 1 }],
					entities: [
						{ type: 2, x: 960, y: 770, moveDelay: 0.1, idleDelay: 1.2, entry: 2, exit: 2, ignoreRandomShield: true },
						{ type: 0, x: -50, y: -100, moveDelay: 0.3, idleDelay: 1.4, entry: 11, exit: 1, fixedType: true },
						{ type: 0, x: 125, y: -100, moveDelay: 0.5, idleDelay: 1.4, entry: 11, exit: 2, fixedType: true }
					]
				};
					break;
				case 110: formation = { // 2 small enemyies and 1 big enemy
					slowMotion: true, slowMotionDelay: 1.3, randomEntityType: [{ type: 1, amount: 1 }], randomShield: true,
					entities: [
						{ type: 0, x: -120, y: 450, moveDelay: 0.5, idleDelay: 0.7, entry: 6, exit: 1 },
						{ type: 0, x: -150, y: 550, moveDelay: 0.7, idleDelay: 0.7, entry: 7, exit: 2 },
						{ type: 4, x: 1110, y: 550, moveDelay: 0.5, idleDelay: 0.7, entry: 5, exit: 2, fixedType: true, ignoreRandomShield: true }
					]
				};
					break;

				// normal difficulty
				case 200: formation = { // 4 enemies, move in pair from both side, all shielded
					slowMotion: true, slowMotionDelay: 1.9375,
					entities: [
						{ type: 0, x: -50, y: 710, moveDelay: 1, idleDelay: 1, entry: 3, exit: 0, shielded: true },
						{ type: 0, x: 1010, y: 710, moveDelay: 1, idleDelay: 1, entry: 3, exit: 0, shielded: true },
						{ type: 0, x: 25, y: 860, moveDelay: 1.7, idleDelay: 0.9, entry: 0, exit: 1, shielded: true },
						{ type: 0, x: 935, y: 860, moveDelay: 1.7, idleDelay: 0.9, entry: 0, exit: 1, shielded: true }
					]
				};
					break;
				case 201: formation = { // 6 enemies move in pair from both side
					slowMotion: true, slowMotionDelay: 2.05, randomShield: true, randomEntityType: [{ type: [0, 1], amount: 3 }],
					entities: [
						{ type: 0, x: 100, y: 695, moveDelay: 1, idleDelay: 1.1, entry: 2, exit: 0 },
						{ type: 0, x: 860, y: 695, moveDelay: 1, idleDelay: 1.1, entry: 2, exit: 0 },
						{ type: 0, x: 40, y: 720, moveDelay: 1.375, idleDelay: 1.1, entry: 1, exit: 1 },
						{ type: 0, x: 920, y: 720, moveDelay: 1.375, idleDelay: 1.1, entry: 1, exit: 1 },
						{ type: 0, x: 80, y: 730, moveDelay: 1.75, idleDelay: 1.1, entry: 3, exit: 2 },
						{ type: 0, x: 880, y: 730, moveDelay: 1.75, idleDelay: 1.1, entry: 3, exit: 2 }
					]
				};
					break;
				case 202: formation = { // 6 enemies in random order
					slowMotion: true, slowMotionDelay: 1.5, moveDelay: 1, shuffle: true, randomShield: true, randomEntityType: [{ type: [0, 1], amount: 3 }],
					entities: [
						{ type: 0, x: 0, y: 825, idleDelay: 2, entry: 0, exit: 0 },
						{ type: 0, x: 960, y: 825, idleDelay: 2, entry: 0, exit: 0 },
						{ type: 0, x: 225, y: 750, idleDelay: 2, entry: 0, exit: 1 },
						{ type: 0, x: 735, y: 750, idleDelay: 2, entry: 0, exit: 1 },
						{ type: 0, x: 113, y: 787, idleDelay: 2, entry: 0, exit: 2 },
						{ type: 0, x: 847, y: 787, idleDelay: 2, entry: 0, exit: 2 },
					]
				};
					break;
				case 203: formation = { // 5 enemies
					slowMotion: true, slowMotionDelay: 1.95, randomShield: true, randomEntityType: [{ type: [0, 1], amount: 3 }], flippable: true,
					entities: [
						{ type: 0, x: 100, y: 695, moveDelay: 1, idleDelay: 1.1, entry: 2, exit: 0 },
						{ type: 0, x: 40, y: 720, moveDelay: 1.375, idleDelay: 1.1, entry: 1, exit: 1 },
						{ type: 0, x: 150, y: 850, moveDelay: 1.75, idleDelay: 1.1, entry: 0, exit: 2 },
						{ type: 0, x: 930, y: 820, moveDelay: 2, idleDelay: 1.1, entry: 0, exit: 1 },
						{ type: 0, x: 800, y: 730, moveDelay: 2.2, idleDelay: 1.1, entry: 0, exit: 2 },
					]
				};
					break;
				case 204: formation = { // 6 enemies moving in pair, shield in the back
					slowMotion: true, slowMotionDelay: 2.425, flippable: true,
					entities: [
						{ type: 0, x: 100, y: 840, moveDelay: 1, idleDelay: 1.2, entry: 1, exit: 0, shielded: true },
						{ type: 0, x: 860, y: 840, moveDelay: 1, idleDelay: 1.2, entry: 1, exit: 0, shielded: true },
						{ type: 0, x: 1060, y: 640, moveDelay: 1.4, idleDelay: 1.2, entry: 4, exit: 1 },
						{ type: 0, x: 1160, y: 640, moveDelay: 1.5, idleDelay: 1.2, entry: 4, exit: 1 },
						{ type: 0, x: -100, y: 480, moveDelay: 1.7, idleDelay: 1.2, entry: 6, exit: 2 },
						{ type: 0, x: -200, y: 480, moveDelay: 1.8, idleDelay: 1.2, entry: 6, exit: 2, shielded: true }
					]
				};
					break;
				case 205: formation = { // 6 enemies - 3 on each side, 2 enemies in front have shield
					slowMotion: true, slowMotionDelay: 2.05,
					entities: [
						{ type: 1, x: 100, y: 780, moveDelay: 1, idleDelay: 1, entry: 2, exit: 2, shielded: true },
						{ type: 1, x: 860, y: 780, moveDelay: 1, idleDelay: 1, entry: 2, exit: 2, shielded: true },
						{ type: 0, x: 0, y: 820, moveDelay: 1.4, idleDelay: 1.1, entry: 2, exit: 3 },
						{ type: 0, x: 960, y: 820, moveDelay: 1.4, idleDelay: 1.1, entry: 2, exit: 2 },
						{ type: 0, x: -125, y: 330, moveDelay: 1.8, idleDelay: 1.2, entry: 8, exit: 1 },
						{ type: 0, x: 1085, y: 330, moveDelay: 1.8, idleDelay: 1.2, entry: 8, exit: 1 }
					]
				};
					break;
				case 206: formation = { // 4 shielded enemies in random order
					slowMotion: true, slowMotionDelay: 1.5, moveDelay: 1, shuffle: true,
					entities: [
						{ type: 0, x: 50, y: 740, idleDelay: 1, entry: 0, exit: 0, shielded: true },
						{ type: 0, x: 910, y: 740, idleDelay: 1, entry: 0, exit: 0, shielded: true },
						{ type: 0, x: 200, y: 840, idleDelay: 1, entry: 0, exit: 1, shielded: true },
						{ type: 0, x: 760, y: 840, idleDelay: 1, entry: 0, exit: 1, shielded: true }
					]
				};
					break;
				case 207: formation = { // 6 enemies moving at the same time no shield
					slowMotion: true, slowMotionDelay: 1.4,
					entities: [
						{ type: 0, x: -150, y: 340, moveDelay: 1, idleDelay: 1, entry: 7, exit: 1 },
						{ type: 0, x: 1110, y: 340, moveDelay: 1, idleDelay: 1, entry: 7, exit: 1 },
						{ type: 0, x: -150, y: 440, moveDelay: 1.075, idleDelay: 1, entry: 7, exit: 2 },
						{ type: 0, x: 1110, y: 440, moveDelay: 1.075, idleDelay: 1, entry: 7, exit: 2 },
						{ type: 0, x: -150, y: 540, moveDelay: 1, idleDelay: 1, entry: 8, exit: 3 },
						{ type: 0, x: 1110, y: 540, moveDelay: 1, idleDelay: 1, entry: 8, exit: 3 }
					]
				};
					break;
				case 208: formation = { // 6 enemies moving at the same time in / \ shape
					slowMotion: true, slowMotionDelay: 1.025, randomEntityType: [{ type: 1, amount: 2 }], randomShield: true,
					entities: [
						{ type: 0, x: 250, y: 680, moveDelay: 0.5, idleDelay: 0.8, entry: 1, exit: 1 },
						{ type: 0, x: 150, y: 660, moveDelay: 0.7, idleDelay: 0.8, entry: 1, exit: 2 },
						{ type: 0, x: 50, y: 640, moveDelay: 0.9, idleDelay: 0.8, entry: 1, exit: 2 },
						{ type: 0, x: 710, y: 680, moveDelay: 0.5, idleDelay: 0.8, entry: 1, exit: 1 },
						{ type: 0, x: 810, y: 660, moveDelay: 0.7, idleDelay: 0.8, entry: 1, exit: 2 },
						{ type: 0, x: 910, y: 640, moveDelay: 0.9, idleDelay: 0.8, entry: 1, exit: 2 }
					]
				};
					break;
				case 209: formation = { // 6 enemies moving at the same time in \ / shape
					slowMotion: true, slowMotionDelay: 1.025, randomEntityType: [{ type: 1, amount: 2 }],
					entities: [
						{ type: 0, x: 50, y: 680, moveDelay: 0.5, idleDelay: 0.8, entry: 1, exit: 1 },
						{ type: 0, x: 150, y: 660, moveDelay: 0.7, idleDelay: 0.8, entry: 1, exit: 2 },
						{ type: 0, x: 250, y: 640, moveDelay: 0.9, idleDelay: 0.8, entry: 1, exit: 2 },
						{ type: 0, x: 910, y: 680, moveDelay: 0.5, idleDelay: 0.8, entry: 1, exit: 1 },
						{ type: 0, x: 810, y: 660, moveDelay: 0.7, idleDelay: 0.8, entry: 1, exit: 2 },
						{ type: 0, x: 710, y: 640, moveDelay: 0.9, idleDelay: 0.8, entry: 1, exit: 2 }
					]
				};
					break;
				case 210: formation = { // 4 enemies moving at the same time, has 2 enemy_2 and random shield
					slowMotion: true, slowMotionDelay: 0.875, randomShield: true, randomEntityType: [{ type: 1, amount: 2 }],
					entities: [
						{ type: 0, x: -75, y: 600, moveDelay: 0.5, idleDelay: 0.825, entry: 4, exit: 1 },
						{ type: 0, x: 25, y: 650, moveDelay: 0.5, idleDelay: 0.825, entry: 5, exit: 2 },
						{ type: 0, x: 1035, y: 600, moveDelay: 0.5, idleDelay: 0.825, entry: 4, exit: 1 },
						{ type: 0, x: 935, y: 650, moveDelay: 0.5, idleDelay: 0.825, entry: 5, exit: 2 }
					]
				};
					break;
				case 211: formation = { // 6 enemies moving in pair
					slowMotion: true, slowMotionDelay: 2.05, randomShield: true, randomEntityType: [{ type: [0, 1], amount: 3 }],
					entities: [
						{ type: 0, x: 100, y: 695, moveDelay: 1, idleDelay: 1.1, entry: 2, exit: 0 },
						{ type: 0, x: 860, y: 695, moveDelay: 1, idleDelay: 1.1, entry: 2, exit: 0 },
						{ type: 0, x: 40, y: 720, moveDelay: 1.375, idleDelay: 1.1, entry: 1, exit: 1 },
						{ type: 0, x: 920, y: 720, moveDelay: 1.375, idleDelay: 1.1, entry: 1, exit: 1 },
						{ type: 0, x: 80, y: 730, moveDelay: 1.75, idleDelay: 1.1, entry: 3, exit: 2 },
						{ type: 0, x: 880, y: 730, moveDelay: 1.75, idleDelay: 1.1, entry: 3, exit: 2 }
					]
				};
					break;
				case 212: formation = { // 2 big enemy
					slowMotion: true, slowMotionDelay: 1.6, flippable: true, randomEntityType: [{ type: [2, 3, 4], amount: 2 }],
					entities: [
						{ type: 2, x: -150, y: 550, moveDelay: 1, idleDelay: 1.2, entry: 6, exit: 2 },
						{ type: 2, x: 1110, y: 550, moveDelay: 1, idleDelay: 1.2, entry: 6, exit: 2 }
					]
				};
					break;
				case 213: formation = { // 3 small enemies and 1 big enemy on other side
					slowMotion: true, slowMotionDelay: 1.975, flippable: true, randomShield: true, randomEntityType: [{ type: [2, 3, 4], amount: 1 }],
					entities: [
						{ type: 0, x: -150, y: 550, moveDelay: 1, idleDelay: 1.2, entry: 6, exit: 1, fixedType: true },
						{ type: 0, x: -150, y: 450, moveDelay: 1.3, idleDelay: 1.2, entry: 6, exit: 2, fixedType: true },
						{ type: 0, x: -100, y: 625, moveDelay: 1.6, idleDelay: 1.2, entry: 6, exit: 3, fixedType: true },
						{ type: 2, x: 1110, y: 550, moveDelay: 1.375, idleDelay: 1.2, entry: 6, exit: 2, ignoreRandomShield: true }
					]
				};
					break;
				case 214: formation = { // 2 enemies on one side, 1 on other with big enemy
					slowMotion: true, slowMotionDelay: 2.2, flippable: true, randomShield: true, randomEntityType: [{ type: [0, 1], amount: 1 }, { type: [2, 3, 4], amount: 1 }],
					entities: [
						{ type: 0, x: 75, y: 690, moveDelay: 1, idleDelay: 1.2, entry: 2, exit: 1 },
						{ type: 0, x: 0, y: 800, moveDelay: 1.25, idleDelay: 1.2, entry: 2, exit: 2 },
						{ type: 0, x: 885, y: 690, moveDelay: 1.5, idleDelay: 1.2, entry: 2, exit: 1 },
						{ type: 0, x: 960, y: 800, moveDelay: 1.6, idleDelay: 1.2, entry: 2, exit: 2 },
					]
				};
					break;
				case 215: formation = { // 3 small enemies and 1 big enemy in random order
					slowMotion: true, slowMotionDelay: 1.5, moveDelay: 1, shuffle: true, randomShield: true, randomEntityType: [{ type: [2, 3, 4], amount: 1 }],
					entities: [
						{ type: 0, x: 50, y: 740, idleDelay: 1, entry: 0, exit: 0 },
						{ type: 0, x: 910, y: 740, idleDelay: 1, entry: 0, exit: 0 },
						{ type: 0, x: 200, y: 840, idleDelay: 1, entry: 0, exit: 1 },
						{ type: 0, x: 760, y: 840, idleDelay: 1, entry: 0, exit: 1 }
					]
				};
					break;
				case 216: formation = { // 3 enemies on one side dropping from top, 1 big enemy on other side
					slowMotion: true, slowMotionDelay: 1.5, flippable: true, randomShield: true, randomEntityType: [{ type: [2, 3, 4], amount: 1 }],
					entities: [
						{ type: 0, x: -50, y: -120, moveDelay: 0.3, idleDelay: 1.4, entry: 11, exit: 1, fixedType: true },
						{ type: 0, x: 150, y: -100, moveDelay: 0.5, idleDelay: 1.4, entry: 11, exit: 2, fixedType: true },
						{ type: 0, x: 62, y: -100, moveDelay: 0.7, idleDelay: 1.4, entry: 11, exit: 3, fixedType: true },
						{ type: 0, x: 760, y: 840, moveDelay: 1.2, idleDelay: 1, entry: 0, exit: 1 }
					]
				};
					break;
				case 217: formation = { // 3 small enemies at the same time, 1 big enemy
					slowMotion: true, slowMotionDelay: 0.825, flippable: true, randomShield: true, randomEntityType: [{ type: [2, 3, 4], amount: 1 }],
					entities: [
						{ type: 0, x: 25, y: 710, moveDelay: 0, idleDelay: 1, entry: 1, exit: 1, fixedType: true },
						{ type: 0, x: 150, y: 760, moveDelay: 0.2, idleDelay: 1, entry: 1, exit: 2, fixedType: true },
						{ type: 0, x: 275, y: 770, moveDelay: 0.4, idleDelay: 1, entry: 1, exit: 3, fixedType: true },
						{ type: 0, x: 860, y: 770, moveDelay: 0.6, idleDelay: 1, entry: 0, exit: 3 }
					]
				};
					break;
				case 218: formation = { // 2 small enemies and 1 big enemy at the same time
					slowMotion: true, slowMotionDelay: 1.6, randomEntityType: [{ type: [2, 3, 4], amount: 1 }], randomShield: true,
					entities: [
						{ type: 1, x: -100, y: 630, moveDelay: 0.5, idleDelay: 1, entry: 4, exit: 1, fixedType: true },
						{ type: 0, x: -150, y: 780, moveDelay: 0.75, idleDelay: 1, entry: 4, exit: 2, fixedType: true },
						{ type: 0, x: 1110, y: 550, moveDelay: 0.9, idleDelay: 0.7, entry: 6, exit: 2 }
					]
				};
					break;
				case 219: formation = { // 3 enemies and 1 big enemy on other side
					slowMotion: true, slowMotionDelay: 2.05, randomShield: true, randomEntityType: [{ type: [2, 3, 4], amount: 1 }],
					entities: [
						{ type: 0, x: 100, y: 695, moveDelay: 1, idleDelay: 1.1, entry: 2, exit: 0, fixedType: true },
						{ type: 1, x: 40, y: 720, moveDelay: 1.375, idleDelay: 1.1, entry: 1, exit: 1, fixedType: true },
						{ type: 0, x: 80, y: 695, moveDelay: 1.75, idleDelay: 1.1, entry: 3, exit: 2, fixedType: true },
						{ type: 0, x: 960, y: 730, moveDelay: 1.375, idleDelay: 1.1, entry: 3, exit: 2 }
					]
				};
					break;

				// hard difficulty
				case 300: formation = { // 6 enemies with shield move in pair - hard
					slowMotion: true, slowMotionDelay: 2.125, randomEntityType: [{ type: 1, amount: 2 }],
					entities: [
						{ type: 0, x: 100, y: 690, moveDelay: 1, idleDelay: 1.225, entry: 2, exit: 1, shielded: true },
						{ type: 0, x: 860, y: 690, moveDelay: 1, idleDelay: 1.225, entry: 2, exit: 1, shielded: true },
						{ type: 0, x: 40, y: 690, moveDelay: 1.6, idleDelay: 1.225, entry: 1, exit: 1, shielded: true },
						{ type: 0, x: 920, y: 690, moveDelay: 1.6, idleDelay: 1.225, entry: 1, exit: 1, shielded: true },
						{ type: 0, x: 170, y: 920, moveDelay: 1.7, idleDelay: 1.825, entry: 0, exit: 2, shielded: true },
						{ type: 0, x: 790, y: 920, moveDelay: 1.7, idleDelay: 1.825, entry: 0, exit: 2, shielded: true }
					]
				};
					break;
				case 301: formation = { // 8 enemies in random order, random shield 
					slowMotion: true, slowMotionDelay: 2.025, randomShield: true, flippable: true, randomEntityType: [{ type: 1, amount: 4 }],
					entities: [
						{ type: 0, x: 50, y: 740, moveDelay: 1, idleDelay: 1.225, entry: 0, exit: 0 },
						{ type: 0, x: 910, y: 740, moveDelay: 1.5, idleDelay: 1.225, entry: 0, exit: 0 },
						{ type: 0, x: 200, y: 840, moveDelay: 2, idleDelay: 1.825, entry: 0, exit: 1 },
						{ type: 0, x: 760, y: 840, moveDelay: 2.5, idleDelay: 1.825, entry: 0, exit: 1 },
						{ type: 0, x: 0, y: 890, moveDelay: 3, idleDelay: 1.825, entry: 0, exit: 0 },
						{ type: 0, x: 960, y: 890, moveDelay: 3.5, idleDelay: 1.825, entry: 0, exit: 0 },
						{ type: 0, x: 150, y: 940, moveDelay: 4, idleDelay: 1.825, entry: 0, exit: 1 },
						{ type: 0, x: 810, y: 940, moveDelay: 4.5, idleDelay: 1.825, entry: 0, exit: 1 }
					]
				};
					break;
				case 302: formation = { // 8 enemies with random shield move in pair
					slowMotion: true, slowMotionDelay: 2.125, randomShield: true, randomEntityType: [{ type: 1, amount: 4 }],
					entities: [
						{ type: 0, x: 100, y: 690, moveDelay: 1, idleDelay: 1.225, entry: 2, exit: 1 },
						{ type: 0, x: 860, y: 690, moveDelay: 1, idleDelay: 1.225, entry: 2, exit: 1 },
						{ type: 0, x: 40, y: 690, moveDelay: 1.6, idleDelay: 1.225, entry: 1, exit: 1 },
						{ type: 0, x: 920, y: 690, moveDelay: 1.6, idleDelay: 1.225, entry: 1, exit: 1 },
						{ type: 0, x: 120, y: 850, moveDelay: 1.7, idleDelay: 1.825, entry: 0, exit: 2 },
						{ type: 0, x: 840, y: 850, moveDelay: 1.7, idleDelay: 1.825, entry: 0, exit: 2 },
						{ type: 0, x: 20, y: 920, moveDelay: 2.3, idleDelay: 1.825, entry: 0, exit: 2 },
						{ type: 0, x: 940, y: 920, moveDelay: 2.3, idleDelay: 1.825, entry: 0, exit: 2 }
					]
				};
					break;
				case 303: formation = { // 8 enemies with random shield move in pair
					slowMotion: true, slowMotionDelay: 2.125, randomShield: true, randomEntityType: [{ type: 1, amount: 4 }],
					entities: [
						{ type: 0, x: -100, y: 640, moveDelay: 1, idleDelay: 1.225, entry: 4, exit: 1 },
						{ type: 0, x: 1060, y: 640, moveDelay: 1, idleDelay: 1.225, entry: 4, exit: 1 },
						{ type: 0, x: -150, y: 640, moveDelay: 1.3, idleDelay: 1.225, entry: 4, exit: 1 },
						{ type: 0, x: 1110, y: 640, moveDelay: 1.3, idleDelay: 1.225, entry: 4, exit: 1 },
						{ type: 0, x: 170, y: 920, moveDelay: 1.9, idleDelay: 1.825, entry: 0, exit: 2 },
						{ type: 0, x: 790, y: 920, moveDelay: 1.9, idleDelay: 1.825, entry: 0, exit: 2 },
						{ type: 0, x: 70, y: 930, moveDelay: 2.2, idleDelay: 1.825, entry: 0, exit: 2 },
						{ type: 0, x: 890, y: 930, moveDelay: 2.2, idleDelay: 1.825, entry: 0, exit: 2 }
					]
				};
					break;
				case 304: formation = { // 8 enemies at the same time
					slowMotion: true, slowMotionDelay: 1.125, randomShield: true, shuffle: true, randomEntityType: [{ type: 1, amount: 4 }],
					entities: [
						{ type: 0, x: 250, y: 760, idleDelay: 1.225, entry: 0, exit: 1 },
						{ type: 0, x: 710, y: 760, idleDelay: 1.225, entry: 0, exit: 1 },
						{ type: 0, x: 150, y: 860, idleDelay: 1.225, entry: 0, exit: 2 },
						{ type: 0, x: 810, y: 860, idleDelay: 1.225, entry: 0, exit: 2 },
						{ type: 0, x: 50, y: 760, idleDelay: 1.225, entry: 0, exit: 1 },
						{ type: 0, x: 910, y: 760, idleDelay: 1.225, entry: 0, exit: 1 },
						{ type: 0, x: -25, y: 860, idleDelay: 1.225, entry: 0, exit: 2 },
						{ type: 0, x: 985, y: 860, idleDelay: 1.225, entry: 0, exit: 2 }
					]
				};
					break;
				case 305: formation = { // 4 enemy_2 with shield and 2 enemy_1, moving in pair
					slowMotion: true, slowMotionDelay: 2.125,
					entities: [
						{ type: 1, x: 50, y: 690, moveDelay: 1, idleDelay: 1.225, entry: 2, exit: 1, shielded: true },
						{ type: 1, x: 910, y: 690, moveDelay: 1, idleDelay: 1.225, entry: 2, exit: 1, shielded: true },
						{ type: 1, x: 25, y: 690, moveDelay: 1.6, idleDelay: 1.225, entry: 1, exit: 1, shielded: true },
						{ type: 1, x: 935, y: 690, moveDelay: 1.6, idleDelay: 1.225, entry: 1, exit: 1, shielded: true },
						{ type: 0, x: 50, y: 900, moveDelay: 1.7, idleDelay: 1.825, entry: 0, exit: 2 },
						{ type: 0, x: 910, y: 900, moveDelay: 1.7, idleDelay: 1.825, entry: 0, exit: 2 }
					]
				};
					break;
				// need rework
				/*
				case 307: formation = {	// 8 enemies at the same time in < > shape - hard
					slowMotion: true, slowMotionDelay: 1.9,
					entities:[
						{ type: 0, x: -150, y: 640, moveDelay: 1, idleDelay: 0.975, entry: 4, exit: 0 },
						{ type: 0, x: -225, y: 720, moveDelay: 1, idleDelay: 0.975, entry: 4, exit: 0 },
						{ type: 0, x: -225, y: 800, moveDelay: 1, idleDelay: 0.975, entry: 4, exit: 1 },
						{ type: 0, x: -150, y: 880, moveDelay: 1, idleDelay: 0.975, entry: 4, exit: 1 },
						{ type: 0, x: 1110, y: 640, moveDelay: 1, idleDelay: 0.975, entry: 4, exit: 2 },
						{ type: 0, x: 1185, y: 720, moveDelay: 1, idleDelay: 0.975, entry: 4, exit: 2 },
						{ type: 0, x: 1185, y: 800, moveDelay: 1, idleDelay: 0.975, entry: 4, exit: 3 },
						{ type: 0, x: 1110, y: 880, moveDelay: 1, idleDelay: 0.975, entry: 4, exit: 3 }
					]
				};
				break;
				*/
				case 306: formation = { // 3 enemy_1 on one side, enemy_2 with shield on other side, 1 big enemy
					slowMotion: true, slowMotionDelay: 1.025, randomEntityType: [{ type: [2, 3, 4], amount: 1 }],
					entities: [
						{ type: 0, x: 250, y: 640, moveDelay: 0.5, idleDelay: 0.6, entry: 1, exit: 1, fixedType: true },
						{ type: 0, x: 150, y: 640, moveDelay: 0.7, idleDelay: 0.6, entry: 1, exit: 1, fixedType: true },
						{ type: 0, x: 50, y: 640, moveDelay: 0.9, idleDelay: 0.6, entry: 1, exit: 2, fixedType: true },
						{ type: 1, x: 760, y: 690, moveDelay: 0.5, idleDelay: 0.6, entry: 1, exit: 2, fixedType: true, shielded: true },
						{ type: 2, x: 900, y: 740, moveDelay: 0.7, idleDelay: 0.6, entry: 1, exit: 2 },
					]
				};
					break;
				case 307: formation = { // 2 small enemies and 2 big enemies
					slowMotion: true, slowMotionDelay: 2.2, flippable: true, randomShield: true, randomEntityType: [{ type: [0, 1], amount: 1 }, { type: [2, 3, 4], amount: 2 }],
					entities: [
						{ type: 0, x: 75, y: 690, moveDelay: 1, idleDelay: 1.2, entry: 2, exit: 1 },
						{ type: 0, x: -25, y: 800, moveDelay: 1.25, idleDelay: 1.2, entry: 2, exit: 2 },
						{ type: 0, x: 885, y: 690, moveDelay: 1.5, idleDelay: 1.2, entry: 2, exit: 1 },
						{ type: 0, x: 985, y: 800, moveDelay: 1.6, idleDelay: 1.2, entry: 2, exit: 2 },
					]
				};
					break;
				case 308: formation = { // 3 small enemies 1 big enemy, move in pair, all shielded
					slowMotion: true, slowMotionDelay: 1.9375, flippable: true, randomEntityType: [{ type: [2, 3, 4], amount: 1 }],
					entities: [
						{ type: 0, x: -50, y: 680, moveDelay: 1, idleDelay: 1, entry: 3, exit: 0, shielded: true, fixedType: true },
						{ type: 0, x: 1010, y: 680, moveDelay: 1, idleDelay: 1, entry: 3, exit: 0, shielded: true, },
						{ type: 0, x: 25, y: 840, moveDelay: 1.7, idleDelay: 0.9, entry: 0, exit: 1, shielded: true, fixedType: true },
						{ type: 0, x: 935, y: 840, moveDelay: 1.7, idleDelay: 0.9, entry: 0, exit: 1, shielded: true, fixedType: true }
					]
				};
					break;
				case 309: formation = { // 3 enemies with shield and 1 big enemy
					slowMotion: true, slowMotionDelay: 2.125, flippable: true, randomEntityType: [{ type: [2, 3, 4], amount: 1 }],
					entities: [
						{ type: 0, x: 100, y: 690, moveDelay: 1, idleDelay: 1.225, entry: 2, exit: 1, shielded: true, fixedType: true },
						{ type: 0, x: 40, y: 690, moveDelay: 1.6, idleDelay: 1.225, entry: 1, exit: 1, shielded: true, fixedType: true },
						{ type: 0, x: 170, y: 920, moveDelay: 1.7, idleDelay: 1.825, entry: 0, exit: 2, shielded: true, fixedType: true },
						{ type: 0, x: 960, y: 740, moveDelay: 1.6, idleDelay: 1.225, entry: 2, exit: 1 }
					]
				};
					break;
				case 310: formation = { // 4 small enemies and 2 big enemies
					slowMotion: true, slowMotionDelay: 2.025, randomShield: true, flippable: true, randomEntityType: [{ type: [2, 3, 4], amount: 2 }],
					entities: [
						{ type: 0, x: 50, y: 740, moveDelay: 1, idleDelay: 1.225, entry: 0, exit: 0, fixedType: true },
						{ type: 0, x: 910, y: 740, moveDelay: 1.5, idleDelay: 1.225, entry: 0, exit: 0, fixedType: true },
						{ type: 0, x: 200, y: 840, moveDelay: 2, idleDelay: 1.825, entry: 0, exit: 1 },
						{ type: 0, x: 760, y: 840, moveDelay: 2.5, idleDelay: 1.825, entry: 0, exit: 1 },
						{ type: 1, x: 0, y: 890, moveDelay: 3, idleDelay: 1.825, entry: 0, exit: 0, fixedType: true },
						{ type: 1, x: 960, y: 890, moveDelay: 3.5, idleDelay: 1.825, entry: 0, exit: 0, fixedType: true },
					]
				};
					break;
				case 311: formation = { // 4 small enemies and 2 big enemies
					slowMotion: true, slowMotionDelay: 2.025, randomShield: true, flippable: true, randomEntityType: [{ type: [2, 3, 4], amount: 2 }],
					entities: [
						{ type: 0, x: 50, y: 740, moveDelay: 1, idleDelay: 1.225, entry: 0, exit: 0, fixedType: true },
						{ type: 0, x: 910, y: 740, moveDelay: 1.5, idleDelay: 1.225, entry: 0, exit: 0, fixedType: true },
						{ type: 0, x: 200, y: 840, moveDelay: 2, idleDelay: 1.825, entry: 0, exit: 1 },
						{ type: 0, x: 760, y: 840, moveDelay: 2.5, idleDelay: 1.825, entry: 0, exit: 1 },
						{ type: 1, x: 0, y: 890, moveDelay: 3, idleDelay: 1.825, entry: 0, exit: 0, fixedType: true },
						{ type: 1, x: 960, y: 890, moveDelay: 3.5, idleDelay: 1.825, entry: 0, exit: 0, fixedType: true },
					]
				};
					break;
				case 312: formation = { // 4 small enemies and 1 big enemy
					slowMotion: true, slowMotionDelay: 2.125, flippable: true, randomEntityType: [{ type: [2, 3, 4], amount: 1 }],
					entities: [
						{ type: 0, x: 100, y: 690, moveDelay: 1, idleDelay: 1.225, entry: 2, exit: 1, fixedType: true, shielded: true },
						{ type: 0, x: 40, y: 690, moveDelay: 1.6, idleDelay: 1.225, entry: 1, exit: 1, fixedType: true, shielded: true },
						{ type: 0, x: 120, y: 850, moveDelay: 1.7, idleDelay: 1.825, entry: 0, exit: 2, fixedType: true, shielded: true },
						{ type: 0, x: 20, y: 920, moveDelay: 2.3, idleDelay: 1.825, entry: 0, exit: 2, fixedType: true, shielded: true },
						{ type: 0, x: 840, y: 850, moveDelay: 1.6, idleDelay: 1.825, entry: 0, exit: 2 }
					]
				};
					break;
				case 313: formation = { // 4 small enemies and 2 big enemies move in pair
					slowMotion: true, slowMotionDelay: 2.125, randomShield: true, randomEntityType: [{ type: [2, 3, 4], amount: 2 }],
					entities: [
						{ type: 0, x: 100, y: 680, moveDelay: 1, idleDelay: 1.225, entry: 2, exit: 1, fixedType: true },
						{ type: 0, x: 860, y: 680, moveDelay: 1, idleDelay: 1.225, entry: 2, exit: 1, fixedType: true },
						{ type: 0, x: 40, y: 680, moveDelay: 1.6, idleDelay: 1.225, entry: 1, exit: 1, fixedType: true },
						{ type: 0, x: 920, y: 680, moveDelay: 1.6, idleDelay: 1.225, entry: 1, exit: 1, fixedType: true },
						{ type: 0, x: 120, y: 880, moveDelay: 1.7, idleDelay: 1.825, entry: 0, exit: 2 },
						{ type: 0, x: 840, y: 880, moveDelay: 2.3, idleDelay: 1.825, entry: 0, exit: 2 },
					]
				};
					break;
				case 314: formation = { // 6 enemies with 1 big enemy
					slowMotion: true, slowMotionDelay: 2.125, randomShield: true, randomEntityType: [{ type: [2, 3, 4], amount: 1 }],
					entities: [
						{ type: 0, x: -100, y: 640, moveDelay: 1, idleDelay: 1.225, entry: 4, exit: 1, fixedType: true },
						{ type: 0, x: -150, y: 640, moveDelay: 1.3, idleDelay: 1.225, entry: 4, exit: 1, fixedType: true },
						{ type: 0, x: 1110, y: 640, moveDelay: 1.3, idleDelay: 1.225, entry: 4, exit: 1 },
						{ type: 0, x: 170, y: 920, moveDelay: 1.9, idleDelay: 1.825, entry: 0, exit: 2, fixedType: true },
						{ type: 0, x: 790, y: 920, moveDelay: 1.9, idleDelay: 1.825, entry: 0, exit: 2, fixedType: true },
						{ type: 0, x: 50, y: 930, moveDelay: 2.2, idleDelay: 1.825, entry: 0, exit: 2, fixedType: true },
						{ type: 0, x: 910, y: 930, moveDelay: 2.2, idleDelay: 1.825, entry: 0, exit: 2, fixedType: true }
					]
				};
					break;
				case 315: formation = { // 4 small ememies 2 big ememis
					slowMotion: true, slowMotionDelay: 2.125, randomShield: true, randomEntityType: [{ type: [2, 3, 4], amount: 2 }],
					entities: [
						{ type: 0, x: -100, y: 640, moveDelay: 1, idleDelay: 1.225, entry: 4, exit: 1, fixedType: true },
						{ type: 0, x: -150, y: 640, moveDelay: 1.3, idleDelay: 1.225, entry: 4, exit: 1, fixedType: true },
						{ type: 0, x: 1060, y: 640, moveDelay: 1.3, idleDelay: 1.225, entry: 4, exit: 1 },
						{ type: 0, x: 170, y: 920, moveDelay: 1.9, idleDelay: 1.825, entry: 0, exit: 2, fixedType: true },
						{ type: 0, x: 50, y: 930, moveDelay: 2.2, idleDelay: 1.825, entry: 0, exit: 2, fixedType: true },
						{ type: 0, x: 910, y: 825, moveDelay: 2.5, idleDelay: 1.825, entry: 0, exit: 2 }
					]
				};
					break;
				case 316: formation = { // 6 enemies and 2 big enemies in random order
					slowMotion: true, slowMotionDelay: 1.125, randomShield: true, shuffle: true, randomEntityType: [{ type: [3, 4], amount: 2 }],
					entities: [
						{ type: 0, x: 250, y: 750, idleDelay: 1.225, entry: 0, exit: 1, fixedType: true },
						{ type: 0, x: 710, y: 750, idleDelay: 1.225, entry: 0, exit: 1, fixedType: true },
						{ type: 0, x: 112, y: 850, idleDelay: 1.225, entry: 0, exit: 2 },
						{ type: 0, x: 848, y: 850, idleDelay: 1.225, entry: 0, exit: 2 },
						{ type: 0, x: -25, y: 750, idleDelay: 1.225, entry: 0, exit: 1, fixedType: true },
						{ type: 0, x: 985, y: 750, idleDelay: 1.225, entry: 0, exit: 1, fixedType: true },
					]
				};
					break;
				case 317: formation = { // 4 small enemies and 1 big enemies in random order
					slowMotion: true, slowMotionDelay: 1.125, randomShield: true, shuffle: true, randomEntityType: [{ type: [2, 3, 4], amount: 1 }], flippable: true,
					entities: [
						{ type: 0, x: 250, y: 760, idleDelay: 1.225, entry: 0, exit: 1, fixedType: true },
						{ type: 0, x: 150, y: 860, idleDelay: 1.225, entry: 0, exit: 2, fixedType: true },
						{ type: 0, x: 50, y: 760, idleDelay: 1.225, entry: 0, exit: 1, fixedType: true },
						{ type: 0, x: -25, y: 860, idleDelay: 1.225, entry: 0, exit: 2, fixedType: true },
						{ type: 0, x: 910, y: 850, idleDelay: 1.225, entry: 0, exit: 2 }
					]
				};
					break;
				case 318: formation = { // 2 big enemies on one side, 1 on other
					slowMotion: true, slowMotionDelay: 2.2, flippable: true, randomShield: true, randomEntityType: [{ type: [2, 3, 4], amount: 3 }],
					entities: [
						{ type: 0, x: 75, y: 690, moveDelay: 1, idleDelay: 1.2, entry: 2, exit: 1 },
						{ type: 0, x: -25, y: 800, moveDelay: 1.5, idleDelay: 1.2, entry: 2, exit: 2 },
						{ type: 0, x: 885, y: 650, moveDelay: 2, idleDelay: 1.2, entry: 2, exit: 3 }
					]
				};
					break;

				case 400: formation = { // 8 enemies move in pair all have shield
					slowMotion: true, slowMotionDelay: 2.125, randomEntityType: [{ type: 1, amount: 4 }],
					entities: [
						{ type: 0, x: 100, y: 690, moveDelay: 1, idleDelay: 1.225, entry: 2, exit: 1, shielded: true },
						{ type: 0, x: 860, y: 690, moveDelay: 1, idleDelay: 1.225, entry: 2, exit: 1, shielded: true },
						{ type: 0, x: 40, y: 690, moveDelay: 1.6, idleDelay: 1.225, entry: 1, exit: 1, shielded: true },
						{ type: 0, x: 920, y: 690, moveDelay: 1.6, idleDelay: 1.225, entry: 1, exit: 1, shielded: true },
						{ type: 0, x: 170, y: 920, moveDelay: 1.7, idleDelay: 1.825, entry: 0, exit: 2, shielded: true },
						{ type: 0, x: 790, y: 920, moveDelay: 1.7, idleDelay: 1.825, entry: 0, exit: 2, shielded: true },
						{ type: 0, x: 40, y: 920, moveDelay: 2.2, idleDelay: 1.825, entry: 0, exit: 2, shielded: true },
						{ type: 0, x: 920, y: 920, moveDelay: 2.2, idleDelay: 1.825, entry: 0, exit: 2, shielded: true }
					]
				};
					break;
				case 401: formation = { // 2 small enemies, 1 big enemies on each side
					slowMotion: true, slowMotionDelay: 2.025, randomShield: true, flippable: true, randomEntityType: [{ type: [2, 3, 4], amount: 2 }],
					entities: [
						{ type: 0, x: 50, y: 740, moveDelay: 1, idleDelay: 1.225, entry: 0, exit: 0, fixedType: true },
						{ type: 0, x: 910, y: 740, moveDelay: 1.5, idleDelay: 1.225, entry: 0, exit: 0, fixedType: true },
						{ type: 0, x: 200, y: 840, moveDelay: 2, idleDelay: 1.825, entry: 0, exit: 1 },
						{ type: 0, x: 760, y: 840, moveDelay: 2.5, idleDelay: 1.825, entry: 0, exit: 1 },
						{ type: 1, x: 0, y: 890, moveDelay: 3, idleDelay: 1.825, entry: 0, exit: 0, fixedType: true, shielded: true },
						{ type: 1, x: 960, y: 890, moveDelay: 3.5, idleDelay: 1.825, entry: 0, exit: 0, fixedType: true, shielded: true },
					]
				};
					break;
				case 402: formation = { // 4 enemy_2 with shield and 2 big enemies, moving in pair
					slowMotion: true, slowMotionDelay: 2.125, randomEntityType: [{ type: [3, 4], amount: 2 }],
					entities: [
						{ type: 1, x: 50, y: 690, moveDelay: 1, idleDelay: 1.225, entry: 2, exit: 1, shielded: true, fixedType: true },
						{ type: 1, x: 910, y: 690, moveDelay: 1, idleDelay: 1.225, entry: 2, exit: 1, shielded: true, fixedType: true },
						{ type: 0, x: 25, y: 790, moveDelay: 1.6, idleDelay: 1.225, entry: 0, exit: 1 },
						{ type: 0, x: 935, y: 790, moveDelay: 1.6, idleDelay: 1.225, entry: 0, exit: 1 },
						{ type: 1, x: 50, y: 900, moveDelay: 1.7, idleDelay: 1.825, entry: 0, exit: 2, shielded: true, fixedType: true },
						{ type: 1, x: 910, y: 900, moveDelay: 1.7, idleDelay: 1.825, entry: 0, exit: 2, shielded: true, fixedType: true }
					]
				};
					break;
				case 403: formation = { // 4 enemies with shield on one side, 2 big enemies on other
					slowMotion: true, slowMotionDelay: 2.125, randomEntityType: [{ type: [3, 4], amount: 2 }],
					entities: [
						{ type: 0, x: 100, y: 690, moveDelay: 1, idleDelay: 1.225, entry: 2, exit: 1, shielded: true, fixedType: true },
						{ type: 0, x: 860, y: 690, moveDelay: 1, idleDelay: 1.225, entry: 2, exit: 1 },
						{ type: 0, x: 40, y: 690, moveDelay: 1.6, idleDelay: 1.225, entry: 1, exit: 1, shielded: true, fixedType: true },
						{ type: 0, x: 170, y: 920, moveDelay: 1.7, idleDelay: 1.825, entry: 0, exit: 2, shielded: true, fixedType: true },
						{ type: 0, x: 40, y: 920, moveDelay: 2.2, idleDelay: 1.825, entry: 0, exit: 2, shielded: true, fixedType: true },
						{ type: 0, x: 920, y: 920, moveDelay: 2.2, idleDelay: 1.825, entry: 0, exit: 2 }
					]
				};
					break;
				case 404: formation = { // 4 big enemies in random order
					slowMotion: true, slowMotionDelay: 1.5, moveDelay: 1, shuffle: true, randomEntityType: [{ type: [2, 3, 4], amount: 4 }],
					entities: [
						{ type: 2, x: 50, y: 740, idleDelay: 1, entry: 0, exit: 0 },
						{ type: 2, x: 910, y: 740, idleDelay: 1, entry: 0, exit: 0 },
						{ type: 2, x: 200, y: 840, idleDelay: 1, entry: 0, exit: 1 },
						{ type: 2, x: 760, y: 840, idleDelay: 1, entry: 0, exit: 1 }
					]
				};
					break;

				case 900: formation = { // boss 1
					entities: [
						{ type: 5, x: 2048, y: 2048, moveDelay: 1, idleDelay: 1, entry: 0, exit: 0, boss: true }
					]
				};
					break;
				case 901: formation = { // boss 1
					entities: [
						{ type: 6, x: 2048, y: 2048, moveDelay: 1, idleDelay: 1, entry: 0, exit: 0, boss: true }
					]
				};
					break;
				case 902: formation = { // boss 1
					entities: [
						{ type: 7, x: 2048, y: 2048, moveDelay: 1, idleDelay: 1, entry: 0, exit: 0, boss: true }
					]
				};
					break;
			}

			if (formation.shuffle)
				this.shuffleFormation(formation);

			if (formation.flippable && (Math.random() > 0.5))
				this.flipFormation(formation);

			if (formation.randomShield)
				this.addShieldToFormation(formation);

			if (formation.randomEntityType)
				this.randomEntityTypeInFormation(formation);

			this.adjustFormationDifficulty(formation);

			// console.log(formation);

			return formation;
		},

		convertEntitiesData: function (entity) {
			var data = {
				x: entity.x,
				y: entity.y,
				settings: {
					moveDelay: entity.moveDelay,
					moveDelayScale: entity.moveDelayScale,
					idleDelay: entity.idleDelay,
					attackDelayScale: entity.attackDelayScale,
					healthScale: entity.healthScale,
					shielded: entity.shielded,
					giveItem: entity.giveItem,
				}
			};
			data.type = this.enemyTypes[entity.type];
			data.boss = entity.boss;

			data.settings.entry = this.moveIn[entity.entry];
			if (data.settings.entry.maxVel)
				data.settings.maxVel = data.settings.entry.maxVel;

			var exit = this.moveOut[entity.exit];
			var exitX = (entity.x < ig.system.width * 0.5) ? ig.system.width * 0.5 - exit.x : ig.system.width * 0.5 + exit.x;
			data.settings.exit = { velocity: exit.velocity, angle: exit.angle, x: exitX, y: exit.y, slowMotionScale: 0.5, flee: true };

			if (entity.idleTime > 0)
				data.settings.idleTime = entity.idleTime;

			if (entity.warningTime > 0)
				data.settings.warningTime = entity.warningTime;

			if (typeof entity.giveItem === 'number')
				data.settings.giveItem = this.pickupTypes[entity.giveItem];

			return data;
		},

		getBackgroundObjects: function () {
			var maxIndex = 7;
			var randomCount = 0;
			var index, data;
			do {
				index = Math.floor(Math.random() * maxIndex);
				randomCount++;
			} while (index === this.lastBackground && randomCount < this.maxBackgroundRandomCount);
			switch (index) {
				case 0:
					data = [
						{ type: 4, x: 0, y: 0 },
						{ type: 0, x: 169, y: 0 },
						{ type: 5, x: 366, y: 0 },
						{ type: 5, x: 866, y: -33 },
						{ type: 3, x: 440, y: 149 },
						{ type: 2, x: 828, y: 381 },
						{ type: 6, x: 0, y: 260 },
					];
					break;
				case 1:
					data = [
						{ type: 5, x: 429, y: 0 },
						{ type: 0, x: 677, y: 0 },
						{ type: 5, x: 866, y: -33 },
						{ type: 3, x: 104, y: 149 },
						{ type: 2, x: 828, y: 381 }
					];
					break;
				case 2:
					data = [
						{ type: 0, x: 677, y: 0 },
						{ type: 1, x: 487, y: 0 },
						{ type: 4, x: 86, y: 0 },
						{ type: 5, x: 656, y: -7 },
						{ type: 3, x: 219, y: 150 },
						{ type: 2, x: 107, y: 381 }
					];
					break;
				case 3:
					data = [
						{ type: 4, x: 0, y: 0 },
						{ type: 0, x: 169, y: 0 },
						{ type: 5, x: 366, y: 0 },
						{ type: 5, x: 866, y: -33 },
						{ type: 3, x: 440, y: 149 },
						{ type: 2, x: 828, y: 381 },
						{ type: 7, x: 584, y: 450 },
					];
					break;
				case 4:
					data = [
						{ type: 1, x: 601, y: 0 },
						{ type: 3, x: 343, y: 150 },
						{ type: 4, x: 302, y: 0 },
						{ type: 6, x: 644, y: 410 },
						{ type: 2, x: 119, y: 381 },
						{ type: 2, x: 685, y: 381 },
						{ type: 5, x: 130, y: -35 }
					];
					break;
				case 5:
					data = [
						{ type: 3, x: 636, y: 150 },
						{ type: 4, x: 385, y: 0 },
						{ type: 6, x: 70, y: 410 },
						{ type: 5, x: 143, y: -20 },
						{ type: 2, x: 40, y: 385 },
						{ type: 2, x: 551, y: 381 },
					];
					break;
				case 6:
					data = [
						{ type: 3, x: 167, y: 150 },
						{ type: 4, x: 607, y: -35 },
						{ type: 6, x: 656, y: 359 },
						{ type: 5, x: 107, y: 0 },
						{ type: 2, x: 685, y: 381 },
					];
					break;
				default: data = [];
					break;
			}
			this.lastBackground = index;
			return data;
		}
	});
});