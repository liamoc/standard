{
	msg: false,
	
	enter: function()
	{
		this.msg = new MessageBox(Strings.get("test_msg"));
		Screen.attach(5, this.msg);
	},
	
	leave: function()
	{
		Screen.detach(this.msg);
	},
	
	test_1: {
		talk: function()
		{
			Screen.detach(this.msg);
			this.msg = new MessageBox(Strings.get("test_msg_2"));
			Screen.attach(5, this.msg);
		}
	}
}