var Action = Class.extend({
	constructor: function(data)
	{
		this.target = data.target;
		this.targetAllies = data.targetAllies;
		this.targetEnemies = data.targetEnemies;
		this.defaultTarget = data.defaultTarget;
		this.damageType = data.damageType;
		this.battleEffect = data.battleEffect;
		this.fieldEffect = data.fieldEffect;
		this.power = data.power;
	}
});

Action.load = function(s)
{
	var s2 = new Serializer("../data/actions/" + s.read());
	var data = s2.read();
	s2.close();
	return new Action(data);
}