var StaticPositionManager = PositionManager.extend({
	x: 0,
	y: 0,
	constructor: function (x, y)
	{
		this.x = x;
		this.y = y;
	},
	getX: function()
	{
		return this.x;
	},
	getY: function()
	{
		return this.y;
	}
});