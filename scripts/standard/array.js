Array.prototype.removeIf = function(predicate)
{
	var count = 0;
	for (var i = 0; i < this.length; i++)
	{
		if (predicate(this[i]))
		{
			this.splice(i, 1);
			count++;
			i--;
		}
	}
	return count;
}

Array.prototype.remove = function(value)
{
	for (var i = 0; i < this.length; i++)
	{
		if (this[i] == value)
		{
			this.splice(i, 1);
			return;
		}
	}
}

Array.prototype.removeMultiple = function(values)
{
	for (var i = 0; i < values.length; i++)
	{
		this.splice(this.indexOf(values[i]), 1);
	}
}

Array.prototype.indexOf = function(value)
{
	for (var i = 0; i < this.length; i++)
	{
		if (this[i] == value) return i;
	}
	return -1;
}

Array.prototype.sliceWhere = function(predicate)
{
	var slice = [];
	for (var i = 0; i < this.length; i++)
	{
		if (predicate(this[i])) slice.push(this[i]);
	}
	return slice;
}

Array.prototype.forEach = function(predicate)
{
	for (var i = 0; i < this.length; i++)
	{
		predicate(this[i]);
	}
}

Array.prototype.contains = function(o)
{
	return this.indexOf(o) >= 0;
}