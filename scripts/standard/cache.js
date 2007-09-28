var Cache = Class.extend({
	constructor: null,
	images: {},
	getImage: function(fn)
	{
		if (!this.images[fn])
		{
			this.images[fn] = new CacheObject(LoadImage(fn));
		}
		return this.images[fn].getObject();
	}
});

var CacheObject = Class.extend({
	object: false,
	lastAccess: 0,
	
	constructor: function(object)
	{
		this.object = object;
		this.lastAccess = GetTime();
	},
	getObject: function()
	{
		this.lastAccess = GetTime();
		return this.object;
	}
});