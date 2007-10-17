var Event = Class.extend({
	constructor: null,
	
	addFunction: function(name, f)
	{
		this[name] = f;
	}
});

var EventQueue = Class.extend({
	queue: [],
	position: 0,
	lock: false,
	
	constructor: function()
	{
		this.queue = [];
		this.lock = false;
	},
	
	add: function(f, p, auto)
	{
		this.queue.push({func: f, args: p, auto: auto});
	},
	
	start: function()
	{
		Standard.addTimer(this, this.check, 1);
	},
	
	check: function()
	{
		if (!this.lock || this.lock())
		{
			if (!this.next())
			{
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
		
		this.lock = this.queue[this.position].func.apply(this.queue[this.position].func, this.queue[this.position].args);
		
		if (this.queue[this.position].auto)
			this.lock = false;
		
		this.position++;		
		
		return true;
	}
});

Event.addFunction("messageBox", function(str)
{
	var msg = new MessageBox(str);
	Screen.attach(5, msg);
	
	return function()
	{
		return msg.finished;
	};
});

Event.addFunction("messageBoxChoice", function(str, items)
{
	var msg = new MessageBox(str);
	Screen.attach(5, msg);
	
	var choice = new Menu(204, 78, 100, Resources.fonts.standard.getHeight() * Math.min(items.length, 3));
	for (var i = 0; i < items.length; i++)
	{
		choice.addItem(new TextMenuItem(items[i], ALIGN_LEFT), i);
	}
	State.lastChoice = -1;
	choice.onFinish = function() { State.lastChoice = choice.result; };
	Screen.attach(5, choice);
	return function()
	{
		if (choice.finished)
		{
			msg.close();
		}
		return choice.finished;
	};
});

Event.addFunction("choice", function(items)
{
	var choice = new Menu(180, 60, 120, Resources.fonts.standard.getHeight() * 2);
	for (var i = 0; i < items.length; i++)
	{
		choice.addItem(new TextMenuItem(items[i], ALIGN_LEFT), i);
	}
	State.lastChoice = -1;
	choice.onFinish = function() { State.lastChoice = choice.result; };
	Screen.attach(5, choice);
	return function()
	{
		return choice.finished;
	}
});