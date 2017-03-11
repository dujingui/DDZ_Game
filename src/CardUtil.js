
var CardUtil = {
	getCardRect : function(color,numid){
		var rect = null;
		if(color === CardDef.CardColor.CC_DigJoker){
			rect = cc.rect(0,0,29,131);
		}else if(color === CardDef.CardColor.CC_SmallJoker){
			rect = cc.rect(29,0,29,131);
		}else{
			var line = 1;
			var column = numid - 1;
			if(color === CardDef.CardColor.CC_Spades || color === CardDef.CardColor.CC_Clubs){
				line = 0;
			}
			var x = column * 38.3;
			var y = line * 41.7;
			rect = cc.rect(x,y,38.3,41.7);
		}
		return rect;
	},

	getCardRectForSmall : function(color,numid){
		var rect = null;
		if(color === CardDef.CardColor.CC_DigJoker){
			rect = cc.rect(0,0,13,50);
		}else if(color === CardDef.CardColor.CC_SmallJoker){
			rect = cc.rect(13,0,13,50);
		}else{
			var line = 1;
			var column = numid - 1;
			if(color === CardDef.CardColor.CC_Spades || color === CardDef.CardColor.CC_Clubs){
				line = 0;
			}
			var x = column * 27.846;
			var y = line * 27.667;
			rect = cc.rect(x,y,27.846,27.667);
		}
		return rect;
	},

	getCardColorRect :function(color){
		if(color === CardDef.CardColor.CC_Diamonds){
			return cc.rect(0,0,27.5,26);
		}else if(color === CardDef.CardColor.CC_Clubs){
			return cc.rect(27.5,0,27.5,26);
		}else if(color === CardDef.CardColor.CC_Hearts){
			return cc.rect(55,0,27.5,26);
		}else if(color === CardDef.CardColor.CC_Spades){
			return cc.rect(82.5,0,27.5,26);
		}
	},

	getCardColorRectForSmall :function(color){
		if(color === CardDef.CardColor.CC_Diamonds){
			return cc.rect(0,0,19,16);
		}else if(color === CardDef.CardColor.CC_Clubs){
			return cc.rect(19,0,19,16);
		}else if(color === CardDef.CardColor.CC_Hearts){
			return cc.rect(38,0,19,16);
		}else if(color === CardDef.CardColor.CC_Spades){
			return cc.rect(57,0,19,16);
		}
	},

	getCardColorFileName : function(color){
		if(color === CardDef.CardColor.CC_DigJoker || color === CardDef.CardColor.CC_SmallJoker){
			return null;
		}
		return res.card_color;
	},

	getCardColorFileNameForSmall : function(color){
		if(color === CardDef.CardColor.CC_DigJoker || color === CardDef.CardColor.CC_SmallJoker){
			return null;
		}
		return res.card_color_small;
	},

	getCardFileNameForSmall : function(color){
		if(color === CardDef.CardColor.CC_DigJoker || color === CardDef.CardColor.CC_SmallJoker){
			return res.card_wang_small;
		}else{
			return res.card_number_small;
		}
	},

	getCardFileName : function(color){
		if(color === CardDef.CardColor.CC_DigJoker || color === CardDef.CardColor.CC_SmallJoker){
			return res.card_wang;
		}else{
			return res.card_number;
		}
	}

};