{
	msg: false,
	menu: false,
	
	enter: function()
	{
		if (!State.displayedMessage)
		{
			this.msg = new MessageBox(Strings.get("test_msg"));
			Screen.attach(5, this.msg);
		}
	},
	
	leave: function()
	{
		if (this.msg) Screen.detach(this.msg);
	},
	
	test_1: {
		talk: function()
		{
			State.saveCount++;
			
			this.menu = new Menu(20, 20, 60, 140);
			for (var i = 0; i < 20; i++)
			{
				this.menu.addItem(new TextMenuItem(Strings.get("save_list_item").format(i + 1), ALIGN_LEFT), i);
			}
			var late_this = this;
			this.menu.onFinish = function()
			{
				State.displayedMessage = true;
				Screen.detach(late_this.menu);
				SaveManager.saveGame("../save/" + new String(late_this.menu.result + 1).numericPad(2) + ".sdg");
				if (this.msg) Screen.detach(late_this.msg);
				late_this.msg = new MessageBox(Strings.get("test_msg_2").format(State.saveCount));
				Screen.attach(5, late_this.msg);
			};
			Screen.attach(5, this.menu);
		}
	}
}