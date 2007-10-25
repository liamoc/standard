var Ability = Class.extend({
	constructor: function(path, data)
	{
		this.path = path;
		this.data = data;
		this.name = data.name;
		this.id = data.id;
		this.type = data.type;
		this.action = data.action;
		this.action_type = data.action_type;
		this.ap_required = data.ap_required;
		this.flags = data.flags;
		this.description = data.description;
		this.mp_cost = data.mp_cost;
		this.equip_cost = data.equip_cost;
		this.stat_effect = data.stat_effect;
		this.ap = 0;
		this.equipped = false;
		this.enabled = true;
	},
	
	
	
	use: function(character)
	{
		character.stats.mp = Math.max(0, character.stats.mp - this.mp_cost);
	},
	
	getName: function()
	{
		return this.name;
	},
	
	getMenuText: function()
	{
		return this.name;
	},
	
	getMenuEndText: function()
	{
		return this.mp_cost;
	},
	
	save: function(s)
	{
		s.write(this.path);
		s.write(this.ap);
		s.write(this.equipped);
		s.write(this.enabled);
	},
	className: "Ability"
});

Ability.load = function(s)
{
	var path = s.read();
	var serializer = new Serializer("../data/abilities/" + path + ".sdl");
	var a = new Ability(path, serializer.read());
	serializer.close();
	a.ap = s.read();
	a.equipped = s.read();
	a.enabled = s.read();
	return a;
}
