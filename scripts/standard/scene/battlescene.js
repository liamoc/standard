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
			if (Party.characters[i].atb == 65536 && !this.commandAvailable.contains(Party.characters[i]))
			{
				this.requestCommand(Party.characters[i]);
			}
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
	performCommand: function(command)
	{
		switch (command.type)
		{
			case "final":
				// perform an actual action
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
						break;
				}
				var filtered = [];
				// remove items that don't meet REQUIRE
				if (command.filter.require)
				{
					for (var i = 0; i < source_list.length; i++)
					{
						var passup = false;
						for (var filter_field in command.filter.require)
						{
							if (source_list[i][filter_field] != command.filter.require[filter_field])
							{
								passup = true;
								break;
							}
						}
						if (!passup)
						{
							filtered.push(source_list[i]);
						}
					}
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
						for (var enable_field in command.filter.enable)
						{
							if (filtered[i][enable_field] != command.filter.enable[enable_field])
							{
								enable = false;
								break;
							}
						}
					}
					// now add it to the list
					var item = new TextMenuItem(filtered[i].getMenuText(), ALIGN_LEFT);
					var et = filtered[i].getMenuEndText();
					if (et)
						item.end_text = et;
					submenu.addItem(item, i);
					
				}
				var lt = this;
				submenu.allowCancel = true;
				submenu.onFinish = function()
				{
					if (submenu.canceled)
					{
						submenu.close();
						lt.commandMenu.finished = false;
					}
					else
					{
						submenu.close()
						lt.commandMenu.close();
						lt.commandAvailable[lt.currentCommandMenu].atb = 0;
						lt.commandAvailable.splice(lt.currentCommandMenu, 1);
						if (lt.currentCommandMenu == lt.commandAvailable.length)
							lt.currentCommandMenu--;
						lt.showCommandWindow();
					}
				}
				Screen.attach(7, submenu);
				break;
		}
	}
});