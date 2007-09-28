var Transition = ScreenObject.extend({
	onFinish: false,
	
	finish: function()
	{
		if (this.onFinish) this.onFinish();
	}
});