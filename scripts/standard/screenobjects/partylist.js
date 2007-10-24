var PartyList = Window.extend({
	constructor: function()
	{
		this.base(80, 164, 236, 72, false);
		this.padding = 2;
		this.selectedCharacter = false;
		this.clipContents = true;
	},
	selectCharacter: function(c)
	{
		this.selectedCharacter = c;
	},
	renderContent: function()
	{
		for (var i = 0; i < Party.characters.length; i++)
		{
			var y = this.y + i * 68 / 4;
			
			if (Party.characters[i] == this.selectedCharacter)
			{
				Rectangle(this.x, y, this.w, 68 / 4, CreateColor(25, 50, 127, 120));
				OutlinedRectangle(this.x, y, this.w, 68 / 4, CreateColor(242, 243, 249, 180));
			}
			y += 2;
			this.font.drawText(this.x + 2, y, Party.characters[i].name);
			
			
			var hp_val = Math.round(Party.characters[i].displayHp);
			var hp_len = new String(hp_val).length;
			var num_zeros = 4 - hp_len;
			var hp_zeros = "0".repeat(num_zeros);
			var mhp_val = Party.characters[i].getStat("maxhp");
			var mhp_len = new String(mhp_val).length;
			var mhp_num_zeros = 4 - mhp_len;
			var mhp_zeros = "0".repeat(num_zeros);
		
			var hp_middle = this.x + 100;
			var hp_x = hp_middle - Resources.fonts.numeric.getStringWidth("0000");
			var hp_r_x = hp_x + Resources.fonts.numeric.getStringWidth("0") * num_zeros;
			var mhp_x = hp_middle + 4;
			var mhp_r_x = hp_middle + 4 + this.font.getStringWidth("0") * mhp_num_zeros;
			
			var hpbmw = this.font.getStringWidth("0") * 4 - 2;
			var hpbw = Party.characters[i].stats.hp / mhp_val * hpbmw;
			
			// Get the length of the display difference bar
			
			var ddbw = (Party.characters[i].displayHp / mhp_val * hpbmw) - hpbw;
			
			Rectangle(mhp_x, y + 10, hpbw, 2, Resources.colors.green);
			Rectangle(mhp_x + hpbw, y + 10, hpbmw - hpbw, 2, Resources.colors.darkgreen);
			if (ddbw < 0)
			{
				ddbw = Math.floor(Math.abs(ddbw));
				Rectangle(mhp_x + hpbw - ddbw, y + 10, ddbw, 2, Resources.colors.white);
			}
			else
				Rectangle(mhp_x + hpbw, y + 10, ddbw, 2, Resources.colors.red);
			Resources.fonts.numeric.setColorMask(Resources.colors.white20);
			Resources.fonts.numeric.drawText(hp_x, y - 3, hp_zeros);
			Resources.fonts.numeric.setColorMask(Resources.colors.white);
			Resources.fonts.numeric.drawText(hp_r_x, y - 3, hp_val);
			this.font.setColorMask(Resources.colors.white20);
			this.font.drawText(mhp_x, y - 4, mhp_zeros);
			this.font.setColorMask(Resources.colors.white);
			this.font.drawText(mhp_r_x, y - 4, mhp_val);
			
			var atbbmw = 60;
			var atbbw = Party.characters[i].atb / 65536 * atbbmw;
			var atb_x = 240;
			Rectangle(atb_x, y + 4, atbbw, 4, Resources.colors.green);
			Rectangle(atb_x + atbbw, y + 4, atbbmw - atbbw, 4, Resources.colors.darkgreen);			
			
		}
	}
});