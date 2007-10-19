var Strings = Class.extend({
	constructor: null,

	tables: {dialog: {}},
	
	loadTable: function(table, bank)
	{
		if (!bank) bank = table;
		var serializer;
		if (bank != "map")
			serializer = new Serializer("../data/strings/" + table + ".sdt");
		else
			serializer = new Serializer("../data/strings/maps/" + table + ".sdt");
		this.tables[bank] = serializer.read();
		serializer.close();
	},
	
	unloadTable: function(bank)
	{
		delete this.tables[bank];
	},
	
	get: function(id, bank)
	{
		if (!bank) bank = "map";
		return this.tables[bank][id];
	}
});