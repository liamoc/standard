var MonsterGraphic = ScreenObject.extend({
	constructor: function(monster)
	{
		this.monster = monster;
		this.flash_frames = 8;
		this.image = this.monster.image;
		this.x = monster.x;
		this.y = monster.y;
		this.flashing = false;
		this.center = {

		};
		this.__defineGetter__("centerX", function() { return this.x + monster.image.width / 2; });
		this.__defineGetter__("centerY", function() { return this.y + monster.image.height / 2; });
		this.width = this.image.width;
		this.height = this.image.height;
	},
	render: function()
	{
		if (this.flashing)
			this.image.blitMask(this.x, this.y, CreateColor(0, 0, 0, 255));
		else
			this.image.blit(this.x, this.y);
	},
	flash: function()
	{
		this.flashing = true;
		Standard.addTimer(this, this.endFlash, this.flash_frames);
	},
	endFlash: function()
	{
		this.flashing = false;
		Standard.removeTimer(this, this.endFlash);
	},
});