ig.module('game.entities.ui.buttons.button')
.requires(
	'game.entities.ui.base-ui'
)
.defines(function() {
	EntityButton = EntityBaseUi.extend({
		collides:ig.Entity.COLLIDES.NEVER,
		type:ig.Entity.TYPE.A,
		size:{ x:48, y:48 },
		zIndex:5000,
		clickSound: 'button',
		isClicked: false,
		clickedScale: 0.95,
		isHighlighted: false,
		highlightScale: 1.05,

		clicked:function() {
			this.isClicked = true;
			this.setScale(this.clickedScale, this.clickedScale);

			if (typeof this.clickSound === "string")
				ig.soundHandler.sfxPlayer.play(this.clickSound);
		},

		clicking:function() {
		},

		released:function() {
			if(this.isClicked)
				this.callback();
			this.isClicked = false;
			this.setScale(1, 1);
		},

		releasedOutside: function() {
			this.isClicked = false;
		},

		over: function() {
			this.isHighlighted = true;
			this.setScale(this.highlightScale, this.highlightScale);
		},

		leave: function() {
			this.isHighlighted = false;
			this.setScale(1, 1);
		},

		callback: function() {
			
		}
	});
});