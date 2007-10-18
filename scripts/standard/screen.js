var Screen = Class.extend({
	constructor: null,

	layers: new Array(9),
	particleLayers: new Array(9),
	
	setParticleSystemLayer: function(particle_system, layer)
	{
		if (!this.particleLayers[layer]) this.particleLayers[layer] = [];
		this.particleLayers[layer].push(particle_system);
	},
	
	attach: function(layer, object)
	{
		if (!this.layers[layer]) this.layers[layer] = [];
		this.layers[layer].push(object);
		object.onAdd();
	},
	detachAll: function()
	{
		for (var i = 0; i < this.layers.length; i++)
		{
			if (this.layers[i])
			{
				this.layers[i].forEach(function(o) { o.onRemove(); });
			}
		}
		this.layers = new Array(9);
	},
	detach: function(object)
	{
		object.onRemove();
		for (var i = 0; i < this.layers.length; i++)
		{
			if (this.layers[i]) this.layers[i].remove(object);
		}
	},
	
	render: function()
	{
		for (var i = 0; i < this.particleLayers.length; i++)
		{
			if (!this.particleLayers[i]) continue;
			for (var j = 0; j < this.particleLayers[i].length; j++)
			{
				this.particleLayers[i][j].hidden = true;
			}
		}
		for (var i = 0; i < this.layers.length; i++)
		{
			if (this.layers[i])
			{
				for (var j = 0; j < this.layers[i].length; j++)
				{
					var o = this.layers[i][j];
					o.render();
				}
			}
			if (this.particleLayers[i])
			{
				for (var j = 0; j < this.particleLayers[i].length; j++)
				{
					this.particleLayers[i][j].hidden = false;
					Standard.particleEngine.renderSystems();
					this.particleLayers[i][j].hidden = true;
				}
			}
		}
		for (var i = 0; i < this.particleLayers.length; i++)
		{
			if (!this.particleLayers[i]) continue;
			for (var j = 0; j < this.particleLayers[i].length; j++)
			{
				this.particleLayers[i][j].hidden = false;
			}
		}
		if (Standard.debugMode)
		{
			for (var i = 0; i < Standard.debugMessages.length; i++)
			{
				GetSystemFont().drawText(0, i * GetSystemFont().getHeight(), Standard.debugMessages[i]());
			}
			GetSystemFont().drawText(0, 240 - GetSystemFont().getHeight(), Settings.get("name") + " " + Settings.get("version"));
		}
		
	}
});