var BattleTransition = Transition.extend({
	colors: [],
	surface: false,
	constructor: function()
	{
		this.surface = CreateSurface(320, 240, Resources.colors.black);
		this.colors = [
			CreateColor(0, 0, 0, Random(1, 50)),
			CreateColor(0, 0, 0, Random(1, 50)),
			CreateColor(0, 0, 0, Random(1, 50)),
			CreateColor(0, 0, 0, Random(1, 50))
		];
	},
	
	onAdd: function()
	{
		Standard.addTimer(this, this.tick, 1);
	},
	
	onRemove: function()
	{
		Standard.removeTimer(this, this.tick);
	},
	
	tick: function()
	{
		var finished = true;
		for (var i = 0; i < this.colors.length; i++)
		{
			if (this.colors[i].alpha < 255)
			{
				finished = false;
				this.colors[i].alpha = Math.min(255, this.colors[i].alpha + 10);
			}
		}
		
		if (finished)
		{
			Screen.detach(this);
			this.finish();
		}
	},
	render: function()
	{
		GradientRectangle(0, 0, 320, 240, this.colors[0], this.colors[1], this.colors[2], this.colors[3]);
	}
});