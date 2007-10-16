var SaveManager = Class.extend({ 
	constructor: null,
	
	saveGame: function(path)
	{
		var serializer = new Serializer(path);
		
		partyImages = [];
		partyNames = [];
		partyLevels = [];
		for (var i = 0; i < Party.characters.length; i++)
		{
			partyImages[i] = Party.characters[i].spriteset_path;
			partyNames[i] = Party.characters[i].name;
			partyLevels[i] = Party.characters[i].stats.level;
		}
		
		// Write the header block
		serializer.write(
			{
				headerBlock: true,
				
				location: Strings.get("name"),
				partyImages: partyImages,
				partyNames: partyNames,
				partyLevels: partyLevels
			}
		);
		
		var personData = [];
		
		var personList = GetPersonList();
		for (var i = 0; i < personList.length; i++)
		{
			var p = personList[i];
			personData.push({
				p: p,
				x: GetPersonX(p),
				y: GetPersonY(p),
				l: GetPersonLayer(p),
				d: GetPersonDirection(p)
			});
		}
		
		// Write the actual save.
		serializer.write(
			{
				party: {
					characters: Party.characters,
					money: Party.money,
					items: Party.items
				},
				
				state: State,
				
				controls: Config.controls,
				
				map: GetCurrentMap(),
				personData: personData
			}
		);
	},
	
	loadGame: function(path, basic)
	{
		var serializer = new Serializer(path);
		var gameData = serializer.read();
		
		// Save games include a header block for quick access in the load game screen
		if (gameData.headerBlock) gameData = serializer.read();
		
		Party.characters = gameData.party.characters;
		Party.money = gameData.party.money;
		Party.items = gameData.party.items;
		State = gameData.state;
		if (gameData.controls) Config.controls = gameData.controls;
		serializer.close();
		
		if (!basic)
		{
			SetTalkActivationKey(Config.controls.accept);
			CreatePerson("hero", Party.characters[0].spriteset_path, false);
			Standard.attachInput("hero");
		
			Standard.changeScene(new MapScene());
			Map.change(gameData.map);
			for (var i = 0; i < gameData.personData.length; i++)
			{
				SetPersonX(gameData.personData[i].p, gameData.personData[i].x);
				SetPersonY(gameData.personData[i].p, gameData.personData[i].y);
				SetPersonLayer(gameData.personData[i].p, gameData.personData[i].l);
				SetPersonDirection(gameData.personData[i].p, gameData.personData[i].d);
			}
		}
	},
	
	loadDefaultGame: function()
	{
		this.loadGame("../data/default.sdg", true);
	}
});