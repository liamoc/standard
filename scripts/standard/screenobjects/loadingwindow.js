var LoadingWindow = Window.extend({
	max: 100,
	value: 0,
	clipContents: true,
	constructor: function()
	{
		this.base(80, 120, 160, 16, false);
		var progress_x = Resources.fonts.standard.getStringWidth("Loading...") + 4;
		var progress_width = this.w - progress_x;
		this.progressWidth = progress_width;
		this.progressX = progress_x;
	},
	renderContent: function()
	{
		Resources.fonts.standard.drawText(this.x, this.y, "Loading...");
		Rectangle(this.x + this.progressX, this.y, (this.progressWidth / this.max) * this.value, this.h, Resources.colors.white);
	}
});