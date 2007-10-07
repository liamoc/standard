var LoadGameScene = Scene.extend({
	menu: false,
	exitTrans: false,
	loadingIndex: 0,
	constructor: function()
	{
		Strings.loadTable("save");
		this.menu = new Menu(32, 48, 256, 160);
		this.menu.pointer = new BoxMenuPointer();
		this.menu.pointer.padding = [4, 4, 4, 4];
		var bind_this = this;
		this.menu.onFinish = function() { bind_this.menuFinished.call(bind_this); }
		this.exitTrans = new FadeOutTransition();
		this.exitTrans.color = CreateColor(255, 255, 255, 0);
		this.exitTrans.generateImage();
		this.exitTrans.image.blendmode = ADD;
		this.loadingWindow = new LoadingWindow();
		this.loadingWindow.max = 10;
		this.loadingWindow.value = 0;
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
		//Screen.attach(5, this.menu);
		Screen.attach(6, this.loadingWindow);
		Standard.addTimer(this, this.load_next, 1);
	},
	
	load_next: function()
	{
		var path = "../save/" + new String(this.loadingIndex + 1).numericPad(2) + ".sdg";
		if (Path.exists(path))
		{
			var serializer = new Serializer(path);
			var block = serializer.read();
			serializer.close();
			this.menu.addItem(new LoadGameMenuItem(block, this.loadingIndex + 1), this.loadingIndex);
		}
		else
		{
			this.menu.addItem(new LoadGameMenuItem(false, this.loadingIndex + 1), this.loadingIndex);
		}
		this.loadingIndex++;
		this.loadingWindow.value = this.loadingIndex;
		if (this.loadingIndex == 10)
		{
			Standard.removeTimer(this, this.load_next);
		
			
			Screen.attach(5, this.menu);
			this.loadingWindow.close();
		}
	}
});

var LoadGameMenuItem = MenuItem.extend({
	block: false,
	h: 40,
	
	constructor: function(block, index)
	{
		this.block = block;
		this.index = index;
		this.noSaveText = Strings.get("no_save", "save");
	},
	
	renderAt: function(x, y, w, selected)
	{
		Resources.fonts.large.setColorMask(Resources.colors.white20);
		Resources.fonts.large.drawText(x, y + this.h / 2 - Resources.fonts.large.getHeight() / 2, this.index);
		if (!this.block)
		{
			Resources.fonts.standard.setColorMask(Resources.colors.white50);
			Resources.fonts.standard.drawText(x + w / 2 - Resources.fonts.standard.getStringWidth(this.noSaveText) / 2, y + this.h / 2 - Resources.fonts.standard.getHeight() / 2, this.noSaveText);
		}
		else
		{
			Resources.fonts.standard.setColorMask(Resources.colors.white);
			Resources.fonts.standard.drawText(x + w / 2 - Resources.fonts.standard.getStringWidth("THERE IS DATA HERE") / 2, y + this.h / 2 - Resources.fonts.standard.getHeight() / 2, "THERE IS DATA HERE");
		}
	}
});