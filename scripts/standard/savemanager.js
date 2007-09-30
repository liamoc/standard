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
		
		Party.characters = gameData.party.characters;
		Party.money = gameData.party.money;
		Party.items = gameData.party.items;
		serializer.close();
	},
	
	loadDefaultGame: function()
	{
		this.loadGame("../data/default.sdg");
	}
});