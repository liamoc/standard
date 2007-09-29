var SaveManager = Class.extend({
	constructor: null,
	
	saveGame: function(path)
	{
		//TODO: save game
	},
	
	loadGame: function(path)
	{
		var serializer = new Serializer(path);
		var gameData = serializer.read();
		
		//TODO: update game state with gameData
		
	},
	
	loadDefaultGame: function()
	{
		this.loadGame("../rawdata/default.sdg");
	}
});