var MonsterGraphic = ScreenObject.extend({
	constructor: function(monster)
	{
		this.monster = monster;
		this.image = this.monster.image;
		this.x = monster.x;
		this.y = monster.y;
		this.center = {

		};
		this.__defineGetter__("centerX", function() { return this.x + monster.image.width / 2; });
		this.__defineGetter__("centerY", function() { return this.y + monster.image.height / 2; });
		this.width = this.image.width;
		this.height = this.image.height;
	},
	render: function()
	{
		this.image.blit(this.x, this.y);
	}
});