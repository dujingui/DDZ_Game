
var CardUtil = {
	//判断array数组是否包含于numid相同的牌
	isContain : function(array,numid){
		for(var i = 0;i < array.length;i ++){
			var cardData = Game_Card_Mgr.getCardData(array[i]);
			if(cardData.numID === numid){
				return true;
			}
		}
		return false;
	},

	//对牌型组进行从大到小的排序
	sortCardGroup : function(group){
		for(var i = 0;i < group.length;i ++){
			for(var j = i + 1; j< group.length; j++){
				var carddata1 = Game_Card_Mgr.getCardData(group[i][0]);
				var carddata2 = Game_Card_Mgr.getCardData(group[j][0]);
				if(carddata1.value > carddata2.value){
					var temp = group[i];
					group[i] = group[j];
					group[j] = temp;
				}
			}
		}
	},

	//从array数组中移除一个numid相同的元素
	removeEleByNumID : function(array, numid){
		for(var i = 0;i < array.length;i ++){
			var soleID = array[i];
			var cardData = Game_Card_Mgr.getCardData(soleID);
			if(cardData.numID === numid){
				array.splice(i,1);
				return soleID;
			}
		}
		return -1;
	},

	//合并两个数组
	mergeArray : function(array1,array2){
		var newArray = [];
		for(var i = 0;i < array1.length;i ++){
			newArray.push(array1[i]);
		}
		for(var i = 0;i < array2.length;i ++){
			newArray.push(array2[i]);
		}
		return newArray;
	}，

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