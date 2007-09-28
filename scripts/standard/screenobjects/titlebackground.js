var TitleBackground = ScreenObject.extend({
	system: false,
	
	onAdd: function()
	{
		this.base();
		this.system = Standard.particleEngine.addSystem(300);
		this.system.setRenderer(PE_IMAGE);
		//this.system.setRenderer(PE_POINT);
		this.system.max = 0;
		this.system.image.image = Cache.getImage("particle.png");
		this.system.image.blendmode = ADD;
		this.system.x = 0;
		this.system.y = 140;
	
		this.system.setCoordinateType(PE_SCREEN);
		this.system.initializer.setColor(PE_ENABLE, CreateColor(255, 0, 0));
		this.system.initializer.setAging(0.005, 0.02);
		this.system.initializer.setArea(PE_SQUARE, -32, 320, 0, 30);
		//this.system.initializer.setArea(PE_SQUARE, 24, 260, 0, 30);
		//this.system.initializer.setArea(PE_CIRCLE, 0, 20, 0, 320);
		//this.system.initializer.setVelocity(PE_CIRCLE, 1, 1.2, 0, 320);
		this.system.initializer.setVelocity(PE_SQUARE, -0.3, 0.3, -1, 1);
		//this.system.updater.setAcceleration(PE_ENABLE, 0, -0.5);
		this.std = new Image("std2.png", 46, 140);
		this.gradient = new Image("gradient.png", 0, 50);
		this.black = new ColorBlock(CreateColor(0, 0, 0), 0, 0, 320, 50);
		this.std.image.blendmode = SUBTRACT;
		this.gradient.image.blendmode = SUBTRACT;
		Screen.setParticleSystemLayer(this.system, 5);
		Screen.attach(6, this.std);
		Screen.attach(6, this.gradient);
		Screen.attach(6, this.black);
		Standard.addTimer(this, this.tick, 1);
	},
	onRemove: function()
	{
		this.base();
		this.system.remove();	
		Screen.detach(this.std);	
		Screen.detach(this.gradient);	
		Screen.detach(this.black);
	},
	tick: function()
	{
		this.system.max++;
		if (this.system.max == 300)
		{
			Standard.removeTimer(this, this.tick);
			/*var transition = new FadeOutTransition();
			transition.color = CreateColor(255, 255, 255, 0);
			transition.generateImage();
			transition.image.blendmode = ADD;
			transition.onFinish = function() { Standard.changeScene(new Scene()); };
			Screen.attach(9, transition);*/
		}
	}
});