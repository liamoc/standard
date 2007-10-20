var BattleScene = Scene.extend({
	background: false,
	monsters: [],
	constructor: function(id)
	{
		var serializer = new Serializer("../data/battles/" + id + ".sdb");
		var battle_info = serializer.read();
		serializer.close();
		this.monsters = [];
		for (var i = 0; i < battle_info.monsters.length; i++)
		{
			this.monsters.push(battle_info.monsters[i].monster);
			battle_info.monsters[i].monster.x = battle_info.monsters[i].x;
			battle_info.monsters[i].monster.y = battle_info.monsters[i].y;
			battle_info.monsters[i].monster.createGraphic();
		}
		this.music = battle_info.music;
		this.cb = new ColorBlock(Resources.colors.black);
		this.background = new Image(battle_info.background, 0, 0);
		this.enemyList = new EnemyList();
		this.partyList = new PartyList();
		this.charGraphics = [];
		for (var i = 0; i < Party.characters.length; i++)
		{
			this.charGraphics.push(new CharacterGraphic(Party.characters[i], 260 + i * 8, 72 + i * 20));
			this.charGraphics[this.charGraphics.length-1].facing = "west";
			this.charGraphics[this.charGraphics.length-1].setDirection("west_idle");
		}
	},
	
	onEnter: function()
	{
		Sounds.playMusic(this.music);
		Screen.attach(0, this.cb);
		Screen.attach(2, this.background);
		Screen.attach(9, new FadeInTransition());
		Screen.attach(7, this.enemyList);
		Screen.attach(7, this.partyList);
		for (var i = 0; i < this.monsters.length; i++)
		{
			Screen.attach(5, this.monsters[i].graphic);
		}
		for (var i = 0; i < this.charGraphics.length; i++)
		{
			Screen.attach(5, this.charGraphics[i]);
		}
		
		Standard.addTimer(this, this.tick, 1);
	},
	
	onLeave: function()
	{
		Standard.removeTimer(this, this.tick);
		Screen.detach(this.cb);
		Screen.detach(this.background);
		Screen.detach(this.enemyList);
		Screen.detach(this.partyList);
	},
	tick: function()
	{
		for (var i = 0; i < Party.characters.length; i++)
		{
			var atb_modifier = Party.characters[i].getAtbModifier();
			Party.characters[i].atb = Math.min(65536, Party.characters[i].atb + (atb_modifier * (Party.characters[i].stats.speed + 20)) / 16);
		}
	}
	
});