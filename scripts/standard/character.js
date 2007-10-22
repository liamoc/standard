var Character = Class.extend({
	spriteset_path: "",
	
	constructor: function(data)
	{
		this.name = data.name;
		this.stats = data.stats;
		this.spriteset_path = data.spriteset_path;
		this.commands = data.commands;

		this.spriteset = Cache.getSpriteset(this.spriteset_path);
		this.atb = 0;
		this.statusEffects = [];
		this.abilities = [];
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
		s.write({
			name: this.name,
			stats: this.stats,
			spriteset_path: this.spriteset_path,
			commands: this.commands
		});
	},
	
	className: "Character"
});

Character.load = function(s)
{
	var extended = s.read();
	if (extended)
	{
		var data = s.read();
		return new Character(data);
	}
	var path = s.read();
	var s2 = new Serializer("../data/characters/" + path);
	var data = s2.read();
	s2.close();
	return new Character(data);
}