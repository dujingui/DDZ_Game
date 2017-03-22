//牌型组
var CardTypeGroup = function(){

	this.singleCardGroups 		= null;		//单牌组
	this.sigleStraightGroups 	= null;		//单顺组
	this.doubleCardGroups 		= null;		//双牌组
	this.doubleStraightGroups 	= null;		//双顺组
	this.threeAndOneGroups 		= null; 	//3带1组
	this.bombGroups 			= null;		//炸弹组
	this.rocketGroups 			= null;		//火箭组

	//获得最小的牌及类型---出牌使用
	this.getMinCardInfo = function(){
		//按照（单牌、对子、单顺、双顺、三条等）的顺序找

		var temp = null;
		var type = null;
		if(this.singleCardGroups && this.singleCardGroups.length > 0){
			temp = this.singleCardGroups;
			type = CardDef.CardPatterns.CCP_Single;
		}else if(this.sigleStraightGroups && this.sigleStraightGroups.length > 0){
			temp = this.sigleStraightGroups;
			type = CardDef.CardPatterns.CCP_Single_Straight;
		}else if(this.doubleCardGroups && this.doubleCardGroups.length > 0){
			temp = this.doubleCardGroups;
			type = CardDef.CardPatterns.CCP_Double;
		}else if(this.doubleStraightGroups && this.doubleStraightGroups.length > 0){
			temp = this.doubleStraightGroups;
			type = CardDef.CardPatterns.CCP_Double_Straight;
		}else if(this.threeAndOneGroups && this.threeAndOneGroups.length > 0){
			temp = this.threeAndOneGroups;
			type = CardDef.CardPatterns.CCP_ThreeAndOne;
		}else if(this.bombGroups && this.bombGroups.length > 0){
			temp = this.bombGroups;
			type = CardDef.CardPatterns.CCP_Bomb;
		}else if(this.rocketGroups && this.rocketGroups.length > 0){
			temp = this.rocketGroups;
			type = CardDef.CardPatterns.CCP_Rocket;
		}else{
			throw new Error("牌已经出完了！");
			return null;
		}

		var cardInfo = {
			cards: temp[0],
			type : type
		};

		temp.splice(0,1);

		if(cardInfo.cards.length > 0 && cardInfo.type >= 0 && cardInfo.type < CardDef.CardPatterns.CCP_Max){
			return cardInfo;
		}else{
			throw new Error("找不到牌！！！");
		}
	},

	//获得要跟的牌
	this.getFollowCardInfo = function(discardInfo){
		var _this = this;
		var getCards = function(soleid,type){
			var tempGroup = _this.getCardGroupByType(type);
			var result = null;
			if(tempGroup){
				for(var i = 0;i < tempGroup.length;i ++){
					var cards = tempGroup[i];
					if(CardUtil.compareBySoleID(cards[0],soleid) === 1){
						result = tempGroup[i];
						tempGroup.splice(i,1);
						break;
					}
				}
				return result;
			}else{
				return null;
			}
		};

		var cards = getCards(discardInfo.cards[0], discardInfo.type);

		if(!cards){
			return null;
		}

		var followCardInfo = {
			cards: cards,
			type: discardInfo.type
		};
		return followCardInfo;
	},
	
	//通过类型获取牌组
	this.getCardGroupByType = function(type){
		var temp = null;
		switch(type){
			case CardDef.CardPatterns.CCP_Single:
			{
				temp = this.singleCardGroups;
				break;
			}
			case CardDef.CardPatterns.CCP_Single_Straight:
			{
				temp = this.sigleStraightGroups;
				break;
			}
			case CardDef.CardPatterns.CCP_Double:
			{
				temp = this.doubleCardGroups;
				break;
			}
			case CardDef.CardPatterns.CCP_Double_Straight:
			{
				temp = this.doubleStraightGroups;
				break;
			}
			case CardDef.CardPatterns.CCP_ThreeAndOne:
			{
				temp = this.threeAndOneGroups;
				break;
			}
			case CardDef.CardPatterns.CCP_Bomb:
			{
				temp = this.bombGroups;
				break;
			}
			case CardDef.CardPatterns.CCP_Rocket:
			{
				temp = this.rocketGroups;
				break;
			}
		}
		if(!temp || temp.length <= 0){
			return null;
		}
		return temp
	},

	this.printCards = function(){
		if(this.singleCardGroups){
			console.log("--------------------单牌组--------------------");
			for(var i = 0;i < this.singleCardGroups.length;i++){
				console.log("第" + i + "组：" + CardUtil.getCardsInfo(this.singleCardGroups[i]));
			}
		}
		
		if(this.sigleStraightGroups){
			console.log("--------------------单顺组--------------------");
			for(var i = 0;i < this.sigleStraightGroups.length;i++){
				console.log("第" + i + "组：" + CardUtil.getCardsInfo(this.sigleStraightGroups[i]));
			}
		}

		if(this.doubleCardGroups){
			console.log("--------------------双牌组--------------------");
			for(var i = 0;i < this.doubleCardGroups.length;i++){
				console.log("第" + i + "组：" + CardUtil.getCardsInfo(this.doubleCardGroups[i]));
			}
		}

		if(this.doubleStraightGroups){
			console.log("--------------------双顺组--------------------");
			for(var i = 0;i < this.doubleStraightGroups.length;i++){
				console.log("第" + i + "组：" + CardUtil.getCardsInfo(this.doubleStraightGroups[i]));
			}
		}

		if(this.threeAndOneGroups){
			console.log("--------------------3带1组--------------------");
			for(var i = 0;i < this.threeAndOneGroups.length;i++){
				console.log("第" + i + "组：" + CardUtil.getCardsInfo(this.threeAndOneGroups[i]));
			}
		}

		if(this.bombGroups){
			console.log("--------------------炸弹组--------------------");
			for(var i = 0;i < this.bombGroups.length;i++){
				console.log("第" + i + "组：" + CardUtil.getCardsInfo(this.bombGroups[i]));
			}
		}

		if(this.rocketGroups){
			console.log("--------------------火箭组--------------------");
			for(var i = 0;i < this.rocketGroups.length;i++){
				console.log("第" + i + "组：" + CardUtil.getCardsInfo(this.rocketGroups[i]));
			}
		}
	},

	this.setSigleCardGroups = function(groups){
		this.singleCardGroups = groups;
	},

	this.getSigleCardGroups = function(){
		return this.singleCardGroups;
	},

	// this.discard = function(type, index){
	// 	var cards = null;
	// 	switch(type){
	// 		case CardDef.CardPatterns.CCP_Single:
	// 		{
	// 			cards = this.singleCardGroups.splice(index, 1);
	// 			break;
	// 		}
	// 		default:
	// 			break;
	// 	}
	// 	return cards[0];
	// },

	// //从单牌组获得最小的一张单牌
	// this.getSigleCard = function(){
	// 	if(this.singleCardGroups.length > 0){
	// 		var sigleCard = this.singleCardGroups.splice(0, 1);
	// 		return sigleCard[0];
	// 	}
	// 	return null;
	// },

	this.setSigleStraightGroups = function(groups){
		this.sigleStraightGroups = groups;
	},

	this.setDoubleCardGroups = function(groups){
		this.doubleCardGroups = groups;
	},

	this.setDoubleStraightGroupss = function(groups){
		this.doubleStraightGroups = groups;
	},

	this.setThreeAndOneGroups = function(groups){
		this.threeAndOneGroups = groups;
	},

	this.setBombGroups = function(groups){
		this.bombGroups = groups;
	},

	this.setRocketGroups = function(groups){
		this.rocketGroups = groups;
	}
}