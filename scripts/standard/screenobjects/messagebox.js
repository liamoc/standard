var MessageBox = Window.extend({
	text: "",
	wrapped_lines: "",
	constructor: function(text)
	{
		this.base(16, 16, 288, 60);
		
		this.text = text;
		
		this.wrapped_lines = text.wrap(Resources.fonts.standard, 288, 4);
	}
});