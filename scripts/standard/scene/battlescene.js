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
	},
	
	onRemove: function()
	{
		Screen.detach(this.cb);
		Screen.detach(this.background);
		Screen.detach(this.enemyList);
		Screen.detach(this.partyList);
	}
});