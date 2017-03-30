
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

	//是否为单牌
	isSigleCard : function(cards){
		if(!cards || cards.length !== 1){
			return null;
		}

		var value = Game_Card_Mgr.getCardValue(cards[0]);

		var info = {
			cards : cards,
			type : CardDef.CardPatterns.CCP_Single,
			value : value
		};

		return info;
	},

	//是否为单顺
	isSigleStraight : function(cards){
		if(!cards || cards.length < 5){
			return null;
		}
		Game_Card_Mgr.sort(cards);
		var len = cards.length - 1;
		for(var i = 0; i < len; i ++){
			var value1 = Game_Card_Mgr.getCardValue(cards[i]);
			var value2 = Game_Card_Mgr.getCardValue(cards[i+1]);
			if(value1 !== (value2 + 1)){
				return null;
			}
		}

		var value = Game_Card_Mgr.getCardValue(cards[cards.length - 1]);
		var info = {
			cards: cards,
			type: CardDef.CardPatterns.CCP_Single_Straight,
			value: value
		};
		return info;
	},

	//是否为对牌
	isDoubleCard : function(cards){
		if(!cards || cards.length !== 2){
			return null;
		}

		var value1 = Game_Card_Mgr.getCardValue(cards[0]);
		var value2 = Game_Card_Mgr.getCardValue(cards[1]);

		if(value1 !== value2){
			return null;
		}

		var value = value1;
		var info = {
			cards: cards,
			type: CardDef.CardPatterns.CCP_Double,
			value: value
		};

		return info;
	},

	//是否为对顺
	isDoubleStraight : function(cards){
		if(!cards || cards.length < 6 || cards.length % 2 !== 0){
			return null;
		}
		Game_Card_Mgr.sort(cards);
		var len = cards.length;
		for(var i = 0; i < len; i += 2){
			var value1 = Game_Card_Mgr.getCardValue(cards[i]);
			var value2 = Game_Card_Mgr.getCardValue(cards[i+1]);
			if(value1 !== value2){
				return null;
			}
		}

		len = cards.length - 2;
		for(var j = 0; j < len; j += 2){
			var value1 = Game_Card_Mgr.getCardValue(cards[j]);
			var value2 = Game_Card_Mgr.getCardValue(cards[j+2]);
			if(value1 !== (value2 + 1)){
				return null;
			}
		}

		var value = Game_Card_Mgr.getCardValue(cards[cards.length - 2]);
		var info = {
			cards: cards,
			type: CardDef.CardPatterns.CCP_Double_Straight,
			value: value
		};
		return info;
	},

	//是否为3带1
	isThreeAndOne : function(cards){
		if(!cards || cards.length !== 4){
			return null;
		}
		Game_Card_Mgr.sort(cards);
		var len = cards.length - 1;
		var count = 1;

		var cardGroupValue = -1;

		for(var i = 0;i < len;i ++){
			var value1 = Game_Card_Mgr.getCardValue(cards[i]);
			var value2 = Game_Card_Mgr.getCardValue(cards[i+1]);
			if(value1 === value2){
				count ++;
				cardGroupValue = value1;
			}
		}

		if(count !== 3){
			return null; 
		}

		var info = {
			cards : cards,
			type : CardDef.CardPatterns.CCP_ThreeAndOne,
			value : cardGroupValue
		};

		return info;
	},

	//是否为炸弹
	isBomb : function(cards){
		if(!cards || cards.length !== 4){
			return null;
		}
		var len = cards.length - 1;
		var count = 1;

		for(var i = 0;i < len;i ++){
			var value1 = Game_Card_Mgr.getCardValue(cards[i]);
			var value2 = Game_Card_Mgr.getCardValue(cards[i+1]);
			if(value1 === value2){
				count ++;
			}
		}

		if(count !== 4){
			return null; 
		}

		var value = Game_Card_Mgr.getCardValue(cards[0]);
		var info = {
			cards: cards,
			type: CardDef.CardPatterns.CCP_Bomb,
			value: value
		};

		return info;
	},

	//是否为火箭
	isRocket : function(cards){
		if(!cards || cards.length !== 2){
			return null;
		}

		Game_Card_Mgr.sort(cards);

		var color1 = Game_Card_Mgr.getCardColor(cards[0]);
		var color2 = Game_Card_Mgr.getCardColor(cards[1]);

		if(color2 !== CardDef.CardColor.CC_DigJoker || color1 !== CardDef.CardColor.CC_SmallJoker){
			return null;
		}

		var value = 999;
		var info = {
			cards: cards,
			type: CardDef.CardPatterns.CCP_Rocket,
			value: value
		};

		return info;
	},

	//是否为指定类型的牌 
	toSpecifyTypeOfCard : function(cards, type){
		var info = null;
		switch(type){
			case CardDef.CardPatterns.CCP_Single:
			{
				info = this.isSigleCard(cards);
				break;
			}
			case CardDef.CardPatterns.CCP_Single_Straight:
			{
				info = this.isSigleStraight(cards);
				break;
			}
			case CardDef.CardPatterns.CCP_Double:
			{
				info = this.isDoubleCard(cards);
				break;
			}
			case CardDef.CardPatterns.CCP_Double_Straight:
			{
				info = this.isDoubleStraight(cards);
				break;
			}
			case CardDef.CardPatterns.CCP_ThreeAndOne:
			{
				info = this.isThreeAndOne(cards);
				break;
			}
			case CardDef.CardPatterns.CCP_Bomb:
			{
				info = this.isBomb(cards);
				break;
			}
			case CardDef.CardPatterns.CCP_Rocket:
			{
				info = this.isRocket (cards);
				break;
			}
		}
		return info;
	},

	//判断数组cards中的牌是否可以组合成可出的牌型
	IsCombination : function(cards){
		var info = null;
		info = this.isSigleCard(cards);
		if(info)return info;
		info = this.isSigleStraight(cards);
		if(info)return info;
		info = this.isDoubleCard(cards);
		if(info)return info;
		info = this.isDoubleStraight(cards);
		if(info)return info;
		info = this.isThreeAndOne(cards);
		if(info)return info;
		info = this.isBomb(cards);
		if(info)return info;
		info = this.isBomb(cards);
		if(info)return info;
		return null;
	},

	//组合数组cards中的牌为指定的类型
	combinationCards :function(cards, type){
		var info = null;
		switch(type){
			case CardDef.CardPatterns.CCP_Single:
			{
				info = this.isSigleCard(cards);
				break;
			}
			case CardDef.CardPatterns.CCP_Single_Straight:
			{
				info = this.isSigleStraight(cards);
				break;
			}
			case CardDef.CardPatterns.CCP_Double:
			{
				info = this.isDoubleCard(cards);
				break;
			}
			case CardDef.CardPatterns.CCP_Double_Straight:
			{
				info = this.isDoubleStraight(cards);
				break;
			}
			case CardDef.CardPatterns.CCP_ThreeAndOne:
			{
				info = this.isThreeAndOne(cards);
				break;
			}
			case CardDef.CardPatterns.CCP_Bomb:
			{
				info = this.isBomb(cards);
				break;
			}
			case CardDef.CardPatterns.CCP_Rocket:
			{
				info = this.isRocket (cards);
				break;
			}
		}
		return info;
	},

	//判断array数组是否包含于soleid相同的牌
	isContainBySoleID : function(array,soleid){
		for(var i = 0;i < array.length;i ++){
			var cardData = Game_Card_Mgr.getCardData(array[i]);
			if(cardData.soleID === soleid){
				return true;
			}
		}
		return false;
	},

	//根据soleid比较两张牌的大小
	compareBySoleID : function(soleid1,soleid2){
		var cardData1 = Game_Card_Mgr.getCardData(soleid1);
		var cardData2 = Game_Card_Mgr.getCardData(soleid2);
		var result = -1;
		if(cardData1.value > cardData2.value){
			return 1;
		}else if(cardData1.value === cardData2.value){
			return 0;
		}else if(cardData1.value < cardData2.value){
			return 2;
		}else{
			new Error("比较牌出错！");
		}
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

	getCardsInfo : function(array){
		var info = "{";
		for(var i = 0;i < array.length;i ++){
			info += this.getCardInfo(array[i]);
			if(i < array.length - 1){
				info += ", ";
			}
		}
		info += "}";
		return info;
	},

	//根据牌id获取牌信息
	getCardInfo : function(id){
		var cardData = Game_Card_Mgr.getCardData(id);
		var cardColor,cardNum;
		if(!cardData){
			new Error("获取牌信息出错！");
		}
		if(cardData.color == CardDef.CardColor.CC_Hearts){
			cardColor = "红桃";
		}else if(cardData.color == CardDef.CardColor.CC_Spades){
			cardColor = "黑桃";
		}else if(cardData.color == CardDef.CardColor.CC_Diamonds){
			cardColor = "方片";
		}else if(cardData.color == CardDef.CardColor.CC_Clubs){
			cardColor = "梅花";
		}else if(cardData.color == CardDef.CardColor.CC_DigJoker){
			cardColor = "大王";
		}else if(cardData.color == CardDef.CardColor.CC_SmallJoker){
			cardColor = "小王";
		}

		if(cardData.numID > 1 && cardData.numID < 11){
			cardNum = cardData.numID;
		}else if(cardData.numID == 11){
			cardNum = 'J';
		}else if(cardData.numID == 12){
			cardNum = 'Q';
		}else if(cardData.numID == 13){
			cardNum = 'K';
		}else if(cardData.numID == 14){
			cardNum = '';
		}else if(cardData.numID == 15){
			cardNum = '';
		}else if(cardData.numID == 1){
			cardNum = 'A';
		}
		return cardColor + '：' + cardNum;
	},

	//合并两个数组
	mergeArray : function(array1,array2){
		var newArray = [];
		if(!array1 || !array2){
			var a = 0;
		}
		for(var i = 0;i < array1.length;i ++){
			newArray.push(array1[i]);
		}
		for(var i = 0;i < array2.length;i ++){
			newArray.push(array2[i]);
		}
		return newArray;
	},

	getCardRect : function(color,numid){
		var rect = null;
		if(color === CardDef.CardColor.CC_SmallJoker){
			rect = cc.rect(0,0,29,131);
		}else if(color === CardDef.CardColor.CC_DigJoker){
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
		if(color === CardDef.CardColor.CC_SmallJoker){
			rect = cc.rect(0,0,13,50);
		}else if(color === CardDef.CardColor.CC_DigJoker){
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