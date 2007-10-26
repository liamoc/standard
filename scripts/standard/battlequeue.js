var BattleQueue = Class.extend({
	queue: [],
	position: 0,
	lock: false,
	pauseBattle: false,
	id: "BattleQueue",
	constructor: function()
	{
		this.queue = [];
		this.lock = false;
	},
	
	append: function(q)
	{
		for (var i = 0; i < q.queue.length; i++)
		{
			this.queue.push(q.queue[i]);
		}
	},
	
	add: function(f, p)
	{
		this.queue.push({func: f, args: p});
	},
	
	start: function()
	{
		Standard.addTimer(this, this.check, 1);
		if (this.pauseBattle)
		{
			Event.currentBattle.waiting = true;
		}
	},
	
	check: function()
	{
		if (!this.lock || this.lock())
		{
			var item = this.next();
			if (!item)
			{
				this.finished = true;
				Event.currentBattle.waiting = false;
				Standard.removeTimer(this, this.check);
			}
		}
	},
	
	next: function()
	{
		if (this.position == this.queue.length)
		{
			return false;
		}
		this.lock = this.queue[this.position].func.apply(null, this.queue[this.position].args);
			
		this.position++;		
		
		return true;
	}
});