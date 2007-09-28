var BoxMenuPointer = MenuPointer.extend({
	render: function()
	{
		Rectangle(this.x, this.y, this.w, this.h, CreateColor(50, 100, 255, 40));
		OutlinedRectangle(this.x, this.y, this.w, this.h, CreateColor(255, 255, 255, 100));
	}
});