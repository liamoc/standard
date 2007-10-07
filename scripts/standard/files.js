var Files = Class.extend({
	constructor: null,
	
	loadJson: function(filename)
	{
		var f = OpenRawFile(filename);
		var json = CreateStringFromByteArray(f.read(f.getSize()));
		return eval('(' + json + ')');
	}
});