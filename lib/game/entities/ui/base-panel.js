ig.module('game.entities.ui.base-panel')
.requires(
	'game.entities.ui.base-ui'
)
.defines(function() {
	EntityBasePanel = EntityBaseUi.extend({
		zIndex: 5000,
		enabled: false,
		inTween: false,
		tweenDuration: 0.35,
		contents: [],

		init:function(x,y,settings)
		{
			this.parent(x,y,settings);
			this.showPos = { x: x, y: y };
			this.hidePos = { x: x, y: y };
		},

		update: function()
		{
			if(!this.enabled)
				return;

			this.parent();
			if(this.inTween)
				this.updateContentsPosition();
		},

		addContent: function(other)
		{
			this.contents.push( { entity: other, offset: { x: other.pos.x - this.pos.x, y: other.pos.y - this.pos.y } } );
		},

		updateContentsPosition: function()
		{
			for(var i = 0; i < this.contents.length; i++)
			{
				var content = this.contents[i];
				if (typeof content.entity.moveTo === 'function')
					content.entity.moveTo(this.pos.x + content.offset.x, this.pos.y + content.offset.y);
				else {
					content.entity.pos.x = this.pos.x + content.offset.x;
					content.entity.pos.y = this.pos.y + content.offset.y;
				}
			}
		},
		
		show: function(delay)
		{
			if(this.inTween)
				return;
			
			this.enable();
			this.inTween = true;
			this.pos.x = this.hidePos.x;
			this.pos.y = this.hidePos.y;
			this.onShowStart();
			this.tween({pos: { x: this.showPos.x, y: this.showPos.y }}, this.tweenDuration, { easing: ig.Tween.Easing.Back.EaseOut, delay: delay,
				onComplete : function() {
					this.inTween = false;
					this.updateContentsPosition();
					this.onShowComplete();
				 }.bind(this)
			}).start();
		},
		
		hide: function()
		{
			if(this.inTween)
				return;
			
			this.inTween = true;
			this.onHideStart();
			this.tween({pos: { x: this.hidePos.x, y:this.hidePos.y }}, this.tweenDuration, { easing: ig.Tween.Easing.Back.EaseIn, 
				onComplete : function() { 
					this.inTween = false;
					this.updateContentsPosition();
					this.disable();
					this.onHideComplete();
				}.bind(this)
			}).start();
		},
		
		onShowStart: function()
		{

		},

		onHideStart: function()
		{
			
		},
		
		onShowComplete: function()
		{

		},

		onHideComplete: function()
		{
			
		},
		
		enable: function()
		{
			this.parent();
			for (var i = 0; i < this.contents.length; i++) {
				var entity = this.contents[i].entity;
				if (typeof entity.enable === 'function')
					entity.enable();
			}
		},
		
		disable: function()
		{
			this.parent();
			for (var i = 0; i < this.contents.length; i++) {
				var entity = this.contents[i].entity;
				if (typeof entity.disable === 'function')
					entity.disable();
			}
		},
		
		kill: function()
		{
			this.parent();
			for (var i = 0; i < this.contents.length; i++) {
				this.contents[i].entity.kill();
			}
			this.contents = null;
		},
		
		moveTo: function(x, y)
		{
			this.parent(x, y);
			this.updateContentsPosition();
		}
	});
});