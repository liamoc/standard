var MonsterGraphic = ScreenObject.extend({
	constructor: function(monster)
	{
		this.monster = monster;
		this.image = this.monster.image;
		this.x = monster.x;
		this.y = monster.y;
	},
	render: function()
	{
		this.image.blit(this.x, this.y);
	}
});