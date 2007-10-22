var Monster = Class.extend({
	constructor: function(path)
	{
		var serializer = new Serializer("../data/monsters/" + path);
		var data = serializer.read();
		this.image = data.image;
		this.name = data.name;
		this.stats = data.stats;
		this.x = 0;
		this.y = 0;
	},
	damage: function(amount)
	{
		this.stats.hp = Math.min(this.stats.maxhp, Math.max(0, this.stats.hp - amount));
	},
	getStat: function(stat)
	{
		return this.stats[stat];
	},
	createGraphic: function()
	{
		this.graphic = new MonsterGraphic(this, this.x, this.y);
	}
	
});

Monster.load = function(s)
{
	var path = s.read();
	return new Monster(path);
}