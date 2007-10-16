var LoadGameScene = Scene.extend({
	menu: false,
	exitTrans: false,
	loadingIndex: 0,
	saveSlots: 0,
	
	constructor: function()
	{
		this.saveSlots = Settings.get("saveSlots");
		this.loadingIndex = 0;
		Strings.loadTable("save");
		this.menu = new Menu(32, 48, 256, 160);
		this.menu.allowCancel = true;
		this.menu.pointer = new BoxMenuPointer();
		this.menu.pointer.padding = [2, 2, 2, 2];
		this.menu.pointer.border = false;
		var bind_this = this;
		this.menu.onFinish = function() { if (bind_this.menu.canceled) bind_this.backToMenu(); else bind_this.menuFinished.call(bind_this); }
		this.exitTrans = new FadeOutTransition();
		this.exitTrans.color = CreateColor(255, 255, 255, 0);
		this.exitTrans.generateImage();
		this.exitTrans.image.blendmode = ADD;
		this.loadingWindow = new LoadingWindow();
		this.loadingWindow.max = this.saveSlots;
		this.loadingWindow.value = 0;
	},
	
	loadGame: function()
	{
		Screen.attach(9, this.exitTrans);
	},
	
	onLeave: function()
	{
		Strings.unloadTable("save");
		Screen.detach(this.menu);
	},
	
	onEnter: function()
	{
		Screen.attach(9, new FadeInTransition());
		//Screen.attach(5, this.menu);
		Screen.attach(6, this.loadingWindow);
		Standard.addTimer(this, this.load_next, 1);
	},
	backToMenu: function()
	{
		var trans = new FadeOutTransition();
		trans.onFinish = function()
		{
			Standard.changeScene(new TitleScene());
		};
		Screen.attach(9, trans);
	},
	menuFinished: function()
	{
		var bind_this = this;
		this.exitTrans.onFinish = function()
		{
			SaveManager.loadGame("../save/" + new String(bind_this.menu.result + 1).numericPad(2) + ".sdg");
		}
		Screen.attach(9, this.exitTrans);
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
		if (this.loadingIndex == this.saveSlots)
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
		if (!this.block) this.disabled = true;
		this.noSaveText = Strings.get("no_save", "save");
		this.sprites = [];
		if (this.block)
		{
			for (var i = 0; i < this.block.partyImages.length; i++)
			{
				this.sprites.push(Cache.getSpriteset(block.partyImages[i]));
			}
		}
	},
	
	renderAt: function(x, y, w, selected)
	{
		/*if (selected)
		{
			Rectangle(x, y, w, this.h, Resources.colors.black20);
		}*/
		Resources.fonts.large.setColorMask(Resources.colors.white20);
		Resources.fonts.large.drawText(x, y + this.h / 2 - Resources.fonts.large.getHeight() / 2, new String(this.index).numericPad(2));
		if (!this.block)
		{
			Resources.fonts.standard.setColorMask(Resources.colors.white50);
			Resources.fonts.standard.drawText(x + w / 2 - Resources.fonts.standard.getStringWidth(this.noSaveText) / 2, y + this.h / 2 - Resources.fonts.standard.getHeight() / 2, this.noSaveText);
		}
		else
		{
			Resources.fonts.standard.setColorMask(Resources.colors.white);
			
			for (var i = 0; i < this.sprites.length; i++)
			{
				this.sprites[i].images[0].blit(x + 44 + i * 28, y + 8);
			}
			
			// Draw location
			var location_w = Resources.fonts.standard.getStringWidth(this.block.location);
			var location_x = x + w - 100;
			var location_y = y + this.h - 18;
			Resources.fonts.standard.drawText(x + w - Resources.fonts.standard.getStringWidth(this.block.location), location_y, this.block.location);
			
			GradientLine(location_x, location_y - 3, x + w + 2, location_y - 3, Resources.colors.wswhite, Resources.colors.wswhite0);
			
			// Level
			Resources.fonts.standard.drawText(x + w - Resources.fonts.standard.getStringWidth("Lv. 00"), y, "Lv. " + new String(this.block.partyLevels[0]).numericPad(2));
			
			// Name
			Resources.fonts.standard.drawText(location_x, y, this.block.partyNames[0]);
		}
		
		//Line(x - 2, y + this.h + 3, x + w + 2, y + this.h + 3, Resources.colors.wswhite);
	}
});