var CharacterGraphic = ScreenObject.extend({

	constructor: function(character, x, y)
	{
		this.character = character;
		this.spriteset = this.character.spriteset;
		this.x = x;
		this.y = y;
		this.center = {
			x: x + character.spriteset.images[0].width / 2,
			y: y + character.spriteset.images[0].height / 2
		};
		this.frame = 0;
		this.nextFrame = 0;
		this.currentImage = this.spriteset.images[0];
		this.facing = "west";
	},
	onAdd: function()
	{
		Standard.addTimer(this, this.tick, 1);
	},
	onRemove: function()
	{
		Standard.removeTimer(this, this.tick);
	},
	render: function()
	{
		if (this.currentImage) this.currentImage.blit(this.x, this.y);
	},
	setDirection: function(dir)
	{
		this.dir = dir;
		for (var i = 0; i < this.spriteset.directions.length; i++)
		{
			if (this.spriteset.directions[i].name == dir)
			{
				this.dir_frames = this.spriteset.directions[i].frames;
				this.frame = 0;
				this.nextFrame = this.dir_frames[0].delay;
				this.currentImage = this.spriteset.images[this.dir_frames[0].index];
				break;
			}			
		}
	},
	tick: function()
	{
		this.nextFrame--;
		if (this.nextFrame == 0)
		{
			this.frame++;
			if (this.frame == this.dir_frames.length)
			{
				this.frame = 0;
			}
			this.nextFrame = this.dir_frames[this.frame].delay;
			this.currentImage = this.spriteset.images[this.dir_frames[this.frame].index];
		}
	}
});