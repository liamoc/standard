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
		}
		this.cb = new ColorBlock(Resources.colors.black);
		this.background = new Image(battle_info.background, 0, 0);
		this.enemyList = new EnemyList();
		this.partyList = new PartyList();
		
		Sounds.playMusic(battle_info.music);
		
	},
	
	onEnter: function()
	{
		Screen.attach(0, this.cb);
		Screen.attach(5, this.background);
		Screen.attach(9, new FadeInTransition());
		Screen.attach(5, this.enemyList);
		Screen.attach(5, this.partyList);
	},
	
	onRemove: function()
	{
		Screen.detach(this.cb);
		Screen.detach(this.background);
		Screen.detach(this.enemyList);
		Screen.detach(this.partyList);
	}
});