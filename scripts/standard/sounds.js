var Sounds = Class.extend({
	constructor: null,
	
	mapping: {},

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
		snd.play(false);
	}
});