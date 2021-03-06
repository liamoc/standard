{
	vars: {
		lights: [
			new Light(7 * 16 + 8, 7 * 16 + 8, 0)
		]
	},
	
	enter: function()
	{
		if (!State.displayedMessage)
		{
			for (var i = 0; i < Party.characters.length; i++)
			{
				Party.characters[i].equip("weapon", Party.items[1]);
				Party.characters[i].equip("helm", Party.items[2]);
				Party.characters[i].abilities[2].equipped = true;
			}
			var eq = new EventQueue();
			//eq.add(Event.torchOn);
			eq.add(Event.messageBox, [Strings.get("test_msg")]);
			eq.add(Event.messageBox, [Strings.get("test_msg2").format(Party.characters[0].name)]);
			eq.start();
			State.displayedMessage = true;
		}
		Screen.attach(3, this.vars.lights);
	},
	
	leave: function()
	{
		Screen.detach(this.vars.lights);
	},
	
	test_1: {
		talk: function()
		{
			var eq = new EventQueue();
			
			var list = [];
			for (var i = 1; i <= 20; i++)
			{
				list.push(Strings.get("save_list_item").format(i));
			}
			eq.add(Event.messageBoxChoice, [Strings.get("choose"), list]);
			eq.add(function()
			{
				SaveManager.saveGame("../save/" + new String(State.lastChoice + 1).numericPad(2) + ".sdg");
			});
			eq.start();
		}
	},
	
	test_2: {
		talk: function()
		{
			var eq = new EventQueue();
			
			eq.add(Event.messageBoxChoice, [Strings.get("choose2"), ["Cancel", "Back to Menu", "Change Level", "Move Character", (State.torch ? "Torch Off" : "Torch On"), "Randomise HP", "Battle"]]);
			eq.add(function()
			{
				switch (State.lastChoice)
				{
					case 1:
						Event.returnToTitle();
						break;
					case 2:
						Party.characters[0].stats.level = Random(1, 99);
						break;
					case 3:
						eq.add(Event.movePerson, ["hero", "ne2s2w2nfe", true]);
						eq.add(Event.messageBox, ["You're now moving!", true]);
						eq.add(Event.wait, [60]);
						eq.add(Event.closeMessageBox);
						break;
					case 4:
						if (State.torch) eq.add(Event.torchOff);
						else eq.add(Event.torchOn);
						break;
					case 5:
						for (var i = 0; i < Party.characters.length; i++)
						{
							Party.characters[i].stats.hp = Random(1, Party.characters[i].stats.maxhp);
						}
						break;
					case 6:
						eq.add(Event.battle, ["test"]);
						break;
				}
			});
			eq.start();
		}
	}
}