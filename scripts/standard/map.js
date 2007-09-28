var Map = Class.extend({
	constructor: null,
	
	change: function(map)
	{
		var mapname = map.split(".").slice(0, -1).join(".");
		Strings.unloadTable("dialog");
		if (GetFileList("data/strings/dialog/").indexOf(mapname + ".sdt") >= 0)
		{
			Strings.loadTable(mapname, "dialog");
		}
		ChangeMap(map);
	}
});