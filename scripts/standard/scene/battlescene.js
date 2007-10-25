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
		this.commandAvailable = [];
		this.currentCommandMenu = 0;
		this.partyList = new PartyList();
		this.charGraphics = [];
		this.waitingCommandQueues = [];
		this.currentCommandQueue = false;
		for (var i = 0; i < Party.characters.length; i++)
		{
			this.charGraphics.push(new CharacterGraphic(Party.characters[i], 260 + i * 8, 72 + i * 20));
			this.charGraphics[this.charGraphics.length-1].facing = "west";
			this.charGraphics[this.charGraphics.length-1].setDirection("west_idle");
			Party.characters[i].graphic = this.charGraphics[this.charGraphics.length-1];
			Party.characters[i].displayHp = Party.characters[i].stats.hp;
		}
	},
	
	onEnter: function()
	{
		Sounds.playMusic(this.music);
		Screen.attach(0, this.cb);
		Screen.attach(2, this.background);
		Screen.attach(9, new FadeInTransition());
		Screen.attach(6, this.enemyList);
		Screen.attach(6, this.partyList);
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
	
	particleAnimation: function(params, frames, dontblock)
	{
		var anim = new ParticleAnimation(params, frames);
		Screen.attach(7, anim);
		if (!dontblock)
		{
			return function()
			{
				return anim.finished;
			};
		}
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
			if (Party.characters[i].waiting)
				continue;
			var atb_modifier = Party.characters[i].getAtbModifier();
			Party.characters[i].atb = Math.min(65536, Party.characters[i].atb + (atb_modifier * (Party.characters[i].stats.speed + 20)) / 16);
			if (Party.characters[i].atb == 65536 && !this.commandAvailable.contains(Party.characters[i]))
			{
				this.requestCommand(Party.characters[i]);
			}
			
			if (Party.characters[i].displayHpTick > 0)
			{
				Party.characters[i].displayHpTick--;
				Party.characters[i].displayHp = Party.characters[i].displayHp + Party.characters[i].displayHpPerFrame;
			}
		}
		
		if ((!this.currentCommandQueue || this.currentCommandQueue.finished) && this.waitingCommandQueues.length)
		{
			this.currentCommandQueue = this.waitingCommandQueues.splice(0, 1)[0];
			this.currentCommandQueue.start();
		}
	},
	requestCommand: function(character)
	{
		this.commandAvailable.push(character);
		if (this.commandAvailable.length == 1)
		{
			// We just added this, so show the next command window automatically
			this.showCommandWindow();
		}
	},
	showCommandWindow: function()
	{
		if (this.currentCommandMenu > this.commandAvailable.length - 1)
		{
			this.currentCommandMenu = this.commandAvailable.length - 1;
		}
		var c = this.commandAvailable[this.currentCommandMenu];
		var menu = new Menu(24, 154, 70, Resources.fonts.standard.getHeight() * 4, false);
		menu.autoClose = false;
		menu.allowCancel = true;
		for (var i = 0; i < c.commands.length; i++)
		{
			if (c.commands[i])
				menu.addItem(new TextMenuItem(Commands[c.commands[i]].name, ALIGN_LEFT), i);
		}
		var lt = this;
		menu.onFinish = function()
		{
			if (menu.canceled)
			{
				lt.currentCommandMenu++;
				if (lt.currentCommandMenu == lt.commandAvailable.length)
					lt.currentCommandMenu = 0;
				menu.close();
				lt.showCommandWindow();
			}
			else
			{
				var cmd = Commands[c.commands[menu.result]];
				lt.performCommand(cmd);
			}
		}
	
		Screen.attach(7, menu);
		this.commandMenu = menu;
		this.partyList.selectCharacter(c);
	},
	damage: function(action, source, targets, extra)
	{
		var damages = DamageTypes[action.damageType](action, source, targets, extra);
		
		for (var i = 0; i < damages.length; i++)
		{
			targets[i].damage(damages[i]);
			Screen.attach(8, new DamageNumbers(damages[i], targets[i].graphic.centerX, targets[i].graphic.centerY));
		}
	},

	invokeAction: function(action_source, action, source, targets, extra)
	{
		var queue = new BattleQueue();
		var dir = source.graphic.dir;
		switch (dir)
		{
			case "east":
			case "east_idle":
				var op_dir = "west";
				var dir = "east";
				break;
			case "west":
			case "west_idle":
				var op_dir = "east";
				var dir = "west";
				break;
		}
		var set_dir = Bind(source.graphic.setDirection, source.graphic);
		if (!action_source.flags.basic)
		{
			queue.add(this.showActionName, [action_source.getName()]);
		}
		if (source.isEnemy)
		{
			queue.add(this.flashEnemy, [source]);
		}
		else
		{
			queue.add(set_dir, [dir]);
			queue.add(this.moveCharacterForward, [source]);
			queue.add(set_dir, [dir + "_idle"]);
		}
		queue.append(action.battleEffect(source, targets, extra));
		if (source.isCharacter)
		{
			queue.add(set_dir, [op_dir]);
			queue.add(this.moveCharacterBack, [source]);
			queue.add(set_dir, [dir + "_idle"]);
		}
		queue.add(function() { source.waiting = false; });
		this.waitingCommandQueues.push(queue);
		source.waiting = true;
	},
	moveCharacterForward: function(character)
	{
		switch (character.graphic.facing)
		{
			case "west":
				character.graphic.moveTo(character.graphic.x - 32, character.graphic.y, 40);
				break;
		}
		return function()
		{
			return character.graphic.moveFrames == 0;
		}
	},
	showActionName: function(name)
	{
		Screen.attach(8, new AbilityNameWindow(name));
		return false;
	},
	moveCharacterBack: function(character)
	{
		switch (character.graphic.facing)
		{
			case "west":
				character.graphic.moveTo(character.graphic.x + 32, character.graphic.y, 40);
				break;
		}
		return function()
		{
			return character.graphic.moveFrames == 0;
		}
	},
	flashEnemy: function(enemy)
	{
		//TODO: implement
		return false;
	},
	performCommand: function(command)
	{
		switch (command.type)
		{
			case "action":
				// perform an actual action
				// choose a target
				var targetChooser = new TargetChooser(command.action);
				var lt = this;
				targetChooser.onFinish = function()
				{
					if (targetChooser.canceled)
					{
						lt.commandMenu.finished = false;
					}
					else
					{
						lt.commandMenu.close();
						lt.invokeAction(command, command.action, lt.commandAvailable[lt.currentCommandMenu], targetChooser.targets);
						lt.commandMenu.close();
						lt.commandAvailable[lt.currentCommandMenu].atb = 0;
						lt.commandAvailable.splice(lt.currentCommandMenu, 1);
						if (lt.currentCommandMenu >= lt.commandAvailable.length)
							lt.currentCommandMenu = lt.commandAvailable.length;
						if (lt.commandAvailable.length)
						{
							lt.showCommandWindow();
						}	
						else
						{
							lt.partyList.selectCharacter(false);
						}
					}
				}
				Screen.attach(7, targetChooser);
				break;
			case "menu":
				// show a submenu
				
				var submenu = new Menu(44, 154, 110, Resources.fonts.standard.getHeight() * 4);
				
				// what's the source of this submenu?
				var source_list = [];
				switch (command.filter.source)
				{
					case "items":
						source_list = Party.items;
						break;
					case "abilities":
						source_list = this.commandAvailable[this.currentCommandMenu].abilities;
						break;
				}
				var filtered = [];
				// remove items that don't meet REQUIRE
				if (command.filter.require)
				{
					filtered = source_list.filter(command.filter.require);
				}
				else
				{
					filtered = source_list;
				}
				
				// add these items to the list.
				
				for (var i = 0; i < filtered.length; i++)
				{
					var enable = true;
					// does this item meet ENABLE?
					if (command.filter.enable)
					{
						if (!command.filter.enable(filtered[i], this.commandAvailable[this.currentCommandMenu]))
							enable = false;
					}
					// now add it to the list
					var item = new TextMenuItem(filtered[i].getMenuText(), ALIGN_LEFT);
					item.disabled = !enable;
					var et = filtered[i].getMenuEndText();
					if (et)
						item.end_text = et;
					submenu.addItem(item, filtered[i]);
					
				}
				var lt = this;
				submenu.allowCancel = true;
				submenu.autoClose = false;
				submenu.onFinish = function()
				{
					if (submenu.canceled)
					{
						submenu.close();
						lt.commandMenu.finished = false;
					}
					else
					{
						var targetChooser = new TargetChooser(command.customAction ? command.customAction : submenu.result.action);
						targetChooser.onFinish = function()
						{
							if (targetChooser.canceled)
							{
								submenu.finished = false;
							}
							else
							{
								lt.commandMenu.close();
								submenu.result.use(lt.commandAvailable[lt.currentCommandMenu]);
								submenu.close();
								if (command.customAction)
								{
									lt.invokeAction(command, command.customAction, lt.commandAvailable[lt.currentCommandMenu], targetChooser.targets, submenu.result);
								}
								else
								{
									lt.invokeAction(submenu.result, submenu.result.action, lt.commandAvailable[lt.currentCommandMenu], targetChooser.targets);
								}
								lt.commandAvailable[lt.currentCommandMenu].atb = 0;
								lt.commandAvailable.splice(lt.currentCommandMenu, 1);
								if (lt.currentCommandMenu >= lt.commandAvailable.length)
									lt.currentCommandMenu = lt.commandAvailable.length;
								if (lt.commandAvailable.length)
								{
									lt.showCommandWindow();
								}	
								else
								{
									lt.partyList.selectCharacter(false);
								}
							}
						}
						Screen.attach(7, targetChooser);

					}
				}
				Screen.attach(7, submenu);
				break;
		}
	}
});