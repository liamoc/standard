var EnemyList = Window.extend({
	constructor: function()
	{
		this.base(4, 164, 70, 72, false);
		this.clipContents = true;
	},
	
	renderContent: function()
	{
		for (var i = 0; i < Event.currentBattle.monsters.length; i++)
		{
			this.font.drawText(this.x, this.y + i * (72 / 4), Event.currentBattle.monsters[i].name);
		}
		
	}
});