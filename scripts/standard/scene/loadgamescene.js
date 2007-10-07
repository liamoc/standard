var LoadGameScene = Scene.extend({
	menu: false,
	exitTrans: false,
	
	constructor: function()
	{
		Strings.loadTable("save");
		this.menu = new Menu(32, 48, 256, 160);
		this.menu.pointer = new BoxMenuPointer();
		this.menu.pointer.padding = [4, 4, 4, 4];
		for (var i = 0; i < 100; i++)
		{
			this.menu.addItem(new LoadGameMenuItem(i + 1, ALIGN_LEFT), this.loadGame);
		}
		var bind_this = this;
		this.menu.onFinish = function() { bind_this.menuFinished.call(bind_this); }
		this.exitTrans = new FadeOutTransition();
		this.exitTrans.color = CreateColor(255, 255, 255, 0);
		this.exitTrans.generateImage();
		this.exitTrans.image.blendmode = ADD;
	},
	
	loadGame: function()
	{
		Screen.attach(9, this.exitTrans);
	},
	
	onLeave: function()
	{
		Strings.unloadTable("save");
		Strings.detach(this.menu);
	},
	
	onEnter: function()
	{
		Screen.attach(9, new FadeInTransition());
		Screen.attach(5, this.menu);
	}
});

var LoadGameMenuItem = TextMenuItem.extend({
		constructor: function(text, align)
	{
		this.text = text;
		if (align) this.align = align;
		this.__defineGetter__("h", function() { return 40; });
	}
});