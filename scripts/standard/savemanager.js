var SaveManager = Class.extend({ 
	constructor: null,
	
	saveGame: function(path)
	{
		var serializer = new Serializer(path);
		
		partyImages = [];
		partyNames = [];
		for (var i = 0; i < Party.characters.length; i++)
		{
			partyImages[i] = false;
			partyNames[i] = Party.characters[i].name;
		}
		
		// Write the header block
		serializer.write(
			{
				headerBlock: true,
				
				location: Strings.get("name"),
				partyImages: partyImages,
				partyNames: partyNames
			}
		);
		// Write the actual save.
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
		
		// Save games include a header block for quick access in the load game screen
		if (gameData.headerBlock) gameData = serializer.read();
		
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