var Resources = Class.extend({
	constructor: null,
	
	windows: {
		standard: LoadWindowStyle("default.rws")
	},
	
	fonts: {
		standard: LoadFont("standard.rfn"),
		all_caps: LoadFont("bebas.rfn"),
		large: LoadFont("large.rfn")
	},
	
	colors: {
		white: CreateColor(255, 255, 255),
		white50: CreateColor(255, 255, 255, 128),
		white20: CreateColor(255, 255, 255, 40)
	}
});