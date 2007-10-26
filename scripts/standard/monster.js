var Monster = Class.extend({
	constructor: function(path)
	{
		var serializer = new Serializer("../data/monsters/" + path);
		var data = serializer.read();
		this.flashing = false;
		this.flash_frames = 4;
		this.image = data.image;
		this.name = data.name;
		this.stats = data.stats;
		this.x = 0;
		this.y = 0;
		this.isEnemy = true;
		this.atb = 0;
		this.isCharacter = false;
		this.abilities = data.abilities;
		for (var i in this.abilities)
		{
			this.abilities[i].getName = function() { return this.abilities[i].name; }.bind(this);
		}
		this.ai = data.ai;
		this.ai.tick = this.ai.tick ? this.ai.tick.bind(this) : void(0);
		this.ai.turn = this.ai.turn ? this.ai.turn.bind(this) : void(0);
		this.state = {};
		this.statusEffects = [];
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
	}
});

Monster.load = function(s)
{
	var path = s.read();
	return new Monster(path);
}