{
	enter: function()
	{
		if (!State.displayedMessage)
		{
			var eq = new EventQueue();
			eq.add(Event.messageBox, [Strings.get("test_msg")]);
			eq.add(Event.messageBox, [Strings.get("test_msg2").format(Party.characters[0].name)]);
			eq.start();
			State.displayedMessage = true;
		}
	},
	
	leave: function()
	{
		
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
			
			eq.add(Event.messageBoxChoice, [Strings.get("choose2"), ["Cancel", "Back to Menu"]]);
			eq.add(function()
			{
				switch (State.lastChoice)
				{
					case 1:
						Standard.changeScene(new TitleScene());
						break;
				}
			});
			eq.start();
		}
	}
}