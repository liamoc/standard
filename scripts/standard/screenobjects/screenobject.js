var ScreenObject = Class.extend({
	visible: false,
	acceptsInput: false,
	onAdd: function()
	{
		this.visible = true;
		if (this.acceptsInput)
		{
			Standard.addInput(this);
		}
	},
	onRemove: function()
	{
		this.visible = false;
		if (this.acceptsInput)
		{
			Standard.removeInput(this);
		}
	},
	render: function()
	{
	},
	acceptKey: function(key)
	{
		
	}	
});