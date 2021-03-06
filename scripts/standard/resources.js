var Resources = Class.extend({
	constructor: null,
	
	windows: {
		standard: LoadWindowStyle("default.rws"),
		transparent: LoadWindowStyle("transparent.rws")
	},
	
	fonts: {
		standard: LoadFont("standard.rfn"),
		all_caps: LoadFont("bebas.rfn"),
		large: LoadFont("large.rfn"),
		numeric: LoadFont("calibri_large.rfn")
	},
	
	colors: {
		white: CreateColor(255, 255, 255),
		white50: CreateColor(255, 255, 255, 128),
		white20: CreateColor(255, 255, 255, 40),
		black: CreateColor(0, 0, 0),
		black20: CreateColor(0, 0, 0, 40),
		wswhite: CreateColor(242, 243, 249),
		wswhite0: CreateColor(242, 243, 249, 0),
		green: CreateColor(48, 208, 123),
		darkgreen: CreateColor(8, 128, 63),
		lightgreen: CreateColor(150, 255, 200),
		red: CreateColor(255, 0, 0),
		blue: CreateColor(0, 0, 255)
	}
});