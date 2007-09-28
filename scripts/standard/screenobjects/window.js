const ALIGN_LEFT = 1;
const ALIGN_CENTER = 2;
const ALIGN_RIGHT = 3;

var Window = ScreenObject.extend({
	x: 0,
	y: 0,
	w: 0,
	h: 0,
	transparent: false,
	
	constructor: function(x, y, w, h, transparent)
	{
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.transparent = transparent;
	},
	render: function()
	{
		if (!this.transparent) Resources.windows.standard.drawWindow(this.x, this.y, this.w, this.h);
		SetClippingRectangle(this.x, this.y, this.w, this.h);
		this.renderContent();
		SetClippingRectangle(0, 0, 320, 240);
	},
	renderContent: function()
	{
	}
});