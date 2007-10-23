var EnemyList = Window.extend({
	constructor: function()
	{
		this.base(4, 164, 70, 72, false);
		this.clipContents = true;
		//this.font = Resources.fonts.corbel;
		this.padding = 2;
	},
	
	renderContent: function()
	{
		this.font.setColorMask(Resources.colors.white);
		for (var i = 0; i < Event.currentBattle.monsters.length; i++)
		{
			this.font.drawText(this.x, this.y + i * (72 / 4), Event.currentBattle.monsters[i].name);
		}
		
	}
});