var MenuPointer = ScreenObject.extend({
	x: 0,
	y: 0,
	w: 0,
	h: 0,
	x2: 0,
	y2: 0,
	w2: 0,
	h2: 0,
	xd: 0,
	yd: 0,
	wd: 0,
	hd: 0,
	moveTime: 7,
	moveTimeLeft: 0,
	
	constructor: function(x, y, w, h)
	{
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	},
	onAdd: function()
	{
		this.base();
		Standard.addTimer(this, this.tick, 1);
	},
	onRemove: function()
	{
		this.base();
		Standard.removeTimer(this, this.tick);
	},
	moveTo: function(x, y, w, h, instant)
	{
		if (instant)
		{
			this.x = x;
			this.y = y;
			this.w = w;
			this.h = h;
			this.positionUpdate();
			return;
		}
		this.x2 = x;
		this.y2 = y;
		this.w2 = w;
		this.h2 = h;
		this.xd = (this.x2 - this.x) / this.moveTime;
		this.yd = (this.y2 - this.y) / this.moveTime;
		this.wd = (this.w2 - this.w) / this.moveTime;
		this.hd = (this.h2 - this.h) / this.moveTime;
		this.moveTimeLeft = this.moveTime;
	},
	render: function()
	{
		
	},
	tick: function()
	{
		if (this.moveTimeLeft-- > 0)
		{
			this.x += this.xd;
			this.y += this.yd;
			this.w += this.wd;
			this.h += this.hd;
			this.positionUpdate();
		}
	},
	positionUpdate: function() { }
});
