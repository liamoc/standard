/*
 * MapScripts are inspired by ScriptBind by tunginobi
 */

var Map = Class.extend({
	constructor: null,
	
	init: function()
	{
		[
			[SCRIPT_ON_ENTER_MAP, "Map.loadScripts(); Map.callMapScript(\"enter\");"],
			[SCRIPT_ON_LEAVE_MAP, "Map.callMapScript(\"leave\");"],
			[SCRIPT_ON_LEAVE_MAP_NORTH, "Map.callMapScript(\"leaveNorth\");"],
			[SCRIPT_ON_LEAVE_MAP_EAST, "Map.callMapScript(\"leaveEast\");"],
			[SCRIPT_ON_LEAVE_MAP_SOUTH, "Map.callMapScript(\"leaveSouth\");"],
			[SCRIPT_ON_LEAVE_MAP_WEST, "Map.callMapScript(\"leaveWest\");"]
		].forEach(function(s) { SetDefaultMapScript(s[0], s[1]); });
	},
	
	scriptData: {},
	
	loadScripts: function()
	{
		var script_filename = Path.baseName(GetCurrentMap()) + ".js";
		var script_path = "../scripts/maps/" + script_filename;
		if (Path.exists(script_path))
		{
			this.scriptData = Files.loadJson(script_path);
		}
		else
		{
			this.scriptData = {};
		}
		
		// Attach scripts to persons
		GetPersonList().forEach(function (p) {
			[
				[SCRIPT_ON_CREATE, "create"],
				[SCRIPT_ON_DESTROY, "destroy"],
				[SCRIPT_ON_ACTIVATE_TOUCH, "touch"],
				[SCRIPT_ON_ACTIVATE_TALK, "talk"],
				[SCRIPT_COMMAND_GENERATOR, "generator"]
			].forEach(function (s) {
				SetPersonScript(p, s[0], "Map.callPersonScript(\"" + p + "\", \"" + s[1] + "\");");
			});
		});
	},
	
	callMapScript: function(script)
	{
		if (script in this.scriptData)
		{
			this.scriptData[script].call(this.scriptData);
		}
	},
	
	callPersonScript: function(person, script)
	{
		if (person in this.scriptData)
		{
			if (script in this.scriptData[person])
			{
				this.scriptData[person][script].call(this.scriptData);
			}
		}
	},
	
	change: function(map)
	{
		Sounds.stopMusic();
		var mapname = Path.baseName(map);
		Strings.unloadTable("map");
		if (GetFileList("data/strings/maps/").indexOf(mapname + ".sdt") >= 0)
		{
			Strings.loadTable(mapname, "map");
		}
		ChangeMap(map);
		if (Strings.get("music"))
		{
			Sounds.playMusic(Strings.get("music"));
		}
	}
});