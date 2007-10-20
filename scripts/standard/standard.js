/*
 * Standard game engine
 * Provides a barebones RPG engine similar to RPG Maker.
 *
 * 2007 Engine #100
 * Licensed under Creative Commons Attribution-Noncommercial-Share Alike 2.0 UK: England & Wales
 * http://creativecommons.org/licenses/by-nc-sa/2.0/uk/
 * Excepting the Kamatsu's Spheritype library, which is not part of this engine, and some bundled resources which are used for testing purposes only.
 */

RequireScript("standard/spheritype.js");	// Include Kamatsu's Spheritype library
RequireScript("standard/array.js"); // array extensions
RequireScript("standard/string.js"); // string extensions
RequireScript("standard/common.js"); // common functions

// Include some core objects
RequireScript("standard/screen.js");
RequireScript("standard/cache.js");
RequireScript("standard/strings.js");
RequireScript("standard/positionmanager.js");
RequireScript("standard/staticpositionmanager.js");
RequireScript("standard/slidingpositionmanager.js");
RequireScript("standard/imagerenderer.js");
RequireScript("standard/staticimagerenderer.js");
RequireScript("standard/fadeoutimagerenderer.js");
RequireScript("standard/resources.js");
RequireScript("standard/config.js");
RequireScript("standard/settings.js");
RequireScript("standard/map.js");
RequireScript("standard/serializer.js");
RequireScript("standard/serializedresources.js");
RequireScript("standard/savemanager.js");
RequireScript("standard/movementhandler.js");
RequireScript("standard/tilemovementhandler.js");
RequireScript("standard/party.js");
RequireScript("standard/character.js");
RequireScript("standard/files.js");
RequireScript("standard/path.js");
RequireScript("standard/state.js");
RequireScript("standard/sounds.js");
RequireScript("standard/event.js");
RequireScript("standard/monster.js");


// Include all the Screen objects
RequireScript("standard/screenobjects/screenobject.js");
RequireScript("standard/screenobjects/colorblock.js");
RequireScript("standard/screenobjects/image.js");
RequireScript("standard/screenobjects/titlebackground.js");
RequireScript("standard/screenobjects/transition.js");
RequireScript("standard/screenobjects/fadeintransition.js");
RequireScript("standard/screenobjects/fadeouttransition.js");
RequireScript("standard/screenobjects/menupointer.js");
RequireScript("standard/screenobjects/boxmenupointer.js");
RequireScript("standard/screenobjects/particlemenupointer.js");
RequireScript("standard/screenobjects/arrowmenupointer.js");
RequireScript("standard/screenobjects/window.js");
RequireScript("standard/screenobjects/menu.js");
RequireScript("standard/screenobjects/messagebox.js");
RequireScript("standard/screenobjects/loadingwindow.js");
RequireScript("standard/screenobjects/infobox.js");
RequireScript("standard/screenobjects/torch.js");
RequireScript("standard/screenobjects/battletransition.js");
RequireScript("standard/screenobjects/enemylist.js");
RequireScript("standard/screenobjects/partylist.js");
RequireScript("standard/screenobjects/monstergraphic.js");
RequireScript("standard/screenobjects/charactergraphic.js");

// Include all the Scene objects
RequireScript("standard/scene/scene.js");
RequireScript("standard/scene/titlescene.js");
RequireScript("standard/scene/mapscene.js");
RequireScript("standard/scene/loadgamescene.js");
RequireScript("standard/scene/battlescene.js");


// The main engine object.
var Standard = Class.extend({
	constructor: null,
	
	debugMode: false,
	debugMessages: [],
	log: OpenLog("log.txt"),
	nrt: false,

	particleEngine: GetParticleEngine(),
	
	movementHandler: new TileMovementHandler(),

	inputPerson: false,

	game: function()
	{
	
		Settings.loadSettings();
	
		BindKey(KEY_UP, "", "");
		BindKey(KEY_DOWN, "", "");
		BindKey(KEY_LEFT, "", "");
		BindKey(KEY_RIGHT, "", "");
		
		SetTalkActivationKey(Config.controls.accept);
		
		SetUpdateScript("Standard.update()");
		SetRenderScript("Standard.render()");
		
		Map.init();
		Sounds.loadEffectMapping();
		
		MapEngine("entry.rmp", 60);
	},
	
	attachInput: function(person)
	{
		AttachInput(person);
		this.inputPerson = person;
	},
	
	detachInput: function()
	{
		DetachInput();
		this.inputPerson = false;
	},
	
	currentScene: false,
	nextScene: false,
	
	// Doesn't change instantly.
	changeScene: function(newScene)
	{
		if (this.currentScene) this.currentScene.onLeave();
		this.currentScene = newScene;
		this.currentScene.onEnter();
	},
	
	addDebugMessage: function(messageGenerator)
	{
		this.debugMessages.push(messageGenerator);
	},
	
	update: function()
	{
	
		for (var i = 0; i < this.timers.length; i++)
		{
			this.timers[i].ticks++;
			if (this.timers[i].ticks == this.timers[i].interval)
			{
				var t = this.timers[i];
				this.timers[i].func.call(this.timers[i].object);
				if (this.timers[i] == t)
				{
					this.timers[i].ticks = 0;
				}
				else
				{
					i--;
				}
			}
		}
		this.particleEngine.updateSystems();
		
		if (this.inputs.length)
		{
			while (AreKeysLeft())
			{
				this.inputs[this.inputs.length - 1].acceptKey(GetKey());
			}
		}
		else
		{
			this.movementHandler.update();
		}
	},
	
	render: function()
	{
		Screen.render();
	},
	
	timers: [],
	
	addTimer: function(object, func, interval)
	{
		this.timers.push({object: object, func: func, interval: interval, ticks: 0});
	},
	
	removeTimer: function(object, func)
	{
		return this.timers.removeIf(function (x) { return x.object == object && x.func == func; });
	},
	
	inputs: [],
	
	addInput: function(object)
	{
		this.inputs.push(object);
		DetachInput();
	},
	
	removeInput: function(object)
	{
		this.inputs.remove(object);
		if (!this.inputs.length && this.inputPerson) AttachInput(this.inputPerson);
	}
});