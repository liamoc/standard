var ArrowMenuPointer = MenuPointer.extend({
	image: GetSystemArrow(),

	render: function()
	{
		this.image.blit(this.x - this.image.width + 2, this.y + this.h / 2 - this.image.height / 2);
	}
});