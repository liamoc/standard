var SerializedResources = Class.extend({
	constructor: null,
	
	image: {
		get: function(path)
		{
			return {
				className: "SerializedResources.image",
				save: function(s) { s.write(path); }
			};
		},
		load: function(s)
		{
			return Cache.getImage(s.read());
		}
	},
	
	character:
	{
		get: function(path)
		{
			return {
				className: "Character",
				save: function(s) { s.write(false); s.write(path); }
			};
		}
	},
	
	item:
	{
		get: function(path, num)
		{
			return {
				className: "Item",
				save: function(s) { s.write(path); s.write(num); }
			};
		}
	},
	
	monster:
	{
		get: function(path)
		{
			return {
				className: "Monster",
				save: function(s) { s.write(path); }
			};
		}
	}
});