function Random(min, max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function DumpObject(o)
{
	var s = "";
	for (var i in o)
	{
		s += i + ": " + o[i] + "\n";
	}
	return s;
}

function PersonExists(p)
{
	return GetPersonList().contains(p);
}

function Bind(f, o)
{
	return function()
	{
		f.apply(o, arguments);
	}
}

Function.prototype.bind = function(o)
{
	return function()
	{
		this.apply(o, arguments);
	}
}