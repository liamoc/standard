// This is modified from TFWi by WIP.
String.prototype.wrap = function(font, width, perpage)
{
	if (!perpage) perpage = 4;
	lines = [];
	line = "";
	w = 0;
	for (var i = 0; i < this.length; i++)
	{
		switch (c = this.charAt(i))
		{
			case '\n':
				lines.push(line);
				line = "";
				w = 0;
				break;
			case '|':	// new page, just adds blank lines to previous page until we reach 4 lines
				lines.push(line);
				while (lines.length % perpage)
				{
					lines.push("");
				}
				line = "";
				w = 0;
				break;
			default:
				w += font.getStringWidth(c);
				if (w > width)
				{
					lines.push(line.substr(0, line.lastIndexOf(' ')));
					line = line.substr(line.lastIndexOf(' ') + 1) + c;
					w = font.getStringWidth(line);
				}
				else
				{
					line += c;
				}
		}
	}
	if (line != '') lines.push(line);
	return lines;
}

String.prototype.format = function()
{
	var new_string = this;
	for (var i = 0; i < arguments.length; i++)
	{
		new_string = new_string.replace("{" + i + "}", arguments[i]);
	}
	return new_string;
}

String.prototype.numericPad = function(len)
{
	var s = this;
	while (s.length < len) s = "0" + s;
	return s;
}

String.prototype.repeat = function(l){
	return new Array(l+1).join(this);
};