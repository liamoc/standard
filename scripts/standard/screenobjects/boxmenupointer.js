var BoxMenuPointer = MenuPointer.extend({
	padding: [0, 0, 0, 0],
	border: true,
	id: "BoxMenuPointer",
	constructor: function(x, y, w, h)
	{
		this.base(x, y, w, h);
		this.standalone = false;
	},
	render: function()
	{
		Rectangle(this.x - this.padding[3], this.y - this.padding[0], this.w + this.padding[3] + this.padding[1], this.h + this.padding[0] + this.padding[2], CreateColor(25, 50, 127, 120));
		if (this.border)
		{
			OutlinedRectangle(this.x - this.padding[3], this.y - this.padding[0], this.w + this.padding[3] + this.padding[1], this.h + this.padding[0] + this.padding[2], CreateColor(242, 243, 249, 180));
		}
	}
});