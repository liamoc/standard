var Image = ScreenObject.extend({
	image: false,
	
	positionManager: false,
	
	constructor: function(image, x, y)
	{
		if (typeof(image) == "string")
		{
			this.image = Cache.getImage(image);
		}
		else
		{
			this.image = image;
		}
		this.positionManager = new StaticPositionManager(x, y);
		this.imageRenderer = new StaticImageRenderer();
	},
	
	onAdd: function()
	{
		this.positionManager.start();
		this.imageRenderer.start();
		this.base();
	},
	
	onRemove: function()
	{
		this.positionManager.stop();
		this.imageRenderer.stop();
		this.base();
	},
	
	render: function()
	{
		this.imageRenderer.render(this.image, this.positionManager);
	}
	
});