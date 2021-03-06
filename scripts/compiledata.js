RequireScript("standard/standard.js");
var CompileLog = OpenLog("compile.log");

function CompileLoadData(file)
{
	
	var f = OpenRawFile(file);
	var json = CreateStringFromByteArray(f.read(f.getSize()));
	try {
		return eval('(' + json + ')');
	}
	catch (e)
	{
		Abort("Error in file " + file + "\n" + e);
	}
}

function CompileData()
{
	CompileDirectory("rawdata");
}

function CompileDirectory(dir)
{
	
	var subdirs = GetDirectoryList(dir);
	for (var i = 0; i < subdirs.length; i++)
	{
		CompileDirectory(dir + "/" + subdirs[i]);
	}
	
	var files = GetFileList(dir);
	for (var i = 0; i < files.length; i++)
	{
		CompileFile(dir + "/" + files[i]);
	}
}

function CompileFile(path)
{
	var file = CompileLoadData("../" + path);
	CompileLog.write("Compiling " + path + " to " + "../data/" + file.compilePath);
	var serializer = new Serializer("../data/" + file.compilePath);
	serializer.write(file.data);
	serializer.close();
}

function game()
{
	CompileData();
	GetSystemFont().drawText(0, 0, "All files compiled. Press any key.");
	FlipScreen();
	GetKey();
}