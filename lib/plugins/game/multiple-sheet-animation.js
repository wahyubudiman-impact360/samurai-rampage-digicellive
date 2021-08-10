ig.module(
	'plugins.game.multiple-sheet-animation'
)
.requires(
	'impact.animation'
)
.defines(function(){ "use strict";
ig.MultipleSheetAnimation = ig.Animation.extend({
	data: [],
	currentData: 0,
	totalFrame: 0,

	init: function( data, frameTime, stop ) {
		this.data = data;
		this.sheet = data[0].sheet;
		this.pivot = {x: this.sheet.width/2, y: this.sheet.height/2 };
		this.timer = new ig.Timer();

		this.frameTime = frameTime;
		this.sequence = data[0].sequence;
		this.stop = !!stop;
		this.tile = this.sequence[0];
		this.totalFrame = this.getTotalFrame(data);
	},
	
	rewind: function() {
		this.timer.set();
		this.loopCount = 0;
		this.frame = 0;
		this.tile = this.data[this.currentData].sequence[0];
		return this;
	},

	gotoRandomFrame: function() {
		this.gotoFrame( Math.floor(Math.random() * this.totalFrame) )
	},
	
	update: function() {
		// slow motion fix
		if(typeof this.timer.timeScale === "number")
			this.timer.step();
		
		var frameTotal = Math.floor(this.timer.delta() / this.frameTime);
		this.loopCount = Math.floor(frameTotal / this.totalFrame);

		if( this.stop && this.loopCount > 0 ) {
			this.frame = this.sequence.length - 1;
			this.currentData = this.data.length - 1;
		}
		else {
			this.frame = frameTotal % this.totalFrame;
			this.currentData = 0;
			for(var i = 0; i < this.data.length; i++)
			{
				if(this.frame >= this.data[i].sequence.length)
				{
					this.frame -= this.data[i].sequence.length;
					this.currentData = i + 1;
				}
				else
					break;
			}
		}

		this.sheet = this.data[this.currentData].sheet;
		this.sequence = this.data[this.currentData].sequence;
		this.tile = this.sequence[ this.frame ];
	},
	
	getTotalFrame: function(data)
	{
		var totalFrame = 0;
		for(var i = 0; i < data.length; i++)
		{
			totalFrame += data[i].sequence.length;
		}
		return totalFrame;
	}
});

});