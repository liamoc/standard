var Item = Class.extend({
	constructor: function(path, num)
	{
		this.path = path;
		this.num = num;
		
		var serializer = new Serializer("../data/items/" + path);
		var data = serializer.read();
		this.name = data.name;
		this.flags = data.flags;
		this.icon = data.icon;
		this.stats = data.stats;
		this.description = data.description;
		serializer.close();
	},
	getMenuText: function()
	{
		return this.name;
	},
	getMenuEndText: function()
	{
		return this.num;
	},
	className: "Item",
	save: function(s)
	{
		s.write(this.path);
		s.write(this.num);
	}
});

Item.load = function(s)
{
	return new Item(s.read(), s.read());
}