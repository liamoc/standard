var Commands = Class.extend({
	constructor: null,
	
	load: function()
	{
		var serializer = new Serializer("../data/commands.sdx");
		var data = serializer.read();
		serializer.close();
		for (var i = 0; i < data.length; i++)
		{
			var command = data[i];
			
			this[command.id] = command;
		}
	}
});