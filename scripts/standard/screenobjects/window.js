const ALIGN_LEFT = 1;
const ALIGN_CENTER = 2;
const ALIGN_RIGHT = 3;

var Window = ScreenObject.extend({
	x: 0,
	y: 0,
	w: 0,
	h: 0,
	transparent: false,
	closePixelsPerFrame: 0,
	clipContents: false,
	
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
		if (this.clipContents) SetClippingRectangle(this.x, this.y, this.w, this.h);
		this.renderContent();
		if (this.clipContents) SetClippingRectangle(0, 0, 320, 240);
	},
	renderContent: function()
	{
	},
	
	close: function()
	{
		Standard.addTimer(this, this.continueClose, 1);
		this.closePixelsPerFrame = this.h / 10;
	},
	
	continueClose: function()
	{
		if ((this.h -= this.closePixelsPerFrame) <= 0)
		{
			Standard.removeTimer(this, this.continueClose);
			Screen.detach(this);
		}
	}
});