var Path = Class.extend({
	constructor: null,
	
	exists: function(path)
	{
		var places = path.split("/");
		if (places[0] == "..") places = places.slice(1);
		var currentDirectory = ".";
		for (var i = 0; i < places.length; i++)
		{
			var fileList = GetFileList(currentDirectory);
			var dirList = GetDirectoryList(currentDirectory);
			if (fileList.contains(places[i]) || dirList.contains(places[i]))
			{
				currentDirectory += "/" + places[i];
			}
			else
			{
				return false;
			}
		}
		return true;
		
	},
	
	baseName: function(filename)
	{
		if (filename.indexOf(".") >= 0) return filename.substr(0, filename.lastIndexOf("."));
		return filename;
	}
});