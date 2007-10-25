var AbilityNameWindow = Window.extend({
	constructor: function(text)
	{
		this.base(85, -20, 150, Resources.fonts.standard.getHeight(), false);
		this.text = text;
		this.text_width = this.font.getStringWidth(this.text);
		this.text_x = this.x + this.w / 2 - this.text_width / 2;
		this.dir = 1;
		this.wait = 60;
	},
	onAdd: function()
	{
		this.base();
		Standard.addTimer(this, this.tick, 1);
	},
	onRemove: function()
	{
		this.base();
		Standard.removeTimer(this, this.tick);
	},
	renderContent: function()
	{
		this.font.drawText(this.text_x, this.y, this.text);
	},
	tick: function()
	{
		switch (this.dir)
		{
			case 0:
				this.wait--;
				if (this.wait == 0)	
					this.dir = -1;
				break;
			case 1:
				this.y++;
				if (this.y == 8)
					this.dir = 0;
				break;
			case -1:
				this.y--;
				if (this.y == -20)
					this.close();
				break;
		}
	}
});