var MessageBox = Window.extend({
	text: "",
	wrapped_lines: "",
	currentLine: 0,
	currentLetter: 0,
	finishedTyping: false,
	finished: false,
	align: ALIGN_LEFT,
	
	constructor: function(text)
	{
		this.base(16, 16, 288, Resources.fonts.standard.getHeight() * 4, false);
		
		this.text = text;
		this.align = ALIGN_LEFT;
		this.finishedTyping = false;
		this.finished = false;
		this.currentLine = 0;
		this.currentLetter = 0;
		this.clipContents = true;
		this.wrapped_lines = text.wrap(Resources.fonts.standard, 288, 4);
	},
	onAdd: function()
	{
		Standard.addTimer(this, this.tick, 1);
		Standard.addInput(this);
		this.base();
	},
	
	onRemove: function()
	{
		Standard.removeTimer(this, this.tick);
		Standard.removeInput(this);
		this.base();
	},
	
	acceptKey: function(key)
	{
		switch (key)
		{
			case Config.controls.accept:
				if (this.heldAccept) break;
				if (this.finishedTyping)
				{
					Sounds.play("accept");
					this.finished = true;
					this.close();
				}
				break;
		}
	},
	
	tick: function()
	{
		if (this.finishedTyping) return;
		
		this.currentLetter++;
		
		if (this.currentLetter >= this.wrapped_lines[this.currentLine].length)
		{
			this.currentLine++;
			if (this.currentLine == this.wrapped_lines.length)
			{
				this.finishedTyping = true;
			}
			else
			{
				this.currentLetter = 0;
			}
		}
	},
	
	renderContent: function()
	{
		Resources.fonts.standard.setColorMask(Resources.colors.white);
		// Render all completed lines
		for (var i = 0; i < this.currentLine; i++)
		{
			var x = this.x;
			if (this.align == ALIGN_CENTER)
			{
				x += this.w / 2 - Resources.fonts.standard.getStringWidth(this.wrapped_lines[i]) / 2;
			}
			else if (this.align == ALIGN_RIGHT)
			{
				x += this.w - Resources.fonts.standard.getStringWidth(this.wrapped_lines[i]);
			}
			Resources.fonts.standard.drawText(x, this.y + Resources.fonts.standard.getHeight() * i, this.wrapped_lines[i]);
		}
		
		// Render current line
		if (!this.finishedTyping)
		{
			var x = this.x;
			if (this.align == ALIGN_CENTER)
			{
				x += this.w / 2 - Resources.fonts.standard.getStringWidth(this.wrapped_lines[this.currentLine]) / 2;
			}
			else if (this.align == ALIGN_RIGHT)
			{
				x += this.w - Resources.fonts.standard.getStringWidth(this.wrapped_lines[this.currentLine]);
			}
			Resources.fonts.standard.drawText(x, this.y + Resources.fonts.standard.getHeight() * this.currentLine, this.wrapped_lines[this.currentLine].substr(0, this.currentLetter));
		}
	}
});