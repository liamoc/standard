var ParticleAnimation = ScreenObject.extend({
	
	constructor: function(params, display_frames)
	{
		this.params = params;
		this.display_frames = display_frames;
		this.odisplay_frames = display_frames;
	},
	onAdd: function()
	{
		var params = this.params;
		this.system = Standard.particleEngine.addSystem(params.maxParticles);
		if (params.incremental)
		{
			this.system.max = 0;
			this.increment_amount = params.maxParticles / this.display_frames / 2;
		}
		if (params.image)
		{
			this.system.setRenderer(PE_IMAGE);
			this.system.image.image = params.image;
			this.system.image.blendmode = params.blendMode;
		}
		else
		{
			if (params.length)
			{
				this.system.setRenderer(PE_LINE);
				this.system.initializer.setLength(params.length);
			}
			else
			{
				this.system.setRenderer(PE_POINT);
			}
			this.system.initializer.setColor(params.color);
		}
		this.system.x = params.x;
		this.system.y = params.y;
		this.system.setCoordinateType(PE_SCREEN);
		this.system.initializer.setAging(params.aging.min, params.aging.max);
		if (params.area.type == PE_SQUARE)
			this.system.initializer.setArea(PE_SQUARE, params.area.x_min, params.area.x_max, params.area.y_min, params.area.y_max);
		else if (params.area.type == PE_POINT)
			this.system.initializer.setArea(PE_POINT, params.area.x, params.area.y);
		else if (params.area.type == PE_CIRCLE)
			this.system.initializer.setArea(PE_CIRCLE, params.area.rad_min, params.area.rad_max, params.area.ang_min, params.area.ang_max);
		
		if (params.velocity.type == PE_SQUARE)
			this.system.initializer.setVelocity(PE_SQUARE, params.velocity.x_min, params.velocity.x_max, params.velocity.y_min, params.velocity.y_max);
		else if (params.velocity.type == PE_POINT)
			this.system.initializer.setVelocity(PE_POINT, params.velocity.x, params.velocity.y);
		else if (params.velocity.type == PE_CIRCLE)
			this.system.initializer.setVelocity(PE_CIRCLE, params.velocity.rad_min, params.velocity.rad_max, params.velocity.ang_min, params.velocity.ang_max);
		
		if (params.acceleration)
		{
			this.system.initializer.setAcceleration(PE_ENABLE, params.acceleration.min, params.acceleration.max);
		}
		
		Screen.setParticleSystemLayer(this.system, 7);
		Standard.addTimer(this, this.tick, 1);
	},
	onRemove: function()
	{
		this.base();
		this.system.remove();
	},
	tick: function()
	{
		this.display_frames--;
		if (!this.display_frames)
		{
			this.finished = true;
			Screen.detach(this);
			Standard.removeTimer(this, this.close);
		}
		else
		{
			if (this.params.incremental && this.display_frames > this.odisplay_frames / 2)
				this.system.max = Math.min(this.system.max + this.increment_amount, this.params.maxParticles);
			else if (this.params.decremental)
				this.system.max = Math.max(0, this.system.max - this.increment_amount)
		}
	},
});