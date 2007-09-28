var ColorBlock = ScreenObject.extend({
	color: false,
	x: 0,
	y: 0,
	w: 0,
	h: 0,
	
	constructor: function(color, x, y, w, h)
	{
		this.color = color;
		this.x = x == undefined ? 0 : x;
		this.y = y == undefined ? 0 : y;
		this.w = w == undefined ? 320 : w;
		this.h = h == undefined ? 240 : h;
	},
	render: function()
	{
		Rectangle(this.x, this.y, this.w, this.h, this.color);
	}
});