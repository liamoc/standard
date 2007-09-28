var Strings = Class.extend({
	constructor: null,

	tables: {dialog: {}},
	
	loadTable: function(table, bank)
	{
		if (!bank) bank = table;
		var serializer;
		if (bank != "dialog")
			serializer = new Serializer("../data/strings/" + table + ".sdt");
		else
			serializer = new Serializer("../data/strings/dialog/" + table + ".sdt");
		this.tables[bank] = serializer.read();
		serializer.close();
	},
	
	unloadTable: function(bank)
	{
		delete this.tables[bank];
	},
	
	get: function(id, bank)
	{
		if (!bank) bank = "dialog";
		return this.tables[bank][id];
	}
});