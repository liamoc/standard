{
	enter: function()
	{
		if (!State.started)
		{
			State.started = true;
			var title = new TitleScene();
			Standard.changeScene(title);
		}
	}
}