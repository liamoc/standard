var Sounds = Class.extend({
	constructor: null,
	
	mapping: {},
	sound: false,
	
	loadEffectMapping: function()
	{
		var serializer = new Serializer("../data/strings/effects.sdt");
		this.mapping = serializer.read();
		serializer.close();
	},
	
	play: function(effectID)
	{
		var snd = Cache.getSound(this.mapping[effectID]);
		snd.stop();
		snd.setVolume(255 / 10 * Config.volume.sound);
		snd.play(false);
	},
	
	playMusic: function(file)
	{
		if (this.sound) this.sound.stop();
		this.sound = LoadSound(file);
		this.sound.setVolume(255 / 10 * Config.volume.music);
		this.sound.play(true);
	},
	stopMusic: function()
	{
		this.sound.stop();
	},
	
	fadeMusicOut: function()
	{
		var sound = this.sound;
		function fadeStep()
		{
			var volume = Math.max(0, sound.getVolume() - ((255 / 10) * Config.volume.music) / 50);
			sound.setVolume(volume);
			if (volume == 0)
			{
				Standard.removeTimer(null, fadeStep);
			}
		}
		Standard.addTimer(null, fadeStep, 1);
	}
});