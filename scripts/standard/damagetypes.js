var DamageTypes = Class.extend({
	constructor: null,
	
	load: function()
	{
		var serializer = new Serializer("../data/damage.sdx");
		var data = serializer.read();
		serializer.close();
		for (var did in data)
		{
			this[did] = data[did];
		}
	}
});