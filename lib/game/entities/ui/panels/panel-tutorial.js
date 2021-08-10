ig.module('game.entities.ui.panels.panel-tutorial')
	.requires(
		'game.entities.ui.base-panel',
		'game.entities.ui.buttons.button-tutorial-next',
		'game.entities.ui.buttons.button-tutorial-skip',
		'game.entities.ui.tutorial-pointer'
	)
	.defines(function () {
		EntityPanelTutorial = EntityBasePanel.extend({
			zIndex: 5010,
			animSheet: new ig.AnimationSheet('media/graphics/sprites/ui/popup-tutorial.png', 636, 254),
			bigAnimSheet: new ig.AnimationSheet('media/graphics/sprites/ui/popup-large.png', 636, 413),
			size: { x: 636, y: 254 },

			tutorialStep: 0,

			nextButtonPos: { x: 380, y: 180 }, // { x: 380, y: 225 },
			skipButtonPos: { x: 70, y: 180 }, // { x: 70, y: 225 },
			textPos: { x: 90, y: 95 },
			lineHeight: 27,

			pickupImages: [
				new ig.Image('media/graphics/sprites/pickups/pickup-sewing-kit.png'),
				new ig.Image('media/graphics/sprites/pickups/pickup-shuriken.png'),
				new ig.Image('media/graphics/sprites/pickups/pickup-shield.png')
			],
			pickupImageSize: { x: 50, y: 50 },
			pickupPos: { x: 80, y: 190 },
			pickupLineHeight: 60,

			init: function (x, y, settings) {
				this.parent(x, y, settings);
				this.hidePos = { x: (ig.system.width - this.size.x) * 0.5 - 25, y: this.size.y * 0.5 - ig.system.height };
				this.showPos = { x: this.hidePos.x, y: 290 };
				this.pickupShowPos = { x: this.hidePos.x, y: 90 };

				this.pos.x = this.hidePos.x;
				this.pos.y = this.hidePos.y;

				this.addAnim('normal', 0, [0], true);
				this.anims.big = new ig.Animation(this.bigAnimSheet, 0, [0], true);

				this.btn_next = ig.game.spawnEntity(EntityButtonTutorialNext, this.pos.x + this.nextButtonPos.x, this.pos.y + this.nextButtonPos.y, { panel: this });
				this.btn_skip = ig.game.spawnEntity(EntityButtonTutorialSkip, this.pos.x + this.skipButtonPos.x, this.pos.y + this.skipButtonPos.y, { panel: this });
				this.addContent(this.btn_next);
				this.addContent(this.btn_skip);
			},

			update: function () {
				if (!this.enabled)
					return;

				this.parent();

				switch (this.tutorialStep) {
					case 2:
						this.stepTimer += ig.system.tick;
						if (this.stepTimer >= 1.6)
							this.nextTutorial();
						break;
					case 3:
						if (ig.game.control.score > this.targetScore)
							this.nextTutorial();
						break;
					case 4:
						this.stepTimer += ig.system.tick;
						if (this.stepTimer >= 1.75)
							this.nextTutorial();
						break;
					case 5:
						if (!this.finger) {
							var enemy = ig.game.getEntitiesByType(EntityEnemy5)[0];
							if (enemy) {
								this.finger = ig.game.spawnEntity(EntityTutorialPointer, enemy.pos.x + enemy.size.x * 0.25, enemy.pos.y + enemy.size.y * 0.5);
								enemy.states.warning.transitions = [];
							}
						}
						if (ig.game.control.score > this.targetScore)
							this.nextTutorial();
						break;
					case 6:
						this.stepTimer += ig.system.tick;
						if (this.stepTimer >= 1.75)
							this.nextTutorial();
						break;
					case 7:
						if (!this.finger) {
							var target = ig.game.getEntitiesByType(EntityClickTarget)[0];
							if (target) {
								this.finger = ig.game.spawnEntity(EntityTutorialPointer, target.pos.x + target.size.x * 0.25, target.pos.y + target.size.y * 0.25);
							}
						} else {
							var target = ig.game.getEntitiesByType(EntityClickTarget)[0];
							if (target) {
								this.finger.pos.x = target.pos.x + target.size.x * 0.25;
								this.finger.pos.y = target.pos.y + target.size.y * 0.25;
							}
						}

						if (ig.game.control.score > this.targetScore)
							this.nextTutorial();
						break;
					case 8:
						this.stepTimer += ig.system.tick;
						if (this.stepTimer >= 1.5)
							this.nextTutorial();
						break;
					case 9:
						if (!this.finger) {
							var enemy = ig.game.getEntitiesByType(EntityEnemy1)[0];
							if (enemy && !enemy.shielded)
								this.finger = ig.game.spawnEntity(EntityTutorialPointer, enemy.pos.x + enemy.size.x * 0.25, enemy.pos.y + enemy.size.y * 0.5);
						}
						if (ig.game.control.score > this.targetScore)
							this.nextTutorial();
						break;
					case 10:
						if (ig.game.control.player.shielded)
							this.nextTutorial();
						break;
				}
			},

			draw: function () {
				if (!this.enabled)
					return;

				this.parent();
				var ctx = ig.system.context;
				ctx.save();

				// draw title
				ctx.textAlign = 'center';
				ctx.textBaseline = "middle";
				ctx.font = '42px osaka';
				if (this.tutorialStep === 10) {
					ctx.fillText(_STRINGS.Tutorial.Title, this.pos.x + this.size.x * 0.5, this.pos.y + 35);
				} else {
					ctx.fillText(_STRINGS.Tutorial.Title, this.pos.x + this.size.x * 0.5, this.pos.y + 64);
				}

				// draw texts
				if (this.texts.length > 0) {
					ctx.textAlign = 'left';
					ctx.font = '22px osaka';
					for (var i = 0; i < this.texts.length; i++) {
						ctx.fillText(this.texts[i], this.pos.x + this.textPos.x, this.pos.y + this.textPos.y + i * this.lineHeight);
					}
				}

				if (this.tutorialStep === 10) {
					for (var i = 0; i < this.pickupImages.length; i++) {
						var image = this.pickupImages[i];
						ctx.drawImage(image.data, this.pos.x + this.pickupPos.x, this.pos.y + this.pickupPos.y + i * this.pickupLineHeight, this.pickupImageSize.x, this.pickupImageSize.y);
						ctx.fillText(_STRINGS.Tutorial.TutorialPickups[i], this.pos.x + this.pickupPos.x + this.pickupImageSize.x + 10, this.pos.y + this.pickupPos.y + this.pickupImageSize.y * 0.5 + i * this.pickupLineHeight);
					}
				}

				ctx.restore();
			},

			startTutorial: function () {
				this.tutorialStep = 0;
				this.nextTutorial();
				this.show();
			},

			setTexts: function (textList) {
				this.texts = textList;
			},

			nextTutorial: function () {
				switch (this.tutorialStep) {
					case 0:
						this.setTexts(_STRINGS.Tutorial.Tutorial1);
						break;
					case 1:
						this.moveTo(this.hidePos.x, this.hidePos.y);
						this.stepTimer = 0;
						this.targetScore = ig.game.control.score;
						ig.game.control.checkEnemiesWave();
						break;
					case 2:
						this.btn_next.disable();
						var enemy = ig.game.getEntitiesByType(EntityEnemy1)[0];
						if (enemy) {
							this.moveTo(this.showPos.x, this.showPos.y);
							this.setTexts(_STRINGS.Tutorial.Tutorial2);
							enemy.states.warning.transitions = [];
							this.finger = ig.game.spawnEntity(EntityTutorialPointer, enemy.pos.x + enemy.size.x * 0.25, enemy.pos.y + enemy.size.y * 0.25);
						}
						break;
					case 3:
						this.moveTo(this.hidePos.x, this.hidePos.y);
						this.stepTimer = 0;
						this.finger.kill();
						break;
					case 4:
						this.moveTo(this.showPos.x, this.showPos.y);
						this.setTexts(_STRINGS.Tutorial.Tutorial3);
						this.targetScore = ig.game.control.score;
						this.finger = false;
						break;
					case 5:
						this.moveTo(this.hidePos.x, this.hidePos.y);
						this.stepTimer = 0;
						this.finger.kill();
						break;
					case 6:
						this.moveTo(this.showPos.x, this.showPos.y);
						this.setTexts(_STRINGS.Tutorial.Tutorial4);
						this.targetScore = ig.game.control.score;
						this.finger = false;

						var enemy = ig.game.getEntitiesByType(EntityEnemy3)[0];
							enemy.states.warning.transitions = [];
						break;
					case 7:
						this.moveTo(this.hidePos.x, this.hidePos.y);
						this.stepTimer = 0;
						this.finger.kill();
						break;
					case 8:
						this.moveTo(this.showPos.x, this.showPos.y);
						this.setTexts(_STRINGS.Tutorial.Tutorial5);
						this.targetScore = ig.game.control.score;
						this.finger = false;
						break;
					case 9:
						this.moveTo(this.pickupShowPos.x, this.pickupShowPos.y);
						this.setTexts(_STRINGS.Tutorial.Tutorial6);
						this.targetScore = ig.game.control.score;
						this.currentAnim = this.anims.big;
						this.btn_skip.disable();
						var pickup = ig.game.getEntitiesByType(EntityPickup)[0];
						if (pickup)
							pickup.lifeTime = 9999999;
						break;
					case 10:
						this.skipTutorial();
						break;
				}
				this.tutorialStep++;
			},

			skipTutorial: function () {
				ig.game.control.endTutorial();
				ig.game.ui_tutorial = null;
				this.kill();
			},

			kill: function () {
				this.parent();
				if (this.finger)
					this.finger.kill();
			}
		});
	});