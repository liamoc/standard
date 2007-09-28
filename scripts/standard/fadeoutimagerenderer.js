var FadeOutImageRenderer = ImageRenderer.extend({
	alpha: 255,
	frames: 0,
	perFrame: 0,
	mask: CreateColor(255, 255, 255, 255),
	id: "ir_fadeout",
	constructor: function(frames)
	{
		this.frames = frames;
		this.perFrame = 255 / frames;
	},
	
	render: function(image, positionManager)
	{
		image.blitMask(positionManager.getX(), positionManager.getY(), this.mask);
	},
	
	tick: function()
	{
		if (this.frames--)
		{
			this.alpha = Math.max(0, this.alpha - this.perFrame);
			this.mask.alpha = this.alpha;
		}
	},
	
	start: function()
	{
		Standard.addTimer(this, this.tick, 1);
	},
	
	stop: function()
	{
		Standard.removeTimer(this, this.tick);
	}
});