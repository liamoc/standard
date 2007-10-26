var BattleMessage = Window.extend({
	text: "",
	wrapped_lines: "",
	currentLine: 0,
	currentLetter: 0,
	finishedTyping: false,
	finished: false,
	align: ALIGN_LEFT,
	id: "MessageBox",
	constructor: function(text)
	{
		this.base(16, 16, 288, Resources.fonts.standard.getHeight(), false);
		
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
		if (this.finished) return;
		switch (key)
		{
			case Config.controls.accept:
				if (this.finishedTyping)
				{
					Sounds.play("accept");
					this.currentLine++;
					if (this.currentLine == this.wrapped_lines.length)
					{
						this.currentLine--;
						this.finished = true;
						this.close();
					}
					else
					{
						this.finishedTyping = false;
						this.currentLetter = 0;
					}
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
			this.finishedTyping = true;
		}
	},
	
	renderContent: function()
	{
		Resources.fonts.standard.setColorMask(Resources.colors.white);
	
		// Render current line
		var x = this.x;
		if (this.align == ALIGN_CENTER)
		{
			x += this.w / 2 - Resources.fonts.standard.getStringWidth(this.wrapped_lines[this.currentLine]) / 2;
		}
		else if (this.align == ALIGN_RIGHT)
		{
			x += this.w - Resources.fonts.standard.getStringWidth(this.wrapped_lines[this.currentLine]);
		}
		Resources.fonts.standard.drawText(x, this.y, this.wrapped_lines[this.currentLine].substr(0, this.currentLetter));
	}
});