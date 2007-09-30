var Character = Class.extend({
	spriteset_path: "",
	
	constructor: function(path_name, stats, spriteset_path)
	{
		if (stats !== undefined)
		{
			// extended
			this.name = path_name;
			this.stats = stats;
			this.spriteset_path = spriteset_path;
		}
		else
		{
			// from file
			var s = new Serializer("../data/characters/" + path_name);
			var data = s.read();
			this.name = data.name;
			this.stats = data.stats;
			this.spriteset_path = data.spriteset_path;
			s.close();
		}
	}
});

Character.load = function(s)
{
	var extended = s.read();
	if (extended)
	{
		var name = s.read();
		var stats = s.read();
		var spriteset_path = s.read();
		return new Character(name, stats, spriteset_path);
	}
	
	var path = s.read();
	return new Character(path);
}