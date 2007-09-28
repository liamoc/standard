var Resources = Class.extend({
	constructor: null,
	
	windows: {
		standard: LoadWindowStyle("default.rws")
	},
	
	fonts: {
		standard: LoadFont("standard.rfn"),
		all_caps: LoadFont("bebas.rfn")
	},
	
	colors: {
		white: CreateColor(255, 255, 255)
	}
});