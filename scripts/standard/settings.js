var Settings = Class.extend({
	constructor: null,
	data: {},
	
	saveSettings: function()
	{
		var serializer = new Serializer("../data/settings.sds");
		serializer.write(this.data);
		serializer.close();
	},
	
	loadSettings: function()
	{
		var serializer = new Serializer("../data/settings.sds");
		this.data = serializer.read(this);
	},
	
	get: function(k)
	{
		return this.data[k];
	},
	
	set: function(k, v)
	{
		this.data[k] = v;
	}
});