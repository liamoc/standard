var TitleScene = Scene.extend({
	menu: false,
	exitTrans: false,
	
	constructor: function()
	{
		this.base();
		Strings.loadTable("title");
		this.cb = new ColorBlock(CreateColor(0, 0, 0));
		this.background = new TitleBackground();
		this.menu = new Menu(110, 20, 100, Resources.fonts.standard.getHeight() * 3, true);
		this.menu.pointer = new ParticleMenuPointer();
		this.menu.autoClose = false;
		this.menu.addItem(new TextMenuItem(Strings.get("newGame", "title"), ALIGN_CENTER), this.menuNewGame);
		this.menu.addItem(new TextMenuItem(Strings.get("loadGame", "title"), ALIGN_CENTER), this.menuContinue);
		this.menu.addItem(new TextMenuItem(Strings.get("exitGame", "title"), ALIGN_CENTER), this.menuExit);
		if (Standard.debugMode) this.menu.addItem(new TextMenuItem(Strings.get("compileData", "title"), ALIGN_CENTER), this.menuSetup);
		this.menu.items.forEach(function(x) { x.selectedColor = CreateColor(0, 0, 0); });
		var bind_this = this;
		this.menu.onFinish = function() { bind_this.menuFinished.call(bind_this) };
		
		this.exitTrans = new FadeOutTransition();
		this.exitTrans.color = CreateColor(255, 255, 255, 0);
		this.exitTrans.generateImage();
		this.exitTrans.image.blendmode = ADD;
	},
	onEnter: function()
	{	
		Screen.attach(0, this.cb);
		Screen.attach(9, new FadeInTransition());
		Screen.attach(8, this.menu);
		if (this.background)
		{
			Screen.attach(5, this.background);
		}
		if (GetCurrentMap() != "entry.rmp") Map.change("entry.rmp");
		this.base();
		Sounds.playMusic(Settings.get("titleMusic"));
	},
	onLeave: function()
	{
		Screen.detach(this.cb);
		if (this.background)
		{
			Screen.detach(this.background);
		}
		Screen.detach(this.menu);
		Strings.unloadTable("title");
		this.base();
	},
	
	menuFinished: function()
	{
		this.menu.result.call(this);
	},
	
	menuNewGame: function()
	{
		this.exitTrans.onFinish = function()
		{
			SaveManager.loadDefaultGame();
			if (!PersonExists("hero"))
			{
				CreatePerson("hero", Party.characters[0].spriteset_path, false);
			}
			Standard.attachInput("hero");
			Standard.changeScene(new MapScene());
			Map.change(Settings.get("startMap"));
			
			
		};
		Screen.attach(9, this.exitTrans);
		Sounds.fadeMusicOut();
	},
	
	menuSetup: function()
	{
		EvaluateScript("compiledata.js");
		CompileData();
		this.menu.finished = false;
	},
	
	menuContinue: function()
	{
		this.exitTrans.onFinish = function() { Standard.changeScene(new LoadGameScene()); };
		Screen.attach(9, this.exitTrans);
		Sounds.fadeMusicOut();
	},
	
	menuExit: function()
	{
		this.exitTrans.onFinish = Exit;
		Screen.attach(9, this.exitTrans);
		Sounds.fadeMusicOut();
	}
});