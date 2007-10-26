var Light = ScreenObject.extend({
	constructor: function(mapx, mapy, layer)
	{
		this.mapx = mapx;
		this.mapy = mapy;
		this.layer = layer;
		this.image = Cache.getImage("light2.png");
		this.image.blendmode = ADD;
	},
	
	render: function()
	{
		this.image.blit(MapToScreenX(this.layer, this.mapx) - this.image.width / 2, MapToScreenY(this.layer, this.mapy) - this.image.height / 2);
	}
});