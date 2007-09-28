var StaticImageRenderer = ImageRenderer.extend({
	render: function(image, positionManager)
	{
		image.blit(positionManager.getX(), positionManager.getY());
	}
});