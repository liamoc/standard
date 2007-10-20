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