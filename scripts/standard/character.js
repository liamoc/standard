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
		this.spriteset = Cache.getSpriteset(this.spriteset_path);
		this.atb = 0;
		this.statusEffects = [];
	},
	
	getAtbModifier: function()
	{
		var base_value = 96;
		for (var i = 0; i < this.statusEffects.length; i++)
		{
			if (this.statusEffects[i].atb != 0)
			{
				base_value -= this.statusEffects[i].atb;
			}
		}
		return base_value;
	},
	
	save: function(s)
	{
		s.write(true);
		s.write(this.name);
		s.write(this.stats);
		s.write(this.spriteset_path);
	},
	
	className: "Character"
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