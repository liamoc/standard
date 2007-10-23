var Ability = Class.extend({
	constructor: function(data)
	{
		this.name = data.name;
		this.type = data.type;
		this.action = data.action;
		this.action_type = data.action_type;
		this.ap_required = data.ap_required;
		this.flags = data.flags;
		this.description = data.description;
		this.mp_cost = data.mp_cost;
		
		this.ap = 0;
		this.equipped = false;
		this.enabled = true;
	},
	
	use: function(character)
	{
		character.stats.mp = Math.max(0, character.stats.mp - this.mp_cost);
	},
	
	getMenuText: function()
	{
		return this.name;
	},
	
	getMenuEndText: function()
	{
		return this.mp_cost;
	},
});