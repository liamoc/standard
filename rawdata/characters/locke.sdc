{
	data: {
		name: "Locke",
		stats: {
			hp: 450,
			maxhp: 450,
			mp: 90,
			maxmp: 90,
			level: 15,
			
			strength: 20,
			magic: 20,
			spirit: 20,
			speed: 20,
			attack: 20,
			evade: 10,
			defense: 20,
			magic_evade: 20,
			magic_defense: 20,
		},
		equipment: {
			weapon: SerializedResources.item.get("knife.sdi")
		},
		spriteset_path: "locke.rss",
		commands: [
			"attack",
			"wmagic",
			"throw_item",
			"item"
		]
	},
	
	compilePath: "characters/locke.sdc"
}