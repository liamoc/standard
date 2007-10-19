var Monster = Class.extend({
	constructor: function(path)
	{
		var serializer = new Serializer("../data/monsters/" + path);
		var data = serializer.read();
		this.image = data.image;
		this.name = data.name;
		this.stats = data.stats;
	}
	
});

Monster.load = function(s)
{
	var path = s.read();
	return new Monster(path);
}