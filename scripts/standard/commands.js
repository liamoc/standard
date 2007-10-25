var Commands = Class.extend({
	constructor: null,
	
	load: function()
	{
		var serializer = new Serializer("../data/commands.sdx");
		var data = serializer.read();
		serializer.close();
		for (var cid in data)
		{
			this[cid] = data[cid];
			this[cid].getName = function()
			{
				return this[cid].name;
			}
		}
	}
});