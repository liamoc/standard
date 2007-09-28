// Include the Standard engine
RequireScript("standard/standard.js");

// Sets the game function to be Standard's game function.
// If you want to do things before entering the Standard engine, make your own function here.
game = Standard.game;

Standard.addDebugMessage(function() { return "Timers: " + Standard.timers.length; });
Standard.addDebugMessage(
	function() {
		var count = 0;
		for (var i = 0; i < Screen.layers.length; i++)
		{
			if (Screen.layers[i])
			{
				count += Screen.layers[i].length;
			}
		}
		return "Objects: " + count;
	}
);

Standard.debugMode = true;