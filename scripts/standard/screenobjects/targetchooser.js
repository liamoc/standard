var TargetChooser = ScreenObject.extend({
	acceptsInput: true,
	
	constructor: function(action)
	{
		this.action = action;
		this.targetImage = Cache.getImage("target.png");
		this.targetSet = action.defaultTarget;
		this.finished = false;
		this.canceled = false;
		this.onFinish = false;
		
		if (action.target == "multiple")
		{
			this.targetMultiple = true;
		}
		else
		{
			this.targetMultiple = false;
		}
		this.targetId = 0;
	},
	
	render: function()
	{
		if (!this.targetMultiple)
		{
			switch (this.targetSet)
			{
				case "enemy":
					var cTarget = Event.currentBattle.monsters[this.targetId];
					var graphic = cTarget.graphic;
					this.targetImage.blit(graphic.center.x - 8, graphic.center.y - 24);
					break;
				case "ally":
					var graphic = Event.currentBattle.charGraphics[this.targetId];
					this.targetImage.blit(graphic.center.x - 8, graphic.center.y - 24);
			}
		}
	},
	
	acceptKey: function(key)
	{
		if (this.finished) return;
		var max = 0;
		if (this.targetSet == "enemy")
		{
			max = Event.currentBattle.monsters.length - 1;
		}
		else if (this.targetSet == "ally")
		{
			max = Event.currentBattle.charGraphics.length - 1;
		}
		switch (key)
		{
			case Config.controls.up:
				this.targetId--;
				if (this.targetId == -1)
				{
					this.targetId = max;
				}
				break;
			case Config.controls.down:
				this.targetId++;
				if (this.targetId > max)
				{
					this.targetId = 0;
				}
				break;
			case Config.controls.left:
			case Config.controls.right:
				if (this.targetSet == "ally" && this.action.targetEnemies)
					this.targetSet = "enemy";
				else if (this.targetSet == "enemy" && this.action.targetAllies)
					this.targetSet = "ally";
				this.targetId = 0;
				break;
			case Config.controls.accept:
				this.finished = true;
				this.canceled = false;
				if (this.targetSet == "enemy")
				{
					this.targets = [Event.currentBattle.monsters[this.targetId]];
				}
				else if (this.targetSet == "ally")
				{
					this.targets = [Party.characters[this.targetId]];
				}
				this.finish();
				break;
			case Config.controls.cancel:
				this.finished = true;
				this.canceled = true;
				this.finish();
				break;
		}
	},
	finish: function()
	{
		if (this.onFinish) this.onFinish();
		Screen.detach(this);
	}
});