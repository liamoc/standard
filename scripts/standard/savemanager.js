var SaveManager = Class.extend({ 
	constructor: null,
	
	saveGame: function(path)
	{
		var serializer = new Serializer(path);
		serializer.write(
			{
				party: {
					characters: Party.characters,
					money: Party.money,
					items: Party.items
				},
				
				state: State
			}
		);
	},
	
	loadGame: function(path)
	{
		var serializer = new Serializer(path);
		var gameData = serializer.read();
		//TODO: update game state with gameData
		
		Party.characters = gameData.party.characters;
		Party.money = gameData.party.money;
		Party.items = gameData.party.items;
		State = gameData.state;
		serializer.close();
	},
	
	loadDefaultGame: function()
	{
		this.loadGame("../data/default.sdg");
	}
});