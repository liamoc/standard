var FadeInTransition = Transition.extend({
	alpha: 255,
	color: CreateColor(0, 0, 0, 255),
	whitemask: CreateColor(255, 255, 255, 0),
	frames: 0,
	perFrame: 0,
	id: "fadeintrans",
	image: false,
	
	constructor: function(frames)
	{
		if (!frames) frames = 25;
		this.frames = frames;
		this.perFrame = 255 / frames;
	},
	
	generateImage: function()
	{
		var surface = CreateSurface(320, 240, CreateColor(this.color.red, this.color.blue, this.color.green, 255));
		this.image = surface.createImage();
	},
	
	onAdd: function()
	{
		Standard.addTimer(this, this.tick, 1);
	},
	
	onRemove: function()
	{
		Standard.removeTimer(this, this.tick);
	},
	
	tick: function()
	{
		this.alpha = Math.max(0, this.alpha - this.perFrame);
		this.color.alpha = this.alpha;
		if (this.alpha == 0)
		{
			Screen.detach(this);
			this.finish();
		}
	},
	
	render: function()
	{
		if (this.image)
		{
			this.image.blitMask(0, 0, this.color);
		}
		else
		{
			Rectangle(0, 0, 320, 240, this.color);
		}
	}
});