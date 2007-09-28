var MapScene = Scene.extend({
	onEnter: function()
	{
		var trans = new FadeInTransition();
		trans.color = CreateColor(255, 255, 255, 255);
		trans.generateImage();
		trans.image.blendmode = ADD;
		Screen.attach(9, trans);
	}
});