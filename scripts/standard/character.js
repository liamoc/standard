var Character = Class.extend({
	spriteset_path: "",
	
	constructor: function(data)
	{
		this.name = data.name;
		this.stats = data.stats;
		this.spriteset_path = data.spriteset_path;
		this.commands = data.commands;
		this.isCharacter = true;
		this.isEnemy = false;
		this.spriteset = Cache.getSpriteset(this.spriteset_path);
		this.atb = 0;
		this.statusEffects = [];
		this.abilities = data.abilities;
		this.usable_abilities = data.usable_abilities;
		this.equipment = data.equipment;
		this.displayHp = this.stats.hp;
	},
	equip: function(slot, item)
	{
		this.equipment[slot] = item;
		item.use();
		for (var i = 0; i < item.abilities.length; i++)
		{
			var ability = item.abilities[i];
			// find this ability in our ability list
			for (var j = 0; j < this.abilities.length; j++)
			{
				if (this.abilities[j].id == ability)
				{
					this.abilities[j].enabled = true;
					continue;
				}
			}
			
			// if we couldn't find it, check if we can actually use this ability
			if (this.usable_abilities.contains(ability))
			{
				// add this ability to our list
				var serializer = new Serializer("../data/abilities/" + ability + ".sdl");
				var data = serializer.read();
				serializer.close();
				var ability = new Ability(ability, data)
				ability.enabled = true;
				ability.ap = 0;
				this.abilities.push(ability);
			}
			// otherwise, do nothing.
		}
	},
	unequip: function(slot)
	{
		var item = this.equipment[slot];
		
		for (var i = 0; i < item.abilities.length; i++)
		{
			var ability = item.abilities[i];
			// find this ability in our ability list
			var list_ability = false;
			for (var j = 0; j < this.abilities.length; j++)
			{
				if (this.abilities[j].id == ability)
				{
					list_ability = this.abilities[j];
				}
			}
			// is this ability mastered?
			if (list_ability.ap == list_ability.ap_required)
			{
				// we don't need to disable it, check the next ability
				continue;
			}
			// is this ability on any other item?
			var keep = false;
			for (var cslot in this.equipment)
			{
				if (this.equipment[cslot].abilities.contains(ability))
				{
					keep = true;
					break;
				}
			}
			
			if (!keep)
				list_ability.enabled = false;
		}
		
		this.equipment[slot] = false;
		return item;
	},
	getStat: function(stat)
	{
		var val = this.stats[stat];
		for (var i in this.equipment)
		{
			if (this.equipment[i].stats[stat])
				val += this.equipment[i].stats[stat];
		}
		for (var i = 0; i < this.abilities.length; i++)
		{
			if (this.abilities[i].equipped && this.abilities[i].stat_effect[stat])
			{
				val = this.abilities[i].stat_effect[stat](val);
			}
		}
		return val;
	},
	damage: function(amount)
	{
		this.stats.hp = Math.min(this.getStat("maxhp"), Math.max(0, this.stats.hp - amount));
		this.displayHpTick = 60;
		this.displayHpPerFrame = (this.stats.hp - this.displayHp) / 60;
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
			commands: this.commands,
			abilities: this.abilities,
			usable_abilities: this.usable_abilities
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