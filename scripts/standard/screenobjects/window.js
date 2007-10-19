const ALIGN_LEFT = 1;
const ALIGN_CENTER = 2;
const ALIGN_RIGHT = 3;

var Window = ScreenObject.extend({
	x: 0,
	y: 0,
	w: 0,
	h: 0,
	padding: 0,
	font: Resources.fonts.standard,
	transparent: false,
	closePixelsPerFrame: 0,
	clipContents: false,
	windowTitle: false,
	id: "Window",
	constructor: function(x, y, w, h, transparent)
	{
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.transparent = transparent;
		this.windowTitle = false;
	},
	render: function()
	{
		if (this.windowTitle)
		{
			Resources.fonts.all_caps.drawText(this.x, this.y - Resources.fonts.all_caps.getHeight() - 1, this.windowTitle);
		}
		if (!this.transparent) Resources.windows.standard.drawWindow(this.x, this.y, this.w, this.h);
		this.x += this.padding;
		this.y += this.padding;
		this.w -= this.padding * 2;
		this.h -= this.padding * 2;
		if (this.clipContents) SetClippingRectangle(this.x, this.y, this.w, this.h);
		this.renderContent();
		if (this.clipContents) SetClippingRectangle(0, 0, 320, 240);
		this.x -= this.padding;
		this.y -= this.padding;
		this.w += this.padding * 2;
		this.h += this.padding * 2;
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