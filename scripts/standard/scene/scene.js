var Scene = Class.extend({
	colorBlock: new ColorBlock(CreateColor(255,255,255)),
	onEnter: function()
	{
		Screen.attach(5, this.colorBlock);
	},
	onLeave: function()
	{
		Screen.detach(this.colorBlock);
	}
});