var ParticleMenuPointer = MenuPointer.extend({
	system: null,
	thingradient: Cache.getImage("thin-gradient.png"),
	moveTime: 1,
	constructor: function()
	{
		this.system = Standard.particleEngine.addSystem(450);
		this.system.setRenderer(PE_IMAGE);
		this.system.image.image = Cache.getImage("small-particle.png");
		this.system.image.blendmode = ADD;
		this.system.x = 0;
		this.system.y = 0;
		
		this.system.setCoordinateType(PE_SCREEN);
		
		this.system.initializer.setAging(0.01, 0.04);
		this.system.initializer.setArea(PE_SQUARE, this.w / 2, this.w / 2, -4, 4);
		this.system.initializer.setVelocity(PE_SQUARE, -0.6, 0.6, -0.02, 0.02);
		this.base();
	},
	
	onAdd: function()
	{
		this.base();
		Screen.setParticleSystemLayer(this.system, 6);
	},
	onRemove: function()
	{
		this.base();
		this.system.remove();
	},
	render: function()
	{

	},
	positionUpdate: function()
	{
		this.system.max = 80;
		this.system.max = 450;
		this.system.x = this.x;
		this.system.y = this.y + this.h / 2 - 4;
		this.system.initializer.setArea(PE_SQUARE, 0, this.w, -4, 4);
	}
});