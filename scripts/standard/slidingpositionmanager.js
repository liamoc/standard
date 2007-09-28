var SlidingPositionManager = PositionManager.extend({
	x: 0,
	y: 0,
	x2: 0,
	y2: 0,
	ox: 0,
	oy: 0,
	frames: 0,
	count: 0,
	xPerFrame: 0,
	yPerFrame: 0,
	id: "pm_sliding",
	
	constructor: function (x, y, x2, y2, frames)
	{
		this.x = x;
		this.y = y;
		this.ox = x;
		this.oy = y;
		this.x2 = x2;
		this.y2 = y2;
		this.frames = frames;
		this.xPerFrame = (x2 - x) / frames;
		this.yPerFrame = (y2 - y) / frames;
	},
	start: function()
	{
		Standard.addTimer(this, this.tick, 1);
	},
	stop: function()
	{
		Standard.removeTimer(this, this.tick);
	},
	getX: function()
	{
		return this.x;
	},
	getY: function()
	{
		return this.y;
	},
	tick: function()
	{
		this.x = this.ox + this.xPerFrame * this.count;
		this.y = this.oy + this.yPerFrame * this.count;
		
		if (this.count++ == this.frames)
		{
			this.x = this.x2;
			this.y = this.y2;
		}
	}
});