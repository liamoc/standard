var Torch = ScreenObject.extend({
	image: false,
	attached: false,
	flicker: true,
	scale: 1,
	
	constructor: function(attachperson)
	{
		this.attached = attachperson;
		this.image = Cache.getImage("torch.png");
		this.image.blendmode = SUBTRACT;
		this.scaleTo = 1.1;
		this.scaleMove = 1;
	},
	
	onAdd: function()
	{
		this.base();
		if (this.flicker) Standard.addTimer(this, this.tick, 1);
	},
	
	onRemove: function()
	{
		this.base();
		if (this.flicker) Standard.removeTimer(this, this.tick);
	},
	
	tick: function()
	{
		if (this.scaleMove == 1)
		{
			this.scale += 0.001;
			if (this.scale > this.scaleTo)
			{
				this.scaleTo = 1 + Math.random() / 10;
				if (this.scaleTo > this.scale) this.scaleMove = 1;
				else this.scaleMove = -1;
			}
		}
		else if (this.scaleMove == -1)
		{
			this.scale -= 0.001;
			if (this.scale < this.scaleTo)
			{
				this.scaleTo = 1 + Math.random() / 10;
				if (this.scaleTo > this.scale) this.scaleMove = 1;
				else this.scaleMove = -1;
			}
		}
	},
	
	render: function()
	{
		var scale = this.scale;
		var layer = GetPersonLayer(this.attached);
		var imagex = MapToScreenX(layer, GetPersonX(this.attached)) - this.image.width * scale / 2;
		var imagey = MapToScreenY(layer, GetPersonY(this.attached)) - this.image.height * scale / 2;
		var imagew = this.image.width * scale;
		var imageh = this.image.height * scale;
		
		this.image.zoomBlit(imagex, imagey, scale);
		
		if (imagex > 0) Rectangle(0, 0, imagex, 240, Resources.colors.black);
		if (imagey > 0) Rectangle(0, 0, 320, imagey, Resources.colors.black);
		if (imagex < 0) Rectangle(imagex + imagew, 0, imagex + imagew, 240, Resources.colors.black);
		if (imagey < 0) Rectangle(0, imagey + imageh, 320, imagey + imageh, Resources.colors.black);
	}
});