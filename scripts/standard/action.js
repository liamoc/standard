var Action = Class.extend({
	constructor: function(data)
	{
		this.path = data.path;
		this.target = data.target;
		this.targetAllies = data.targetAllies;
		this.targetEnemies = data.targetEnemies;
		this.defaultTarget = data.defaultTarget;
		this.damageType = data.damageType;
		this.battleEffect = data.battleEffect;
		this.fieldEffect = data.fieldEffect;
		this.power = data.power;
	},
	
	className: "Action",
	save: function(s)
	{
		s.write(this.path);
	}
});

Action.load = function(s)
{
	var path = s.read();
	var s2 = new Serializer("../data/actions/" + path);
	var data = s2.read();
	data.path = path;
	s2.close();
	return new Action(data);
}