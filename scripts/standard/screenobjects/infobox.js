var InfoBox = Window.extend({
	constructor: function(x, y, w, h, text)
	{
		this.base(x, y, w, h, true);
		this.text = text;
	},
	
	renderContent: function()
	{
		this.font.setColorMask(Resources.colors.white);
		this.font.drawText(this.x, this.y, this.text);
	}
});