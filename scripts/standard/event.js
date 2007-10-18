var Event = Class.extend({
	constructor: null,
	
	addFunction: function(name, f)
	{
		this[name] = f;
	},
	
	loadHooks: [],
	
	addLoadingHook: function(f)
	{
		this.loadHooks.push(f);
	},
	
	runLoadingHooks: function()
	{
		for (var i = 0; i < this.loadHooks.length; i++)
		{
			this.loadHooks[i]();
		}
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
		Standard.detachInput();
	},
	
	check: function()
	{
		if (!this.lock || this.lock())
		{
			if (!this.next())
			{
				Standard.removeTimer(this, this.check);
				Standard.attachInput("hero");
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

Event.addFunction("messageBox", function(str, nowait)
{
	Event.closeMessageBox();
	var msg = new MessageBox(str);
	Screen.attach(5, msg);
	Event.currentMessageBox = msg;
	if (!nowait)
	{
		return function()
		{
			return msg.finished;
		};
	}
});

Event.addFunction("closeMessageBox", function()
{
	if (Event.currentMessageBox) Event.currentMessageBox.close();
	if (Event.currentMessageChoice) Event.currentMessageChoice.close();
	Event.currentMessageBox = false;
	Event.currentMessageChoice = false;
});

Event.addFunction("messageBoxChoice", function(str, items)
{
	Event.closeMessageBox();
	var msg = new MessageBox(str);
	Event.currentMessageBox = msg;
	Screen.attach(5, msg);
	
	var choice = new Menu(204, 78, 100, Resources.fonts.standard.getHeight() * Math.min(items.length, 3));
	for (var i = 0; i < items.length; i++)
	{
		choice.addItem(new TextMenuItem(items[i], ALIGN_LEFT), i);
	}
	State.lastChoice = -1;
	choice.onFinish = function() { State.lastChoice = choice.result; };
	Screen.attach(5, choice);
	Event.currentMessageChoice = choice;
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

Event.addFunction("torchOn", function(attach)
{
	if (Event.torch) Screen.detach(Event.torch);
	if (!attach) attach = "hero";
	var torch = new Torch(attach);
	Screen.attach(4, torch);
	Event.torch = torch;
	State.torch = true;
});

Event.addFunction("torchOff", function()
{
	Screen.detach(Event.torch);
	State.torch = false;
	Event.torch = false;
});

Event.addLoadingHook(function()
{
	if (State.torch) Event.torchOn();
});

Event.addFunction("returnToTitle", function()
{
	Screen.detachAll();
	Standard.changeScene(new TitleScene());
});

Event.addFunction("movePerson", function(person, queue, nowait)
{
	var log = OpenLog( "move.txt");
	var queue = queue.toLowerCase();
	var last_cmd = false;
	var simple_map = {
		n: COMMAND_MOVE_NORTH,
		s: COMMAND_MOVE_SOUTH,
		e: COMMAND_MOVE_EAST,
		w: COMMAND_MOVE_WEST,
		p: COMMAND_WAIT,
		fn: COMMAND_FACE_NORTH,
		fs: COMMAND_FACE_SOUTH,
		fe: COMMAND_FACE_EAST,
		fw: COMMAND_FACE_WEST
	};
	
	function QueueStandardCommand(cmd)
	{
		var command = simple_map[cmd];
		for (var i = 0; i < 16; i++)
		{
			QueuePersonCommand(person, command, false);
		}
	}
	
	for (var i = 0; i < queue.length; i++)
	{
		log.write("Position: " + i);
		var cmd = queue.charAt(i);
		if (cmd.match(/^\d+$/))
		{
			while (i < queue.length && queue.charAt(i+1).match(/^\d+$/))
			{
				cmd += queue.charAt(i+1);
				i++;
			}
			log.write("Repeating " + parseInt(cmd));
			if (!last_cmd) throw "Repeat at start of movement sequence is invalid.";
			for (var j = 0; j < parseInt(cmd) - 1; j++)
			{
				QueueStandardCommand(last_cmd);
			}
		}
		else if (cmd == "f")
		{
			i++;
			cmd += queue.charAt(i);
			log.write("Face: " + cmd);
			QueuePersonCommand(person, simple_map[cmd], false);
		}
		else
		{
			log.write("Move: " + cmd);
			if (cmd != last_cmd && simple_map["f" + cmd])
			{
				QueuePersonCommand(person, simple_map["f" + cmd], false);
			}
			QueueStandardCommand(cmd);
		}
		last_cmd = cmd;
	}
	if (!nowait)
	{
		return function()
		{
			return IsCommandQueueEmpty(person);
		}
	}
});

Event.addFunction("wait", function(frames)
{
	var ret_val = false;
	var timer_func = function()
	{
		ret_val = true;
		Standard.removeTimer(null, timer_func);
	}
	Standard.addTimer(null, timer_func, frames);
	return function()
	{
		return ret_val;
	}
});