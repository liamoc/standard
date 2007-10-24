// Include the Standard engine
RequireScript("standard/standard.js");

// Sets the game function to be Standard's game function.
// If you want to do things before entering the Standard engine, make your own function here.
game = Standard.game;

Standard.debugMode = true;

Standard.addDebugMessage(function()
{
	var x = 0;
	Screen.layers.forEach(function (layer) { if (layer) layer.forEach(function(o) { x++; }); });
	return "Objects: " + x;
});