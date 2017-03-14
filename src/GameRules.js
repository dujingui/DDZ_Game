/**
 * 游戏规则类
 */

function GameRules(){
	if(typeof this.instance == 'object'){
		return this.instance;
	}

	this.instance = this;

	this.isRobFag 	= false;	//首次抢地主标记位
	this.CardNum 	= 54;

	this.Init = function(){
		this.initEvent();
	},

	//开始游戏
	this.startGame = function(){
	},

	//发牌
	this.deal = function(){
		var tempPlayer = null;
		var cardid = null;
		var playerIndex = 0;
		//生成一副牌
		Game_Card_Mgr.createCards();
		//洗牌
		Game_Card_Mgr.shuffle();

		//发牌
		for(var i = 0;i < this.CardNum - 3;i ++){
			if(playerIndex >= 3){
				playerIndex = 0;
			}
			cardid = Game_Card_Mgr.getSoleIDByIndex(i);
			tempPlayer = PlayerMgr.GetPlayerByIndex(playerIndex ++);
			tempPlayer.deal(cardid);
		}

		//牌排序
		for(var i = 0;i < 3;i ++){
			tempPlayer = PlayerMgr.GetPlayerByIndex(i);
			Game_Card_Mgr.sort(tempPlayer.getCardList());
		}
	},

	//设置某个玩家为地主
	this.setLandlord = function(playerid){
		var player = PlayerMgr.GetPlayer(playerid);
		player.setLandlord(true);
		Game_Notify_Center.Publish(ObserverType.OT_BECOME_LANDLORD,{player_id:playerid});
	},

	//如指定参数则指定该参数对应的玩家开始叫牌，否则随机指定一名玩家开始叫牌,
	this.startCallCard = function(playerid){
		var randomPlayerid = Util.GetRandomNum(1,3);;
		var callCardPlayerID = playerid || randomPlayerid;
		var player = PlayerMgr.GetPlayer(callCardPlayerID);
		if(player.isAI()){
			this.calcIsCallCard(callCardPlayerID);
		}
		//通知界面 开始叫牌
		Game_Notify_Center.Publish(ObserverType.OT_START_CALL_CARD,{player_id:callCardPlayerID});
	},

	//通知某个玩家开始抢地主
	this.startRobLandlord = function(playerid){
		//如果叫过地主并且没有玩家抢地主,则直接指定为地主
		var _this = this;
		var player = PlayerMgr.GetPlayer(playerid);
		if(player.isCall() && !PlayerMgr.isHasPlayerRob()){
			player.setLandlord(true);
			setTimeout(function(){
				_this.setLandlord(playerid);
		},1000)
			return;
		}
		if(player.isAI()){
			this.calcIsRobLandlord(playerid);
		}
		Game_Notify_Center.Publish(
			ObserverType.OT_START_ROB_LANDLORD,
			{player_id:playerid}
		);
	},

	//叫地主
	this.callLandlord = function(playerid,isCall){
		var player = PlayerMgr.GetPlayer(playerid);
		player.setIsCall(isCall);
		if(isCall){
			this.startRobLandlord(player.next());
		}else{
			this.startCallCard(player.next());
		}
		Game_Notify_Center.Publish(
			ObserverType.OT_CALL_LANDLORD,
			{player_id:playerid,is_call:isCall}
		);
	},

	//抢地主
	this.robLandlord = function(id,isRob){
		var playerid = id;
		var player = PlayerMgr.GetPlayer(playerid);
		player.setIsRob(isRob);
		if(player.isCall()){
			if(isRob){
				playerid = id;
			}else{
				var players = PlayerMgr.getRobPlayers();
				if(players.length >=2){
					playerid = PlayerMgr.GetFirstRobPlayer();
				}else{
					playerid = players[0];
				}
			}
			this.setLandlord(playerid);
		}else{
			this.startRobLandlord(player.next());
		}
	},

	//有人出牌
	this.playerDiscard = function(params){
		var player = PlayerMgr.GetPlayer(params.player_id);
		var nextPlayer = player.nextPlayer();

		if(nextPlayer.isAI()){
			this.calcFollowSuit(params.discard_info,nextPlayer.getID());
		}

		Game_Notify_Center.Publish(
			ObserverType.OT_START_FOLLOW_CARD,
			{player_id:nextPlayer.getID()}
		);
	},

	//有人不出牌
	this.notDiscard = function(params){
		var player = PlayerMgr.GetPlayer(params.player_id);
		var nextPlayer = player.nextPlayer();

		if(nextPlayer.isAI()){
			this.calcFollowSuit(params.discard_info,nextPlayer.getID());
		}

		Game_Notify_Center.Publish(
			ObserverType.OT_START_FOLLOW_CARD,
			{player_id:nextPlayer.getID()}
		);
	},

	//拆牌
	this.splitCards = function(id){
		var player = PlayerMgr.GetPlayer(id);
		var cards = player.getCardList().slice(0);
		var playerGroups = player.getCardTypeGroup();
		player.setIsSplit(true);
		// /**********用于测试**********/
		// var temp = this._cardMgr.createCards();
		// this._cardMgr.shuffle();
		// temp.splice(17, 37);
		// var cards = [];
		// for(var i = 0;i < temp.length;i ++){
		// 	cards.push(temp[i].soleID);
		// }
		// /********************************/

		var cardList_1 = [];
		var cardList_2 = [];
		var cardList_3 = [];
		var cardList_4 = [];

		for(var i = 0;i < cards.length;){
			var cardData = Game_Card_Mgr.getCardData(cards[i]);
			var cardNumID = cardData.numID;
			if(!CardUtil.isContain(cardList_1,cardNumID)){
				cardList_1.push(cardData.soleID);
				cards.splice(i,1);
			}else if(!CardUtil.isContain(cardList_2,cardNumID)){
				cardList_2.push(cardData.soleID);
				cards.splice(i,1);
			}else if(!CardUtil.isContain(cardList_3,cardNumID)){
				cardList_3.push(cardData.soleID);
				cards.splice(i,1);
			}else if(!CardUtil.isContain(cardList_4,cardNumID)){
				cardList_4.push(cardData.soleID);
				cards.splice(i,1);
			}
		}

		var rocketGroups = [];//火箭组
		var bombGroups = [];//炸弹组
		var threeGroups = [];//3牌组
		var doubleGroups = [];//双牌组
		var singleGroups = [];//单牌组
		var singleStraigleGroups = [];	//单顺组
		var threeAndOneGroups = [];

		//首先提取炸弹
		for(var i = 0;i < cardList_4.length; ){
			var cardSoleID = cardList_4[i];
			var numID = Game_Card_Mgr.getCardData(cardSoleID).numID;
			cardList_4.splice(i,1);

			var soleID3 = CardUtil.removeEleByNumID(cardList_3,numID);
			var soleID2 = CardUtil.removeEleByNumID(cardList_2,numID);
			var soleID1 = CardUtil.removeEleByNumID(cardList_1,numID);

			var bombGroup = [];
			bombGroup.push(soleID1, soleID2, soleID3, cardSoleID);
			bombGroups.push(bombGroup);
		}
		//再提取3牌组
		for(var i = 0;i < cardList_3.length;){
			var cardSoleID = cardList_3[i];
			var numID = Game_Card_Mgr.getCardData(cardSoleID).numID;
			cardList_3.splice(i,1);

			var soleID2 = CardUtil.removeEleByNumID(cardList_2,numID);
			var soleID1 = CardUtil.removeEleByNumID(cardList_1,numID);
			var threeGroup = [];
			threeGroup.push(soleID1, soleID2, cardSoleID);
			threeGroups.push(threeGroup);
		}
		//再提取2牌组
		for(var i = 0;i < cardList_2.length;){
			var cardSoleID = cardList_2[i];
			var numID = Game_Card_Mgr.getCardData(cardSoleID).numID;
			cardList_2.splice(i,1);

			var soleID1 = CardUtil.removeEleByNumID(cardList_1,numID);
			var doubleGroup = [];
			doubleGroup.push(soleID1, cardSoleID);
			doubleGroups.push(doubleGroup);
		}
		//再提取火箭
		if(CardUtil.isContain(cardList_1, 14) && CardUtil.isContain(cardList_1, 15)){
			CardUtil.removeEleByNumID(cardList_1, 14);
			CardUtil.removeEleByNumID(cardList_1, 15);
			var rocketGroup = [];
			rocketGroup.push(53, 54);
			rocketGroups.push(rocketGroup);
		}
		//再提取单牌组
		for(var i = 0;i < cardList_1.length;){
			var cardSoleID = cardList_1[i];
			var numID = Game_Card_Mgr.getCardData(cardSoleID);
			cardList_1.splice(i,1);

			var singleGroup = [];
			singleGroup.push(cardSoleID);
			singleGroups.push(singleGroup);
		}
		//对牌型组进行排序(从小到大)
		CardUtil.sortCardGroup(bombGroups);
		CardUtil.sortCardGroup(threeGroups);
		CardUtil.sortCardGroup(doubleGroups);
		CardUtil.sortCardGroup(singleGroups);

		var count = 1;
		var tempArr = [];
		var startIndex = 0;
		//提取单顺
		for(var i = 0;i < singleGroups.length - 1;i ++){
			var card1 = singleGroups[i][0];
			var card2 = singleGroups[i+1][0];
			var numid1 = Game_Card_Mgr.getCardData(card1).numID;
			var numid2 = Game_Card_Mgr.getCardData(card2).numID;
			if(numid1 === (numid2 - 1)){
				count ++;
			}else{
				if(count >= 5){
					tempArr = singleGroups.splice(startIndex, count);
					singleStraigleGroups.push(tempArr);
					i = 0;
				}else{
					count = 1;
					startIndex = i + 1;
				}
			}
		}
		//提取3带1
		for(var i = 0;i < threeGroups.length;){
			var three = threeGroups.splice(i,1)[0];
			var one = singleGroups.splice(i,1)[0];
			var threeAndOne = CardUtil.mergeArray(three,one);
			threeAndOneGroups.push(threeAndOne);
		}

		playerGroups.setSigleCardGroups(singleGroups);
		playerGroups.setSigleStraightGroups(singleStraigleGroups);
		playerGroups.setDoubleCardGroups(doubleGroups);
		playerGroups.setDoubleStraightGroupss(null);
		playerGroups.setThreeAndOneGroups(threeAndOneGroups);
		playerGroups.setBombGroups(bombGroups);
		playerGroups.setRocketGroups(rocketGroups);
	},

	//计算是否叫牌 AI使用
	this.calcIsCallCard = function(id){
		var _this = this;
		var isCall = Util.GetRandomNum(0,1);
		setTimeout(function(){
			Game_Notify_Center.Publish(ObserverType.ET_CALL_CARD,{id:id,is_call:isCall});
			_this.callLandlord(id,isCall);
		},1000);
	},

	//计算是否抢地主 AI使用
	this.calcIsRobLandlord = function(id){
		var _this = this;
		var player = PlayerMgr.GetPlayer(id);
		var isRob = Util.GetRandomNum(0,1);
		setTimeout(function(){
			Game_Notify_Center.Publish(ObserverType.OT_ROB_LANDLORD,{player_id:id,is_rob:isRob});
			_this.robLandlord(id,isRob);
		},1000);

		if(isRob && !this.isRobFag){
			PlayerMgr.SetFirstRobPlayer(id);
			this.isRobFag = true;
		}
		player.setIsRob(isRob);
	},

	//计算如何出牌 AI使用
	this.calcDiscard = function(id){
		var player = PlayerMgr.GetPlayer(id);
		if(!player.isSplit()){
			this.splitCards(id);
		}
		var cardsGroup = player.getCardTypeGroup();
		var cards = cardsGroup.getSigleCard();
		var cardType = null;
		if(cards){
			player.discard(cards);
			cardType = CardDef.CardPatterns.CCP_Single;
		}
		var discardInfo = {
			card_type: cardType,
			cards : cards
		};
		setTimeout(function(){
			Game_Notify_Center.Publish(ObserverType.OT_DISCARD,{discard_info:discardInfo,player_id:id});
		},2000);
	},

	//计算如何跟牌 AI使用
	this.calcFollowSuit = function(discard_info,id){
		var player = PlayerMgr.GetPlayer(id);
		if(!player.isSplit()){
			this.splitCards(id);
		}
		var cardTypeGroup = player.getCardTypeGroup();
		var cards = null;
		var type = null;
		var cardType = discard_info.card_type;
		var cardNumID = discard_info.cards[0];
		if(cardType === CardDef.CardPatterns.CCP_Single){
			var singleGroups = cardTypeGroup.getSigleCardGroups();
			for(var i = 0;i < singleGroups.length;i ++){
				var cardSoleID = singleGroups[i][0];
				var cardData = Game_Card_Mgr.getCardData(cardSoleID);
				if(cardData.numID > cardNumID){
					cards = cardTypeGroup.discard(CardDef.CardPatterns.CCP_Single,i);
					type = CardDef.CardPatterns.CCP_Single;
					break;
				}
			}
		}

		var newDiscardInfo = {
			cards:cards,
			card_type:type
		};

		setTimeout(function(){
			Game_Notify_Center.Publish(
				ObserverType.OT_FOLLOW_CARD,
				{player_id:id,discard_info:newDiscardInfo}
			);
		},2000);
	},

	//叫牌结束后调用
	this.callCardOver = function(){
		var landlordID = PlayerMgr.GetLandlordPlayer();
		if(landlordID == -1){
			return;
		}
		var player = PlayerMgr.GetPlayer(landlordID);

		if(player.isAI()){
			this.calcDiscard(landlordID);
		}
		Game_Notify_Center.Publish(ObserverType.OT_START_DISCARD,{player_id:landlordID});
	},

	this.initEvent = function(){
		var _this = this;
		//开始游戏
		Game_Event_Center.RegisterEvent(EventType.ET_START_GAME,function(){
			_this.startGame();
		});
		//发牌
		Game_Event_Center.RegisterEvent(EventType.ET_DEAL,function(){
			_this.deal();
		});
		//发牌结束
		Game_Event_Center.RegisterEvent(EventType.ET_DEAL_OVER,function(params){
			_this.startCallCard();
		});
		//叫地主
		Game_Event_Center.RegisterEvent(EventType.ET_CALL_OR_NOT_LANDLORD,function(params){
			_this.callLandlord(params.player_id,params.is_call);
		});
		//抢地主
		Game_Event_Center.RegisterEvent(EventType.ET_ROB_LANDLORD,function(params){
			_this.robLandlord(params.player_id,params.is_rob);
		});
		//叫牌结束
		Game_Event_Center.RegisterEvent(EventType.ET_CALL_CARD_OVER,function(params){
			_this.callCardOver(params);
		});
		//某个玩家出牌了
		Game_Event_Center.RegisterEvent(EventType.ET_DISCARD,function(params){
			_this.playerDiscard(params);
		});
		//某个玩家不出牌
		Game_Event_Center.RegisterEvent(EventType.ET_NOT_DISCARD,function(params){
			_this.notDiscard(params);
		});
	}

};

var Game_Rules = new GameRules();
Game_Rules.Init();