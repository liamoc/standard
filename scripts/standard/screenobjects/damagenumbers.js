var DamageNumbers = ScreenObject.extend({
	constructor: function(amount, x, y)
	{
		this.num = Math.abs(amount);
		if (amount < 0)
		{
			this.color = CreateColor(100, 255, 150);
		}
		else
		{
			this.color = CreateColor(255, 255, 255);
		}
		this.x = x;
		this.y = y;
		this.font = Resources.fonts.numeric;
		this.nwidth = this.font.getStringWidth(this.num);
		this.f = 255 / 60;
		this.alpha = 255;

	},
	
	onAdd: function()
	{
		Standard.addTimer(this, this.tick, 1);
	},
	
	render: function()
	{
		this.font.setColorMask(this.color);
		this.font.drawText(this.x - this.nwidth / 2, this.y, this.num);
	},
	
	tick: function()
	{
		this.alpha = Math.max(0, this.alpha - this.f);
		this.color.alpha = this.alpha;
		if (this.alpha == 0)
		{
			Standard.removeTimer(this, this.close);
			Screen.detach(this);
		}
	}
});