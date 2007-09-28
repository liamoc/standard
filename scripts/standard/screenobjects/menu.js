var Menu = Window.extend({

	items: [],
	selected: 0,
	position: 0,
	acceptsInput: true,
	result: null,
	results: [],
	onFinish: false,
	finished: false,
	pointer: new BoxMenuPointer(),
	
	constructor: function(x, y, w, h, transparent)
	{
		this.base(x, y, w, h, transparent);
	},
	
	onAdd: function()
	{
		this.base();
		Screen.attach(7, this.pointer);
		var late_this = this;
		
	},
	
	onRemove: function()
	{
		this.base();
		Screen.detach(this.pointer);
	},
	
	addItem: function(item, result)
	{
		if (!this.items.length)
		{
			this.pointer.moveTo(this.x, this.y, this.w, item.h, true);
		}
		this.items.push(item);
		this.results.push(result);
	},
	
	getMaxViewable: function()
	{
		var h = 0;
		for (var i = this.getFirstIndexInView(); i < this.items.length; i++)
		{
			h += this.items[i].h;
			if (h > this.h)
			{
				return i - this.getFirstIndexInView();
			}
		}
		return this.items.length - this.getFirstIndexInView();
	},
	
	getFirstItemInView: function()
	{
		var h = 0;
		for (var i = 0; i < this.items.length; i++)
		{
			h += this.items[i].h;
			if (h > this.position)
			{
				return this.items[i];
			}
		}
		
	},
	
	getFirstIndexInView: function()
	{
		var h = 0;
		for (var i = 0; i < this.items.length; i++)
		{
			h += this.items[i].h;
			if (h > this.position)
			{
				return i;
			}
		}
		
	},
	
	renderContent: function()
	{
		var yOffset = 0;
		var first = this.getFirstIndexInView();
		var max = this.getMaxViewable();
		for (var i = first; i < Math.min(this.items.length, first + max); i++)
		{
			this.items[i].renderAt(this.x, this.y + yOffset, this.w, this.selected == i);
			yOffset += this.items[i].h;
		}
	},
	
	acceptKey: function(key)
	{
		var os = this.selected;
	
		switch (key)
		{
			case Config.controls.up:
				this.selected = Math.max(0, this.selected - 1);
				break;
			case Config.controls.down:
				this.selected = Math.min(this.selected + 1, this.items.length - 1);
				break;
			case Config.controls.accept:
				if (!this.items[this.selected].disabled)
				{
					this.result = this.results[this.selected];
					this.finished = true;
					if (this.onFinish) this.onFinish();
				}
				break;
		}
		if (this.selected >= this.getFirstIndexInView() + this.getMaxViewable())
		{
			this.position += this.getFirstItemInView().h;
			//Abort(this.selected + "," + this.position + "," + this.getMaxViewable() + "," + this.getFirstItemInView().text);
		}
		if (this.selected < this.getFirstIndexInView())
		{
			this.position -= this.items[this.getFirstIndexInView() - 1].h;
		}
		if (this.selected != os)
		{
			this.repositionPointer();
		}
	},
	
	repositionPointer: function()
	{
		var h = 0;
		for (var i = this.getFirstIndexInView(); i < this.selected; i++)
		{
			h += this.items[i].h;
		}
		this.pointer.moveTo(this.x, this.y + h, this.w, this.items[this.selected].h);
	}
});

var MenuItem = Class.extend({
	h: 0,
	renderAt: function(x, y, w)
	{
		
	}
});

var TextMenuItem = MenuItem.extend({
	h: Resources.fonts.standard.getHeight(),
	
	text: "",
	align: ALIGN_LEFT,
	selectedColor: false,
	font: Resources.fonts.standard,
	
	constructor: function(text, align)
	{
		this.text = text;
		if (align) this.align = align;
		this.__defineGetter__("h", function() { return this.font.getHeight(); });
	},
	
	renderAt: function(x, y, w, selected)
	{

		if (this.align == ALIGN_CENTER)
		{
			x += w / 2;
			x -= this.font.getStringWidth(this.text) / 2;
		}
		else if (this.align == ALIGN_RIGHT)
		{
			x = x + w - this.font.getStringWidth(this.text);
		}
		if (selected && this.selectedColor)
			this.font.setColorMask(this.selectedColor);
		else
			this.font.setColorMask(Resources.colors.white);
		this.font.drawText(x, y, this.text);
	}
});